import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { levels } from "./levels";

export const exercises = pgTable("exercises", {
  id: text("id").primaryKey(),
  levelId: text("level_id")
    .notNull()
    .references(() => levels.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content").notNull(),
  language: text("language").default("typescript").notNull(), // text, javascript, typescript, python, sql, bash
  difficulty: text("difficulty").default("beginner").notNull(), // beginner, intermediate, advanced
  tier: text("tier").default("free").notNull(), // "free" | "premium"
  order: integer("order").default(0).notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
