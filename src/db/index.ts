/**
 * 数据库连接工具
 * 在没有配置 DATABASE_URL 时返回 null，应用优雅降级
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

let dbInstance: ReturnType<typeof drizzle> | null = null;
let poolInstance: Pool | null = null;

/**
 * 获取数据库连接池
 * 如果未配置 DATABASE_URL，返回 null
 */
export function getPool(): Pool | null {
  if (poolInstance) return poolInstance;

  const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!databaseUrl) return null;

  poolInstance = new Pool({
    connectionString: databaseUrl,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  return poolInstance;
}

/**
 * 获取 Drizzle ORM 实例
 * 如果未配置数据库，返回 null
 */
export function getDb() {
  if (dbInstance) return dbInstance;

  const pool = getPool();
  if (!pool) return null;

  dbInstance = drizzle(pool, { schema });
  return dbInstance;
}

/**
 * 检查数据库是否可用
 */
export function isDbAvailable(): boolean {
  return !!(process.env.DATABASE_URL || process.env.SUPABASE_DB_URL);
}

/**
 * 获取数据库健康状态
 */
export async function checkDbHealth(): Promise<{
  available: boolean;
  error?: string;
}> {
  const pool = getPool();
  if (!pool) {
    return { available: false, error: 'DATABASE_URL not configured' };
  }
  try {
    const client = await pool.connect();
    client.release();
    return { available: true };
  } catch (err) {
    return {
      available: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
