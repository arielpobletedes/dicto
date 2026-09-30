import { resolve } from "node:path";
import { config } from "dotenv";
import { getDatabase } from "../client";
import { seedDatabase } from "./seed";

// Intentar cargar variables desde las distintas ubicaciones posibles en el monorepo
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });
config({ path: resolve(process.cwd(), "packages/db/.env") });
config({ path: resolve(process.cwd(), "apps/web/.env.local") });
config({ path: resolve(process.cwd(), "../../apps/web/.env.local") });

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error(
      "❌ Error: DATABASE_URL no está definida en el entorno.\n" +
        "   Por favor define DATABASE_URL en tu archivo .env o apps/web/.env.local con la URL de tu base de datos Neon.",
    );
    process.exit(1);
  }

  const db = getDatabase(dbUrl);
  try {
    const result = await seedDatabase(db);
    console.log(
      `🎉 Semilla finalizada: ${result.levelsCount} niveles y ${result.exercisesCount} ejercicios creados o actualizados.`,
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Error ejecutando la semilla:", error);
    process.exit(1);
  }
}

main();
