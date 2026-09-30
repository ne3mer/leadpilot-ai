import Link from "next/link";
import { pickDisplayReasons } from "@/lib/leads/priority-dashboard";
import type { LeadPriorityScoreResult } from "@/lib/leads/priority-types";
import { LeadPipelineListActions } from "@/components/leads/lead-pipeline-list-actions";
import { LeadPipelineStageIndicator } from "@/components/leads/lead-pipeline-stage-indicator";
import { LeadPrioritySignal } from "@/components/leads/lead-priority-signal";
import {
  LeadStatusSelectOptions,
  leadStatusQuietSelectClassName,
} from "@/components/leads/lead-status-select-options";
import { selectClassName } from "@/components/ui/input";
import type { Lead, LeadStatus } from "@/lib/lead-types";

type LeadPipelineDesktopRowProps = {
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

export function LeadPipelineDesktopRow({
  lead,
  priority,
  isPending,
  isConfirmingDelete,
  onStatusChange,
  onUseInAi,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: LeadPipelineDesktopRowProps) {
  const rowStatusId = `row-status-${lead.id}`;
  const displayReasons = pickDisplayReasons(priority.reasons);
  const signal = displayReasons[0] ?? null;

  return (
    <tr className="group border-b border-border transition-colors duration-[var(--lp-duration-fast)] hover:bg-surface-subtle/80">
      <td className="min-w-0 py-[var(--lp-space-5)] pl-3 pr-4">
        <div className="flex min-w-0 gap-3 border-l-2 border-transparent pl-3 transition-[border-color] duration-[var(--lp-duration-fast)] group-hover:border-accent">
          <div className="min-w-0 flex-1">
            <Link
              href={`/dashboard/leads/${lead.id}`}
              className="lp-focus-ring inline-block max-w-full rounded-sm lp-text-subsection font-medium text-primary underline-offset-2 hover:text-accent hover:underline"
            >
              <span className="break-words">{lead.name}</span>
            </Link>
            <p className="mt-0.5 break-words lp-text-body-small text-secondary">{lead.company}</p>
            <p className="mt-1 break-all lp-text-caption text-muted">{lead.email}</p>
            <div className="mt-2">
              <LeadPipelineStageIndicator status={lead.status} />
            </div>
          </div>
        </div>
      </td>
      <td className="min-w-[7rem] py-[var(--lp-space-5)] align-top">
        <label htmlFor={rowStatusId} className="sr-only">
          Pipeline status for {lead.name}
        </label>
        <select
          id={rowStatusId}
          value={lead.status}
          disabled={isPending}
          onChange={(event) => onStatusChange(lead.id, event.target.value as LeadStatus)}
          aria-label={`Pipeline status for ${lead.name}, currently ${lead.status}`}
          className={selectClassName(
            `max-w-full py-1.5 lp-text-caption ${leadStatusQuietSelectClassName(lead.status)}`,
          )}
        >
          <LeadStatusSelectOptions idPrefix={`row-${lead.id}`} />
        </select>
      </td>
      <td className="py-[var(--lp-space-5)] align-top">
        <LeadPrioritySignal score={priority.score} priority={priority.priority} />
      </td>
      <td className="min-w-0 max-w-xs py-[var(--lp-space-5)] align-top">
        {signal ? (
          <p className="line-clamp-2 lp-text-body-small text-secondary">{signal}</p>
        ) : (
          <p className="lp-text-caption text-muted">—</p>
        )}
      </td>
      <td className="min-w-[10rem] py-[var(--lp-space-5)] pl-2 pr-3 align-top">
        <LeadPipelineListActions
          lead={lead}
          isPending={isPending}
          isConfirmingDelete={isConfirmingDelete}
          onUseInAi={onUseInAi}
          onRequestDelete={onRequestDelete}
          onCancelDelete={onCancelDelete}
          onConfirmDelete={onConfirmDelete}
        />
      </td>
    </tr>
  );
}
