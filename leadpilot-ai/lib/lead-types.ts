export const leadStatuses = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
] as const;

export type LeadStatus = (typeof leadStatuses)[number];

export type Lead = {
  id: string;
  user_id: string;
  name: string;
  company: string;
  email: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
};

export type LeadInsertInput = {
  name: string;
  company: string;
  email: string;
  status: LeadStatus;
};

export type LeadUpdateInput = {
  name?: string;
  company?: string;
  email?: string;
  status?: LeadStatus;
};

export function isLeadStatus(value: string): value is LeadStatus {
  return (leadStatuses as readonly string[]).includes(value);
}
