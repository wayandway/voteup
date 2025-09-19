import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createSupabaseClient<Database>> | null = null;

const getSupabaseClient = () => {
  if (!supabase) {
    if (!supabaseUrl || !supabaseAnonKey) {
      if (typeof window === "undefined") {
        return createSupabaseClient<Database>(
          "https://dummy.supabase.co",
          "dummy-key"
        );
      }
      throw new Error("Missing Supabase environment variables");
    }
    supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
};

export const createClient = () => {
  return getSupabaseClient();
};

export { getSupabaseClient as supabase };
