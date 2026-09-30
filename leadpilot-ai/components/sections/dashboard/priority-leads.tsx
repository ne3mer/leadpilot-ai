"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Sparkles, Target } from "lucide-react";
import { leadStatusSelectClassName } from "@/components/leads/lead-status-select-options";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { DashboardPriorityLeadItem } from "@/lib/leads/priority-dashboard";
import type { LeadPriorityLevel } from "@/lib/leads/priority-score";

type DashboardPriorityLeadsProps = {
  items: DashboardPriorityLeadItem[];
  error?: string | null;
};

type PriorityExplanation = {
  explanation: string;
  nextAction: string;
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

function mapApiError(status: number, apiMessage: string | undefined): string {
  switch (status) {
    case 401:
      return "You must be signed in.";
    case 400:
      return apiMessage && apiMessage.trim().length > 0
        ? apiMessage
        : "Something went wrong. Please try again.";
    case 404:
      return "Lead not found.";
    case 503:
      return "AI service is not configured.";
    case 502:
      return "AI insight failed. Please try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

function isPriorityExplanation(value: unknown): value is PriorityExplanation {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.explanation === "string" &&
    typeof record.nextAction === "string" &&
    record.explanation.trim().length > 0 &&
    record.nextAction.trim().length > 0
  );
}

function PriorityLeadRow({ item }: { item: DashboardPriorityLeadItem }) {
  const [isLoading, setIsLoading] = useState(false);
  const [insight, setInsight] = useState<PriorityExplanation | null>(null);
  const [insightError, setInsightError] = useState<string | null>(null);
  const requestLeadIdRef = useRef(item.id);

  useEffect(() => {
    requestLeadIdRef.current = item.id;
  }, [item.id]);

  async function handleExplain() {
    const requestLeadId = item.id;
    setIsLoading(true);
    setInsightError(null);

    try {
      const response = await fetch("/api/ai/lead-priority-explanation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: requestLeadId }),
      });

      if (requestLeadId !== requestLeadIdRef.current) {
        return;
      }

      let payload: unknown = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok) {
        const apiMessage =
          payload &&
          typeof payload === "object" &&
          typeof (payload as Record<string, unknown>).error === "string"
            ? ((payload as Record<string, unknown>).error as string)
            : undefined;
        setInsight(null);
        setInsightError(mapApiError(response.status, apiMessage));
        return;
      }

      if (!isPriorityExplanation(payload)) {
        setInsight(null);
        setInsightError(mapApiError(502, undefined));
        return;
      }

      setInsight(payload);
    } catch {
      if (requestLeadId === requestLeadIdRef.current) {
        setInsightError("Something went wrong. Please try again.");
      }
    } finally {
      if (requestLeadId === requestLeadIdRef.current) {
        setIsLoading(false);
      }
    }
  }

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

          {insight ? (
            <div className="mt-3 min-w-0 space-y-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2.5 text-sm text-slate-700">
              <p className="break-words">
                <span className="font-medium text-slate-900">Why: </span>
                {insight.explanation}
              </p>
              <p className="break-words">
                <span className="font-medium text-slate-900">Next: </span>
                {insight.nextAction}
              </p>
            </div>
          ) : null}

          {insightError ? (
            <p className="mt-2 text-sm text-red-700" role="alert">
              {insightError}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-stretch">
          <Button
            type="button"
            variant="secondary"
            disabled={isLoading}
            onClick={handleExplain}
            className="min-w-0 gap-1.5 rounded-xl px-3 py-2 text-sm"
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            {isLoading ? "Loading…" : insight ? "Refresh insight" : "AI insight"}
          </Button>
          <Link
            href={`/dashboard/leads/${item.id}`}
            className="inline-flex min-w-0 items-center justify-center gap-1 rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-emerald-700 hover:underline sm:py-1"
          >
            View lead
            <ArrowUpRight className="h-4 w-4 shrink-0" />
          </Link>
        </div>
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
              <PriorityLeadRow key={item.id} item={item} />
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
