/**
 * 五行报告 API
 * GET  /api/reports          - 获取用户报告列表
 * POST /api/reports          - 保存报告
 * GET  /api/reports/:id      - 获取单个报告详情
 *
 * 未配置数据库时返回 503
 */

import { NextRequest } from 'next/server';
import { eq, desc } from 'drizzle-orm';
import { getDb, isDbAvailable } from '@/db';
import { reports } from '@/db/schema';
import { getUserFromRequest } from '@/lib/auth';
import { apiSuccess, apiError, dbNotConfigured } from '@/lib/api-utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 获取报告列表
export async function GET(request: NextRequest) {
  if (!isDbAvailable()) return dbNotConfigured();

  const db = getDb();
  if (!db) return dbNotConfigured();

  const user = await getUserFromRequest(request);
  if (!user) return apiError('未授权', 401);

  try {
    const result = await db
      .select()
      .from(reports)
      .where(eq(reports.userId, user.id))
      .orderBy(desc(reports.createdAt))
      .limit(50);

    return apiSuccess(result);
  } catch (err) {
    console.error('获取报告失败:', err);
    return apiError('获取报告失败', 500);
  }
}

// 保存报告
export async function POST(request: NextRequest) {
  if (!isDbAvailable()) return dbNotConfigured();

  const db = getDb();
  if (!db) return dbNotConfigured();

  const user = await getUserFromRequest(request);
  if (!user) return apiError('未授权', 401);

  try {
    const body = await request.json();
    const { birthYear, birthMonth, birthDay, birthHour, mainElement, reportData } = body;

    if (!birthYear || !mainElement || !reportData) {
      return apiError('birthYear, mainElement, reportData 为必填项', 400);
    }

    const [created] = await db
      .insert(reports)
      .values({
        userId: user.id,
        birthYear,
        birthMonth: birthMonth || null,
        birthDay: birthDay || null,
        birthHour: birthHour || null,
        mainElement,
        reportData,
      })
      .returning();

    return apiSuccess(created);
  } catch (err) {
    console.error('保存报告失败:', err);
    return apiError('保存报告失败', 500);
  }
}
