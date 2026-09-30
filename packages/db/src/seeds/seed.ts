import type { Database } from "../client";
import { levels, exercises, users } from "../schema";
import { SEED_LEVELS, SEED_EXERCISES } from "./data";

export async function seedDatabase(db: Database): Promise<{
  levelsCount: number;
  exercisesCount: number;
}> {
  console.log("🌱 Insertando niveles semilla...");
  for (const lvl of SEED_LEVELS) {
    await db
      .insert(levels)
      .values({
        id: lvl.id,
        title: lvl.title,
        description: lvl.description,
        slug: lvl.slug,
        order: lvl.order,
      })
      .onConflictDoUpdate({
        target: levels.id,
        set: {
          title: lvl.title,
          description: lvl.description,
          slug: lvl.slug,
          order: lvl.order,
          updatedAt: new Date(),
        },
      });
  }

  console.log("🌱 Insertando ejercicios semilla...");
  for (const ex of SEED_EXERCISES) {
    await db
      .insert(exercises)
      .values({
        id: ex.id,
        levelId: ex.levelId,
        title: ex.title,
        description: ex.description,
        content: ex.content,
        language: ex.language,
        difficulty: ex.difficulty,
        tier: ex.tier,
        order: ex.order,
        published: ex.published,
      })
      .onConflictDoUpdate({
        target: exercises.id,
        set: {
          levelId: ex.levelId,
          title: ex.title,
          description: ex.description,
          content: ex.content,
          language: ex.language,
          difficulty: ex.difficulty,
          tier: ex.tier,
          order: ex.order,
          published: ex.published,
          updatedAt: new Date(),
        },
      });
  }

  // Insertar usuario demo administrador y estudiante si no existen
  console.log("🌱 Creando usuarios demo (si no existen)...");
  await db
    .insert(users)
    .values([
      {
        id: "demo-admin-id",
        name: "Admin Demo",
        email: "admin@protouchtyping.dev",
        emailVerified: true,
        role: "admin",
      },
      {
        id: "demo-student-id",
        name: "Estudiante Demo",
        email: "student@protouchtyping.dev",
        emailVerified: true,
        role: "student",
      },
    ])
    .onConflictDoNothing();

  console.log("✅ Sembrado completado con éxito.");
  return {
    levelsCount: SEED_LEVELS.length,
    exercisesCount: SEED_EXERCISES.length,
  };
}

// Si se ejecuta este archivo directamente con Node.js
if (
  process.argv[1] &&
  (process.argv[1].endsWith("seed.ts") || process.argv[1].endsWith("seed.js"))
) {
  const { resolve } = await import("node:path");
  const { config } = await import("dotenv");

  config({ path: resolve(process.cwd(), ".env") });
  config({ path: resolve(process.cwd(), "../../.env") });
  config({ path: resolve(process.cwd(), "packages/db/.env") });
  config({ path: resolve(process.cwd(), "apps/web/.env.local") });
  config({ path: resolve(process.cwd(), "../../apps/web/.env.local") });

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error(
      "❌ Error: DATABASE_URL no está definida en el entorno.\n" +
        "   Por favor define DATABASE_URL en tu archivo .env o apps/web/.env.local con la URL de tu base de datos Neon.",
    );
    process.exit(1);
  }

  const { getDatabase } = await import("../client");
  const db = getDatabase(dbUrl);
  seedDatabase(db)
    .then((result) => {
      console.log(
        `🎉 Semilla finalizada: ${result.levelsCount} niveles y ${result.exercisesCount} ejercicios.`,
      );
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Error ejecutando la semilla:", err);
      process.exit(1);
    });
}
