import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { requireAuthenticatedUser } from "@/lib/leads/repository";
import type { SenderProfile } from "@/lib/sender-profile-types";

type SupabaseServerClient = SupabaseClient<Database>;

type SenderProfileWriteInput = {
  full_name: string;
  job_title: string | null;
  company_name: string;
  company_description: string | null;
  services: string | null;
  target_customers: string | null;
  value_proposition: string | null;
  tone_preference: SenderProfile["tone_preference"];
  website: string | null;
};

const profileColumns =
  "id, user_id, full_name, job_title, company_name, company_description, services, target_customers, value_proposition, tone_preference, website, created_at, updated_at" as const;

function mapProfile(row: Database["public"]["Tables"]["sender_profiles"]["Row"]): SenderProfile {
  return row;
}

export async function getSenderProfileForCurrentUser(
  supabase: SupabaseServerClient
): Promise<SenderProfile | null> {
  await requireAuthenticatedUser(supabase);

  const { data, error } = await supabase
    .from("sender_profiles")
    .select(profileColumns)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load sender profile.");
  }

  return data ? mapProfile(data) : null;
}

export async function createSenderProfileForCurrentUser(
  supabase: SupabaseServerClient,
  input: SenderProfileWriteInput
): Promise<SenderProfile> {
  const user = await requireAuthenticatedUser(supabase);

  const existing = await getSenderProfileForCurrentUser(supabase);
  if (existing) {
    throw new Error("Sender profile already exists.");
  }

  const { data, error } = await supabase
    .from("sender_profiles")
    .insert({
      user_id: user.id,
      ...input,
    })
    .select(profileColumns)
    .single();

  if (error) {
    throw new Error("Unable to create sender profile.");
  }

  return mapProfile(data);
}

export async function updateSenderProfileForCurrentUser(
  supabase: SupabaseServerClient,
  input: SenderProfileWriteInput
): Promise<SenderProfile> {
  await requireAuthenticatedUser(supabase);

  const { data, error } = await supabase
    .from("sender_profiles")
    .update(input)
    .select(profileColumns)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to update sender profile.");
  }

  if (!data) {
    throw new Error("Sender profile not found.");
  }

  return mapProfile(data);
}
