/** Canonical lead statuses (must match `public.leads.status` check constraint). */
export const leadStatuses = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
] as const;

export type LeadStatus = (typeof leadStatuses)[number];

/** Active pipeline stages (non-terminal). */
export const activePipelineStatuses = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
] as const;

export type ActivePipelineStatus = (typeof activePipelineStatuses)[number];

/** Terminal outcomes. */
export const terminalLeadStatuses = ["Won", "Lost"] as const;

export type TerminalLeadStatus = (typeof terminalLeadStatuses)[number];

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

export function isActivePipelineStatus(value: LeadStatus): value is ActivePipelineStatus {
  return (activePipelineStatuses as readonly string[]).includes(value);
}

export function isTerminalLeadStatus(value: LeadStatus): value is TerminalLeadStatus {
  return (terminalLeadStatuses as readonly string[]).includes(value);
}
