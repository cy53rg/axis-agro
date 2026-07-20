import { NextResponse } from "next/server";

import {
  apiAuthErrorResponse,
  requireApiRoles,
} from "@/lib/auth/api";
import { AUDIT_LOG_ACCESS_ROLES } from "@/lib/auth/rbac";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AuditLog, AuditLogEntry } from "@/types";

export async function GET(request: Request) {
  try {
    // Role gate first (manager / owner), then privileged read for joins
    await requireApiRoles(AUDIT_LOG_ACCESS_ROLES);

    const { searchParams } = new URL(request.url);
    const limit = Math.min(
      Number(searchParams.get("limit") ?? "50") || 50,
      200
    );
    const tableName = searchParams.get("table");

    const admin = createAdminClient();

    let query = admin
      .from("audit_log")
      .select(
        "id, actor_id, action, table_name, record_id, before_data, after_data, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (tableName) {
      query = query.eq("table_name", tableName);
    }

    const { data: logs, error } = await query;

    if (error) {
      console.error("[api/admin/audit-logs]", error.message);
      return NextResponse.json(
        { error: "Failed to load audit logs" },
        { status: 500 }
      );
    }

    const rows = (logs ?? []) as AuditLog[];
    const actorIds = Array.from(
      new Set(rows.map((row) => row.actor_id).filter(Boolean))
    );

    const emailByActorId = new Map<string, string | null>();

    if (actorIds.length > 0) {
      const { data: profiles, error: profilesError } = await admin
        .from("profiles")
        .select("id, email")
        .in("id", actorIds);

      if (profilesError) {
        console.error(
          "[api/admin/audit-logs] profiles join:",
          profilesError.message
        );
      } else {
        for (const profile of profiles ?? []) {
          emailByActorId.set(
            profile.id as string,
            (profile.email as string | null) ?? null
          );
        }
      }
    }

    const data: AuditLogEntry[] = rows.map((row) => ({
      ...row,
      actor_email: row.actor_id
        ? (emailByActorId.get(row.actor_id) ?? null)
        : null,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    return apiAuthErrorResponse(error);
  }
}
