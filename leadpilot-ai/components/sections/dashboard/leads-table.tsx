"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, UserPlus, Users } from "lucide-react";
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
import { buttonClassName } from "@/components/ui/button";
import {
  fieldLabelClassName,
  inputClassName,
  selectClassName,
} from "@/components/ui/input";
import { typographyClass } from "@/lib/design-system/typography";
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
    <section id="pipeline" className="min-w-0 scroll-mt-24" aria-label="Lead pipeline">
      <div className="mb-[var(--lp-space-6)] flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0 max-w-prose">
          <h2 className={typographyClass("sectionTitle")}>Pipeline</h2>
          <p className={typographyClass("bodySmall", "mt-2")}>
            New → Contacted → Qualified → Proposal Sent → Negotiation → Won or Lost
          </p>
        </div>
        <p className="lp-text-metadata tabular-nums text-muted">{resultCountLabel}</p>
      </div>

      {loadError ? (
        <p className="mt-3 rounded-sm border border-danger/20 bg-danger-muted px-3 py-2 lp-text-body-small text-danger">
          {loadError}
        </p>
      ) : null}

      {actionError ? (
        <p className="mt-3 rounded-sm border border-danger/20 bg-danger-muted px-3 py-2 lp-text-body-small text-danger">
          {actionError}
        </p>
      ) : null}

      {actionMessage ? (
        <p className="mt-3 rounded-sm border border-border bg-surface-subtle px-3 py-2 lp-text-body-small text-secondary">
          {actionMessage}
        </p>
      ) : null}

      <div
        id="add-lead-form"
        className="mt-[var(--lp-space-6)] grid gap-[var(--lp-space-form-gap)] rounded-md border border-border bg-surface-subtle p-[var(--lp-space-5)] sm:grid-cols-2 md:grid-cols-5"
      >
        <label className={`${fieldLabelClassName()} sm:col-span-1 md:col-span-1`}>
          Name
          <input
            ref={nameInputRef}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Lead name"
            disabled={isPending}
            className={inputClassName("mt-2")}
          />
        </label>

        <label className={`${fieldLabelClassName()} sm:col-span-1 md:col-span-1`}>
          Company
          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            placeholder="Company"
            disabled={isPending}
            className={inputClassName("mt-2")}
          />
        </label>

        <label className={`${fieldLabelClassName()} sm:col-span-1 md:col-span-1`}>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="lead@company.com"
            disabled={isPending}
            className={inputClassName("mt-2")}
          />
        </label>

        <label className={`${fieldLabelClassName()} sm:col-span-1 md:col-span-1`}>
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as LeadStatus)}
            disabled={isPending}
            className={selectClassName("mt-2")}
          >
            <LeadStatusSelectOptions idPrefix="add-lead" />
          </select>
        </label>

        <div className="flex items-end sm:col-span-2 md:col-span-1">
          <button
            type="button"
            onClick={handleAddLead}
            disabled={!isFormValid || isPending}
            className={buttonClassName("primary", "inline-flex w-full gap-2")}
          >
            <UserPlus className="h-4 w-4" aria-hidden />
            {isPending ? "Saving…" : "Add lead"}
          </button>
        </div>
      </div>

      {hasDuplicateEmail ? (
        <p className="mt-2 lp-text-caption text-warning">A lead with this email already exists.</p>
      ) : null}

      {initialLeads.length > 0 ? (
        <div className="mt-[var(--lp-space-6)] flex flex-col gap-[var(--lp-space-form-gap)] border-t border-border pt-[var(--lp-space-6)] lg:flex-row lg:items-end">
          <label className={`${fieldLabelClassName()} block flex-1`}>
            Search leads
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name, company, or email…"
              className={inputClassName("mt-2")}
            />
          </label>

          <label className={`${fieldLabelClassName()} block w-full lg:w-48`}>
            Status
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as LeadStatusFilter)}
              className={selectClassName("mt-2")}
            >
              <option value="all">All statuses</option>
              {leadStatuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className={`${fieldLabelClassName()} block w-full lg:w-48`}>
            Priority
            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value as LeadPriorityFilter)
              }
              className={selectClassName("mt-2")}
            >
              {leadPriorityFilterOptions.map((option) => (
                <option key={option} value={option}>
                  {leadPriorityFilterLabels[option]}
                </option>
              ))}
            </select>
          </label>

          <label className={`${fieldLabelClassName()} block w-full lg:w-56`}>
            Sort
            <select
              value={sortPreset}
              onChange={(event) => setSortPreset(event.target.value as LeadSortPreset)}
              className={selectClassName("mt-2")}
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
              className={buttonClassName("ghost", "lg:mb-0.5")}
            >
              Clear filters
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 min-w-0 md:overflow-x-auto">
        {isLoading ? (
          <div
            className="py-[var(--lp-space-10)] text-center lp-text-body-small text-muted"
            aria-live="polite"
          >
            Loading your leads…
          </div>
        ) : initialLeads.length === 0 ? (
          <div className="py-[var(--lp-space-12)] text-center">
            <Users className="mx-auto h-6 w-6 text-muted" aria-hidden />
            <h3 className={typographyClass("subsection", "mt-4")}>No leads yet</h3>
            <p className={typographyClass("bodySmall", "mx-auto mt-2 max-w-md")}>
              Add your first lead using the form above to start tracking pipeline status and
              follow-ups.
            </p>
            <button
              type="button"
              onClick={focusAddLeadForm}
              className={buttonClassName("primary", "mt-6 inline-flex gap-2")}
            >
              <UserPlus className="h-4 w-4" aria-hidden />
              Add your first lead
            </button>
          </div>
        ) : visibleLeads.length === 0 ? (
          <div className="py-[var(--lp-space-12)] text-center">
            <h3 className={typographyClass("subsection")}>No leads match your filters</h3>
            <p className={typographyClass("bodySmall", "mx-auto mt-2 max-w-md")}>
              Try adjusting search, status, or priority to see more leads.
            </p>
            <button
              type="button"
              onClick={clearListFilters}
              className={buttonClassName("secondary", "mt-6")}
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
          <table className="min-w-[720px] w-full text-left lp-text-body-small text-secondary">
            <thead className="border-b border-border lp-text-caption text-muted">
              <tr>
                <th className="px-3 py-[var(--lp-space-table-row-y)] font-medium">Name</th>
                <th className="px-3 py-[var(--lp-space-table-row-y)] font-medium">Company</th>
                <th className="px-3 py-[var(--lp-space-table-row-y)] font-medium">Email</th>
                <th className="px-3 py-[var(--lp-space-table-row-y)] font-medium">Status</th>
                <th className="px-3 py-[var(--lp-space-table-row-y)] font-medium">Priority</th>
                <th className="px-3 py-[var(--lp-space-table-row-y)] text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleLeads.map((lead) => {
                const listPriority = getLeadListPriorityResult(lead, leadActivitiesByLeadId);
                const rowStatusId = `row-status-${lead.id}`;
                return (
                <tr key={lead.id} className="border-t border-border">
                  <td className="px-3 py-[var(--lp-space-table-row-y)] font-medium text-primary">
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="lp-focus-ring rounded-sm text-primary underline-offset-2 hover:text-accent hover:underline"
                    >
                      {lead.name}
                    </Link>
                  </td>
                  <td className="px-3 py-[var(--lp-space-table-row-y)]">{lead.company}</td>
                  <td className="px-3 py-[var(--lp-space-table-row-y)] break-all">{lead.email}</td>
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
                      className={`lp-focus-ring max-w-full rounded-sm border border-border bg-surface px-2.5 py-1.5 lp-text-caption font-medium disabled:opacity-60 ${leadStatusSelectClassName(lead.status)}`}
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
                        className="rounded-sm border border-danger/20 bg-danger-muted px-3 py-2 text-left"
                        role="alertdialog"
                        aria-labelledby={`delete-lead-${lead.id}`}
                      >
                        <p
                          id={`delete-lead-${lead.id}`}
                          className="lp-text-caption text-danger"
                        >
                          Delete {lead.name}? This cannot be undone.
                        </p>
                        <div className="mt-2 flex flex-wrap justify-end gap-2">
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleDeleteLead(lead.id)}
                            className={buttonClassName("danger", "px-3 py-1.5 text-xs")}
                          >
                            {isPending ? "Deleting…" : "Confirm delete"}
                          </button>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => setConfirmDeleteLeadId(null)}
                            className={buttonClassName("secondary", "px-3 py-1.5 text-xs")}
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
                          className={buttonClassName("secondary", "px-2.5 py-1.5 text-xs")}
                        >
                          Use in AI
                        </button>
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => {
                            setConfirmDeleteLeadId(lead.id);
                            setActionError(null);
                          }}
                          className={buttonClassName("ghost", "px-2.5 py-1.5 text-xs text-danger hover:bg-danger-muted disabled:opacity-60")}
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden />
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
    </section>
  );
}
