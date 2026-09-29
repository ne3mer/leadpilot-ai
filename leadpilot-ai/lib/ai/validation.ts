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
