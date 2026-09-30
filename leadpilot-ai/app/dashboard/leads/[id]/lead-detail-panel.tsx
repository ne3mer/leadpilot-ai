"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { deleteLeadAction, updateLeadDetailAction } from "@/lib/leads/actions";
import { formatLeadTimestamp } from "@/lib/leads/format";
import {
  LeadStatusSelectOptions,
  leadStatusMetadataClassName,
  leadStatusSelectClassName,
} from "@/components/leads/lead-status-select-options";
import { LeadDetailBriefHeader } from "@/components/leads/lead-detail-brief-header";
import { LeadDetailSection } from "@/components/leads/lead-detail-section";
import { AiGuidanceBlock } from "@/components/leads/ai-guidance-block";
import { LeadPriorityInsight } from "@/components/leads/lead-priority-insight";
import { LeadPrioritySummary } from "@/components/leads/lead-priority-summary";
import { SenderProfileAiCta } from "@/components/leads/sender-profile-ai-cta";
import { AiLeadIntelligencePanel } from "@/components/sections/dashboard/ai-lead-intelligence-panel";
import { DashboardAiMessagePanel } from "@/components/sections/dashboard/ai-message-panel";
import { LeadActivityPanel } from "@/components/sections/dashboard/lead-activity-panel";
import { LeadTimeline } from "@/components/sections/dashboard/lead-timeline";
import type { LeadActivity } from "@/lib/activity-types";
import { Button, buttonClassName } from "@/components/ui/button";
import {
  fieldLabelClassName,
  inputClassName,
  selectClassName,
} from "@/components/ui/input";
import { typographyClass } from "@/lib/design-system/typography";
import type { LeadPriorityScoreResult } from "@/lib/leads/priority-types";
import type { Lead, LeadStatus } from "@/lib/lead-types";

type LeadDetailPanelProps = {
  lead: Lead;
  activities: LeadActivity[];
  priorityResult: LeadPriorityScoreResult;
  hasSenderProfile: boolean;
};

type FormState = {
  name: string;
  company: string;
  email: string;
  status: LeadStatus;
};

function toFormState(lead: Lead): FormState {
  return {
    name: lead.name,
    company: lead.company,
    email: lead.email,
    status: lead.status,
  };
}

export function LeadDetailPanel({
  lead,
  activities,
  priorityResult,
  hasSenderProfile,
}: LeadDetailPanelProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteLead, setConfirmDeleteLead] = useState(false);
  const [form, setForm] = useState<FormState>(() => toFormState(lead));
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCancelEdit() {
    setForm(toFormState(lead));
    setIsEditing(false);
    setError(null);
  }

  function handleSave() {
    setError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const result = await updateLeadDetailAction(lead.id, {
        name: form.name,
        company: form.company,
        email: form.email,
        status: form.status,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setIsEditing(false);
      setSuccessMessage("Lead updated.");
      router.refresh();
    });
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteLeadAction(lead.id);
      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <div className="mx-auto min-w-0 max-w-3xl">
      <LeadDetailBriefHeader lead={lead} priority={priorityResult} />

      {successMessage ? (
        <p
          className="mt-[var(--lp-space-4)] rounded-sm border border-accent/30 bg-accent-muted px-3 py-2 lp-text-body-small text-primary"
          role="status"
        >
          {successMessage}
        </p>
      ) : null}

      {error ? (
        <p
          className="mt-[var(--lp-space-4)] rounded-sm border border-danger/20 bg-danger-muted px-3 py-2 lp-text-body-small text-danger"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-[var(--lp-space-section)] space-y-0">
        <LeadDetailSection
          index="01"
          title="Lead"
          description="Identity, contact, and pipeline status."
          className="border-t-0 pt-0"
        >
          <div className="flex flex-wrap items-center justify-end gap-2">
            {!isEditing ? (
              <Button
                type="button"
                variant="secondary"
                className="gap-1.5"
                onClick={() => {
                  setForm(toFormState(lead));
                  setIsEditing(true);
                  setSuccessMessage(null);
                  setError(null);
                  setConfirmDeleteLead(false);
                }}
              >
                <Pencil className="h-4 w-4 shrink-0" aria-hidden />
                Edit
              </Button>
            ) : null}

            {!confirmDeleteLead ? (
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  setConfirmDeleteLead(true);
                  setError(null);
                }}
                className="lp-focus-ring inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 lp-text-body-small font-medium text-danger hover:bg-danger-muted disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
                Delete lead
              </button>
            ) : null}
          </div>

          {confirmDeleteLead ? (
            <div
              className="mt-[var(--lp-space-4)] rounded-sm border border-danger/25 bg-danger-muted px-4 py-3"
              role="alertdialog"
              aria-labelledby="delete-lead-heading"
            >
              <p id="delete-lead-heading" className={typographyClass("bodySmall", "text-danger")}>
                Delete this lead permanently? This cannot be undone.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={handleDelete}
                  className="rounded-sm bg-danger px-3 py-2 lp-text-body-small font-medium text-white hover:opacity-90 disabled:opacity-60"
                >
                  {isPending ? "Deleting…" : "Confirm delete"}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setConfirmDeleteLead(false)}
                  className={buttonClassName("secondary", "px-3 py-2 lp-text-body-small disabled:opacity-60")}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          {isEditing ? (
            <form
              className="mt-[var(--lp-space-6)] space-y-[var(--lp-space-form-gap)]"
              onSubmit={(event) => {
                event.preventDefault();
                handleSave();
              }}
            >
              <div className="space-y-[var(--lp-space-form-gap)] border-b border-border pb-[var(--lp-space-6)]">
                <p className={typographyClass("caption", "text-muted")}>Identity</p>
                <label className={fieldLabelClassName()}>
                  Name
                  <input
                    required
                    value={form.name}
                    disabled={isPending}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    className={inputClassName("mt-2")}
                  />
                </label>
                <label className={fieldLabelClassName()}>
                  Company
                  <input
                    required
                    value={form.company}
                    disabled={isPending}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, company: event.target.value }))
                    }
                    className={inputClassName("mt-2")}
                  />
                </label>
              </div>

              <div className="space-y-[var(--lp-space-form-gap)] border-b border-border pb-[var(--lp-space-6)]">
                <p className={typographyClass("caption", "text-muted")}>Contact</p>
                <label className={fieldLabelClassName()}>
                  Email
                  <input
                    type="email"
                    required
                    value={form.email}
                    disabled={isPending}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    className={inputClassName("mt-2")}
                  />
                </label>
              </div>

              <div className="space-y-[var(--lp-space-form-gap)]">
                <p className={typographyClass("caption", "text-muted")}>Status</p>
                <label className={fieldLabelClassName()}>
                  Pipeline status
                  <select
                    value={form.status}
                    disabled={isPending}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, status: event.target.value as LeadStatus }))
                    }
                    className={`${selectClassName("mt-2")} ${leadStatusSelectClassName(form.status)}`}
                  >
                    <LeadStatusSelectOptions idPrefix={`edit-${lead.id}`} />
                  </select>
                </label>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving…" : "Save changes"}
                </Button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={handleCancelEdit}
                  className={buttonClassName("secondary", "px-4 py-2 text-sm disabled:opacity-60")}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <dl className="mt-[var(--lp-space-6)] min-w-0 space-y-[var(--lp-space-6)]">
              <div className="border-b border-border pb-[var(--lp-space-5)]">
                <dt className={typographyClass("caption", "text-muted")}>Identity</dt>
                <dd className="mt-2 break-words lp-text-body font-medium text-primary">{lead.name}</dd>
                <dd className="mt-1 break-words lp-text-body-small text-secondary">{lead.company}</dd>
              </div>
              <div className="border-b border-border pb-[var(--lp-space-5)]">
                <dt className={typographyClass("caption", "text-muted")}>Contact</dt>
                <dd className="mt-2 break-all lp-text-body-small text-primary">{lead.email}</dd>
              </div>
              <div className="grid gap-[var(--lp-space-5)] sm:grid-cols-2">
                <div>
                  <dt className={typographyClass("caption", "text-muted")}>Status</dt>
                  <dd className={`mt-2 font-medium ${leadStatusMetadataClassName(lead.status)}`}>
                    {lead.status}
                  </dd>
                </div>
                <div>
                  <dt className={typographyClass("caption", "text-muted")}>Created</dt>
                  <dd className="mt-2 tabular-nums lp-text-body-small text-secondary">
                    {formatLeadTimestamp(lead.created_at)}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className={typographyClass("caption", "text-muted")}>Last updated</dt>
                  <dd className="mt-2 tabular-nums lp-text-body-small text-secondary">
                    {formatLeadTimestamp(lead.updated_at)}
                  </dd>
                </div>
              </div>
            </dl>
          )}
        </LeadDetailSection>

        <LeadDetailSection
          index="02"
          title="Priority"
          description="Deterministic score from pipeline status and activity—not AI."
        >
          <LeadPrioritySummary priority={priorityResult} />

          <div className="mt-[var(--lp-space-8)] border-t border-border pt-[var(--lp-space-6)]">
            <AiGuidanceBlock
              title="Priority insight"
              description="Why this lead might deserve attention beyond the score."
            >
              <SenderProfileAiCta hasSenderProfile={hasSenderProfile} />
              <LeadPriorityInsight leadId={lead.id} variant="guidance" />
            </AiGuidanceBlock>
          </div>
        </LeadDetailSection>

        <LeadTimeline leadCreatedAt={lead.created_at} activities={activities} />

        <LeadActivityPanel leadId={lead.id} initialActivities={activities} />

        <AiLeadIntelligencePanel
          key={`intel-${lead.id}`}
          lead={lead}
          hasSenderProfile={hasSenderProfile}
          presentation="detail"
        />

        <DashboardAiMessagePanel
          key={`ai-${lead.id}`}
          selectedLead={lead}
          hasSenderProfile={hasSenderProfile}
          presentation="detail"
        />
      </div>
    </div>
  );
}
