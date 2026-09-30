"use client";

import { useEffect, useRef, useState } from "react";
import { AiGuidanceBlock } from "@/components/leads/ai-guidance-block";
import { LeadDetailSection } from "@/components/leads/lead-detail-section";
import { SenderProfileAiCta } from "@/components/leads/sender-profile-ai-cta";
import { AiGeneratedLabel } from "@/components/ui/ai-generated-label";
import { Button } from "@/components/ui/button";
import { typographyClass } from "@/lib/design-system/typography";
import type { Lead } from "@/lib/lead-types";

type AiLeadIntelligencePanelProps = {
  lead: Lead;
  hasSenderProfile?: boolean;
  presentation?: "card" | "detail";
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

function IntelligenceBody({
  lead,
  hasSenderProfile,
}: {
  lead: Lead;
  hasSenderProfile: boolean;
}) {
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
    <>
      <AiGuidanceBlock
        title="Lead intelligence"
        description="Concise understanding from verified lead data, activities, and your sender context."
      >
        <SenderProfileAiCta hasSenderProfile={hasSenderProfile} />
        <Button
          type="button"
          variant="secondary"
          className="mt-[var(--lp-space-3)] w-full sm:w-auto"
          disabled={isGenerating}
          aria-busy={isGenerating}
          onClick={() => void handleGenerate()}
        >
          {isGenerating ? "Generating…" : "Generate intelligence"}
        </Button>
      </AiGuidanceBlock>

      {error ? (
        <p
          className="mt-4 rounded-sm border border-danger/20 bg-danger-muted px-3 py-2 lp-text-body-small text-danger"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-[var(--lp-space-6)] min-w-0" aria-live="polite" aria-busy={isGenerating}>
        {isGenerating ? (
          <p className={typographyClass("bodySmall", "text-secondary")}>Analyzing lead context…</p>
        ) : intelligence ? (
          <div className="min-w-0 space-y-[var(--lp-space-5)]">
            <section>
              <h4 className={typographyClass("caption", "text-muted")}>Summary</h4>
              <p className="mt-2 break-words leading-relaxed lp-text-body-small text-primary">
                {intelligence.summary}
              </p>
            </section>
            <section>
              <h4 className={typographyClass("caption", "text-muted")}>Next action</h4>
              <p className="mt-2 break-words font-medium leading-relaxed lp-text-body-small text-primary">
                {intelligence.nextAction}
              </p>
            </section>
            <section>
              <h4 className={typographyClass("caption", "text-muted")}>Approach</h4>
              <p className="mt-2 break-words leading-relaxed lp-text-body-small text-secondary">
                {intelligence.approach}
              </p>
            </section>
            <AiGeneratedLabel disclosure="generated" className="pt-1" />
          </div>
        ) : (
          <p className={typographyClass("bodySmall", "text-muted")}>
            Generated summary, next action, and approach will appear here.
          </p>
        )}
      </div>
    </>
  );
}

export function AiLeadIntelligencePanel({
  lead,
  hasSenderProfile = true,
  presentation = "card",
}: AiLeadIntelligencePanelProps) {
  const body = (
    <IntelligenceBody lead={lead} hasSenderProfile={hasSenderProfile} />
  );

  if (presentation === "detail") {
    return (
      <LeadDetailSection
        index="05"
        title="Intelligence"
        description="Broader context beyond the priority score—when you need a full read on this lead."
      >
        {body}
      </LeadDetailSection>
    );
  }

  return body;
}
