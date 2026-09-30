import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth";
import { updateExercise } from "@/server/exercises";
import { exerciseTierSchema } from "@ptt/shared";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    // Verificación estricta de rol admin en el servidor
    await requireAdmin();
    const { id } = await params;
    const json = await req.json();
    const tier = exerciseTierSchema.parse(json.tier);

    const updated = await updateExercise(id, { tier });
    return NextResponse.json({ success: true, exercise: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al actualizar tier";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}
