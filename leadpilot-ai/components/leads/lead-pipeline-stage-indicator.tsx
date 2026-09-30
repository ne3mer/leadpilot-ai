import { getLeadStatusSortIndex } from "@/lib/leads/list-view";
import { leadStatuses, type LeadStatus } from "@/lib/lead-types";

type LeadPipelineStageIndicatorProps = {
  status: LeadStatus;
  className?: string;
};

/**
 * Functional pipeline position — muted dots through lifecycle (LeadPilot row signature).
 */
export function LeadPipelineStageIndicator({ status, className = "" }: LeadPipelineStageIndicatorProps) {
  const activeIndex = getLeadStatusSortIndex(status);

  return (
    <div
      className={`flex items-center gap-0.5 ${className}`.trim()}
      role="img"
      aria-label={`Pipeline stage: ${status}`}
    >
      {leadStatuses.map((stage, index) => (
        <span
          key={stage}
          className={`h-1 w-1 rounded-full ${
            index <= activeIndex ? "bg-accent" : "bg-border"
          }`}
          aria-hidden
        />
      ))}
    </div>
  );
}
