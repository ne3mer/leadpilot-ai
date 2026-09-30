import { LeadPriorityBadge } from "@/components/leads/lead-priority-badge";
import type { LeadPriorityScoreResult } from "@/lib/leads/priority-types";
import { pickDisplayReasons } from "@/lib/leads/priority-dashboard";

type LeadPrioritySummaryProps = {
  priority: LeadPriorityScoreResult;
  /** Show up to three scoring reasons (full engine output). */
  maxReasons?: number;
};

export function LeadPrioritySummary({
  priority,
  maxReasons = 3,
}: LeadPrioritySummaryProps) {
  const reasons = priority.reasons.slice(0, maxReasons);
  const displayReasons =
    reasons.length > 0 ? reasons : pickDisplayReasons(priority.reasons);

  return (
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-wide text-slate-500">Priority</p>
      <div className="mt-2">
        <LeadPriorityBadge
          score={priority.score}
          priority={priority.priority}
          size="md"
        />
      </div>

      {displayReasons.length > 0 ? (
        <div className="mt-4 min-w-0">
          <p className="text-xs uppercase tracking-wide text-slate-500">Top reasons</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {displayReasons.map((reason) => (
              <li key={reason} className="break-words">
                {reason}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
