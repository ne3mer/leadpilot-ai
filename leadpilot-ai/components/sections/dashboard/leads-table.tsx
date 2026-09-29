"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, UserPlus, Users, WandSparkles } from "lucide-react";
import {
  createLeadAction,
  deleteLeadAction,
  migrateLocalLeadsAction,
  updateLeadStatusAction,
} from "@/lib/leads/actions";
import { clearLegacyLocalLeads, readLegacyLocalLeads } from "@/lib/leads/local-storage";
import { Card } from "@/components/ui/card";
import { leadStatuses, type Lead, type LeadStatus } from "@/lib/lead-types";

type DashboardLeadsTableProps = {
  initialLeads: Lead[];
  loadError?: string | null;
  onUseLead?: (lead: Lead) => void;
};

const statusClasses: Record<LeadStatus, string> = {
  New: "bg-zinc-100 text-zinc-700",
  Contacted: "bg-lime-100 text-lime-800",
  Qualified: "bg-emerald-100 text-emerald-800",
  "Proposal Sent": "bg-slate-100 text-slate-700",
  Negotiation: "bg-amber-100 text-amber-800",
};

export function DashboardLeadsTable({
  initialLeads,
  loadError,
  onUseLead,
}: DashboardLeadsTableProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<LeadStatus>("New");
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const migrationAttemptedRef = useRef(false);

  const leads = initialLeads;

  useEffect(() => {
    if (migrationAttemptedRef.current || initialLeads.length > 0) {
      return;
    }

    const legacyLeads = readLegacyLocalLeads();
    if (!legacyLeads) {
      return;
    }

    migrationAttemptedRef.current = true;

    startTransition(async () => {
      const result = await migrateLocalLeadsAction(legacyLeads);
      if (result.success && result.data.migrated > 0) {
        clearLegacyLocalLeads();
        setActionMessage(`Imported ${result.data.migrated} lead(s) from this browser.`);
        router.refresh();
        return;
      }

      if (!result.success) {
        setActionError(result.error);
      }
    });
  }, [initialLeads.length, router]);

  const hasDuplicateEmail = useMemo(
    () => leads.some((lead) => lead.email.toLowerCase() === email.trim().toLowerCase()),
    [email, leads]
  );

  const isFormValid =
    name.trim().length > 1 &&
    company.trim().length > 1 &&
    email.trim().includes("@") &&
    !hasDuplicateEmail;

  function handleAddLead() {
    if (!isFormValid || isPending) {
      return;
    }

    setActionError(null);
    setActionMessage(null);

    startTransition(async () => {
      const result = await createLeadAction({
        name: name.trim(),
        company: company.trim(),
        email: email.trim(),
        status,
      });

      if (!result.success) {
        setActionError(result.error);
        return;
      }

      setName("");
      setCompany("");
      setEmail("");
      setStatus("New");
      setActionMessage("Lead added.");
      router.refresh();
    });
  }

  function handleDeleteLead(id: string) {
    if (isPending) {
      return;
    }

    setActionError(null);
    setActionMessage(null);

    startTransition(async () => {
      const result = await deleteLeadAction(id);
      if (!result.success) {
        setActionError(result.error);
        return;
      }

      setActionMessage("Lead deleted.");
      router.refresh();
    });
  }

  function handleStatusChange(id: string, nextStatus: LeadStatus) {
    if (isPending) {
      return;
    }

    setActionError(null);
    setActionMessage(null);

    startTransition(async () => {
      const result = await updateLeadStatusAction(id, nextStatus);
      if (!result.success) {
        setActionError(result.error);
        router.refresh();
        return;
      }

      router.refresh();
    });
  }

  function focusAddLeadForm() {
    nameInputRef.current?.focus();
    nameInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const isLoading = isPending && leads.length === 0 && !loadError;

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-medium text-black">Lead Pipeline</h2>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {leads.length} leads
        </span>
      </div>

      {loadError ? (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {loadError}
        </p>
      ) : null}

      {actionError ? (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {actionError}
        </p>
      ) : null}

      {actionMessage ? (
        <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {actionMessage}
        </p>
      ) : null}

      <div
        id="add-lead-form"
        className="mt-4 grid gap-3 rounded-2xl border border-black/10 bg-slate-50 p-4 sm:grid-cols-2 md:grid-cols-5"
      >
        <label className="text-sm text-slate-700 sm:col-span-1 md:col-span-1">
          Name
          <input
            ref={nameInputRef}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Lead name"
            disabled={isPending}
            className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring disabled:opacity-60"
          />
        </label>

        <label className="text-sm text-slate-700 sm:col-span-1 md:col-span-1">
          Company
          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            placeholder="Company"
            disabled={isPending}
            className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring disabled:opacity-60"
          />
        </label>

        <label className="text-sm text-slate-700 sm:col-span-1 md:col-span-1">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="lead@company.com"
            disabled={isPending}
            className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring disabled:opacity-60"
          />
        </label>

        <label className="text-sm text-slate-700 sm:col-span-1 md:col-span-1">
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as LeadStatus)}
            disabled={isPending}
            className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring disabled:opacity-60"
          >
            {leadStatuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end sm:col-span-2 md:col-span-1">
          <button
            type="button"
            onClick={handleAddLead}
            disabled={!isFormValid || isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(22,163,74,0.65)] transition duration-300 enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_14px_28px_-14px_rgba(22,163,74,0.7)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UserPlus className="h-4 w-4" />
            {isPending ? "Saving…" : "Add Lead"}
          </button>
        </div>
      </div>

      {hasDuplicateEmail ? (
        <p className="mt-2 text-xs text-amber-700">A lead with this email already exists.</p>
      ) : null}

      <div className="mt-5 min-w-0 overflow-x-auto">
        {isLoading ? (
          <div
            className="rounded-2xl border border-black/10 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600"
            aria-live="polite"
          >
            Loading your leads…
          </div>
        ) : leads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/15 bg-slate-50 px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-black">No leads yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              Add your first lead using the form above to start tracking pipeline status and
              generating follow-up messages.
            </p>
            <button
              type="button"
              onClick={focusAddLeadForm}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <UserPlus className="h-4 w-4" />
              Add your first lead
            </button>
          </div>
        ) : (
          <table className="min-w-[640px] w-full text-left text-sm text-slate-700">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Company</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t border-black/10">
                  <td className="px-3 py-3 font-medium text-black">{lead.name}</td>
                  <td className="px-3 py-3 text-slate-600">{lead.company}</td>
                  <td className="px-3 py-3 text-slate-600">{lead.email}</td>
                  <td className="px-3 py-3">
                    <select
                      value={lead.status}
                      disabled={isPending}
                      onChange={(event) =>
                        handleStatusChange(lead.id, event.target.value as LeadStatus)
                      }
                      className={`rounded-full border border-transparent px-2.5 py-1 text-xs font-medium outline-none ring-emerald-300/60 transition focus:ring disabled:opacity-60 ${statusClasses[lead.status]}`}
                    >
                      {leadStatuses.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onUseLead?.(lead)}
                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                      >
                        <WandSparkles className="h-3.5 w-3.5" />
                        Use in AI
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleDeleteLead(lead.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-black/15 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-60"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
}
