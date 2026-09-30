"use client";

import { useEffect, useRef, useState } from "react";
import { Brain } from "lucide-react";
import { AiGeneratedLabel } from "@/components/ui/ai-generated-label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Lead } from "@/lib/lead-types";

type AiLeadIntelligencePanelProps = {
  lead: Lead;
};

type LeadIntelligence = {
  summary: string;
  nextAction: string;
  approach: string;
};

function isLeadIntelligence(value: unknown): value is LeadIntelligence {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.summary === "string" &&
    typeof record.nextAction === "string" &&
    typeof record.approach === "string" &&
    record.summary.trim().length > 0 &&
    record.nextAction.trim().length > 0 &&
    record.approach.trim().length > 0
  );
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
      return "AI generation failed. Please try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export function AiLeadIntelligencePanel({ lead }: AiLeadIntelligencePanelProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [intelligence, setIntelligence] = useState<LeadIntelligence | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentLeadIdRef = useRef(lead.id);
  const isMountedRef = useRef(true);

  useEffect(() => {
    currentLeadIdRef.current = lead.id;
  }, [lead.id]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  async function handleGenerate() {
    const requestLeadId = lead.id;
    setIsGenerating(true);
    setError(null);
    setIntelligence(null);

    try {
      const response = await fetch("/api/ai/lead-intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: requestLeadId }),
      });

      if (requestLeadId !== currentLeadIdRef.current) {
        return;
      }

      let payload: unknown = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!isMountedRef.current || requestLeadId !== currentLeadIdRef.current) {
        return;
      }

      if (!response.ok) {
        const apiMessage =
          payload && typeof payload === "object" && "error" in payload
            ? String((payload as { error: unknown }).error)
            : undefined;
        setError(mapApiError(response.status, apiMessage));
        return;
      }

      if (!isLeadIntelligence(payload)) {
        setError("Something went wrong. Please try again.");
        return;
      }

      setIntelligence({
        summary: payload.summary.trim(),
        nextAction: payload.nextAction.trim(),
        approach: payload.approach.trim(),
      });
    } catch {
      if (isMountedRef.current && requestLeadId === currentLeadIdRef.current) {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      if (isMountedRef.current && requestLeadId === currentLeadIdRef.current) {
        setIsGenerating(false);
      }
    }
  }

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Brain className="h-5 w-5 text-emerald-700" aria-hidden />
        <h2 className="text-lg font-medium text-black">AI Lead Intelligence</h2>
        <AiGeneratedLabel />
      </div>

      <p className="mt-2 text-sm text-slate-600">
        On-demand guidance for {lead.name} based on verified lead data and pipeline status.
      </p>

      <div className="mt-4">
        <Button
          type="button"
          className="w-full rounded-xl px-4 py-2.5 text-sm sm:w-auto"
          disabled={isGenerating}
          aria-busy={isGenerating}
          onClick={() => void handleGenerate()}
        >
          {isGenerating ? "Generating..." : "Generate Intelligence"}
        </Button>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-4 space-y-4 rounded-xl border border-black/10 bg-slate-50/80 p-4" aria-live="polite">
        {isGenerating ? (
          <p className="text-sm text-slate-600">Analyzing lead context…</p>
        ) : intelligence ? (
          <>
            <AiGeneratedLabel className="mb-1" />
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Summary</h3>
              <p className="mt-1 text-sm leading-6 text-slate-800">{intelligence.summary}</p>
            </section>
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Recommended Next Action
              </h3>
              <p className="mt-1 text-sm font-medium leading-6 text-black">{intelligence.nextAction}</p>
            </section>
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Suggested Approach</h3>
              <p className="mt-1 text-sm leading-6 text-slate-800">{intelligence.approach}</p>
            </section>
          </>
        ) : (
          <p className="text-sm text-slate-600">
            Generate a concise summary, recommended next action, and suggested approach for this lead.
          </p>
        )}
      </div>
    </Card>
  );
}
