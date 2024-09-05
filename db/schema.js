import { pgTable, serial, text, pgEnum, timestamp } from "drizzle-orm/pg-core";

export const priorityEnum = pgEnum("priority", ["high", "medium", "low"]);

export const ticketsTable = pgTable("tickets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  priority: priorityEnum("priority").notNull(),
  due_date: timestamp("due_date").notNull(),
  user_email: text("user_email").notNull(),
  imgSrc: text("imgSrc").notNull(),
});

// export type InsertUser = typeof ticketsTable.$inferInsert;
