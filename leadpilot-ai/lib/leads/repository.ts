import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { computeLeadMetrics, type LeadDashboardMetrics } from "@/lib/leads/metrics";
import type { Lead, LeadInsertInput, LeadStatus, LeadUpdateInput } from "@/lib/lead-types";
import { isLeadStatus } from "@/lib/lead-types";

type SupabaseServerClient = SupabaseClient<Database>;

const leadColumns =
  "id, user_id, name, company, email, status, created_at, updated_at" as const;

function mapLead(row: Database["public"]["Tables"]["leads"]["Row"]): Lead {
  return row;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function requireAuthenticatedUser(supabase: SupabaseServerClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function listLeadsForCurrentUser(supabase: SupabaseServerClient): Promise<Lead[]> {
  await requireAuthenticatedUser(supabase);

  const { data, error } = await supabase
    .from("leads")
    .select(leadColumns)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapLead);
}

export async function getLeadDashboardMetricsForCurrentUser(
  supabase: SupabaseServerClient
): Promise<LeadDashboardMetrics> {
  const leads = await listLeadsForCurrentUser(supabase);
  return computeLeadMetrics(leads);
}

export async function countLeadsForCurrentUser(supabase: SupabaseServerClient): Promise<number> {
  await requireAuthenticatedUser(supabase);

  const { count, error } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true });

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function createLeadForCurrentUser(
  supabase: SupabaseServerClient,
  input: LeadInsertInput
): Promise<Lead> {
  const user = await requireAuthenticatedUser(supabase);

  const payload = {
    user_id: user.id,
    name: input.name.trim(),
    company: input.company.trim(),
    email: normalizeEmail(input.email),
    status: input.status,
  };

  const { data, error } = await supabase.from("leads").insert(payload).select(leadColumns).single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("A lead with this email already exists.");
    }
    throw new Error(error.message);
  }

  return mapLead(data);
}

export async function updateLeadForCurrentUser(
  supabase: SupabaseServerClient,
  leadId: string,
  input: LeadUpdateInput
): Promise<Lead> {
  await requireAuthenticatedUser(supabase);

  const updates: Database["public"]["Tables"]["leads"]["Update"] = {};

  if (input.name !== undefined) {
    updates.name = input.name.trim();
  }
  if (input.company !== undefined) {
    updates.company = input.company.trim();
  }
  if (input.email !== undefined) {
    updates.email = normalizeEmail(input.email);
  }
  if (input.status !== undefined) {
    updates.status = input.status;
  }

  const { data, error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", leadId)
    .select(leadColumns)
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("A lead with this email already exists.");
    }
    throw new Error(error.message);
  }

  return mapLead(data);
}

export async function deleteLeadForCurrentUser(
  supabase: SupabaseServerClient,
  leadId: string
): Promise<void> {
  await requireAuthenticatedUser(supabase);

  const { error } = await supabase.from("leads").delete().eq("id", leadId);

  if (error) {
    throw new Error(error.message);
  }
}

export type LocalLeadMigrationInput = {
  name: string;
  company: string;
  email: string;
  status: LeadStatus;
};

export function sanitizeLocalMigrationLead(
  value: unknown
): LocalLeadMigrationInput | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  if (
    typeof record.name !== "string" ||
    typeof record.email !== "string" ||
    typeof record.status !== "string" ||
    !isLeadStatus(record.status)
  ) {
    return null;
  }

  const company =
    typeof record.company === "string" && record.company.trim().length > 0
      ? record.company.trim()
      : record.email.split("@")[1]?.split(".")[0] ?? "Company";

  if (record.name.trim().length <= 1 || company.trim().length <= 1) {
    return null;
  }

  return {
    name: record.name.trim(),
    company: company.trim(),
    email: record.email.trim().toLowerCase(),
    status: record.status,
  };
}

export async function migrateLocalLeadsForCurrentUser(
  supabase: SupabaseServerClient,
  leads: LocalLeadMigrationInput[]
): Promise<{ migrated: number }> {
  const existingCount = await countLeadsForCurrentUser(supabase);
  if (existingCount > 0 || leads.length === 0) {
    return { migrated: 0 };
  }

  let migrated = 0;

  for (const lead of leads) {
    try {
      await createLeadForCurrentUser(supabase, lead);
      migrated += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Migration failed";
      if (message.includes("already exists")) {
        continue;
      }
      throw error;
    }
  }

  return { migrated };
}
