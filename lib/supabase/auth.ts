import type { SupabaseClient, User } from "@supabase/supabase-js";

import { isUserRole } from "@/lib/auth/rbac";
import type { AppSession, AppUser } from "@/types/auth";
import type { UserRole } from "@/types";

function asUserRole(value: string | null | undefined): UserRole | undefined {
  return isUserRole(value) ? value : undefined;
}

/**
 * Loads `profiles.role` for a user id. Returns undefined if missing or on error.
 */
export async function fetchProfileRole(
  supabase: SupabaseClient,
  userId: string
): Promise<UserRole | undefined> {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("[fetchProfileRole]", error.message);
    return undefined;
  }

  return asUserRole(data?.role as string | undefined);
}

/**
 * Appends `profiles.role` onto the user as `user.role`.
 */
export async function attachRoleToUser(
  supabase: SupabaseClient,
  user: User
): Promise<AppUser> {
  const role = await fetchProfileRole(supabase, user.id);
  const appUser = user as AppUser;

  if (role) {
    appUser.role = role;
  }

  return appUser;
}

/**
 * Appends `profiles.role` onto `session.user.role`.
 */
export async function attachRoleToSession(
  supabase: SupabaseClient,
  session: AppSession | null
): Promise<AppSession | null> {
  if (!session?.user) {
    return session;
  }

  session.user = await attachRoleToUser(supabase, session.user);
  return session;
}

/**
 * Returns the current session with `session.user.role` from profiles.
 * Prefer this over raw `supabase.auth.getSession()` in app code.
 */
export async function getSessionWithRole(
  supabase: SupabaseClient
): Promise<AppSession | null> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("[getSessionWithRole]", error.message);
    return null;
  }

  return attachRoleToSession(supabase, session as AppSession | null);
}

/**
 * Returns the current user with `user.role` from profiles.
 * Prefer this over raw `supabase.auth.getUser()` when role is needed.
 */
export async function getUserWithRole(
  supabase: SupabaseClient
): Promise<AppUser | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("[getUserWithRole]", error.message);
    return null;
  }

  if (!user) {
    return null;
  }

  return attachRoleToUser(supabase, user);
}
