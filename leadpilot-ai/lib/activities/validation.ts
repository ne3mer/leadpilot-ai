import {
  isLeadActivityType,
  type LeadActivityType,
} from "@/lib/activity-types";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const MAX_CONTENT_LENGTH = 5000;

export type ActivityFieldInput = {
  type: LeadActivityType;
  content: string;
};

export function isValidLeadId(leadId: string): boolean {
  return UUID_REGEX.test(leadId.trim());
}

export function isValidActivityId(activityId: string): boolean {
  return UUID_REGEX.test(activityId.trim());
}

export function validateActivityFields(input: ActivityFieldInput): string | null {
  if (!isLeadActivityType(input.type)) {
    return "Select a valid activity type.";
  }

  const content = input.content.trim();
  if (content.length < 1) {
    return "Enter activity content.";
  }
  if (content.length > MAX_CONTENT_LENGTH) {
    return "Activity content is too long.";
  }

  return null;
}
