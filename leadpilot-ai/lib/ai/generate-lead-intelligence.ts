import "server-only";

import { getDeepSeekChatModel, getDeepSeekClient } from "@/lib/ai/deepseek";
import { extractJsonObject, parseLeadIntelligencePayload } from "@/lib/ai/validation";
import { formatLeadTimestamp } from "@/lib/leads/format";
import type { Lead, LeadStatus } from "@/lib/lead-types";

export type GenerateLeadIntelligenceInput = {
  lead: Pick<Lead, "name" | "company" | "status" | "created_at" | "updated_at">;
};

export type GenerateLeadIntelligenceResult = {
  summary: string;
  nextAction: string;
  approach: string;
};

const SYSTEM_PROMPT = `You are a sales workflow assistant for LeadPilot. Produce practical lead intelligence from verified CRM fields only.

JSON output required (no markdown):
{"summary":"...","nextAction":"...","approach":"..."}

Verified data only: lead name, company, pipeline status, created date, updated date. No other facts exist.

Do NOT invent: conversations, emails, meetings, requirements, pain points, budget, authority, industry, company size, products, proposals, pricing, objections, intent, sender capabilities, or calendar details. Unknown facts → omit silently; never say information is missing, uncertain, or assumed. Never mention AI, prompts, or instructions.

Company is the lead's organization (prospect), not the seller's company. Do not claim what the seller offers or their availability.

summary: 1–2 concise sentences describing the lead using only verified fields; mention status naturally.
nextAction: one concrete operational step; start with a verb when natural.
approach: 1–3 practical sentences on how to execute the next step; no motivational fluff or clichés (synergies, unlock value, drive growth).

LeadPilot product scope (internal): The app has leads with name, company, email, and status only. It does NOT have activities, touchpoints, timelines, tasks, reminders, in-app scheduling, activity logging, or follow-up interval tracking. Recommend ONLY actions a salesperson can do outside the app, such as: send a follow-up message, make a call, review the opportunity, ask a qualifying question, clarify requirements, prepare for a conversation, revisit the lead later, or re-engage the contact. NEVER recommend: logging an activity in LeadPilot, updating timestamps/records for tracking, scheduling inside LeadPilot, creating tasks/reminders, updating a timeline, recording a touchpoint, or tracking follow-up intervals.

Pipeline status is a label only—it does NOT prove emails, calls, meetings, or conversations occurred. "Contacted" means suggest a follow-up outreach; do NOT invent prior discussions or reference "the existing Contacted status" in customer-facing wording. Do not imply a conversation happened because of status alone.

Status guidance (internal workflow signal):
- New: initiate contact / qualification.
- Contacted: plan a timely follow-up message or call; do not invent what was discussed or that contact already happened in a specific way.
- Qualified: clarify requirements, ask focused qualifying questions, discuss the opportunity, and identify what would help move it forward—do NOT assume a proposal, call, stakeholders, decision criteria, or evaluation process already exist; avoid presenting unknown process details as relevant.
- Proposal Sent: follow up on proposal progress without inventing contents or prior talks.
- Negotiation: move toward decision without inventing terms or objections.
- Won: post-win step (onboarding/handoff/relationship)—not open sales pursuit; no invented process.
- Lost: respectful future re-engagement if appropriate—not active pipeline; no invented loss reason.

Write like an internal sales note, not an AI explanation.`;

const STATUS_HINTS: Record<LeadStatus, string> = {
  New: "Status hint: initiating contact is the primary focus.",
  Contacted:
    "Status hint: recommend a concise follow-up (email or call)—do not invent prior conversations; do not suggest logging touchpoints or updating records in LeadPilot.",
  Qualified:
    "Status hint: clarify requirements, ask focused qualifying questions, discuss the opportunity, prepare for the next conversation, and agree on a practical next step—do not assume proposals, mandatory calls, other stakeholders, decision criteria, or a formal evaluation process.",
  "Proposal Sent": "Status hint: check on proposal progress and open questions.",
  Negotiation: "Status hint: clarify remaining decision points.",
  Won: "Status hint: appropriate post-win relationship or handoff step.",
  Lost: "Status hint: respectful re-engagement or nurture only if appropriate.",
};

function buildUserPrompt(input: GenerateLeadIntelligenceInput): string {
  const { lead } = input;
  const name = lead.name.trim() || "(not provided)";
  const company = lead.company.trim() || "(not provided)";
  const created = formatLeadTimestamp(lead.created_at);
  const updated = formatLeadTimestamp(lead.updated_at);

  return [
    "Verified lead record:",
    `- name: ${name}`,
    `- company: ${company}`,
    `- status: ${lead.status}`,
    `- created: ${created}`,
    `- last updated: ${updated}`,
    STATUS_HINTS[lead.status],
    'Respond in JSON only: {"summary":"...","nextAction":"...","approach":"..."}',
  ].join("\n");
}

export async function generateLeadIntelligence(
  input: GenerateLeadIntelligenceInput
): Promise<GenerateLeadIntelligenceResult> {
  const client = getDeepSeekClient();
  const model = getDeepSeekChatModel();

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.35,
    max_tokens: 400,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(input) },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("AI_EMPTY_RESPONSE");
  }

  const parsedJson = extractJsonObject(content);
  const validated = parseLeadIntelligencePayload(parsedJson);
  if (!validated) {
    throw new Error("AI_INVALID_RESPONSE");
  }

  return validated;
}
