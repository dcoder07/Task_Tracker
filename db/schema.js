import { pgTable, serial, text, pgEnum, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const priorityEnum = pgEnum("priority", ["high", "medium", "low"]);
export const statusEnum = pgEnum("status", ["backlog", "in_progress", "in_review", "done"]);
export const roleEnum = pgEnum("role", ["admin", "manager", "developer", "viewer"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  clerk_id: text("clerk_id").unique(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash"),
  first_name: text("first_name"),
  last_name: text("last_name"),
  avatar_url: text("avatar_url"),
  role: roleEnum("role").notNull().default("viewer"),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const ticketsTable = pgTable("tickets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  priority: priorityEnum("priority").notNull().default("low"),
  status: statusEnum("status").notNull().default("backlog"),
  due_date: timestamp("due_date").notNull(),
  user_email: text("user_email").notNull(), // assignee
  reported_by: text("reported_by").notNull(), // reporter email
  reporter_id: integer("reporter_id").references(() => usersTable.id),
  assignee_id: integer("assignee_id").references(() => usersTable.id),
  imgSrc: text("imgSrc").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const commentsTable = pgTable("comments", {
  id: serial("id").primaryKey(),
  ticket_id: serial("ticket_id").notNull(),
  author: text("author").notNull(),
  author_id: integer("author_id").references(() => usersTable.id),
  content: text("content").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const permissionsTable = pgTable("permissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const rolePermissionsTable = pgTable("role_permissions", {
  id: serial("id").primaryKey(),
  role: roleEnum("role").notNull(),
  permission_id: integer("permission_id").references(() => permissionsTable.id),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const sessionsTable = pgTable("sessions", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(),
  user_id: integer("user_id").references(() => usersTable.id).notNull(),
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// export type InsertUser = typeof ticketsTable.$inferInsert;
