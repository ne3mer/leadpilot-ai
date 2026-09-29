import { leadStatuses, type LeadStatus } from "@/lib/lead-types";

export const LEGACY_LEADS_STORAGE_KEY = "leadpilot.dashboard.leads";

export function readLegacyLocalLeads(): unknown[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(LEGACY_LEADS_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return null;
    }

    return parsed.filter((item) => {
      if (!item || typeof item !== "object") {
        return false;
      }
      const record = item as Record<string, unknown>;
      return (
        typeof record.name === "string" &&
        typeof record.email === "string" &&
        typeof record.status === "string" &&
        (leadStatuses as readonly string[]).includes(record.status as LeadStatus)
      );
    });
  } catch {
    return null;
  }
}

export function clearLegacyLocalLeads() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(LEGACY_LEADS_STORAGE_KEY);
}
