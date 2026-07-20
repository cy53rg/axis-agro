import { NextResponse } from "next/server";

import {
  apiAuthErrorResponse,
  requireApiRoles,
} from "@/lib/auth/api";
import { ANIMAL_ACCESS_ROLES } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import { healthCheckSchema } from "@/lib/validations/animal";

interface RouteContext {
  params: { id: string };
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const user = await requireApiRoles(ANIMAL_ACCESS_ROLES);
    const animalId = context.params.id;
    const body = await request.json();
    const parsed = healthCheckSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid health check", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const supabase = await createClient();

    const { data: inserted, error } = await supabase
      .from("health_checks")
      .insert({
        animal_id: animalId,
        check_date: data.check_date,
        findings: data.findings || null,
        vet_name: data.vet_name || null,
        recorded_by: user.id,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[api health-checks]", error.message);
      return NextResponse.json(
        { error: "Failed to save health check" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: inserted }, { status: 201 });
  } catch (error) {
    return apiAuthErrorResponse(error);
  }
}
