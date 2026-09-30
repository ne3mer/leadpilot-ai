import type { LeadActivityType } from "@/lib/activity-types";

export const MAX_AI_ACTIVITY_CONTEXT = 20;

export type AiActivityContext = {
  type: LeadActivityType;
  content: string;
  created_at: string;
};

export function selectActivitiesForAiContext<T extends AiActivityContext>(
  activities: T[]
): T[] {
  return activities.slice(0, MAX_AI_ACTIVITY_CONTEXT);
}
