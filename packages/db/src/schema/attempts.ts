import { integer, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { exercises } from "./exercises";

export const attempts = pgTable("attempts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  exerciseId: text("exercise_id")
    .notNull()
    .references(() => exercises.id, { onDelete: "cascade" }),
  wpm: real("wpm").notNull(),
  accuracy: real("accuracy").notNull(),
  errors: integer("errors").notNull(),
  durationMs: integer("duration_ms").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
