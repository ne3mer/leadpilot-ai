import type { LeadActivityType } from "@/lib/activity-types";
import type { LeadStatus } from "@/lib/lead-types";
import type { SenderProfileTonePreference } from "@/lib/sender-profile-types";

export type Database = {
  public: {
    Tables: {
      lead_activities: {
        Row: {
          id: string;
          lead_id: string;
          user_id: string;
          type: LeadActivityType;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          user_id: string;
          type: LeadActivityType;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          user_id?: string;
          type?: LeadActivityType;
          content?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      sender_profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          job_title: string | null;
          company_name: string;
          company_description: string | null;
          services: string | null;
          target_customers: string | null;
          value_proposition: string | null;
          tone_preference: SenderProfileTonePreference;
          website: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          job_title?: string | null;
          company_name: string;
          company_description?: string | null;
          services?: string | null;
          target_customers?: string | null;
          value_proposition?: string | null;
          tone_preference?: SenderProfileTonePreference;
          website?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          job_title?: string | null;
          company_name?: string;
          company_description?: string | null;
          services?: string | null;
          target_customers?: string | null;
          value_proposition?: string | null;
          tone_preference?: SenderProfileTonePreference;
          website?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          company: string;
          email: string;
          status: LeadStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          company: string;
          email: string;
          status: LeadStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          company?: string;
          email?: string;
          status?: LeadStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
