-- 蒲华堂数据库初始化脚本
-- 在 Supabase SQL Editor 中执行此文件

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========== 用户表 ==========
CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "email" varchar(255) UNIQUE,
  "display_name" varchar(100),
  "avatar_url" text,
  "birth_year" integer,
  "birth_element" varchar(2),
  "created_at" timestamp DEFAULT NOW() NOT NULL,
  "updated_at" timestamp DEFAULT NOW() NOT NULL
);

-- ========== 收藏类型枚举 ==========
DO $$ BEGIN
  CREATE TYPE "favorite_type" AS ENUM ('opera', 'solar_term', 'report');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ========== 收藏表 ==========
CREATE TABLE IF NOT EXISTS "favorites" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "type" "favorite_type" NOT NULL,
  "item_id" varchar(200) NOT NULL,
  "created_at" timestamp DEFAULT NOW() NOT NULL,
  UNIQUE("user_id", "type", "item_id")
);

-- ========== 聊天历史表 ==========
CREATE TABLE IF NOT EXISTS "chat_history" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "role" varchar(20) NOT NULL,
  "content" text NOT NULL,
  "session_id" varchar(100),
  "created_at" timestamp DEFAULT NOW() NOT NULL
);

-- ========== 五行报告表 ==========
CREATE TABLE IF NOT EXISTS "reports" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "birth_year" integer NOT NULL,
  "birth_month" integer,
  "birth_day" integer,
  "birth_hour" integer,
  "main_element" varchar(2) NOT NULL,
  "report_data" jsonb NOT NULL,
  "is_public" boolean DEFAULT false,
  "created_at" timestamp DEFAULT NOW() NOT NULL
);

-- ========== 索引 ==========
CREATE INDEX IF NOT EXISTS "idx_favorites_user_id" ON "favorites"("user_id");
CREATE INDEX IF NOT EXISTS "idx_favorites_type" ON "favorites"("type");
CREATE INDEX IF NOT EXISTS "idx_chat_history_user_id" ON "chat_history"("user_id");
CREATE INDEX IF NOT EXISTS "idx_chat_history_session" ON "chat_history"("session_id");
CREATE INDEX IF NOT EXISTS "idx_reports_user_id" ON "reports"("user_id");
CREATE INDEX IF NOT EXISTS "idx_reports_element" ON "reports"("main_element");

-- ========== 更新时间触发器 ==========
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS "users_updated_at" ON "users";
CREATE TRIGGER "users_updated_at" BEFORE UPDATE ON "users"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 完成
SELECT '蒲华堂数据库初始化完成' as status;
