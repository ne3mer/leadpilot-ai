import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LeadPipelineStageIndicator } from "@/components/leads/lead-pipeline-stage-indicator";
import {
  formatPriorityScoreLine,
  type LeadPriorityScoreResult,
} from "@/lib/leads/priority-types";
import { leadStatusMetadataClassName } from "@/components/leads/lead-status-select-options";
import { typographyClass } from "@/lib/design-system/typography";
import type { Lead } from "@/lib/lead-types";

type LeadDetailBriefHeaderProps = {
  lead: Lead;
  priority: LeadPriorityScoreResult;
};

/**
 * Editorial "lead brief" — identity, pipeline position, and signal at a glance.
 */
export function LeadDetailBriefHeader({ lead, priority }: LeadDetailBriefHeaderProps) {
  const priorityLine = formatPriorityScoreLine(priority.score, priority.priority);

  return (
    <header className="min-w-0 border-b border-border pb-[var(--lp-space-8)]">
      <Link
        href="/dashboard#pipeline"
        className="lp-focus-ring inline-flex items-center gap-1.5 rounded-sm lp-text-body-small text-secondary transition-colors duration-[var(--lp-duration-fast)] hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
        Leads
      </Link>

      <div className="mt-[var(--lp-space-6)] min-w-0 border-l-2 border-accent/40 pl-[var(--lp-space-5)]">
        <h1 className={typographyClass("display", "break-words")}>{lead.name}</h1>
        <p className={typographyClass("bodySmall", "mt-2 break-words")}>{lead.company}</p>

        <div className="mt-[var(--lp-space-4)] flex flex-wrap items-center gap-x-3 gap-y-2 lp-text-body-small">
          <span
            className={`font-medium ${leadStatusMetadataClassName(lead.status)}`}
          >
            {lead.status}
          </span>
          <span className="text-muted" aria-hidden>
            ·
          </span>
          <span className="tabular-nums font-medium text-primary">{priorityLine}</span>
        </div>

        <div className="mt-3">
          <LeadPipelineStageIndicator status={lead.status} />
        </div>
      </div>
    </header>
  );
}
