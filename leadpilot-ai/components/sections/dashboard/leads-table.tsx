"use client";

import Link from "next/link";
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
import { LeadPipelineMobileCard } from "@/components/leads/lead-pipeline-mobile-card";
import { LeadPriorityBadge } from "@/components/leads/lead-priority-badge";
import {
  applyLeadListView,
  defaultLeadSortPreset,
  formatLeadResultCount,
  getLeadListPriorityResult,
  hasActiveLeadListFilters,
  type LeadPriorityFilter,
  type LeadSortPreset,
  type LeadStatusFilter,
} from "@/lib/leads/list-view";
import {
  leadPriorityFilterLabels,
  leadPriorityFilterOptions,
} from "@/lib/leads/priority-types";
import type { LeadPriorityActivityInput } from "@/lib/leads/priority-score";
import {
  LeadStatusSelectOptions,
  leadStatusSelectClassName,
} from "@/components/leads/lead-status-select-options";
import { Card } from "@/components/ui/card";
import { leadStatuses, type Lead, type LeadStatus } from "@/lib/lead-types";

type DashboardLeadsTableProps = {
  initialLeads: Lead[];
  leadActivitiesByLeadId?: Record<string, LeadPriorityActivityInput[]>;
  loadError?: string | null;
  onUseLead?: (lead: Lead) => void;
};

const sortPresetLabels: Record<LeadSortPreset, string> = {
  created_desc: "Created date (newest)",
  created_asc: "Created date (oldest)",
  name_asc: "Name (A–Z)",
  name_desc: "Name (Z–A)",
  company_asc: "Company (A–Z)",
  company_desc: "Company (Z–A)",
  status_asc: "Status (lifecycle)",
  status_desc: "Status (reverse lifecycle)",
  priority_desc: "Priority (highest first)",
  priority_asc: "Priority (lowest first)",
};

export function DashboardLeadsTable({
  initialLeads,
  leadActivitiesByLeadId = {},
  loadError,
  onUseLead,
}: DashboardLeadsTableProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<LeadStatus>("New");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatusFilter>("all");
  const [sortPreset, setSortPreset] = useState<LeadSortPreset>(defaultLeadSortPreset);
  const [priorityFilter, setPriorityFilter] = useState<LeadPriorityFilter>("all");
  const [confirmDeleteLeadId, setConfirmDeleteLeadId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const migrationAttemptedRef = useRef(false);

  const filtersActive = hasActiveLeadListFilters(searchQuery, statusFilter, priorityFilter);

  const visibleLeads = applyLeadListView(initialLeads, searchQuery, statusFilter, sortPreset, {
    priorityFilter,
    activitiesByLeadId: leadActivitiesByLeadId,
  });

  const resultCountLabel = formatLeadResultCount(
    visibleLeads.length,
    initialLeads.length,
    filtersActive
  );

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
    () =>
      initialLeads.some((lead) => lead.email.toLowerCase() === email.trim().toLowerCase()),
    [email, initialLeads]
  );

  const isFormValid =
    name.trim().length > 1 &&
    company.trim().length > 1 &&
    email.trim().includes("@") &&
    !hasDuplicateEmail;

  function clearListFilters() {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortPreset(defaultLeadSortPreset);
  }

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

      setConfirmDeleteLeadId(null);
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

  const isLoading = isPending && initialLeads.length === 0 && !loadError;

  return (
    <section id="pipeline" className="min-w-0 scroll-mt-24" aria-label="Lead Pipeline">
    <Card className="min-w-0 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-black">Lead Pipeline</h2>
          <p className="mt-1 text-xs text-slate-600">
            Lifecycle: New → Contacted → Qualified → Proposal Sent → Negotiation → Won (or Lost)
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {resultCountLabel}
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
            <LeadStatusSelectOptions idPrefix="add-lead" />
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

      {initialLeads.length > 0 ? (
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-end">
          <label className="block flex-1 text-sm text-slate-700">
            Search leads
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name, company, or email…"
              className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring"
            />
          </label>

          <label className="block w-full text-sm text-slate-700 lg:w-48">
            Status
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as LeadStatusFilter)}
              className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring"
            >
              <option value="all">All statuses</option>
              {leadStatuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block w-full text-sm text-slate-700 lg:w-48">
            Priority
            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value as LeadPriorityFilter)
              }
              className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring"
            >
              {leadPriorityFilterOptions.map((option) => (
                <option key={option} value={option}>
                  {leadPriorityFilterLabels[option]}
                </option>
              ))}
            </select>
          </label>

          <label className="block w-full text-sm text-slate-700 lg:w-56">
            Sort
            <select
              value={sortPreset}
              onChange={(event) => setSortPreset(event.target.value as LeadSortPreset)}
              className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-black outline-none ring-emerald-400/40 transition focus:ring"
            >
              {(Object.keys(sortPresetLabels) as LeadSortPreset[]).map((preset) => (
                <option key={preset} value={preset}>
                  {sortPresetLabels[preset]}
                </option>
              ))}
            </select>
          </label>

          {filtersActive ? (
            <button
              type="button"
              onClick={clearListFilters}
              className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700 lg:mb-0.5"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 min-w-0 md:overflow-x-auto">
        {isLoading ? (
          <div
            className="rounded-2xl border border-black/10 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600"
            aria-live="polite"
          >
            Loading your leads…
          </div>
        ) : initialLeads.length === 0 ? (
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
        ) : visibleLeads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/15 bg-slate-50 px-6 py-12 text-center">
            <h3 className="text-base font-semibold text-black">No leads match your current filters.</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              Try adjusting your search, status, or priority filter to see more leads.
            </p>
            <button
              type="button"
              onClick={clearListFilters}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
          <ul className="md:hidden space-y-3" aria-label="Lead list">
            {visibleLeads.map((lead) => {
              const listPriority = getLeadListPriorityResult(lead, leadActivitiesByLeadId);
              return (
                <li key={lead.id}>
                  <LeadPipelineMobileCard
                    lead={lead}
                    priorityScore={listPriority.score}
                    priorityLevel={listPriority.priority}
                    isPending={isPending}
                    isConfirmingDelete={confirmDeleteLeadId === lead.id}
                    onStatusChange={handleStatusChange}
                    onUseInAi={(item) => {
                      setConfirmDeleteLeadId(null);
                      onUseLead?.(item);
                    }}
                    onRequestDelete={(leadId) => {
                      setConfirmDeleteLeadId(leadId);
                      setActionError(null);
                    }}
                    onCancelDelete={() => setConfirmDeleteLeadId(null)}
                    onConfirmDelete={handleDeleteLead}
                  />
                </li>
              );
            })}
          </ul>

          <div className="hidden md:block overflow-x-auto">
          <table className="min-w-[720px] w-full text-left text-sm text-slate-700">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Company</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Priority</th>
                <th className="px-3 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleLeads.map((lead) => {
                const listPriority = getLeadListPriorityResult(lead, leadActivitiesByLeadId);
                const rowStatusId = `row-status-${lead.id}`;
                return (
                <tr key={lead.id} className="border-t border-black/10">
                  <td className="px-3 py-3 font-medium text-black">
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="text-emerald-800 underline-offset-2 transition hover:text-emerald-600 hover:underline"
                    >
                      {lead.name}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-slate-600">{lead.company}</td>
                  <td className="px-3 py-3 text-slate-600">{lead.email}</td>
                  <td className="px-3 py-3">
                    <label htmlFor={rowStatusId} className="sr-only">
                      Pipeline status for {lead.name}
                    </label>
                    <select
                      id={rowStatusId}
                      value={lead.status}
                      disabled={isPending}
                      onChange={(event) =>
                        handleStatusChange(lead.id, event.target.value as LeadStatus)
                      }
                      aria-label={`Pipeline status for ${lead.name}, currently ${lead.status}`}
                      className={`max-w-full rounded-xl border border-black/15 bg-white px-2.5 py-1.5 text-xs font-medium outline-none ring-emerald-300/60 transition focus:ring disabled:opacity-60 ${leadStatusSelectClassName(lead.status)}`}
                    >
                      <LeadStatusSelectOptions idPrefix={`row-${lead.id}`} />
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <LeadPriorityBadge
                      score={listPriority.score}
                      priority={listPriority.priority}
                    />
                  </td>
                  <td className="px-3 py-3 text-right">
                    {confirmDeleteLeadId === lead.id ? (
                      <div
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-left"
                        role="alertdialog"
                        aria-labelledby={`delete-lead-${lead.id}`}
                      >
                        <p
                          id={`delete-lead-${lead.id}`}
                          className="text-xs text-red-900"
                        >
                          Delete {lead.name}? This cannot be undone.
                        </p>
                        <div className="mt-2 flex flex-wrap justify-end gap-2">
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleDeleteLead(lead.id)}
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                          >
                            {isPending ? "Deleting…" : "Confirm delete"}
                          </button>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => setConfirmDeleteLeadId(null)}
                            className="rounded-lg border border-black/15 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmDeleteLeadId(null);
                            onUseLead?.(lead);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                        >
                          <WandSparkles className="h-3.5 w-3.5" />
                          Use in AI
                        </button>
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => {
                            setConfirmDeleteLeadId(lead.id);
                            setActionError(null);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-black/15 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-60"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
          </div>
          </>
        )}
      </div>
    </Card>
    </section>
  );
}
