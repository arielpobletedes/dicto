import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth";
import { togglePublishExercise } from "@/server/exercises";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_req: Request, { params }: RouteParams) {
  try {
    // Verificación estricta de rol admin en el servidor
    await requireAdmin();
    const { id } = await params;
    const updated = await togglePublishExercise(id);
    return NextResponse.json({ success: true, exercise: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No autorizado";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}
