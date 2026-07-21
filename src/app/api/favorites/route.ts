/**
 * 收藏 API
 * GET  /api/favorites      - 获取用户收藏列表
 * POST /api/favorites      - 添加收藏
 * DELETE /api/favorites    - 删除收藏
 *
 * 使用 Supabase REST API (HTTPS)，支持沙箱环境
 */

import { NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { apiSuccess, apiError } from '@/lib/api-utils';
import {
  isSupabaseAvailable,
  supabaseEnsureUser,
  supabaseGetFavorites,
  supabaseAddFavorite,
  supabaseRemoveFavorite,
} from '@/db/supabase-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function dbNotConfigured() {
  return apiError('数据库未配置，收藏功能暂不可用。请在 Supabase 后台执行迁移 SQL。', 503);
}

// 获取收藏列表
export async function GET(request: NextRequest) {
  if (!isSupabaseAvailable()) return dbNotConfigured();

  const user = await getUserFromRequest(request);
  if (!user) return apiError('未授权', 401);

  try {
    await supabaseEnsureUser(user.id, user.displayName || '访客');
    const result = await supabaseGetFavorites(user.id);

    return apiSuccess({
      operaIds: result.filter(f => f.type === 'opera').map(f => f.item_id),
      solarTermNames: result.filter(f => f.type === 'solar_term').map(f => f.item_id),
      reportIds: result.filter(f => f.type === 'report').map(f => f.item_id),
    });
  } catch (err) {
    console.error('获取收藏失败:', err);
    return apiError('获取收藏失败', 500);
  }
}

// 添加收藏
export async function POST(request: NextRequest) {
  if (!isSupabaseAvailable()) return dbNotConfigured();

  const user = await getUserFromRequest(request);
  if (!user) return apiError('未授权', 401);

  try {
    const { type, itemId } = await request.json();

    if (!type || !itemId) {
      return apiError('type 和 itemId 为必填项', 400);
    }

    await supabaseEnsureUser(user.id, user.displayName || '访客');
    const result = await supabaseAddFavorite(user.id, type, itemId);
    return apiSuccess(result);
  } catch (err) {
    console.error('添加收藏失败:', err);
    return apiError('添加收藏失败', 500);
  }
}

// 删除收藏
export async function DELETE(request: NextRequest) {
  if (!isSupabaseAvailable()) return dbNotConfigured();

  const user = await getUserFromRequest(request);
  if (!user) return apiError('未授权', 401);

  try {
    const { type, itemId } = await request.json();

    if (!type || !itemId) {
      return apiError('type 和 itemId 为必填项', 400);
    }

    await supabaseEnsureUser(user.id, user.displayName || '访客');
    const result = await supabaseRemoveFavorite(user.id, type, itemId);
    return apiSuccess(result);
  } catch (err) {
    console.error('删除收藏失败:', err);
    return apiError('删除收藏失败', 500);
  }
}
