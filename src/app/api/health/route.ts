/**
 * 健康检查 API
 * GET /api/health - 检查服务状态、数据库连接、AI 配置
 */

import { NextRequest } from 'next/server';
import { isDbAvailable, checkDbHealth } from '@/db';
import { isSupabaseConfigured } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  const dbConfigured = isDbAvailable();
  const supabaseConfigured = isSupabaseConfigured();
  const hasLlmKey = !!(
    process.env.OPENAI_API_KEY ||
    process.env.COZE_WORKLOAD_API_TOKEN ||
    process.env.COZE_API_TOKEN
  );

  let dbStatus: { available: boolean; error?: string } = {
    available: false,
    error: 'not configured',
  };

  if (dbConfigured) {
    dbStatus = await checkDbHealth();
  }

  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: {
        configured: dbConfigured,
        connected: dbStatus.available,
        error: dbStatus.error,
      },
      supabase: {
        configured: supabaseConfigured,
      },
      llm: {
        configured: hasLlmKey,
        provider: 'coze-coding-dev-sdk',
      },
    },
    version: '0.1.0',
  });
}
