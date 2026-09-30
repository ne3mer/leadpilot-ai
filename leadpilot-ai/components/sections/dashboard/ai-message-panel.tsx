"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
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
import type { Lead, LeadStatus } from "@/lib/lead-types";

type DashboardAiMessagePanelProps = {
  selectedLead?: Lead | null;
  hasSenderProfile?: boolean;
  workflowStep?: string;
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

  return (
    <Card className="min-w-0 p-5 sm:p-6">
      {workflowStep ? (
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
          {workflowStep}
        </p>
      ) : null}
      <div className={`flex flex-wrap items-center gap-2 ${workflowStep ? "mt-1" : ""}`}>
        <Sparkles className="h-5 w-5 text-emerald-700" aria-hidden />
        <h2 className="text-lg font-medium text-black">AI message generator</h2>
        <AiGeneratedLabel variant="draft" />
      </div>

      <p className="mt-2 text-sm text-slate-600">
        Draft a follow-up message when outreach is appropriate—using your tone and objective.
      </p>
      <SenderProfileAiCta hasSenderProfile={hasSenderProfile} className="mt-2" />

      {selectedLead ? (
        <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
          Lead: {selectedLead.name}
          {selectedLead.company ? ` — ${selectedLead.company}` : ""}
        </p>
      ) : (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Select a saved lead with &quot;Use in AI&quot; on the dashboard, or open a lead detail page.
        </p>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-slate-700">
          Lead Name
          <input
            value={leadName}
            onChange={(event) => setDraftName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring"
            placeholder="From selected lead"
            readOnly={Boolean(selectedLead)}
            aria-readonly={Boolean(selectedLead)}
          />
        </label>

        <label className="text-sm text-slate-700">
          Company
          <input
            value={company}
            onChange={(event) => setDraftCompany(event.target.value)}
            className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring"
            placeholder="From selected lead"
            readOnly={Boolean(selectedLead)}
            aria-readonly={Boolean(selectedLead)}
          />
        </label>

        <label className="text-sm text-slate-700">
          Status
          <select
            value={status}
            onChange={(event) => setDraftStatus(event.target.value as LeadStatus)}
            className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring"
            disabled={Boolean(selectedLead)}
            aria-disabled={Boolean(selectedLead)}
          >
            <LeadStatusSelectOptions idPrefix="ai-panel" />
          </select>
        </label>

        <label className="text-sm text-slate-700">
          Tone
          <select
            value={tone}
            onChange={(event) => setTone(event.target.value as AiFollowUpTone)}
            className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring"
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

        <label className="text-sm text-slate-700 sm:col-span-2">
          Objective
          <select
            value={objective}
            onChange={(event) => setObjective(event.target.value as AiFollowUpObjective)}
            className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring"
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
          className="w-full rounded-xl px-4 py-2.5 text-sm sm:w-auto"
          disabled={!canGenerate}
          aria-busy={isGenerating}
          onClick={() => void handleGenerate()}
        >
          {isGenerating ? "Generating..." : "Generate"}
        </Button>
      </div>

      {error ? (
        <p
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div
        className="mt-4 rounded-xl border border-black/10 bg-white p-4 sm:p-5"
        aria-live="polite"
        aria-busy={isGenerating}
      >
        {isGenerating ? (
          <p className="text-sm text-slate-600">Generating your follow-up draft…</p>
        ) : generated ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email draft for this lead
                </p>
                <AiGeneratedLabel variant="draft" />
              </div>
              <Button
                type="button"
                variant="secondary"
                className="rounded-xl px-4 py-2 text-xs"
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
              <p className="text-xs text-red-700">Unable to copy. Select the text manually.</p>
            ) : null}

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Subject</p>
              <p className="mt-1 break-words text-sm font-semibold text-black">{generated.subject}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Message</p>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-800">
                {generated.message}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-600">
            Generate a personalized follow-up based on this lead&apos;s information.
          </p>
        )}
      </div>
    </Card>
  );
}
