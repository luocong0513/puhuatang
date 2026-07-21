/**
 * Drizzle Kit 配置
 * 用于数据库迁移生成和管理
 * 运行: npx drizzle-kit generate 生成迁移文件
 * 运行: npx drizzle-kit migrate 执行迁移
 */

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || '',
  },
  verbose: true,
  strict: true,
});
