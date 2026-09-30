import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth";
import { recordAttempt } from "@/server/attempts";
import { recordAttemptSchema } from "@ptt/shared";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const validated = recordAttemptSchema.parse(json);

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      // Usuario invitado (modo demostración o práctica rápida sin registro)
      return NextResponse.json({
        attemptId: "guest-attempt",
        wpm: validated.wpm,
        accuracy: validated.accuracy,
        errors: validated.errors,
        durationMs: validated.durationMs,
        isNewBestWpm: false,
        exerciseTitle: "Práctica de invitado",
        levelId: "guest",
      });
    }

    const result = await recordAttempt(currentUser.id, validated);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al procesar el intento";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
