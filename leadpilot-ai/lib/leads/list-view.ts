import { leadStatuses, type Lead, type LeadStatus } from "@/lib/lead-types";

export type LeadStatusFilter = LeadStatus | "all";

export type LeadSortPreset =
  | "created_desc"
  | "created_asc"
  | "name_asc"
  | "name_desc"
  | "company_asc"
  | "company_desc"
  | "status_asc"
  | "status_desc";

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

function compareLeads(a: Lead, b: Lead, preset: LeadSortPreset): number {
  switch (preset) {
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
    preset === "status_desc"
  );
}

export function sortLeads(leads: Lead[], preset: LeadSortPreset): Lead[] {
  const sorted = [...leads].sort((a, b) => compareLeads(a, b, preset));
  if (isDescendingPreset(preset)) {
    sorted.reverse();
  }
  return sorted;
}

export function applyLeadListView(
  leads: Lead[],
  searchQuery: string,
  statusFilter: LeadStatusFilter,
  sortPreset: LeadSortPreset
): Lead[] {
  const filtered = filterLeadsBySearchAndStatus(leads, searchQuery, statusFilter);
  return sortLeads(filtered, sortPreset);
}

export function hasActiveLeadListFilters(
  searchQuery: string,
  statusFilter: LeadStatusFilter
): boolean {
  return searchQuery.trim().length > 0 || statusFilter !== "all";
}

export function formatLeadResultCount(visibleCount: number, totalCount: number, filtered: boolean) {
  if (!filtered) {
    return `${totalCount} lead${totalCount === 1 ? "" : "s"}`;
  }
  return `${visibleCount} of ${totalCount} lead${totalCount === 1 ? "" : "s"}`;
}
