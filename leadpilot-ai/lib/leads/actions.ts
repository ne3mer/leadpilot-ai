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
import type { Lead, LeadInsertInput, LeadStatus, LeadUpdateInput } from "@/lib/lead-types";
import { isLeadStatus } from "@/lib/lead-types";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function validateLeadInsert(input: LeadInsertInput): string | null {
  if (input.name.trim().length <= 1) {
    return "Enter a valid lead name.";
  }
  if (input.company.trim().length <= 1) {
    return "Enter a valid company name.";
  }
  if (!input.email.trim().includes("@")) {
    return "Enter a valid email address.";
  }
  if (!isLeadStatus(input.status)) {
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
      error: error instanceof Error ? error.message : "Unable to create lead.",
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
    revalidatePath("/dashboard");
    return { success: true, data: lead };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to update lead status.",
    };
  }
}

export async function deleteLeadAction(leadId: string): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient();
    await deleteLeadForCurrentUser(supabase, leadId);
    revalidatePath("/dashboard");
    return { success: true, data: { id: leadId } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to delete lead.",
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
      error: error instanceof Error ? error.message : "Unable to migrate local leads.",
    };
  }
}

export async function updateLeadAction(
  leadId: string,
  input: LeadUpdateInput
): Promise<ActionResult<Lead>> {
  try {
    const supabase = await createClient();
    const lead = await updateLeadForCurrentUser(supabase, leadId, input);
    revalidatePath("/dashboard");
    return { success: true, data: lead };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to update lead.",
    };
  }
}
