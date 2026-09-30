import Link from "next/link";
import { Trash2, WandSparkles } from "lucide-react";
import { LeadPriorityBadge } from "@/components/leads/lead-priority-badge";
import {
  LeadStatusSelectOptions,
  leadStatusSelectClassName,
} from "@/components/leads/lead-status-select-options";
import { formatLeadTimestamp } from "@/lib/leads/format";
import type { LeadPriorityLevel } from "@/lib/leads/priority-types";
import type { Lead, LeadStatus } from "@/lib/lead-types";

type LeadPipelineMobileCardProps = {
  lead: Lead;
  priorityScore: number;
  priorityLevel: LeadPriorityLevel;
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
  priorityScore,
  priorityLevel,
  isPending,
  isConfirmingDelete,
  onStatusChange,
  onUseInAi,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: LeadPipelineMobileCardProps) {
  const statusFieldId = `mobile-status-${lead.id}`;

  return (
    <article className="min-w-0 rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="min-w-0">
        <h3 className="break-words text-base font-semibold text-black">
          <Link
            href={`/dashboard/leads/${lead.id}`}
            className="text-emerald-800 underline-offset-2 hover:text-emerald-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            {lead.name}
          </Link>
        </h3>
        <p className="mt-1 break-words text-sm text-slate-600">{lead.company}</p>
        <p className="mt-1 break-all text-xs text-slate-500">{lead.email}</p>
        <p className="mt-2 text-xs text-slate-500">
          Updated {formatLeadTimestamp(lead.updated_at)}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <LeadPriorityBadge score={priorityScore} priority={priorityLevel} />
      </div>

      <div className="mt-3">
        <label htmlFor={statusFieldId} className="text-xs font-medium text-slate-600">
          Pipeline status
        </label>
        <select
          id={statusFieldId}
          value={lead.status}
          disabled={isPending}
          onChange={(event) => onStatusChange(lead.id, event.target.value as LeadStatus)}
          aria-label={`Pipeline status for ${lead.name}, currently ${lead.status}`}
          className={`mt-1 w-full max-w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm font-medium outline-none ring-emerald-400/40 transition focus:ring disabled:opacity-60 ${leadStatusSelectClassName(lead.status)}`}
        >
          <LeadStatusSelectOptions idPrefix={`mobile-${lead.id}`} />
        </select>
      </div>

      {isConfirmingDelete ? (
        <div
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-3"
          role="alertdialog"
          aria-labelledby={`delete-lead-mobile-${lead.id}`}
        >
          <p id={`delete-lead-mobile-${lead.id}`} className="text-sm text-red-900">
            Delete {lead.name}? This cannot be undone.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => onConfirmDelete(lead.id)}
              className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:opacity-60"
            >
              {isPending ? "Deleting…" : "Confirm delete"}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={onCancelDelete}
              className="rounded-lg border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Link
            href={`/dashboard/leads/${lead.id}`}
            className="inline-flex min-h-10 items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            Open lead
          </Link>
          <button
            type="button"
            onClick={() => onUseInAi(lead)}
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <WandSparkles className="h-4 w-4 shrink-0" aria-hidden />
            Use in AI
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => onRequestDelete(lead.id)}
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-black/15 px-4 py-2 text-sm font-medium text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
