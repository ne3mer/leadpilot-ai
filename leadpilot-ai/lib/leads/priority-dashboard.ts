import type { LeadActivity } from "@/lib/activity-types";
import {
  activePipelineStatuses,
  isActivePipelineStatus,
  type ActivePipelineStatus,
  type Lead,
} from "@/lib/lead-types";
import {
  computeLeadPriorityScore,
  type LeadPriorityActivityInput,
  type LeadPriorityLevel,
} from "@/lib/leads/priority-score";

/** Max priority leads shown on the dashboard (no pagination in Phase 11B). */
export const DASHBOARD_PRIORITY_LEADS_LIMIT = 5;

export type DashboardPriorityLeadItem = {
  id: string;
  name: string;
  company: string;
  status: ActivePipelineStatus;
  score: number;
  priority: LeadPriorityLevel;
  /** Up to two reasons from the scoring engine (excluding duplicate status line when possible). */
  displayReasons: string[];
  updated_at: string;
};

export function activitiesByLeadIdToRecord(
  map: Map<string, LeadPriorityActivityInput[]>
): Record<string, LeadPriorityActivityInput[]> {
  return Object.fromEntries(map.entries());
}

export function groupActivitiesByLeadId(
  activities: LeadActivity[]
): Map<string, LeadPriorityActivityInput[]> {
  const map = new Map<string, LeadPriorityActivityInput[]>();

  for (const activity of activities) {
    const existing = map.get(activity.lead_id) ?? [];
    existing.push({
      type: activity.type,
      content: activity.content,
      created_at: activity.created_at,
    });
    map.set(activity.lead_id, existing);
  }

  return map;
}

/** Pick up to two explainability lines; status is shown separately in the UI. */
export function pickDisplayReasons(reasons: string[]): string[] {
  const withoutStatus = reasons.slice(1);
  if (withoutStatus.length > 0) {
    return withoutStatus.slice(0, 2);
  }
  return reasons.slice(0, 1);
}

function compareDashboardPriorityLeads(
  a: DashboardPriorityLeadItem,
  b: DashboardPriorityLeadItem
): number {
  if (b.score !== a.score) {
    return b.score - a.score;
  }

  const updatedA = Date.parse(a.updated_at);
  const updatedB = Date.parse(b.updated_at);
  const safeA = Number.isFinite(updatedA) ? updatedA : 0;
  const safeB = Number.isFinite(updatedB) ? updatedB : 0;
  if (safeB !== safeA) {
    return safeB - safeA;
  }

  return a.id.localeCompare(b.id);
}

export function buildDashboardPriorityLeads(
  leads: Lead[],
  activitiesByLeadId: Map<string, LeadPriorityActivityInput[]>,
  options?: { limit?: number; asOf?: Date }
): DashboardPriorityLeadItem[] {
  const limit = options?.limit ?? DASHBOARD_PRIORITY_LEADS_LIMIT;
  const activeSet = new Set<string>(activePipelineStatuses);

  const scored: DashboardPriorityLeadItem[] = [];

  for (const lead of leads) {
    if (!isActivePipelineStatus(lead.status) || !activeSet.has(lead.status)) {
      continue;
    }

    const activities = activitiesByLeadId.get(lead.id) ?? [];
    const result = computeLeadPriorityScore(
      {
        status: lead.status,
        created_at: lead.created_at,
        updated_at: lead.updated_at,
      },
      activities,
      { asOf: options?.asOf }
    );

    scored.push({
      id: lead.id,
      name: lead.name,
      company: lead.company,
      status: lead.status,
      score: result.score,
      priority: result.priority,
      displayReasons: pickDisplayReasons(result.reasons),
      updated_at: lead.updated_at,
    });
  }

  scored.sort(compareDashboardPriorityLeads);
  return scored.slice(0, limit);
}
