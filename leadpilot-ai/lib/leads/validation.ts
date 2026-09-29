import type { LeadInsertInput, LeadStatus } from "@/lib/lead-types";
import { isLeadStatus } from "@/lib/lead-types";

export type LeadFieldInput = {
  name: string;
  company: string;
  email: string;
  status: LeadStatus;
};

export function validateLeadFields(input: LeadFieldInput): string | null {
  if (input.name.trim().length <= 1) {
    return "Enter a valid lead name.";
  }
  if (input.company.trim().length <= 1) {
    return "Enter a valid company name.";
  }

  const email = input.email.trim();
  if (!email.includes("@") || !email.includes(".") || email.startsWith("@")) {
    return "Enter a valid email address.";
  }

  if (!isLeadStatus(input.status)) {
    return "Select a valid lead status.";
  }

  return null;
}

export function validateLeadInsert(input: LeadInsertInput): string | null {
  return validateLeadFields(input);
}
