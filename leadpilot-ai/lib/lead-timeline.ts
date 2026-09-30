import type { LeadActivity, LeadActivityType } from "@/lib/activity-types";

export type LeadTimelineEventType = LeadActivityType | "lead_created";

export type LeadTimelineEvent = {
  id: string;
  type: LeadTimelineEventType;
  created_at: string;
  content: string;
};

export const leadTimelineEventLabels: Record<LeadTimelineEventType, string> = {
  lead_created: "Lead created",
  note: "Note",
  email: "Email",
  call: "Call",
};

export function buildLeadTimelineEvents(
  leadCreatedAt: string,
  activities: LeadActivity[]
): LeadTimelineEvent[] {
  const events: LeadTimelineEvent[] = [
    {
      id: "lead-created",
      type: "lead_created",
      created_at: leadCreatedAt,
      content: "Lead created",
    },
    ...activities.map((activity) => ({
      id: activity.id,
      type: activity.type,
      created_at: activity.created_at,
      content: activity.content,
    })),
  ];

  return events.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
