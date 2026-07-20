import type { Session, User } from "@supabase/supabase-js";

import type { UserRole } from "@/types";

/**
 * App user with role loaded from public.profiles.
 * Extends Supabase User; `role` is the application role (not the JWT claim alone).
 */
export type AppUser = User & {
  role?: UserRole | string;
};

/**
 * Session whose user includes the profiles.role value.
 */
export type AppSession = Omit<Session, "user"> & {
  user: AppUser;
};

export type SessionWithRole = AppSession;
