"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { AiGeneratedLabel } from "@/components/ui/ai-generated-label";
import { Button } from "@/components/ui/button";
import { typographyClass } from "@/lib/design-system/typography";
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
  /** Lead detail: no sparkle icon, design-system copy */
  variant?: "default" | "guidance";
};

export function LeadPriorityInsight({
  leadId,
  compact = false,
  dashboardRow = false,
  variant = "default",
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

  const isGuidance = variant === "guidance";
  const buttonLabel = isLoading
    ? "Generating priority insight"
    : insight
      ? "Refresh priority insight"
      : "Generate priority insight";

  const showHelper = !dashboardRow && !isLoading && !insight && !insightError && !isGuidance;

  const buttonText = isLoading
    ? "Generating…"
    : insight
      ? "Refresh insight"
      : isGuidance
        ? "Generate insight"
        : "AI insight";

  return (
    <div className="min-w-0">
      <Button
        type="button"
        variant="secondary"
        disabled={isLoading}
        onClick={handleExplain}
        aria-busy={isLoading}
        aria-label={buttonLabel}
        className={`min-w-0 text-sm ${compact || dashboardRow ? "gap-1.5 px-3 py-2" : "px-4 py-2.5"} ${!isGuidance ? "gap-1.5" : ""}`}
      >
        {!isGuidance ? <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden /> : null}
        {buttonText}
      </Button>

      {isLoading ? (
        <p className={typographyClass("bodySmall", "mt-2 text-secondary")} role="status" aria-live="polite">
          Generating insight…
        </p>
      ) : null}

      {showHelper ? (
        <p className={typographyClass("bodySmall", "mt-2 text-muted")}>
          On demand: AI explanation of why this lead deserves attention and a suggested next step.
        </p>
      ) : null}

      {insight ? (
        <div
          className={`mt-[var(--lp-space-4)] min-w-0 space-y-3 ${typographyClass("bodySmall", "text-primary")}`}
          aria-live="polite"
        >
          <AiGeneratedLabel disclosure="generated" className="mb-1" />
          <p className="break-words leading-relaxed">
            <span className="font-medium text-secondary">Why · </span>
            {insight.explanation}
          </p>
          <p className="break-words leading-relaxed">
            <span className="font-medium text-secondary">Next step · </span>
            {insight.nextAction}
          </p>
        </div>
      ) : null}

      {insightError ? (
        <p className={`mt-2 ${typographyClass("bodySmall", "text-danger")}`} role="alert">
          {insightError}
        </p>
      ) : null}
    </div>
  );
}
