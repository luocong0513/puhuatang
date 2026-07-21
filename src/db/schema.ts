/**
 * 蒲华堂 - 数据库 Schema
 * 使用 Drizzle ORM + PostgreSQL (Supabase)
 */

import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
  boolean,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core';

// ========== Enums ==========

export const favoriteTypeEnum = pgEnum('favorite_type', [
  'opera',
  'solar_term',
  'report',
]);

// ========== Tables ==========

/**
 * 用户表 - 对应 Supabase Auth 用户
 * 在 Supabase 中 auth.users 是内置的，这里建一个 public.users 做关联
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique(),
  displayName: varchar('display_name', { length: 100 }),
  avatarUrl: text('avatar_url'),
  // 用户五行偏好（基于出生年推算）
  birthYear: integer('birth_year'),
  birthElement: varchar('birth_element', { length: 2 }), // 木火土金水
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * 收藏表 - 戏曲/节气/报告收藏
 */
export const favorites = pgTable('favorites', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: favoriteTypeEnum('type').notNull(),
  itemId: varchar('item_id', { length: 200 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * 聊天历史表 - 蒲生 AI 对话记录
 */
export const chatHistory = pgTable('chat_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 20 }).notNull(), // 'user' | 'assistant' | 'system'
  content: text('content').notNull(),
  sessionId: varchar('session_id', { length: 100 }), // 会话分组
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * 五行报告表 - 用户生成的五行分析报告
 */
export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  birthYear: integer('birth_year').notNull(),
  birthMonth: integer('birth_month'),
  birthDay: integer('birth_day'),
  birthHour: integer('birth_hour'), // 0-23
  mainElement: varchar('main_element', { length: 2 }).notNull(),
  // 完整报告 JSON（对应 FiveElementsReport 接口）
  reportData: jsonb('report_data').notNull(),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ========== Relations ==========

import { relations } from 'drizzle-orm';

export const usersRelations = relations(users, ({ many }) => ({
  favorites: many(favorites),
  chatHistory: many(chatHistory),
  reports: many(reports),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
}));

export const chatHistoryRelations = relations(chatHistory, ({ one }) => ({
  user: one(users, {
    fields: [chatHistory.userId],
    references: [users.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
}));

// ========== Types ==========

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Favorite = typeof favorites.$inferSelect;
export type NewFavorite = typeof favorites.$inferInsert;
export type ChatMessage = typeof chatHistory.$inferSelect;
export type NewChatMessage = typeof chatHistory.$inferInsert;
export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
