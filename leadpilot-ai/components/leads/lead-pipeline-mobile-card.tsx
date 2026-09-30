import Link from "next/link";
import { pickDisplayReasons } from "@/lib/leads/priority-dashboard";
import { LeadPipelineListActions } from "@/components/leads/lead-pipeline-list-actions";
import { LeadPipelineStageIndicator } from "@/components/leads/lead-pipeline-stage-indicator";
import { LeadPrioritySignal } from "@/components/leads/lead-priority-signal";
import {
  LeadStatusSelectOptions,
  leadStatusQuietSelectClassName,
} from "@/components/leads/lead-status-select-options";
import { selectClassName } from "@/components/ui/input";
import type { LeadPriorityScoreResult } from "@/lib/leads/priority-types";
import type { Lead, LeadStatus } from "@/lib/lead-types";

type LeadPipelineMobileCardProps = {
  lead: Lead;
  priority: LeadPriorityScoreResult;
  isPending: boolean;
  isConfirmingDelete: boolean;
  onStatusChange: (leadId: string, status: LeadStatus) => void;
  onUseInAi: (lead: Lead) => void;
  onRequestDelete: (leadId: string) => void;
  onCancelDelete: () => void;
  onConfirmDelete: (leadId: string) => void;
};

export function LeadPipelineMobileCard({
  lead,
  priority,
  isPending,
  isConfirmingDelete,
  onStatusChange,
  onUseInAi,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: LeadPipelineMobileCardProps) {
  const statusFieldId = `mobile-status-${lead.id}`;
  const displayReasons = pickDisplayReasons(priority.reasons);
  const signal = displayReasons[0] ?? null;

  return (
    <article className="min-w-0 border-b border-border py-[var(--lp-space-5)] last:border-b-0">
      <div className="min-w-0 border-l-2 border-accent/30 pl-3">
        <h3 className="min-w-0">
          <Link
            href={`/dashboard/leads/${lead.id}`}
            className="lp-focus-ring inline-block break-words lp-text-subsection font-medium text-primary underline-offset-2 hover:text-accent hover:underline"
          >
            {lead.name}
          </Link>
        </h3>
        <p className="mt-0.5 break-words lp-text-body-small text-secondary">{lead.company}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-start gap-4 pl-3">
        <div className="min-w-0 flex-1">
          <label htmlFor={statusFieldId} className="lp-text-caption text-muted">
            Status
          </label>
          <select
            id={statusFieldId}
            value={lead.status}
            disabled={isPending}
            onChange={(event) => onStatusChange(lead.id, event.target.value as LeadStatus)}
            aria-label={`Pipeline status for ${lead.name}, currently ${lead.status}`}
            className={selectClassName(
              `mt-1 w-full max-w-full py-2 lp-text-body-small ${leadStatusQuietSelectClassName(lead.status)}`,
            )}
          >
            <LeadStatusSelectOptions idPrefix={`mobile-${lead.id}`} />
          </select>
        </div>
        <LeadPrioritySignal score={priority.score} priority={priority.priority} />
      </div>

      <div className="mt-2 pl-3">
        <LeadPipelineStageIndicator status={lead.status} />
      </div>

      {signal ? (
        <p className="mt-3 line-clamp-2 pl-3 lp-text-body-small text-secondary">{signal}</p>
      ) : null}

      <div className="mt-4 pl-3">
        <LeadPipelineListActions
          lead={lead}
          isPending={isPending}
          isConfirmingDelete={isConfirmingDelete}
          layout="stack"
          onUseInAi={onUseInAi}
          onRequestDelete={onRequestDelete}
          onCancelDelete={onCancelDelete}
          onConfirmDelete={onConfirmDelete}
        />
      </div>
    </article>
  );
}
