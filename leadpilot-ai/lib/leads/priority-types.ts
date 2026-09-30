import type { LeadPriorityLevel } from "@/lib/leads/priority-score";

export type { LeadPriorityLevel, LeadPriorityScoreResult } from "@/lib/leads/priority-score";
export { LEAD_PRIORITY_THRESHOLDS, scoreToLeadPriority } from "@/lib/leads/priority-score";

export function formatPriorityLevelLabel(level: LeadPriorityLevel): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export function priorityLevelBadgeClassName(level: LeadPriorityLevel): string {
  const classes: Record<LeadPriorityLevel, string> = {
    high: "bg-emerald-100 text-emerald-800",
    medium: "bg-amber-100 text-amber-900",
    low: "bg-zinc-100 text-zinc-700",
  };
  return classes[level];
}

/** Visible score line (level label included for non-color-only communication). */
export function formatPriorityScoreLine(score: number, level: LeadPriorityLevel): string {
  return `${score} · ${formatPriorityLevelLabel(level)}`;
}

/** Higher rank sorts first when ordering by priority descending. */
export function priorityLevelSortRank(level: LeadPriorityLevel): number {
  const ranks: Record<LeadPriorityLevel, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };
  return ranks[level];
}

export type LeadPriorityFilter = LeadPriorityLevel | "all";

export const leadPriorityFilterOptions: LeadPriorityFilter[] = [
  "all",
  "high",
  "medium",
  "low",
];

export const leadPriorityFilterLabels: Record<LeadPriorityFilter, string> = {
  all: "All priorities",
  high: "High priority",
  medium: "Medium priority",
  low: "Low priority",
};
