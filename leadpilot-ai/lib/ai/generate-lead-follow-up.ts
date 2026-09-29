import "server-only";

import type { AiFollowUpObjective, AiFollowUpTone } from "@/lib/ai/constants";
import { getDeepSeekChatModel, getDeepSeekClient } from "@/lib/ai/deepseek";
import { extractJsonObject, parseFollowUpEmailPayload } from "@/lib/ai/validation";
import type { Lead, LeadStatus } from "@/lib/lead-types";
import type OpenAI from "openai";

export type GenerateLeadFollowUpInput = {
  lead: Pick<Lead, "name" | "company" | "email" | "status">;
  tone: AiFollowUpTone;
  objective: AiFollowUpObjective;
};

export type GenerateLeadFollowUpResult = {
  subject: string;
  message: string;
};

const SYSTEM_PROMPT = `You are a B2B sales follow-up email assistant for LeadPilot.

Turn ONLY the verified lead fields in the user message into one concise, natural sales email a human salesperson would send as-is. Do not invent facts.

JSON output is required. Respond with one JSON object only (no markdown or code fences):
{"subject":"<subject line>","message":"<email body>"}
Both fields must be non-empty strings. The message is plain text ready to paste into an email client.

FINISHED EMAIL ONLY — never expose internal reasoning in subject or message. The recipient must never see mentions of: AI, models, prompts, rules, instructions, constraints, assumptions, uncertainty, missing context, lack of information, what you do or do not know, or why wording was chosen. Forbidden examples: "I won't assume...", "Since I don't have much information...", "Based on limited information...", "I don't know if this is relevant...", "I don't have context from our previous conversation...". Unknown facts → omit them silently and write a simpler email. Never explain that information is missing.

CRITICAL — lead company is the RECIPIENT's organization, NOT the sender's company. Never write "on behalf of [lead company]" or "We at [lead company]". Do not use "I came across [company]" or "I noticed [company]" unless discovery is explicitly provided (it is not). Prefer "I wanted to follow up regarding [company]" when the company fits naturally; skip the company if it sounds forced.

NO-HALLUCINATION: Never invent previous conversations, meetings, calls, demos, proposals, products, pricing, deadlines, pain points, or why communication stopped. Do not use "As discussed...", "Since we last spoke...", "I know things got busy...".

NO VERIFIED SENDER PROFILE (internal): Sender name, company, product, service, capabilities, and calendar are unknown—never tell the recipient they are unknown; omit them. Never invent sender capabilities, products, services, topics, availability, meeting duration, dates, or commitments. Never claim or imply what "we" do, sell, offer, provide, build, specialize in, or how "we" help/improve/support/solve for the recipient. Forbidden: "introduce what we do", "what we offer", "our platform/product/services/solution", "how we can help", "show you our", "walk you through", "give you a demo", "send over information", "prepare a proposal". You MAY invite a neutral conversation ("Would you be open to a brief conversation?") without stating what it is about unless verified. Avoid vague "share more details" when no topic exists—prefer a neutral connect/conversation CTA. Never claim availability: no "work around your schedule", "make any time work", "available next week", specific durations (e.g. 30-minute call), or promising to accommodate times the recipient suggests.

Personalization: Use name and company only as provided. Use pipeline status only internally to shape tone—never quote status labels in the email. Do not include the lead's email in the body.

Length: ~50–120 words (concise tone: ~35–80). Do not pad. Do not open with "I'll keep this short."

Subject: ~2–8 words, natural; avoid fake urgency. Do not force the company name into the subject.

Greeting: If a name is provided, "Hi {first name}," (first token when multiple words). If no name, "Hello,".

Sign-off: "Best regards," or "Thanks," only. No invented signer or company. Do not sign "LeadPilot".

Avoid clichés: "I hope this email finds you well", "touch base", "your time is valuable", "please don't hesitate", "looking forward to hearing from you", generic growth/synergy pitches.

Before returning JSON, silently review subject and message. If it contains meta-language, unsupported sender capability/availability claims, or talks about missing context, rewrite into plain neutral sales copy and return only the revised JSON.

Preserve company spelling exactly. For placeholder-like company values, mention minimally or omit if awkward.`;

const STATUS_STRATEGY: Record<LeadStatus, string> = {
  New: "Status strategy (internal): introductory outreach; no implied prior contact.",
  Contacted: "Status strategy (internal): gentle follow-up; do not invent what was said or sent.",
  Qualified: "Status strategy (internal): suggest a sensible next step; do not invent qualification criteria.",
  "Proposal Sent":
    "Status strategy (internal): offer to discuss the proposal if helpful; do not invent proposal contents.",
  Negotiation:
    "Status strategy (internal): encourage next-step conversation; do not invent terms or offers.",
  Won: "Status strategy (internal): existing customer tone if follow-up is needed—not new acquisition pitch; no invented details.",
  Lost: "Status strategy (internal): respectful reopening only; do not assume why the deal was lost.",
};

const OBJECTIVE_INSTRUCTIONS: Record<AiFollowUpObjective, string> = {
  follow_up:
    "Objective: follow_up — follow up regarding the recipient/company; invite connect or brief conversation. No sender offering claims.",
  book_meeting:
    "Objective: book_meeting — neutral CTA only (e.g. \"Would you be open to a brief conversation?\"). No duration, demo, dates, or schedule accommodation promises.",
  re_engage:
    "Objective: re_engage — reconnect; ask if continuing the conversation would be useful. No product/platform claims or invented loss reasons.",
};

const TONE_INSTRUCTIONS: Record<AiFollowUpTone, string> = {
  professional: "Tone: professional — clear, polished, direct, restrained B2B language (not robotic).",
  friendly: "Tone: friendly — warm and conversational while staying professional (not casual slang).",
  concise: "Tone: concise — very short, minimal words, clear CTA (~35–80 words).",
};

const REWRITE_USER_MESSAGE = `The previous draft failed quality checks (meta-language and/or unsupported claims about what the sender does/offers/provides, products/services, demos, or calendar availability). Rewrite as a finished email using only verified lead facts. Use a neutral invitation to connect or brief conversation—no "what we do", no "how we help", no "work around your schedule". JSON only: {"subject":"...","message":"..."}`;

/** Recipient-visible meta / constraint language (pairs with prompt + one retry). */
const META_LANGUAGE_PATTERNS: RegExp[] = [
  /\b(i won't|i will not|without making|don't want to make|do not want to make)\b.*\bassum/i,
  /\b(won't|will not)\s+assume\b/i,
  /\b(no|without)\s+assumptions?\b/i,
  /\b(missing|limited|insufficient|lack of)\s+(context|information|info|data|details)\b/i,
  /\b(don't|do not)\s+have\s+(much|enough|any)\s+(context|information|info|details)\b/i,
  /\bbased on (the )?limited (information|info|data|context)\b/i,
  /\bi don'?t know (if|whether)\b/i,
  /\bi'm not sure (if|whether)\b/i,
  /\b(not sure|uncertain) (if|whether|about)\b/i,
  /\bwithout (knowing|having)\b/i,
  /\bleave (the )?next step open\b/i,
  /\b(i don't|i do not) have context\b/i,
  /\b(previous conversation|prior conversation).*(don't|do not|no)\b/i,
  /\b(as an ai|artificial intelligence|language model|chatgpt|deepseek)\b/i,
  /\b(my (instructions|prompt|rules|constraints|guidelines))\b/i,
  /\bi came across\b/i,
  /\bi (happened to )?notice(d)? your (company|organization)\b/i,
  /\bi'll keep this short\b/i,
  /\bhal(lucin|ucin)/i,
  /\bsafety (rules|guidelines)\b/i,
];

/** Unsupported sender capability / availability claims (no verified sender profile). */
const UNSUPPORTED_SENDER_CLAIM_PATTERNS: RegExp[] = [
  /\bwhat we (do|offer|provide|build|deliver|sell)\b/i,
  /\bintroduce what we\b/i,
  /\b(show|tell) you what we\b/i,
  /\bour (platform|product|service|services|solution|solutions|offering|offerings)\b/i,
  /\bhow we (can )?help\b/i,
  /\bhow we help\b/i,
  /\bwe help (teams|companies|businesses|organizations|you)\b/i,
  /\bwe (provide|offer|deliver|build|develop|specialize)\b/i,
  /\b(can|could) (help|support|improve|solve)\b.*\b(your|team|company|business)\b/i,
  /\bhelp (your|the) (team|company|business)\b/i,
  /\bimprove your (business|team|sales|process|results)\b/i,
  /\bsupport your (team|business|company)\b/i,
  /\b(show you|walk you through|give you a demo|demo of)\b/i,
  /\bshare more (details|information) about (what we|how we|our)\b/i,
  /\bshare more about our\b/i,
  /\bexplain how our\b/i,
  /\b(send over|share) (some )?(information|details) about (what we|our|how we)\b/i,
  /\bprepare a proposal\b/i,
  /\bwork around (your )?(schedule|calendar|availability)\b/i,
  /\b(i'll|i will|happy to) work around\b/i,
  /\bmake any time work\b/i,
  /\baccommodate your (schedule|availability|calendar)\b/i,
  /\bflexible availability\b/i,
  /\b(i'm|i am) available (next|this|tomorrow|on \w+day)\b/i,
  /\bmeet (next|this) week\b/i,
  /\b\d+\s*-?\s*minute (call|meeting|chat|demo)\b/i,
  /\b(30|15|45|60)\s*minute\b/i,
  /\bpick a time\b.*\b(i'll|i will|adjust|accommodate)\b/i,
  /\breply with a time\b.*\b(i'll|i will)\b/i,
  /\b(let me know|send me) (a )?time\b.*\b(work around|adjust|accommodate)\b/i,
];

const PLACEHOLDER_COMPANY_PATTERN =
  /^(test|asdf|foo|bar|baz|demo|sample|placeholder|xxx|123+|\d+|n\/a|na|none|unknown)$/i;

function normalizeField(value: string): string {
  return value.trim();
}

function hasLeadName(name: string): boolean {
  return normalizeField(name).length > 0;
}

function formatNameForPrompt(name: string): string {
  const trimmed = normalizeField(name);
  if (!trimmed) {
    return "(not provided — use greeting \"Hello,\")";
  }
  const firstToken = trimmed.split(/\s+/)[0] ?? trimmed;
  return `${trimmed} (greeting may use first name: ${firstToken})`;
}

function formatCompanyForPrompt(company: string): string {
  const trimmed = normalizeField(company);
  if (!trimmed) {
    return "(not provided — do not invent; omit company references)";
  }
  if (PLACEHOLDER_COMPANY_PATTERN.test(trimmed) || trimmed.length <= 2) {
    return `${trimmed} (likely placeholder — use conservatively; avoid awkward \"help ${trimmed} achieve\" phrasing)`;
  }
  return `${trimmed} (recipient's organization — NOT the sender's company)`;
}

function buildUserPrompt(input: GenerateLeadFollowUpInput): string {
  const { lead, tone, objective } = input;
  const nameLine = formatNameForPrompt(lead.name);
  const companyLine = formatCompanyForPrompt(lead.company);

  return [
    "Verified lead data (only facts you may treat as true):",
    `- recipient name: ${nameLine}`,
    `- recipient company: ${companyLine}`,
    `- pipeline status: ${lead.status}`,
    "(Internal) No verified sender profile — omit sender capabilities and calendar; neutral sign-off only.",
    STATUS_STRATEGY[lead.status],
    TONE_INSTRUCTIONS[tone],
    OBJECTIVE_INSTRUCTIONS[objective],
    hasLeadName(lead.name)
      ? "Write the finished email now. Output JSON only."
      : "Use greeting \"Hello,\". Do not invent a name. Output JSON only.",
    'Respond in JSON only: {"subject":"...","message":"..."}',
  ].join("\n");
}

function needsQualityRewrite(result: GenerateLeadFollowUpResult): boolean {
  const combined = `${result.subject}\n${result.message}`;
  return (
    META_LANGUAGE_PATTERNS.some((pattern) => pattern.test(combined)) ||
    UNSUPPORTED_SENDER_CLAIM_PATTERNS.some((pattern) => pattern.test(combined))
  );
}

async function requestFollowUpEmail(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
): Promise<GenerateLeadFollowUpResult> {
  const client = getDeepSeekClient();
  const model = getDeepSeekChatModel();

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.35,
    max_tokens: 450,
    response_format: { type: "json_object" },
    messages,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("AI_EMPTY_RESPONSE");
  }

  const parsedJson = extractJsonObject(content);
  const validated = parseFollowUpEmailPayload(parsedJson);
  if (!validated) {
    throw new Error("AI_INVALID_RESPONSE");
  }

  return validated;
}

export async function generateLeadFollowUp(
  input: GenerateLeadFollowUpInput
): Promise<GenerateLeadFollowUpResult> {
  const userPrompt = buildUserPrompt(input);
  const baseMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ];

  let result = await requestFollowUpEmail(baseMessages);

  if (needsQualityRewrite(result)) {
    result = await requestFollowUpEmail([
      ...baseMessages,
      { role: "assistant", content: JSON.stringify(result) },
      { role: "user", content: REWRITE_USER_MESSAGE },
    ]);
  }

  if (needsQualityRewrite(result)) {
    throw new Error("AI_INVALID_RESPONSE");
  }

  return result;
}
