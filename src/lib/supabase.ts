import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 지연 로딩을 위한 변수
let supabase: ReturnType<typeof createSupabaseClient<Database>> | null = null;

const getSupabaseClient = () => {
  if (!supabase) {
    if (!supabaseUrl || !supabaseAnonKey) {
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
