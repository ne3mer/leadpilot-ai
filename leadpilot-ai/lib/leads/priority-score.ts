import type { LeadActivityType } from "@/lib/activity-types";
import {
  isTerminalLeadStatus,
  type Lead,
  type LeadStatus,
} from "@/lib/lead-types";

/** Priority bands (inclusive lower bound for high/medium). */
export const LEAD_PRIORITY_THRESHOLDS = {
  /** Scores 70–100 → high */
  highMin: 70,
  /** Scores 40–69 → medium; below 40 → low */
  mediumMin: 40,
  maxScore: 100,
  minScore: 0,
} as const;

export type LeadPriorityLevel = "high" | "medium" | "low";

export type LeadPriorityScoreInput = Pick<Lead, "status" | "created_at" | "updated_at">;

export type LeadPriorityActivityInput = {
  type: LeadActivityType;
  content: string;
  created_at: string;
};

export type LeadPriorityScoreOptions = {
  /** Reference instant for recency buckets (defaults to current time). */
  asOf?: Date;
};

export type LeadPriorityScoreResult = {
  score: number;
  priority: LeadPriorityLevel;
  reasons: string[];
};

/** Base score from pipeline status (terminal statuses stay non-actionable). */
const STATUS_BASE_SCORE: Record<LeadStatus, number> = {
  New: 30,
  Contacted: 40,
  Qualified: 55,
  "Proposal Sent": 65,
  Negotiation: 75,
  Won: 12,
  Lost: 8,
};

const STATUS_REASON: Record<LeadStatus, string> = {
  New: "Lead is New",
  Contacted: "Lead is Contacted",
  Qualified: "Lead is Qualified",
  "Proposal Sent": "Lead is Proposal Sent",
  Negotiation: "Lead is Negotiation",
  Won: "Lead is Won",
  Lost: "Lead is Lost",
};

/** Recency buckets (ms) relative to `asOf`, using the latest activity only. */
const RECENCY_BUCKETS = [
  { maxAgeMs: 3 * 24 * 60 * 60 * 1000, bonus: 12, reason: "Very recent activity" },
  { maxAgeMs: 14 * 24 * 60 * 60 * 1000, bonus: 8, reason: "Recent activity" },
  { maxAgeMs: 60 * 24 * 60 * 60 * 1000, bonus: 4, reason: "Activity within the last two months" },
] as const;

type SentimentSignal = {
  pattern: RegExp;
  delta: number;
  reason: string;
};

/** Conservative keyword signals — activity text is untrusted data, not instructions. */
const NEGATIVE_SENTIMENT_SIGNALS: SentimentSignal[] = [
  {
    pattern: /\b(do not contact|don't contact|dont contact)\b/i,
    delta: -22,
    reason: "Latest activity indicates do-not-contact",
  },
  {
    pattern: /\b(not interested|no longer interested|declined)\b/i,
    delta: -18,
    reason: "Latest activity indicates reduced interest",
  },
  {
    pattern: /\bstop (contact|email|calling|reaching out)\b/i,
    delta: -20,
    reason: "Latest activity indicates reduced interest",
  },
];

const POSITIVE_SENTIMENT_SIGNALS: SentimentSignal[] = [
  {
    pattern: /\b(pricing|budget|quote)\b/i,
    delta: 10,
    reason: "Recent pricing interest",
  },
  {
    pattern: /\b(interested|ready to move forward|ready to proceed|next step)\b/i,
    delta: 8,
    reason: "Recent positive activity",
  },
  {
    pattern: /\b(follow[\s-]?up|wants to discuss|would like to discuss)\b/i,
    delta: 6,
    reason: "Recent follow-up interest",
  },
];

/** Slight weight for engagement channel; does not stack per activity. */
const ACTIVITY_TYPE_BONUS: Record<LeadActivityType, number> = {
  call: 2,
  email: 1,
  note: 0,
};

function clampScore(value: number): number {
  return Math.min(
    LEAD_PRIORITY_THRESHOLDS.maxScore,
    Math.max(LEAD_PRIORITY_THRESHOLDS.minScore, Math.round(value))
  );
}

export function scoreToLeadPriority(score: number): LeadPriorityLevel {
  if (score >= LEAD_PRIORITY_THRESHOLDS.highMin) {
    return "high";
  }
  if (score >= LEAD_PRIORITY_THRESHOLDS.mediumMin) {
    return "medium";
  }
  return "low";
}

function parseTimestamp(iso: string): number | null {
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : null;
}

function sortActivitiesNewestFirst(
  activities: LeadPriorityActivityInput[]
): LeadPriorityActivityInput[] {
  return [...activities].sort((a, b) => {
    const aMs = parseTimestamp(a.created_at) ?? 0;
    const bMs = parseTimestamp(b.created_at) ?? 0;
    return bMs - aMs;
  });
}

function recencyBonus(
  latestActivityAt: number | null,
  asOfMs: number
): { bonus: number; reason: string | null } {
  if (latestActivityAt === null) {
    return { bonus: 0, reason: "No recorded activity" };
  }

  const ageMs = asOfMs - latestActivityAt;
  if (ageMs < 0) {
    return { bonus: 0, reason: "No recent activity" };
  }

  for (const bucket of RECENCY_BUCKETS) {
    if (ageMs <= bucket.maxAgeMs) {
      return { bonus: bucket.bonus, reason: bucket.reason };
    }
  }

  return { bonus: 0, reason: "No recent activity" };
}

function matchSentiment(content: string): SentimentSignal | null {
  const normalized = content.trim();
  if (normalized.length === 0) {
    return null;
  }

  for (const signal of NEGATIVE_SENTIMENT_SIGNALS) {
    if (signal.pattern.test(normalized)) {
      return signal;
    }
  }

  for (const signal of POSITIVE_SENTIMENT_SIGNALS) {
    if (signal.pattern.test(normalized)) {
      return signal;
    }
  }

  return null;
}

/**
 * Newest activity with a keyword signal wins (positive or negative).
 * Older contradictory notes do not stack; repeated identical notes are not counted separately.
 */
function sentimentFromActivities(
  activities: LeadPriorityActivityInput[]
): { delta: number; reason: string | null } {
  const sorted = sortActivitiesNewestFirst(activities);

  for (const activity of sorted) {
    const signal = matchSentiment(activity.content);
    if (signal) {
      return { delta: signal.delta, reason: signal.reason };
    }
  }

  return { delta: 0, reason: null };
}

function latestActivityTimestamp(activities: LeadPriorityActivityInput[]): number | null {
  let latest: number | null = null;
  for (const activity of activities) {
    const ms = parseTimestamp(activity.created_at);
    if (ms === null) {
      continue;
    }
    if (latest === null || ms > latest) {
      latest = ms;
    }
  }
  return latest;
}

/** Small bonus when the lead row was edited recently but no activities exist yet. */
function leadRecordUpdateBonus(
  lead: LeadPriorityScoreInput,
  asOfMs: number,
  hasActivities: boolean
): { bonus: number; reason: string | null } {
  if (hasActivities) {
    return { bonus: 0, reason: null };
  }

  const updatedMs = parseTimestamp(lead.updated_at);
  const createdMs = parseTimestamp(lead.created_at);
  if (updatedMs === null || createdMs === null) {
    return { bonus: 0, reason: null };
  }

  const editedAfterCreateMs = updatedMs - createdMs;
  if (editedAfterCreateMs <= 60 * 1000) {
    return { bonus: 0, reason: null };
  }

  const ageMs = asOfMs - updatedMs;
  if (ageMs < 0 || ageMs > 14 * 24 * 60 * 60 * 1000) {
    return { bonus: 0, reason: null };
  }

  return { bonus: 2, reason: "Lead record recently updated" };
}

function latestActivityTypeBonus(activities: LeadPriorityActivityInput[]): number {
  const sorted = sortActivitiesNewestFirst(activities);
  const latest = sorted.find((a) => a.content.trim().length > 0);
  if (!latest) {
    return 0;
  }
  return ACTIVITY_TYPE_BONUS[latest.type];
}

/**
 * Deterministic lead priority score from status and CRM activities.
 *
 * Formula (active pipeline):
 *   score = clamp(
 *     statusBase
 *     + recencyBonus(latest activity.created_at vs asOf)
 *     + leadRecordUpdateBonus(lead.updated_at when no activities)
 *     + sentimentDelta(newest keyword signal only)
 *     + typeBonus(latest meaningful activity)
 *   )
 *
 * Terminal statuses (Won/Lost) use a low fixed base and ignore activity bonuses.
 */
export function computeLeadPriorityScore(
  lead: LeadPriorityScoreInput,
  activities: LeadPriorityActivityInput[],
  options?: LeadPriorityScoreOptions
): LeadPriorityScoreResult {
  const asOfMs = (options?.asOf ?? new Date()).getTime();
  const reasons: string[] = [STATUS_REASON[lead.status]];

  let score = STATUS_BASE_SCORE[lead.status];

  if (isTerminalLeadStatus(lead.status)) {
    const terminalScore = clampScore(score);
    return {
      score: terminalScore,
      priority: scoreToLeadPriority(terminalScore),
      reasons,
    };
  }

  const hasActivities = activities.length > 0;
  const latestActivityAt = latestActivityTimestamp(activities);
  const { bonus: recency, reason: recencyReason } = recencyBonus(
    latestActivityAt,
    asOfMs
  );
  score += recency;
  if (recencyReason) {
    reasons.push(recencyReason);
  }

  const { bonus: updateBonus, reason: updateReason } = leadRecordUpdateBonus(
    lead,
    asOfMs,
    hasActivities
  );
  score += updateBonus;
  if (updateReason) {
    reasons.push(updateReason);
  }

  const { delta: sentimentDelta, reason: sentimentReason } =
    sentimentFromActivities(activities);
  score += sentimentDelta;
  if (sentimentReason) {
    reasons.push(sentimentReason);
  }

  score += latestActivityTypeBonus(activities);

  const finalScore = clampScore(score);
  return {
    score: finalScore,
    priority: scoreToLeadPriority(finalScore),
    reasons,
  };
}
