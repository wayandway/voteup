import { createBrowserClient, createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (typeof window !== "undefined") {
    return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get() {
        return undefined;
      },
      set() {},
      remove() {},
    },
  });
}
