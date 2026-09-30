"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { SignalEmptyStructure } from "@/components/visual/signal/signal-empty-structure";
import {
  createLeadAction,
  deleteLeadAction,
  migrateLocalLeadsAction,
  updateLeadStatusAction,
} from "@/lib/leads/actions";
import { clearLegacyLocalLeads, readLegacyLocalLeads } from "@/lib/leads/local-storage";
import { LeadPipelineDesktopRow } from "@/components/leads/lead-pipeline-desktop-row";
import { LeadPipelineMobileCard } from "@/components/leads/lead-pipeline-mobile-card";
import { LeadsWorkspaceHeader } from "@/components/leads/leads-workspace-header";
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
import { LeadStatusSelectOptions } from "@/components/leads/lead-status-select-options";
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

  const showToolbar = initialLeads.length > 0;

  return (
    <section id="pipeline" className="min-w-0 scroll-mt-24" aria-label="Leads workspace">
      <LeadsWorkspaceHeader resultCountLabel={resultCountLabel} />

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

      {showToolbar ? (
        <div
          className="mt-[var(--lp-space-6)] flex flex-col gap-[var(--lp-space-4)] border-y border-border py-[var(--lp-space-5)] lg:flex-row lg:flex-wrap lg:items-end"
          role="search"
        >
          <label className={`${fieldLabelClassName()} min-w-0 flex-1 lg:min-w-[12rem]`}>
            <span className="sr-only">Search leads</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search name, company, or email…"
              className={inputClassName()}
              aria-label="Search leads"
            />
          </label>

          <label className={`${fieldLabelClassName()} w-full lg:w-40`}>
            Status
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as LeadStatusFilter)}
              className={selectClassName("mt-1")}
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              {leadStatuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className={`${fieldLabelClassName()} w-full lg:w-40`}>
            Priority
            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value as LeadPriorityFilter)
              }
              className={selectClassName("mt-1")}
              aria-label="Filter by priority"
            >
              {leadPriorityFilterOptions.map((option) => (
                <option key={option} value={option}>
                  {leadPriorityFilterLabels[option]}
                </option>
              ))}
            </select>
          </label>

          <label className={`${fieldLabelClassName()} w-full lg:w-48`}>
            Sort
            <select
              value={sortPreset}
              onChange={(event) => setSortPreset(event.target.value as LeadSortPreset)}
              className={selectClassName("mt-1")}
              aria-label="Sort leads"
            >
              {(Object.keys(sortPresetLabels) as LeadSortPreset[]).map((preset) => (
                <option key={preset} value={preset}>
                  {sortPresetLabels[preset]}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-wrap items-center gap-2 lg:pb-0.5">
            {filtersActive ? (
              <button type="button" onClick={clearListFilters} className={buttonClassName("ghost")}>
                Clear filters
              </button>
            ) : null}
            <a
              href="#add-lead-form"
              className={buttonClassName("secondary", "inline-flex gap-1.5")}
              onClick={(event) => {
                event.preventDefault();
                focusAddLeadForm();
              }}
            >
              <UserPlus className="h-4 w-4" aria-hidden />
              Add lead
            </a>
          </div>
        </div>
      ) : null}

      <details
        id="add-lead-form"
        className="mt-[var(--lp-space-6)] min-w-0 scroll-mt-28"
        open={initialLeads.length === 0}
      >
        <summary className="lp-focus-ring cursor-pointer list-none lp-text-body-small font-medium text-secondary marker:content-none [&::-webkit-details-marker]:hidden">
          {initialLeads.length === 0 ? "Add your first lead" : "Add lead details"}
        </summary>
        <div className="mt-[var(--lp-space-4)] grid gap-[var(--lp-space-form-gap)] border-t border-border pt-[var(--lp-space-4)] sm:grid-cols-2 lg:grid-cols-5">
          <label className={fieldLabelClassName()}>
            Name
            <input
              ref={nameInputRef}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Lead name"
              disabled={isPending}
              className={inputClassName("mt-1")}
            />
          </label>

          <label className={fieldLabelClassName()}>
            Company
            <input
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="Company"
              disabled={isPending}
              className={inputClassName("mt-1")}
            />
          </label>

          <label className={fieldLabelClassName()}>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="lead@company.com"
              disabled={isPending}
              className={inputClassName("mt-1")}
            />
          </label>

          <label className={fieldLabelClassName()}>
            Status
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as LeadStatus)}
              disabled={isPending}
              className={selectClassName("mt-1")}
            >
              <LeadStatusSelectOptions idPrefix="add-lead" />
            </select>
          </label>

          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <button
              type="button"
              onClick={handleAddLead}
              disabled={!isFormValid || isPending}
              className={buttonClassName("primary", "inline-flex w-full gap-2")}
            >
              {isPending ? "Saving…" : "Save lead"}
            </button>
          </div>
        </div>
        {hasDuplicateEmail ? (
          <p className="mt-2 lp-text-caption text-warning">A lead with this email already exists.</p>
        ) : null}
      </details>

      <div className="mt-[var(--lp-space-6)] min-w-0">
        {isLoading ? (
          <div
            className="py-[var(--lp-space-10)] text-center lp-text-body-small text-muted"
            aria-live="polite"
          >
            Loading your leads…
          </div>
        ) : initialLeads.length === 0 ? (
          <div className="py-[var(--lp-space-12)] text-center">
            <SignalEmptyStructure className="mx-auto" />
            <h3 className={typographyClass("subsection", "mt-4")}>No leads yet</h3>
            <p className={typographyClass("bodySmall", "mx-auto mt-2 max-w-md")}>
              Add a lead below to start tracking pipeline status and follow-ups.
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
            <ul className="min-w-0 md:hidden" aria-label="Leads">
              {visibleLeads.map((lead) => (
                <li key={lead.id}>
                  <LeadPipelineMobileCard
                    lead={lead}
                    priority={getLeadListPriorityResult(lead, leadActivitiesByLeadId)}
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
              ))}
            </ul>

            <div className="hidden min-w-0 md:block">
              <table className="w-full min-w-0 text-left">
                <caption className="sr-only">Lead pipeline list</caption>
                <thead className="border-b border-border lp-text-caption text-muted">
                  <tr>
                    <th scope="col" className="w-[38%] py-2 pl-3 pr-2 text-left font-normal">
                      Lead
                    </th>
                    <th scope="col" className="w-[14%] py-2 px-2 text-left font-normal">
                      Status
                    </th>
                    <th scope="col" className="w-[12%] py-2 px-2 text-left font-normal">
                      Priority
                    </th>
                    <th scope="col" className="w-[22%] py-2 px-2 text-left font-normal">
                      Context
                    </th>
                    <th scope="col" className="w-[14%] py-2 pl-2 pr-3 text-right font-normal">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleLeads.map((lead) => (
                    <LeadPipelineDesktopRow
                      key={lead.id}
                      lead={lead}
                      priority={getLeadListPriorityResult(lead, leadActivitiesByLeadId)}
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
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
