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
  sm: "px-2.5 py-0.5 text-xs",
  md: "px-3 py-1 text-xs",
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
      className={`inline-flex rounded-full font-semibold ${sizeClasses[size]} ${priorityLevelBadgeClassName(priority)} ${className}`.trim()}
      aria-label={`Priority score ${score}, ${label} priority`}
    >
      {line}
    </span>
  );
}
