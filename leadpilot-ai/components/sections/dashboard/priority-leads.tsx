"use client";

import Link from "next/link";
import { LeadPriorityBadge } from "@/components/leads/lead-priority-badge";
import { LeadPriorityInsight } from "@/components/leads/lead-priority-insight";
import { leadStatusSelectClassName } from "@/components/leads/lead-status-select-options";
import { typographyClass } from "@/lib/design-system/typography";
import type { DashboardPriorityLeadItem } from "@/lib/leads/priority-dashboard";

type DashboardPriorityLeadsProps = {
  items: DashboardPriorityLeadItem[];
  error?: string | null;
};

function PriorityLeadRow({ item }: { item: DashboardPriorityLeadItem }) {
  const primaryReason = item.displayReasons[0];

  return (
    <li className="min-w-0 border-b border-border last:border-b-0">
      <div className="grid min-w-0 gap-[var(--lp-space-4)] py-[var(--lp-space-5)] lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,0.55fr)_minmax(0,1fr)_auto] lg:items-center lg:gap-[var(--lp-space-6)]">
        <div className="min-w-0 lg:col-span-1">
          <Link
            href={`/dashboard/leads/${item.id}`}
            className="lp-focus-ring inline-block max-w-full rounded-sm font-medium text-primary hover:text-accent"
          >
            <span className="block truncate lp-text-subsection">{item.name}</span>
          </Link>
          <p className="mt-0.5 truncate lp-text-body-small text-secondary">{item.company}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:contents">
          <div className="min-w-0 lg:col-span-1">
            <span
              className={`inline-flex max-w-full rounded-sm px-2 py-0.5 lp-text-caption font-medium ${leadStatusSelectClassName(item.status)}`}
            >
              {item.status}
            </span>
          </div>
          <div className="min-w-0 lg:col-span-1">
            <LeadPriorityBadge score={item.score} priority={item.priority} />
          </div>
        </div>

        <div className="min-w-0 lg:col-span-1">
          {primaryReason ? (
            <p className="line-clamp-2 lp-text-body-small text-secondary">{primaryReason}</p>
          ) : (
            <p className="lp-text-body-small text-muted">No additional signals yet.</p>
          )}
          {item.displayReasons.length > 1 ? (
            <p className="mt-1 lp-text-caption text-muted">
              +{item.displayReasons.length - 1} more reason
              {item.displayReasons.length - 1 === 1 ? "" : "s"}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:col-span-1 lg:justify-end">
          <Link
            href={`/dashboard/leads/${item.id}`}
            className={buttonLinkClass()}
          >
            Open lead
          </Link>
          <LeadPriorityInsight leadId={item.id} compact dashboardRow />
        </div>
      </div>
    </li>
  );
}

function buttonLinkClass() {
  return "lp-focus-ring inline-flex min-h-10 items-center rounded-sm border border-border bg-surface px-3 py-2 lp-text-body-small font-medium text-primary transition-colors duration-[var(--lp-duration-fast)] hover:bg-surface-subtle";
}

export function DashboardPriorityLeads({ items, error }: DashboardPriorityLeadsProps) {
  return (
    <section aria-label="Priority leads" className="min-w-0">
      <div className="mb-[var(--lp-space-6)] max-w-prose">
        <h2 className={typographyClass("sectionTitle")}>Priority leads</h2>
        <p className={typographyClass("bodySmall", "mt-2")}>
          Leads worth your attention now—based on pipeline status and recent activity.
        </p>
      </div>

      {error ? (
        <p className="rounded-sm border border-danger/20 bg-danger-muted px-3 py-2 lp-text-body-small text-danger">
          {error}
        </p>
      ) : items.length === 0 ? (
        <div className="py-[var(--lp-space-10)] text-center">
          <p className="lp-text-body-small text-secondary">No active leads to prioritize yet.</p>
          <p className="mt-2 lp-text-caption text-muted">
            Add leads to your pipeline to see ranked priorities here.
          </p>
        </div>
      ) : (
        <>
          <div
            className="hidden border-b border-border pb-2 lg:grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,0.55fr)_minmax(0,1fr)_auto] lg:gap-[var(--lp-space-6)]"
            aria-hidden
          >
            <span className="lp-text-caption text-muted">Lead</span>
            <span className="lp-text-caption text-muted">Status</span>
            <span className="lp-text-caption text-muted">Priority</span>
            <span className="lp-text-caption text-muted">Signal</span>
            <span className="lp-text-caption text-muted text-right">Actions</span>
          </div>
          <ul className="min-w-0 border-t border-border lg:border-t-0">{items.map((item) => (
            <PriorityLeadRow key={item.id} item={item} />
          ))}</ul>
        </>
      )}
    </section>
  );
}
