import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/supabase/auth";
import { hasRole } from "@/lib/auth/rbac";
import type { AppUser } from "@/types/auth";
import type { UserRole } from "@/types";

export class ApiAuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/**
 * Requires an authenticated user whose profiles.role is in `allowed`.
 * Throws ApiAuthError with 401/403 for the route handler to return.
 */
export async function requireApiRoles(
  allowed: readonly UserRole[]
): Promise<AppUser> {
  const supabase = await createClient();
  const user = await getUserWithRole(supabase);

  if (!user) {
    throw new ApiAuthError("Unauthorized", 401);
  }

  if (!hasRole(user.role, allowed)) {
    throw new ApiAuthError("Forbidden", 403);
  }

  return user;
}

export function apiAuthErrorResponse(error: unknown) {
  if (error instanceof ApiAuthError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  }

  console.error("[api]", error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
