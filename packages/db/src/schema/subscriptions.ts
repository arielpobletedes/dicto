import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  plan: text("plan").default("free").notNull(), // free, pro_monthly, pro_yearly, lifetime
  status: text("status").default("active").notNull(), // active, canceled, past_due, trialing, inactive
  provider: text("provider"), // stripe, lemonsqueezy, mercadopago, manual
  providerCustomerId: text("provider_customer_id"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
