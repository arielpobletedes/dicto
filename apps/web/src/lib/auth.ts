import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { memoryAdapter } from "better-auth/adapters/memory";
import { db, users, sessions, accounts, verifications } from "@ptt/db";
import { env } from "@/env";

const isDbConfigured = Boolean(process.env.DATABASE_URL);

export const auth = betterAuth({
  database: isDbConfigured
    ? drizzleAdapter(db, {
        provider: "pg",
        schema: {
          user: users,
          session: sessions,
          account: accounts,
          verification: verifications,
        },
      })
    : memoryAdapter({}),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "student",
      },
    },
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.NEXT_PUBLIC_APP_URL,
});

export type Auth = typeof auth;
