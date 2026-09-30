"use client";

import { useEffect, useRef, useState } from "react";
import {
  aiFollowUpObjectiveLabels,
  aiFollowUpObjectives,
  aiFollowUpToneLabels,
  aiFollowUpTones,
  type AiFollowUpObjective,
  type AiFollowUpTone,
} from "@/lib/ai/constants";
import { LeadStatusSelectOptions } from "@/components/leads/lead-status-select-options";
import { SenderProfileAiCta } from "@/components/leads/sender-profile-ai-cta";
import { AiGeneratedLabel } from "@/components/ui/ai-generated-label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  fieldLabelClassName,
  inputClassName,
  selectClassName,
} from "@/components/ui/input";
import { typographyClass } from "@/lib/design-system/typography";
import type { Lead, LeadStatus } from "@/lib/lead-types";

type DashboardAiMessagePanelProps = {
  selectedLead?: Lead | null;
  hasSenderProfile?: boolean;
  workflowStep?: string;
  layout?: "default" | "compact";
};

type GeneratedFollowUp = {
  subject: string;
  message: string;
};

type CopyState = "idle" | "copied" | "failed";

function isGeneratedFollowUp(value: unknown): value is GeneratedFollowUp {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.subject === "string" &&
    typeof record.message === "string" &&
    record.subject.trim().length > 0 &&
    record.message.trim().length > 0
  );
}

function FollowUpDetails({
  leadId,
  children,
}: {
  leadId?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(() => Boolean(leadId));

  return (
    <details
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className="group min-w-0"
    >
      {children}
    </details>
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

export function DashboardAiMessagePanel({
  selectedLead,
  hasSenderProfile = true,
  workflowStep,
  layout = "default",
}: DashboardAiMessagePanelProps) {
  const [draftName, setDraftName] = useState("");
  const [draftCompany, setDraftCompany] = useState("");
  const [draftStatus, setDraftStatus] = useState<LeadStatus>("New");
  const [tone, setTone] = useState<AiFollowUpTone>("professional");
  const [objective, setObjective] = useState<AiFollowUpObjective>("follow_up");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<GeneratedFollowUp | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const currentLeadIdRef = useRef<string | undefined>(selectedLead?.id);
  const isMountedRef = useRef(true);

  useEffect(() => {
    currentLeadIdRef.current = selectedLead?.id;
  }, [selectedLead?.id]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const leadName = selectedLead?.name ?? draftName;
  const company = selectedLead?.company ?? draftCompany;
  const status = selectedLead?.status ?? draftStatus;

  const copyResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyResetTimerRef.current) {
        clearTimeout(copyResetTimerRef.current);
      }
    };
  }, []);

  async function handleGenerate() {
    const leadId = selectedLead?.id;
    if (!leadId || !tone || !objective) {
      setError("Select a saved lead before generating a follow-up.");
      return;
    }

    const requestLeadId = leadId;
    setIsGenerating(true);
    setError(null);
    setGenerated(null);
    setCopyState("idle");

    try {
      const response = await fetch("/api/ai/lead-follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: requestLeadId,
          tone,
          objective,
        }),
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

      if (!isGeneratedFollowUp(payload)) {
        setError("Something went wrong. Please try again.");
        return;
      }

      setGenerated({
        subject: payload.subject.trim(),
        message: payload.message.trim(),
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

  async function handleCopy() {
    if (!generated) {
      return;
    }

    const text = `Subject: ${generated.subject}\n\n${generated.message}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
      if (copyResetTimerRef.current) {
        clearTimeout(copyResetTimerRef.current);
      }
      copyResetTimerRef.current = setTimeout(() => {
        setCopyState("idle");
      }, 2000);
    } catch {
      setCopyState("failed");
      if (copyResetTimerRef.current) {
        clearTimeout(copyResetTimerRef.current);
      }
      copyResetTimerRef.current = setTimeout(() => {
        setCopyState("idle");
      }, 2500);
    }
  }

  const canGenerate = Boolean(selectedLead?.id) && !isGenerating;
  const isCompact = layout === "compact";

  const panelBody = (
    <>
      {workflowStep ? (
        <p className="lp-text-caption text-muted">{workflowStep}</p>
      ) : null}
      <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 ${workflowStep ? "mt-1" : ""}`}>
        <h2 className={isCompact ? typographyClass("subsection") : typographyClass("sectionTitle")}>
          {isCompact ? "Draft follow-up" : "AI message generator"}
        </h2>
        <AiGeneratedLabel disclosure="draft" />
      </div>

      <p className={typographyClass("bodySmall", "mt-2")}>
        Optional assistance when outreach is appropriate—tone and objective apply to the selected lead.
      </p>
      <SenderProfileAiCta hasSenderProfile={hasSenderProfile} className="mt-2" />

      {selectedLead ? (
        <p className="mt-3 rounded-sm border border-border bg-surface-subtle px-3 py-2 lp-text-caption text-secondary">
          <span className="font-medium text-primary">{selectedLead.name}</span>
          {selectedLead.company ? ` · ${selectedLead.company}` : null}
        </p>
      ) : (
        <p className="mt-3 rounded-sm border border-border bg-surface-subtle px-3 py-2 lp-text-caption text-muted">
          Choose &quot;Use in AI&quot; on a pipeline lead to draft a follow-up here.
        </p>
      )}

      <div className="mt-4 grid gap-[var(--lp-space-form-gap)] sm:grid-cols-2">
        <label className={fieldLabelClassName()}>
          Lead name
          <input
            value={leadName}
            onChange={(event) => setDraftName(event.target.value)}
            className={inputClassName("mt-2")}
            placeholder="From selected lead"
            readOnly={Boolean(selectedLead)}
            aria-readonly={Boolean(selectedLead)}
          />
        </label>

        <label className={fieldLabelClassName()}>
          Company
          <input
            value={company}
            onChange={(event) => setDraftCompany(event.target.value)}
            className={inputClassName("mt-2")}
            placeholder="From selected lead"
            readOnly={Boolean(selectedLead)}
            aria-readonly={Boolean(selectedLead)}
          />
        </label>

        <label className={fieldLabelClassName()}>
          Status
          <select
            value={status}
            onChange={(event) => setDraftStatus(event.target.value as LeadStatus)}
            className={selectClassName("mt-2")}
            disabled={Boolean(selectedLead)}
            aria-disabled={Boolean(selectedLead)}
          >
            <LeadStatusSelectOptions idPrefix="ai-panel" />
          </select>
        </label>

        <label className={fieldLabelClassName()}>
          Tone
          <select
            value={tone}
            onChange={(event) => setTone(event.target.value as AiFollowUpTone)}
            className={selectClassName("mt-2")}
            disabled={isGenerating}
            aria-disabled={isGenerating}
          >
            {aiFollowUpTones.map((value) => (
              <option key={value} value={value}>
                {aiFollowUpToneLabels[value]}
              </option>
            ))}
          </select>
        </label>

        <label className={`${fieldLabelClassName()} sm:col-span-2`}>
          Objective
          <select
            value={objective}
            onChange={(event) => setObjective(event.target.value as AiFollowUpObjective)}
            className={selectClassName("mt-2")}
            disabled={isGenerating}
            aria-disabled={isGenerating}
          >
            {aiFollowUpObjectives.map((value) => (
              <option key={value} value={value}>
                {aiFollowUpObjectiveLabels[value]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4">
        <Button
          type="button"
          className="w-full sm:w-auto"
          disabled={!canGenerate}
          aria-busy={isGenerating}
          onClick={() => void handleGenerate()}
        >
          {isGenerating ? "Generating…" : "Generate draft"}
        </Button>
      </div>

      {error ? (
        <p
          className="mt-4 rounded-sm border border-danger/20 bg-danger-muted px-3 py-2 lp-text-body-small text-danger"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div
        className="mt-4 rounded-sm border border-border bg-surface-subtle p-4"
        aria-live="polite"
        aria-busy={isGenerating}
      >
        {isGenerating ? (
          <p className="lp-text-body-small text-secondary">Generating your follow-up draft…</p>
        ) : generated ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <AiGeneratedLabel disclosure="draft" />
              <Button
                type="button"
                variant="secondary"
                className="px-3 py-1.5 text-xs"
                onClick={() => void handleCopy()}
                aria-label="Copy subject and message to clipboard"
              >
                {copyState === "copied"
                  ? "Copied"
                  : copyState === "failed"
                    ? "Copy failed"
                    : "Copy"}
              </Button>
            </div>

            {copyState === "failed" ? (
              <p className="lp-text-caption text-danger">Unable to copy. Select the text manually.</p>
            ) : null}

            <div>
              <p className="lp-text-caption text-muted">Subject</p>
              <p className="mt-1 break-words lp-text-body-small font-medium text-primary">
                {generated.subject}
              </p>
            </div>

            <div>
              <p className="lp-text-caption text-muted">Message</p>
              <p className="mt-2 whitespace-pre-wrap break-words lp-text-body-small text-secondary">
                {generated.message}
              </p>
            </div>
          </div>
        ) : (
          <p className="lp-text-body-small text-muted">
            Generated copy will appear here after you run draft generation.
          </p>
        )}
      </div>
    </>
  );

  if (isCompact) {
    return (
      <section aria-label="Draft follow-up assistance" className="min-w-0">
        <FollowUpDetails key={selectedLead?.id ?? "no-lead-selected"} leadId={selectedLead?.id}>
          <summary className="lp-focus-ring cursor-pointer list-none rounded-sm py-1 lp-text-body-small font-medium text-secondary marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="text-primary">Follow-up assistance</span>
            <span className="ml-2 lp-text-caption text-muted">Optional · AI-assisted</span>
          </summary>
          <div className="mt-[var(--lp-space-4)] min-w-0 border-t border-border pt-[var(--lp-space-4)]">
            {panelBody}
          </div>
        </FollowUpDetails>
      </section>
    );
  }

  return (
    <Card className="min-w-0 p-5 sm:p-6">
      {panelBody}
    </Card>
  );
}
