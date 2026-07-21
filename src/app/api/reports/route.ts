/**
 * 五行报告 API
 * GET  /api/reports          - 获取用户报告列表
 * POST /api/reports          - 保存报告
 *
 * 使用 Supabase REST API (HTTPS)
 */

import { NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-utils';
import {
  isSupabaseAvailable,
  supabaseEnsureUser,
  supabaseGetReports,
  supabaseSaveReport,
} from '@/db/supabase-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function dbNotConfigured() {
  return apiError('数据库未配置，报告功能暂不可用。请在 Supabase 后台执行迁移 SQL。', 503);
}

// 获取报告列表
export async function GET(request: NextRequest) {
  if (!isSupabaseAvailable()) return dbNotConfigured();

  const user = await getUserFromRequest(request);
  if (!user) return apiError('未授权', 401);

  try {
    await supabaseEnsureUser(user.id, user.displayName || '访客');
    const result = await supabaseGetReports(user.id);
    return apiSuccess(result);
  } catch (err) {
    console.error('获取报告失败:', err);
    return apiError('获取报告失败', 500);
  }
}

// 保存报告
export async function POST(request: NextRequest) {
  if (!isSupabaseAvailable()) return dbNotConfigured();

  const user = await getUserFromRequest(request);
  if (!user) return apiError('未授权', 401);

  try {
    const body = await request.json();
    const { birthYear, birthMonth, birthDay, birthHour, mainElement, reportData } = body;

    if (!birthYear || !mainElement || !reportData) {
      return apiError('birthYear, mainElement, reportData 为必填项', 400);
    }

    await supabaseEnsureUser(user.id, user.displayName || '访客');
    const created = await supabaseSaveReport(user.id, {
      birthYear,
      birthMonth,
      birthDay,
      birthHour,
      mainElement,
      reportData,
    });

    return apiSuccess(created);
  } catch (err) {
    console.error('保存报告失败:', err);
    return apiError('保存报告失败', 500);
  }
}
