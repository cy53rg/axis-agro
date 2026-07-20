import { NextResponse } from "next/server";

import { lookupPublicAnimalByTag } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag")?.trim() ?? "";

  if (!tag) {
    return NextResponse.json(
      { error: "Tag number is required", animal: null },
      { status: 400 }
    );
  }

  if (tag.length > 50) {
    return NextResponse.json(
      { error: "Tag number not found", animal: null },
      { status: 404 }
    );
  }

  const animal = await lookupPublicAnimalByTag(tag);

  if (!animal) {
    return NextResponse.json(
      { error: "Tag number not found", animal: null },
      { status: 404 }
    );
  }

  return NextResponse.json({
    animal: {
      ...animal,
      /** Public directory only lists active livestock. */
      status: "active" as const,
    },
  });
}
