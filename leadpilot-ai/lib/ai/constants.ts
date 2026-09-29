/** Shared AI follow-up allowlists (safe for client UI; no secrets). */

export const aiFollowUpTones = ["professional", "friendly", "concise"] as const;

export type AiFollowUpTone = (typeof aiFollowUpTones)[number];

export const aiFollowUpToneLabels: Record<AiFollowUpTone, string> = {
  professional: "Professional",
  friendly: "Friendly",
  concise: "Concise",
};

export const aiFollowUpObjectives = ["follow_up", "book_meeting", "re_engage"] as const;

export type AiFollowUpObjective = (typeof aiFollowUpObjectives)[number];

export const aiFollowUpObjectiveLabels: Record<AiFollowUpObjective, string> = {
  follow_up: "Follow up",
  book_meeting: "Book a meeting",
  re_engage: "Re-engage",
};

export function isAiFollowUpTone(value: string): value is AiFollowUpTone {
  return (aiFollowUpTones as readonly string[]).includes(value);
}

export function isAiFollowUpObjective(value: string): value is AiFollowUpObjective {
  return (aiFollowUpObjectives as readonly string[]).includes(value);
}
