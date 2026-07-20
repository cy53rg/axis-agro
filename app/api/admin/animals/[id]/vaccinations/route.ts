import { NextResponse } from "next/server";

import {
  apiAuthErrorResponse,
  requireApiRoles,
} from "@/lib/auth/api";
import { ANIMAL_ACCESS_ROLES } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import { vaccinationSchema } from "@/lib/validations/animal";

interface RouteContext {
  params: { id: string };
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const user = await requireApiRoles(ANIMAL_ACCESS_ROLES);
    const animalId = context.params.id;
    const body = await request.json();
    const parsed = vaccinationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid vaccination", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const supabase = await createClient();

    const { data: inserted, error } = await supabase
      .from("vaccinations")
      .insert({
        animal_id: animalId,
        vaccine_name: data.vaccine_name,
        date_given: data.date_given,
        next_due_date: data.next_due_date || null,
        administered_by: data.administered_by || null,
        recorded_by: user.id,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[api vaccinations]", error.message);
      return NextResponse.json(
        { error: "Failed to save vaccination" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: inserted }, { status: 201 });
  } catch (error) {
    return apiAuthErrorResponse(error);
  }
}
