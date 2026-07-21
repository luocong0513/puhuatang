/**
 * 健康检查 API
 * GET /api/health - 检查服务状态、数据库连接、AI 配置
 */

import { NextRequest } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase';
import { isSupabaseAvailable } from '@/db/supabase-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  const supabaseConfigured = isSupabaseConfigured();
  const supabaseAvailable = isSupabaseAvailable();
  const hasLlmKey = !!process.env.OPENAI_API_KEY;

  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: {
        configured: supabaseConfigured,
        connected: supabaseAvailable,
        provider: 'supabase-rest',
      },
      supabase: {
        configured: supabaseConfigured,
      },
      llm: {
        configured: hasLlmKey,
        provider: 'volcengine-doubao',
      },
    },
    version: '0.1.0',
  });
}
