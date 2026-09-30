"use client";

import Link from "next/link";
import { ArrowUpRight, Target } from "lucide-react";
import { LeadPriorityBadge } from "@/components/leads/lead-priority-badge";
import { LeadPriorityInsight } from "@/components/leads/lead-priority-insight";
import { leadStatusSelectClassName } from "@/components/leads/lead-status-select-options";
import { Card } from "@/components/ui/card";
import type { DashboardPriorityLeadItem } from "@/lib/leads/priority-dashboard";

type DashboardPriorityLeadsProps = {
  items: DashboardPriorityLeadItem[];
  error?: string | null;
};

function PriorityLeadRow({ item }: { item: DashboardPriorityLeadItem }) {
  return (
    <li className="min-w-0 py-4 first:pt-0 last:pb-0">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <Link
              href={`/dashboard/leads/${item.id}`}
              className="truncate text-base font-semibold text-black hover:text-emerald-800"
            >
              {item.name}
            </Link>
            <span className="hidden text-slate-400 sm:inline" aria-hidden>
              ·
            </span>
            <span className="min-w-0 truncate text-sm text-slate-600">{item.company}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${leadStatusSelectClassName(item.status)}`}
            >
              {item.status}
            </span>
            <LeadPriorityBadge score={item.score} priority={item.priority} />
          </div>
          {item.displayReasons.length > 0 ? (
            <ul className="mt-2 space-y-0.5 text-sm text-slate-600">
              {item.displayReasons.map((reason) => (
                <li key={reason} className="break-words">
                  {reason}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-500">No additional priority signals yet.</p>
          )}

          <div className="mt-3 min-w-0">
            <LeadPriorityInsight leadId={item.id} compact />
          </div>
        </div>

        <Link
          href={`/dashboard/leads/${item.id}`}
          className="inline-flex shrink-0 min-w-0 items-center justify-center gap-1 self-start rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-emerald-700 hover:underline sm:pt-1"
        >
          View lead
          <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
        </Link>
      </div>
    </li>
  );
}

export function DashboardPriorityLeads({ items, error }: DashboardPriorityLeadsProps) {
  return (
    <section aria-label="Priority Leads" className="min-w-0">
      <Card className="min-w-0 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Target className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold tracking-tight text-black">Priority Leads</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Leads that deserve attention based on pipeline status and recent activity.
            </p>
          </div>
        </div>

        {error ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : items.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-black/15 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
            No active leads to prioritize yet.
          </div>
        ) : (
          <ul className="mt-5 divide-y divide-black/10">
            {items.map((item) => (
              <PriorityLeadRow key={item.id} item={item} />
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
