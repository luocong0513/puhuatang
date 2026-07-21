/**
 * 收藏 API
 * GET  /api/favorites      - 获取用户收藏列表
 * POST /api/favorites      - 添加收藏
 * DELETE /api/favorites    - 删除收藏
 *
 * 未配置数据库时返回 503，前端 fallback 到 localStorage
 */

import { NextRequest } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { getDb, isDbAvailable } from '@/db';
import { favorites } from '@/db/schema';
import { getUserFromRequest } from '@/lib/auth';
import { apiSuccess, apiError, dbNotConfigured } from '@/lib/api-utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 获取收藏列表
export async function GET(request: NextRequest) {
  if (!isDbAvailable()) return dbNotConfigured();

  const db = getDb();
  if (!db) return dbNotConfigured();

  const user = await getUserFromRequest(request);
  if (!user) return apiError('未授权', 401);

  try {
    const result = await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, user.id));

    return apiSuccess({
      operaIds: result.filter(f => f.type === 'opera').map(f => f.itemId),
      solarTermNames: result.filter(f => f.type === 'solar_term').map(f => f.itemId),
      reportIds: result.filter(f => f.type === 'report').map(f => f.itemId),
    });
  } catch (err) {
    console.error('获取收藏失败:', err);
    return apiError('获取收藏失败', 500);
  }
}

// 添加收藏
export async function POST(request: NextRequest) {
  if (!isDbAvailable()) return dbNotConfigured();

  const db = getDb();
  if (!db) return dbNotConfigured();

  const user = await getUserFromRequest(request);
  if (!user) return apiError('未授权', 401);

  try {
    const { type, itemId } = await request.json();

    if (!type || !itemId) {
      return apiError('type 和 itemId 为必填项', 400);
    }

    // 检查是否已存在
    const existing = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, user.id),
          eq(favorites.type, type),
          eq(favorites.itemId, itemId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return apiSuccess({ alreadyFavorited: true });
    }

    const [created] = await db
      .insert(favorites)
      .values({
        userId: user.id,
        type,
        itemId,
      })
      .returning();

    return apiSuccess(created);
  } catch (err) {
    console.error('添加收藏失败:', err);
    return apiError('添加收藏失败', 500);
  }
}

// 删除收藏
export async function DELETE(request: NextRequest) {
  if (!isDbAvailable()) return dbNotConfigured();

  const db = getDb();
  if (!db) return dbNotConfigured();

  const user = await getUserFromRequest(request);
  if (!user) return apiError('未授权', 401);

  try {
    const { type, itemId } = await request.json();

    if (!type || !itemId) {
      return apiError('type 和 itemId 为必填项', 400);
    }

    await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, user.id),
          eq(favorites.type, type),
          eq(favorites.itemId, itemId)
        )
      );

    return apiSuccess({ removed: true });
  } catch (err) {
    console.error('删除收藏失败:', err);
    return apiError('删除收藏失败', 500);
  }
}
