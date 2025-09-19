import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 단일 인스턴스 생성
const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

export const createClient = () => {
  return supabase;
};

export { supabase };

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
      };
      polls: {
        Row: {
          id: string;
          host_id: string;
          title: string;
          description?: string;
          is_open: boolean;
          created_at: string;
          expires_at?: string;
          max_votes_per_option?: number;
        };
        Insert: {
          id?: string;
          host_id: string;
          title: string;
          description?: string;
          is_open?: boolean;
          created_at?: string;
          expires_at?: string;
          max_votes_per_option?: number;
        };
        Update: {
          id?: string;
          host_id?: string;
          title?: string;
          description?: string;
          is_open?: boolean;
          created_at?: string;
          expires_at?: string;
          max_votes_per_option?: number;
        };
      };
      options: {
        Row: {
          id: string;
          poll_id: string;
          label: string;
          count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          poll_id: string;
          label: string;
          count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          poll_id?: string;
          label?: string;
          count?: number;
          created_at?: string;
        };
      };
      responses: {
        Row: {
          id: string;
          poll_id: string;
          option_id: string;
          participant_token: string;
          ip_address?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          poll_id: string;
          option_id: string;
          participant_token: string;
          ip_address?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          poll_id?: string;
          option_id?: string;
          participant_token?: string;
          ip_address?: string;
          created_at?: string;
        };
      };
    };
  };
};
