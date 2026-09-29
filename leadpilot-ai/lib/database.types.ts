import type { LeadStatus } from "@/lib/lead-types";

export type Database = {
  public: {
    Tables: {
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
