import { Pool } from "@neondatabase/serverless";
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

export type Database = NeonDatabase<typeof schema>;

let _db: Database | null = null;
let _pool: Pool | null = null;

export function getDatabase(connectionString?: string): Database {
  const url = connectionString ?? process.env.DATABASE_URL;

  if (!url) {
    // Si no hay DATABASE_URL configurada, devolvemos un proxy informativo para no quebrar en build
    const handler: ProxyHandler<object> = {
      get(_target, prop) {
        if (prop === "then") return undefined;
        return () => {
          throw new Error(
            "DATABASE_URL no está configurada. Por favor define DATABASE_URL en tu archivo .env con la URL de tu base de datos Neon.",
          );
        };
      },
    };
    return new Proxy({}, handler) as unknown as Database;
  }

  if (!_db) {
    _pool = new Pool({ connectionString: url });
    _db = drizzle(_pool, { schema });
  }

  return _db;
}

export const db = getDatabase();
