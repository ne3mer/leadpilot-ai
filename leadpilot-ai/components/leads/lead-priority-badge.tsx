import {
  formatPriorityLevelLabel,
  formatPriorityScoreLine,
  priorityLevelBadgeClassName,
  type LeadPriorityLevel,
} from "@/lib/leads/priority-types";

type LeadPriorityBadgeProps = {
  score: number;
  priority: LeadPriorityLevel;
  size?: "sm" | "md";
  className?: string;
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-[length:var(--lp-text-caption-size)]",
  md: "px-2.5 py-0.5 text-[length:var(--lp-text-metadata-size)]",
} as const;

export function LeadPriorityBadge({
  score,
  priority,
  size = "sm",
  className = "",
}: LeadPriorityBadgeProps) {
  const label = formatPriorityLevelLabel(priority);
  const line = formatPriorityScoreLine(score, priority);

  return (
    <span
      className={`inline-flex max-w-full rounded-sm font-medium tabular-nums ${sizeClasses[size]} ${priorityLevelBadgeClassName(priority)} ${className}`.trim()}
      aria-label={`Priority score ${score}, ${label} priority`}
    >
      {line}
    </span>
  );
}
