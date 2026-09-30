import { relations } from "drizzle-orm";
import { accounts, sessions, users } from "./auth";
import { levels } from "./levels";
import { exercises } from "./exercises";
import { attempts } from "./attempts";
import { keyStats } from "./key-stats";
import { userProgress } from "./user-progress";
import { subscriptions } from "./subscriptions";

export const usersRelations = relations(users, ({ many, one }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  attempts: many(attempts),
  keyStats: many(keyStats),
  progress: many(userProgress),
  subscription: one(subscriptions, {
    fields: [users.id],
    references: [subscriptions.userId],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const levelsRelations = relations(levels, ({ many }) => ({
  exercises: many(exercises),
}));

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  level: one(levels, {
    fields: [exercises.levelId],
    references: [levels.id],
  }),
  attempts: many(attempts),
  progress: many(userProgress),
}));

export const attemptsRelations = relations(attempts, ({ one }) => ({
  user: one(users, {
    fields: [attempts.userId],
    references: [users.id],
  }),
  exercise: one(exercises, {
    fields: [attempts.exerciseId],
    references: [exercises.id],
  }),
}));

export const keyStatsRelations = relations(keyStats, ({ one }) => ({
  user: one(users, {
    fields: [keyStats.userId],
    references: [users.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  exercise: one(exercises, {
    fields: [userProgress.exerciseId],
    references: [exercises.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));
