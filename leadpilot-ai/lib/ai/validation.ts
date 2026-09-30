import "server-only";

import {
  isAiFollowUpObjective,
  isAiFollowUpTone,
  type AiFollowUpObjective,
  type AiFollowUpTone,
} from "@/lib/ai/constants";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type LeadFollowUpRequestBody = {
  leadId: string;
  tone: AiFollowUpTone;
  objective: AiFollowUpObjective;
};

export type ParsedFollowUpEmail = {
  subject: string;
  message: string;
};

const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

export function parseLeadFollowUpRequestBody(body: unknown):
  | { ok: true; data: LeadFollowUpRequestBody }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }

  const record = body as Record<string, unknown>;
  const leadId = typeof record.leadId === "string" ? record.leadId.trim() : "";
  const tone = typeof record.tone === "string" ? record.tone.trim() : "";
  const objective = typeof record.objective === "string" ? record.objective.trim() : "";

  if (!leadId || !UUID_REGEX.test(leadId)) {
    return { ok: false, error: "Invalid lead id." };
  }

  if (!isAiFollowUpTone(tone)) {
    return { ok: false, error: "Invalid tone." };
  }

  if (!isAiFollowUpObjective(objective)) {
    return { ok: false, error: "Invalid objective." };
  }

  return {
    ok: true,
    data: { leadId, tone, objective: objective as AiFollowUpObjective },
  };
}

export function parseFollowUpEmailPayload(raw: unknown): ParsedFollowUpEmail | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const record = raw as Record<string, unknown>;
  if (typeof record.subject !== "string" || typeof record.message !== "string") {
    return null;
  }

  const subject = record.subject.trim();
  const message = record.message.trim();

  if (
    subject.length < 1 ||
    subject.length > MAX_SUBJECT_LENGTH ||
    message.length < 1 ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return null;
  }

  return { subject, message };
}

export type LeadIntelligencePayload = {
  summary: string;
  nextAction: string;
  approach: string;
};

const MAX_INTELLIGENCE_SUMMARY = 500;
const MAX_INTELLIGENCE_NEXT_ACTION = 300;
const MAX_INTELLIGENCE_APPROACH = 500;

export type LeadIdRequestBody = {
  leadId: string;
};

export function parseLeadIdRequestBody(body: unknown):
  | { ok: true; data: LeadIdRequestBody }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }

  const record = body as Record<string, unknown>;
  const leadId = typeof record.leadId === "string" ? record.leadId.trim() : "";

  if (!leadId || !UUID_REGEX.test(leadId)) {
    return { ok: false, error: "Invalid lead id." };
  }

  return { ok: true, data: { leadId } };
}

export function parseLeadIntelligenceRequestBody(body: unknown):
  | { ok: true; data: LeadIdRequestBody }
  | { ok: false; error: string } {
  return parseLeadIdRequestBody(body);
}

export type LeadPriorityExplanationPayload = {
  explanation: string;
  nextAction: string;
};

const MAX_PRIORITY_EXPLANATION = 600;
const MAX_PRIORITY_NEXT_ACTION = 300;

export function parseLeadPriorityExplanationRequestBody(body: unknown):
  | { ok: true; data: LeadIdRequestBody }
  | { ok: false; error: string } {
  return parseLeadIdRequestBody(body);
}

export function parseLeadPriorityExplanationPayload(
  raw: unknown
): LeadPriorityExplanationPayload | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const record = raw as Record<string, unknown>;
  if (typeof record.explanation !== "string" || typeof record.nextAction !== "string") {
    return null;
  }

  const explanation = record.explanation.trim();
  const nextAction = record.nextAction.trim();

  if (
    explanation.length < 1 ||
    explanation.length > MAX_PRIORITY_EXPLANATION ||
    nextAction.length < 1 ||
    nextAction.length > MAX_PRIORITY_NEXT_ACTION
  ) {
    return null;
  }

  const keys = Object.keys(record);
  if (keys.length !== 2 || !keys.includes("explanation") || !keys.includes("nextAction")) {
    return null;
  }

  return { explanation, nextAction };
}

export function parseLeadIntelligencePayload(raw: unknown): LeadIntelligencePayload | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const record = raw as Record<string, unknown>;
  if (
    typeof record.summary !== "string" ||
    typeof record.nextAction !== "string" ||
    typeof record.approach !== "string"
  ) {
    return null;
  }

  const summary = record.summary.trim();
  const nextAction = record.nextAction.trim();
  const approach = record.approach.trim();

  if (
    summary.length < 1 ||
    summary.length > MAX_INTELLIGENCE_SUMMARY ||
    nextAction.length < 1 ||
    nextAction.length > MAX_INTELLIGENCE_NEXT_ACTION ||
    approach.length < 1 ||
    approach.length > MAX_INTELLIGENCE_APPROACH
  ) {
    return null;
  }

  return { summary, nextAction, approach };
}

export function extractJsonObject(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      return null;
    }
    try {
      return JSON.parse(trimmed.slice(start, end + 1)) as unknown;
    } catch {
      return null;
    }
  }
}
