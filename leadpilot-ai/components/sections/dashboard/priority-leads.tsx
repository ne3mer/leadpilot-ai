import Link from "next/link";
import { ArrowUpRight, Target } from "lucide-react";
import { leadStatusSelectClassName } from "@/components/leads/lead-status-select-options";
import { Card } from "@/components/ui/card";
import type { DashboardPriorityLeadItem } from "@/lib/leads/priority-dashboard";
import type { LeadPriorityLevel } from "@/lib/leads/priority-score";

type DashboardPriorityLeadsProps = {
  items: DashboardPriorityLeadItem[];
  error?: string | null;
};

function priorityLevelLabel(level: LeadPriorityLevel): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

function priorityLevelClassName(level: LeadPriorityLevel): string {
  const classes: Record<LeadPriorityLevel, string> = {
    high: "bg-emerald-100 text-emerald-800",
    medium: "bg-amber-100 text-amber-900",
    low: "bg-zinc-100 text-zinc-700",
  };
  return classes[level];
}

export function DashboardPriorityLeads({ items, error }: DashboardPriorityLeadsProps) {
  return (
    <section aria-label="Priority Leads" className="min-w-0">
      <Card className="min-w-0 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Target className="h-5 w-5" />
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
              <li key={item.id} className="min-w-0 py-4 first:pt-0 last:pb-0">
                <Link
                  href={`/dashboard/leads/${item.id}`}
                  className="group flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="truncate text-base font-semibold text-black group-hover:text-emerald-800">
                        {item.name}
                      </span>
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
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityLevelClassName(item.priority)}`}
                      >
                        {item.score} · {priorityLevelLabel(item.priority)}
                      </span>
                    </div>
                    {item.displayReasons.length > 0 ? (
                      <ul className="mt-2 space-y-0.5 text-sm text-slate-600">
                        {item.displayReasons.map((reason) => (
                          <li key={reason} className="break-words">
                            {reason}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-emerald-700 opacity-100 transition group-hover:underline sm:pt-1">
                    View lead
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
