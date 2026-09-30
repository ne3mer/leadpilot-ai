import { LeadPrioritySignal } from "@/components/leads/lead-priority-signal";
import type { LeadPriorityScoreResult } from "@/lib/leads/priority-types";
import { pickDisplayReasons } from "@/lib/leads/priority-dashboard";
import { typographyClass } from "@/lib/design-system/typography";

type LeadPrioritySummaryProps = {
  priority: LeadPriorityScoreResult;
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
    <div className="flex min-w-0 flex-col gap-[var(--lp-space-5)] sm:flex-row sm:items-start sm:gap-[var(--lp-space-8)]">
      <LeadPrioritySignal score={priority.score} priority={priority.priority} />

      {displayReasons.length > 0 ? (
        <div className="min-w-0 flex-1">
          <p className={typographyClass("caption", "text-muted")}>Top reasons</p>
          <ul className={`mt-2 space-y-1.5 ${typographyClass("bodySmall")}`}>
            {displayReasons.map((reason) => (
              <li key={reason} className="break-words pl-0 before:mr-2 before:text-muted before:content-['–']">
                {reason}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
