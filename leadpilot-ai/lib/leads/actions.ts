"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  createLeadForCurrentUser,
  deleteLeadForCurrentUser,
  migrateLocalLeadsForCurrentUser,
  sanitizeLocalMigrationLead,
  updateLeadForCurrentUser,
  type LocalLeadMigrationInput,
} from "@/lib/leads/repository";
import { validateLeadFields, validateLeadInsert } from "@/lib/leads/validation";
import type { Lead, LeadInsertInput, LeadStatus, LeadUpdateInput } from "@/lib/lead-types";
import { isLeadStatus } from "@/lib/lead-types";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function revalidateLeadPaths(leadId: string) {
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/leads/${leadId}`);
}

function mapActionError(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) {
    return fallback;
  }

  const message = error.message;
  if (
    message === "Lead not found." ||
    message === "A lead with this email already exists." ||
    message === "Unauthorized"
  ) {
    return message === "Unauthorized" ? "You must be signed in to continue." : message;
  }

  return fallback;
}

function validatePartialLeadUpdate(input: LeadUpdateInput): string | null {
  if (input.name !== undefined && input.name.trim().length <= 1) {
    return "Enter a valid lead name.";
  }
  if (input.company !== undefined && input.company.trim().length <= 1) {
    return "Enter a valid company name.";
  }
  if (input.email !== undefined) {
    const email = input.email.trim();
    if (!email.includes("@") || !email.includes(".") || email.startsWith("@")) {
      return "Enter a valid email address.";
    }
  }
  if (input.status !== undefined && !isLeadStatus(input.status)) {
    return "Select a valid lead status.";
  }
  return null;
}

export async function createLeadAction(
  input: LeadInsertInput
): Promise<ActionResult<Lead>> {
  const validationError = validateLeadInsert(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const supabase = await createClient();
    const lead = await createLeadForCurrentUser(supabase, input);
    revalidatePath("/dashboard");
    return { success: true, data: lead };
  } catch (error) {
    return {
      success: false,
      error: mapActionError(error, "Unable to create lead."),
    };
  }
}

export async function updateLeadStatusAction(
  leadId: string,
  status: LeadStatus
): Promise<ActionResult<Lead>> {
  if (!isLeadStatus(status)) {
    return { success: false, error: "Select a valid lead status." };
  }

  try {
    const supabase = await createClient();
    const lead = await updateLeadForCurrentUser(supabase, leadId, { status });
    revalidateLeadPaths(leadId);
    return { success: true, data: lead };
  } catch (error) {
    return {
      success: false,
      error: mapActionError(error, "Unable to update lead status."),
    };
  }
}

export async function deleteLeadAction(leadId: string): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient();
    await deleteLeadForCurrentUser(supabase, leadId);
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/leads/${leadId}`);
    return { success: true, data: { id: leadId } };
  } catch (error) {
    return {
      success: false,
      error: mapActionError(error, "Unable to delete lead."),
    };
  }
}

export async function migrateLocalLeadsAction(
  rawLeads: unknown[]
): Promise<ActionResult<{ migrated: number }>> {
  const leads: LocalLeadMigrationInput[] = [];

  for (const item of rawLeads) {
    const sanitized = sanitizeLocalMigrationLead(item);
    if (sanitized) {
      leads.push(sanitized);
    }
  }

  if (leads.length === 0) {
    return { success: true, data: { migrated: 0 } };
  }

  try {
    const supabase = await createClient();
    const result = await migrateLocalLeadsForCurrentUser(supabase, leads);
    revalidatePath("/dashboard");
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: mapActionError(error, "Unable to migrate local leads."),
    };
  }
}

export async function updateLeadAction(
  leadId: string,
  input: LeadUpdateInput
): Promise<ActionResult<Lead>> {
  const partialError = validatePartialLeadUpdate(input);
  if (partialError) {
    return { success: false, error: partialError };
  }

  if (
    input.name === undefined &&
    input.company === undefined &&
    input.email === undefined &&
    input.status === undefined
  ) {
    return { success: false, error: "No changes to save." };
  }

  try {
    const supabase = await createClient();
    const lead = await updateLeadForCurrentUser(supabase, leadId, input);
    revalidateLeadPaths(leadId);
    return { success: true, data: lead };
  } catch (error) {
    return {
      success: false,
      error: mapActionError(error, "Unable to update lead."),
    };
  }
}

/** Full lead update from the detail page (all editable fields required). */
export async function updateLeadDetailAction(
  leadId: string,
  input: LeadInsertInput
): Promise<ActionResult<Lead>> {
  const validationError = validateLeadFields(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  return updateLeadAction(leadId, {
    name: input.name,
    company: input.company,
    email: input.email,
    status: input.status,
  });
}
