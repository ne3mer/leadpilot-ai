"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { AiGeneratedLabel } from "@/components/ui/ai-generated-label";
import { Button } from "@/components/ui/button";
import {
  isLeadPriorityExplanation,
  mapPriorityInsightApiError,
  type LeadPriorityExplanation,
} from "@/lib/leads/priority-insight-client";

type LeadPriorityInsightProps = {
  leadId: string;
  compact?: boolean;
  /** Compact dashboard row: no helper text, smaller AI result block */
  dashboardRow?: boolean;
};

export function LeadPriorityInsight({
  leadId,
  compact = false,
  dashboardRow = false,
}: LeadPriorityInsightProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [insight, setInsight] = useState<LeadPriorityExplanation | null>(null);
  const [insightError, setInsightError] = useState<string | null>(null);
  const requestLeadIdRef = useRef(leadId);
  const inFlightRef = useRef(false);

  useEffect(() => {
    requestLeadIdRef.current = leadId;
  }, [leadId]);

  async function handleExplain() {
    if (inFlightRef.current) {
      return;
    }

    const requestLeadId = leadId;
    inFlightRef.current = true;
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
        setInsightError(mapPriorityInsightApiError(response.status, apiMessage));
        return;
      }

      if (!isLeadPriorityExplanation(payload)) {
        setInsightError(mapPriorityInsightApiError(502, undefined));
        return;
      }

      setInsight(payload);
    } catch {
      if (requestLeadId === requestLeadIdRef.current) {
        setInsightError("Something went wrong. Please try again.");
      }
    } finally {
      inFlightRef.current = false;
      if (requestLeadId === requestLeadIdRef.current) {
        setIsLoading(false);
      }
    }
  }

  const buttonLabel = isLoading
    ? "Generating AI insight"
    : insight
      ? "Refresh AI priority insight"
      : "Generate AI priority insight";

  const showHelper = !dashboardRow && !isLoading && !insight && !insightError;

  return (
    <div className="min-w-0">
      <Button
        type="button"
        variant="secondary"
        disabled={isLoading}
        onClick={handleExplain}
        aria-busy={isLoading}
        aria-label={buttonLabel}
        className={`min-w-0 gap-1.5 rounded-xl text-sm ${compact || dashboardRow ? "px-3 py-2" : "px-4 py-2.5"}`}
      >
        <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {isLoading ? "Loading…" : insight ? "Refresh insight" : "AI insight"}
      </Button>

      {isLoading ? (
        <p className="mt-2 text-sm text-slate-600" role="status" aria-live="polite">
          Generating insight…
        </p>
      ) : null}

      {showHelper ? (
        <p className="mt-2 text-sm text-slate-500">
          On demand: AI explanation of why this lead deserves attention and a suggested next step.
        </p>
      ) : null}

      {insight ? (
        <div
          className={`mt-2 min-w-0 space-y-2 rounded-lg border border-violet-100 bg-violet-50/50 text-slate-700 ${dashboardRow ? "px-2.5 py-2 text-xs" : "rounded-xl border-emerald-100 bg-emerald-50/60 px-3 py-2.5 text-sm"}`}
          aria-live="polite"
        >
          <AiGeneratedLabel className="mb-1" />
          <p className="break-words">
            <span className="font-medium text-slate-900">Why: </span>
            {insight.explanation}
          </p>
          <p className="break-words">
            <span className="font-medium text-slate-900">Suggested next step: </span>
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
  );
}
