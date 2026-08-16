export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          label: string | null;
          role: string | null;
          date: string | null;
          thumbnail_url: string | null;
          thumbnail_alt: string | null;
          responsibilities: string | null;
          conclusion: string | null;
          content_html: string | null;
          accent_color: string | null;
          published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["projects"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      project_sections: {
        Row: {
          id: string;
          project_id: string;
          label: string;
          content_html: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["project_sections"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["project_sections"]["Insert"]>;
      };
      metrics: {
        Row: {
          id: string;
          project_id: string;
          label: string;
          value: string;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["metrics"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["metrics"]["Insert"]>;
      };
      migration_logs: {
        Row: {
          id: string;
          slug: string;
          source_file: string;
          status: "success" | "skipped" | "error";
          message: string | null;
          imported_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["migration_logs"]["Row"], "id" | "imported_at">;
        Update: Partial<Database["public"]["Tables"]["migration_logs"]["Insert"]>;
      };
      login_attempts: {
        Row: {
          id: string;
          identifier: string;
          success: boolean;
          attempted_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["login_attempts"]["Row"], "id" | "attempted_at">;
        Update: Partial<Database["public"]["Tables"]["login_attempts"]["Insert"]>;
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string | null;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["site_settings"]["Row"], "id" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
