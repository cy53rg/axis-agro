import { createBrowserClient } from "@supabase/ssr";

import {
  getSessionWithRole,
  getUserWithRole,
} from "@/lib/supabase/auth";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Browser helper: current session with `session.user.role` from profiles.
 */
export async function getSession() {
  return getSessionWithRole(createClient());
}

/**
 * Browser helper: current user with `user.role` from profiles.
 */
export async function getUser() {
  return getUserWithRole(createClient());
}
