import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
export const reservations = sqliteTable("reservations", {
  id: text("id").primaryKey(),
  requestId: text("request_id").notNull().unique(),
  artworkId: text("artwork_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  message: text("message").notNull().default(""),
  status: text("status").notNull().default("inquiry_received"),
  currency: text("currency").notNull().default("NZD"),
  consentVersion: text("consent_version").notNull().default("2026-09-v1"),
  createdAt: integer("created_at").notNull(),
}, t => [index("reservations_email_created").on(t.email, t.createdAt)]);
