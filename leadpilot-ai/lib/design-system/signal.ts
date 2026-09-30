import type { LeadPriorityLevel } from "@/lib/leads/priority-types";

/** Semantic signal strength — visual only; does not affect scoring. */
export type SignalStrength = "strong" | "moderate" | "quiet";

export const priorityToSignalStrength: Record<LeadPriorityLevel, SignalStrength> = {
  high: "strong",
  medium: "moderate",
  low: "quiet",
};

export const signalStrengthClass: Record<SignalStrength, string> = {
  strong: "lp-signal-strength-strong",
  moderate: "lp-signal-strength-moderate",
  quiet: "lp-signal-strength-quiet",
};
