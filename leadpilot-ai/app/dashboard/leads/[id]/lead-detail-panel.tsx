"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { deleteLeadAction, updateLeadDetailAction } from "@/lib/leads/actions";
import { formatLeadTimestamp } from "@/lib/leads/format";
import {
  LeadStatusSelectOptions,
  leadStatusSelectClassName,
} from "@/components/leads/lead-status-select-options";
import { AiLeadIntelligencePanel } from "@/components/sections/dashboard/ai-lead-intelligence-panel";
import { DashboardAiMessagePanel } from "@/components/sections/dashboard/ai-message-panel";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import type { Lead, LeadStatus } from "@/lib/lead-types";

type LeadDetailPanelProps = {
  lead: Lead;
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

export function LeadDetailPanel({ lead }: LeadDetailPanelProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
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
      setSuccessMessage("Lead updated successfully.");
      router.refresh();
    });
  }

  function handleDelete() {
    if (!window.confirm("Delete this lead? This cannot be undone.")) {
      return;
    }

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
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Leads
        </Link>

        <div className="flex flex-wrap gap-2">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => {
                setForm(toFormState(lead));
                setIsEditing(true);
                setSuccessMessage(null);
                setError(null);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
          ) : null}

          <button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:border-red-300 disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <Card className="p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Lead Detail
        </p>

        {successMessage ? (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            {successMessage}
          </p>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        {isEditing ? (
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              handleSave();
            }}
          >
            <label className="block text-sm text-slate-700">
              Name
              <input
                required
                value={form.name}
                disabled={isPending}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring disabled:opacity-60"
              />
            </label>

            <label className="block text-sm text-slate-700">
              Company
              <input
                required
                value={form.company}
                disabled={isPending}
                onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring disabled:opacity-60"
              />
            </label>

            <label className="block text-sm text-slate-700">
              Email
              <input
                type="email"
                required
                value={form.email}
                disabled={isPending}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring disabled:opacity-60"
              />
            </label>

            <label className="block text-sm text-slate-700">
              Status
              <select
                value={form.status}
                disabled={isPending}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, status: event.target.value as LeadStatus }))
                }
                className={`mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring disabled:opacity-60 ${leadStatusSelectClassName(form.status)}`}
              >
                <LeadStatusSelectOptions idPrefix={`edit-${lead.id}`} />
              </select>
            </label>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={isPending}
                className={buttonClassName(
                  "primary",
                  "rounded-xl px-4 py-2.5 text-sm disabled:opacity-60"
                )}
              >
                {isPending ? "Saving…" : "Save changes"}
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleCancelEdit}
                className="rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <dl className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Name</dt>
              <dd className="mt-1 text-lg font-semibold text-black">{lead.name}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Company</dt>
              <dd className="mt-1 text-base text-slate-800">{lead.company}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Email</dt>
              <dd className="mt-1 text-base text-slate-800">{lead.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Status</dt>
              <dd className="mt-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${leadStatusSelectClassName(lead.status)}`}
                >
                  {lead.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Created</dt>
              <dd className="mt-1 text-sm text-slate-700">{formatLeadTimestamp(lead.created_at)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500">Last updated</dt>
              <dd className="mt-1 text-sm text-slate-700">{formatLeadTimestamp(lead.updated_at)}</dd>
            </div>
          </dl>
        )}
      </Card>

      <AiLeadIntelligencePanel key={`intel-${lead.id}`} lead={lead} />

      <DashboardAiMessagePanel key={`ai-${lead.id}`} selectedLead={lead} />
    </div>
  );
}
