import { z } from "zod";

export const dbEnvSchema = z.object({
  DATABASE_URL: z
    .string()
    .url("DATABASE_URL debe ser una URL de conexión válida a PostgreSQL")
    .optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type DbEnv = z.infer<typeof dbEnvSchema>;

export function getDbEnv(): DbEnv {
  return dbEnvSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  });
}
