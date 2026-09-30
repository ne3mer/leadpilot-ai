/** Canonical activity types (must match `public.lead_activities.type` check constraint). */

export const leadActivityTypes = ["note", "email", "call"] as const;

export type LeadActivityType = (typeof leadActivityTypes)[number];

export type LeadActivity = {
  id: string;
  lead_id: string;
  user_id: string;
  type: LeadActivityType;
  content: string;
  created_at: string;
};

export const leadActivityTypeLabels: Record<LeadActivityType, string> = {
  note: "Note",
  email: "Email",
  call: "Call",
};

export function isLeadActivityType(value: string): value is LeadActivityType {
  return (leadActivityTypes as readonly string[]).includes(value);
}
