import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import {
  getSessionWithRole,
  getUserWithRole,
} from "@/lib/supabase/auth";

export async function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component. Middleware handles session refresh.
          }
        },
      },
    }
  );
}

/**
 * Server helper: current session with `session.user.role` from profiles.
 */
export async function getSession() {
  const supabase = await createClient();
  return getSessionWithRole(supabase);
}

/**
 * Server helper: current user with `user.role` from profiles.
 */
export async function getUser() {
  const supabase = await createClient();
  return getUserWithRole(supabase);
}
