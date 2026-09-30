import { leadStatuses, type Lead, type LeadStatus } from "@/lib/lead-types";
import {
  computeLeadPriorityScore,
  type LeadPriorityActivityInput,
} from "@/lib/leads/priority-score";
import type { LeadPriorityFilter } from "@/lib/leads/priority-types";

export type LeadStatusFilter = LeadStatus | "all";

export type { LeadPriorityFilter };

export type LeadSortPreset =
  | "created_desc"
  | "created_asc"
  | "name_asc"
  | "name_desc"
  | "company_asc"
  | "company_desc"
  | "status_asc"
  | "status_desc"
  | "priority_desc"
  | "priority_asc";

export const defaultLeadSortPreset: LeadSortPreset = "created_desc";

export function getLeadStatusSortIndex(status: LeadStatus): number {
  return leadStatuses.indexOf(status);
}

export function leadMatchesSearch(lead: Lead, searchQuery: string): boolean {
  const query = searchQuery.trim().toLowerCase();
  if (!query) {
    return true;
  }

  return (
    lead.name.toLowerCase().includes(query) ||
    lead.company.toLowerCase().includes(query) ||
    lead.email.toLowerCase().includes(query)
  );
}

export function filterLeadsBySearchAndStatus(
  leads: Lead[],
  searchQuery: string,
  statusFilter: LeadStatusFilter
): Lead[] {
  return leads.filter((lead) => {
    if (statusFilter !== "all" && lead.status !== statusFilter) {
      return false;
    }
    return leadMatchesSearch(lead, searchQuery);
  });
}

function getLeadPriorityScore(
  lead: Lead,
  activitiesByLeadId: Record<string, LeadPriorityActivityInput[]>
): number {
  const activities = activitiesByLeadId[lead.id] ?? [];
  return computeLeadPriorityScore(
    {
      status: lead.status,
      created_at: lead.created_at,
      updated_at: lead.updated_at,
    },
    activities
  ).score;
}

function getLeadPriorityLevel(
  lead: Lead,
  activitiesByLeadId: Record<string, LeadPriorityActivityInput[]>
) {
  const activities = activitiesByLeadId[lead.id] ?? [];
  return computeLeadPriorityScore(
    {
      status: lead.status,
      created_at: lead.created_at,
      updated_at: lead.updated_at,
    },
    activities
  ).priority;
}

function compareLeads(
  a: Lead,
  b: Lead,
  preset: LeadSortPreset,
  activitiesByLeadId: Record<string, LeadPriorityActivityInput[]>
): number {
  switch (preset) {
    case "priority_desc":
    case "priority_asc": {
      const scoreDelta =
        getLeadPriorityScore(b, activitiesByLeadId) -
        getLeadPriorityScore(a, activitiesByLeadId);
      if (scoreDelta !== 0) {
        return scoreDelta;
      }
      const updatedA = Date.parse(a.updated_at);
      const updatedB = Date.parse(b.updated_at);
      if (Number.isFinite(updatedA) && Number.isFinite(updatedB) && updatedB !== updatedA) {
        return updatedB - updatedA;
      }
      return a.id.localeCompare(b.id);
    }
    case "name_asc":
    case "name_desc":
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    case "company_asc":
    case "company_desc":
      return a.company.localeCompare(b.company, undefined, { sensitivity: "base" });
    case "status_asc":
    case "status_desc":
      return getLeadStatusSortIndex(a.status) - getLeadStatusSortIndex(b.status);
    case "created_asc":
    case "created_desc":
    default: {
      const aTime = new Date(a.created_at).getTime();
      const bTime = new Date(b.created_at).getTime();
      if (Number.isNaN(aTime) || Number.isNaN(bTime)) {
        return 0;
      }
      return aTime - bTime;
    }
  }
}

function isDescendingPreset(preset: LeadSortPreset): boolean {
  return (
    preset === "created_desc" ||
    preset === "name_desc" ||
    preset === "company_desc" ||
    preset === "status_desc" ||
    preset === "priority_desc"
  );
}

export function filterLeadsByPriority(
  leads: Lead[],
  priorityFilter: LeadPriorityFilter,
  activitiesByLeadId: Record<string, LeadPriorityActivityInput[]>
): Lead[] {
  if (priorityFilter === "all") {
    return leads;
  }

  return leads.filter(
    (lead) => getLeadPriorityLevel(lead, activitiesByLeadId) === priorityFilter
  );
}

export function sortLeads(
  leads: Lead[],
  preset: LeadSortPreset,
  activitiesByLeadId: Record<string, LeadPriorityActivityInput[]> = {}
): Lead[] {
  if (preset === "priority_desc" || preset === "priority_asc") {
    const sorted = [...leads].sort((a, b) =>
      compareLeads(a, b, preset, activitiesByLeadId)
    );
    return preset === "priority_asc" ? sorted.reverse() : sorted;
  }

  const sorted = [...leads].sort((a, b) => compareLeads(a, b, preset, activitiesByLeadId));
  if (isDescendingPreset(preset)) {
    sorted.reverse();
  }
  return sorted;
}

export function applyLeadListView(
  leads: Lead[],
  searchQuery: string,
  statusFilter: LeadStatusFilter,
  sortPreset: LeadSortPreset,
  options?: {
    priorityFilter?: LeadPriorityFilter;
    activitiesByLeadId?: Record<string, LeadPriorityActivityInput[]>;
  }
): Lead[] {
  const activitiesByLeadId = options?.activitiesByLeadId ?? {};
  const priorityFilter = options?.priorityFilter ?? "all";

  let filtered = filterLeadsBySearchAndStatus(leads, searchQuery, statusFilter);
  filtered = filterLeadsByPriority(filtered, priorityFilter, activitiesByLeadId);
  return sortLeads(filtered, sortPreset, activitiesByLeadId);
}

export function hasActiveLeadListFilters(
  searchQuery: string,
  statusFilter: LeadStatusFilter,
  priorityFilter: LeadPriorityFilter = "all"
): boolean {
  return (
    searchQuery.trim().length > 0 ||
    statusFilter !== "all" ||
    priorityFilter !== "all"
  );
}

export function getLeadListPriorityResult(
  lead: Lead,
  activitiesByLeadId: Record<string, LeadPriorityActivityInput[]>
) {
  const activities = activitiesByLeadId[lead.id] ?? [];
  return computeLeadPriorityScore(
    {
      status: lead.status,
      created_at: lead.created_at,
      updated_at: lead.updated_at,
    },
    activities
  );
}

export function getLeadListPriorityScore(
  lead: Lead,
  activitiesByLeadId: Record<string, LeadPriorityActivityInput[]>
): number {
  return getLeadListPriorityResult(lead, activitiesByLeadId).score;
}

export function getLeadListPriorityLevel(
  lead: Lead,
  activitiesByLeadId: Record<string, LeadPriorityActivityInput[]>
) {
  return getLeadListPriorityResult(lead, activitiesByLeadId).priority;
}

export function formatLeadResultCount(visibleCount: number, totalCount: number, filtered: boolean) {
  if (!filtered) {
    return `${totalCount} lead${totalCount === 1 ? "" : "s"}`;
  }
  return `${visibleCount} of ${totalCount} lead${totalCount === 1 ? "" : "s"}`;
}
