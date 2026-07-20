import type { UserRole } from "@/types";

/**
 * Narrow Supabase User.role to the application role from public.profiles
 * once session enrichment has run.
 */
declare module "@supabase/supabase-js" {
  interface User {
    /**
     * Application role from `public.profiles`.
     * Populated by `getSessionWithRole` / `getUserWithRole` / middleware.
     * Before enrichment this may still be the JWT role (e.g. "authenticated").
     */
    role?: UserRole | string;
  }
}

export {};
