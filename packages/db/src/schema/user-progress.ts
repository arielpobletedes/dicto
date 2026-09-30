import { boolean, pgTable, real, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { exercises } from "./exercises";

export const userProgress = pgTable(
  "user_progress",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
    completed: boolean("completed").default(false).notNull(),
    bestWpm: real("best_wpm").default(0).notNull(),
    bestAccuracy: real("best_accuracy").default(0).notNull(),
    completedAt: timestamp("completed_at"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("user_exercise_idx").on(table.userId, table.exerciseId)],
);
