import { NextResponse } from "next/server";

import {
  apiAuthErrorResponse,
  requireApiRoles,
} from "@/lib/auth/api";
import { ANIMAL_ACCESS_ROLES } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import { weightLogSchema } from "@/lib/validations/animal";

interface RouteContext {
  params: { id: string };
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const user = await requireApiRoles(ANIMAL_ACCESS_ROLES);
    const animalId = context.params.id;
    const body = await request.json();
    const parsed = weightLogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid weight log", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const weightKg = Number(data.weight_kg);
    const recordedAt = data.recorded_at
      ? new Date(data.recorded_at).toISOString()
      : new Date().toISOString();

    const supabase = await createClient();

    const { data: inserted, error } = await supabase
      .from("weight_logs")
      .insert({
        animal_id: animalId,
        weight_kg: weightKg,
        recorded_at: recordedAt,
        notes: data.notes || null,
        recorded_by: user.id,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[api weight-logs]", error.message);
      return NextResponse.json(
        { error: "Failed to save weight log" },
        { status: 500 }
      );
    }

    await supabase
      .from("animals")
      .update({ current_weight_kg: weightKg })
      .eq("id", animalId);

    return NextResponse.json({ data: inserted }, { status: 201 });
  } catch (error) {
    return apiAuthErrorResponse(error);
  }
}
