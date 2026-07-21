/**
 * 用户认证工具（服务端）
 * 基于 Supabase Auth，支持邮箱/密码登录和匿名用户
 */

import { NextRequest } from 'next/server';
import { getServerSupabase, isSupabaseConfigured } from './supabase';

export interface AuthUser {
  id: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
}

/**
 * 从请求中提取用户信息
 * 支持 Supabase JWT 和匿名用户两种模式
 */
export async function getUserFromRequest(
  request: NextRequest
): Promise<AuthUser | null> {
  // 如果 Supabase 未配置，返回匿名用户
  if (!isSupabaseConfigured()) {
    return getAnonymousUser(request);
  }

  const supabase = getServerSupabase();
  if (!supabase) return null;

  // 从请求头提取 access token
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return getAnonymousUser(request);
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return null;

    return {
      id: data.user.id,
      email: data.user.email,
      displayName:
        (data.user.user_metadata?.display_name as string) ||
        data.user.email?.split('@')[0],
      avatarUrl: data.user.user_metadata?.avatar_url as string,
    };
  } catch {
    return null;
  }
}

/**
 * 获取匿名用户 ID（基于 IP + User-Agent 的简单指纹）
 * 匿名模式下用 localStorage 里的 UUID 作为用户标识
 */
function getAnonymousUser(request: NextRequest): AuthUser {
  const anonymousId =
    request.headers.get('x-anonymous-id') ||
    request.headers.get('x-client-id') ||
    `anon-${request.headers.get('x-forwarded-for') || 'local'}`;

  return {
    id: anonymousId,
    displayName: '访客',
  };
}

/**
 * 创建匿名用户 ID（首次访问时生成）
 */
export function generateAnonymousId(): string {
  return `anon-${crypto.randomUUID()}`;
}
