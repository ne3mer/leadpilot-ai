import Link from "next/link";
import { Trash2 } from "lucide-react";
import { buttonClassName } from "@/components/ui/button";
import type { Lead } from "@/lib/lead-types";

type LeadPipelineListActionsProps = {
  lead: Lead;
  isPending: boolean;
  isConfirmingDelete: boolean;
  layout?: "row" | "stack";
  onUseInAi: (lead: Lead) => void;
  onRequestDelete: (leadId: string) => void;
  onCancelDelete: () => void;
  onConfirmDelete: (leadId: string) => void;
};

export function LeadPipelineListActions({
  lead,
  isPending,
  isConfirmingDelete,
  layout = "row",
  onUseInAi,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: LeadPipelineListActionsProps) {
  if (isConfirmingDelete) {
    return (
      <div
        className="rounded-sm border border-danger/20 bg-danger-muted px-3 py-2"
        role="alertdialog"
        aria-labelledby={`delete-lead-${lead.id}`}
      >
        <p id={`delete-lead-${lead.id}`} className="lp-text-caption text-danger">
          Delete {lead.name}? This cannot be undone.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => onConfirmDelete(lead.id)}
            className={buttonClassName("danger", "px-3 py-1.5 text-xs")}
          >
            {isPending ? "Deleting…" : "Confirm delete"}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onCancelDelete}
            className={buttonClassName("ghost", "px-3 py-1.5 text-xs")}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const containerClass =
    layout === "stack"
      ? "flex flex-col items-stretch gap-2"
      : "flex flex-wrap items-center justify-end gap-x-3 gap-y-1";

  return (
    <div className={containerClass}>
      <Link
        href={`/dashboard/leads/${lead.id}`}
        className="lp-focus-ring rounded-sm lp-text-body-small font-medium text-accent underline-offset-2 hover:underline"
      >
        Open lead
      </Link>
      <button
        type="button"
        onClick={() => onUseInAi(lead)}
        className="lp-focus-ring rounded-sm lp-text-body-small text-secondary underline-offset-2 hover:text-primary hover:underline"
      >
        Use in AI
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => onRequestDelete(lead.id)}
        className="lp-focus-ring inline-flex items-center gap-1 rounded-sm lp-text-body-small text-muted hover:text-danger disabled:opacity-60"
        aria-label={`Delete ${lead.name}`}
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden />
        <span>Delete</span>
      </button>
    </div>
  );
}
