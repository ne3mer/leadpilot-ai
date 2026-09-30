import {
  formatPriorityLevelLabel,
  type LeadPriorityLevel,
} from "@/lib/leads/priority-types";

type LeadPrioritySignalProps = {
  score: number;
  priority: LeadPriorityLevel;
  className?: string;
};

const accentBorder: Record<LeadPriorityLevel, string> = {
  high: "border-accent",
  medium: "border-warning",
  low: "border-border-strong",
};

/**
 * LeadPilot signature: priority as a vertical signal (score + level), not a pill.
 */
export function LeadPrioritySignal({ score, priority, className = "" }: LeadPrioritySignalProps) {
  const label = formatPriorityLevelLabel(priority);

  return (
    <div
      className={`flex min-w-[3.25rem] flex-col border-l-2 pl-2 ${accentBorder[priority]} ${className}`.trim()}
      aria-label={`Priority ${score}, ${label}`}
    >
      <span className="tabular-nums lp-text-subsection font-medium text-primary">{score}</span>
      <span className="lp-text-caption text-muted">{label}</span>
    </div>
  );
}
