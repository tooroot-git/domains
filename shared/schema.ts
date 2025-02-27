import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  message: text("message").notNull(),
  type: text("type", { enum: ["user", "assistant"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rateLimits = pgTable("rate_limits", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  messageCount: integer("message_count").notNull().default(0),
  lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  sessionId: true,
  message: true,
  type: true,
});

export const insertRateLimitSchema = createInsertSchema(rateLimits).pick({
  sessionId: true,
  messageCount: true,
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type RateLimit = typeof rateLimits.$inferSelect;
