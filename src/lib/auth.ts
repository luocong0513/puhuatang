/**
 * 用户认证工具（服务端）
 * 基于 Supabase Auth，支持邮箱/密码登录和匿名用户
 */

import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { getServerSupabase, isSupabaseConfigured } from './supabase';

export interface AuthUser {
  id: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
}

/**
 * 将任意字符串哈希为 UUID v5 兼容格式
 */
function stringToUUID(str: string): string {
  const hash = crypto.createHash('sha256').update(str).digest('hex');
  return `${hash.slice(0,8)}-${hash.slice(8,12)}-${hash.slice(12,16)}-${hash.slice(16,20)}-${hash.slice(20,32)}`;
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
 * 获取匿名用户（基于 X-Anonymous-ID 头，转为 UUID 格式）
 */
function getAnonymousUser(request: NextRequest): AuthUser {
  const rawId =
    request.headers.get('x-anonymous-id') ||
    request.headers.get('x-client-id') ||
    `anon-${request.headers.get('x-forwarded-for') || 'local'}`;

  return {
    id: stringToUUID(rawId),
    displayName: '访客',
  };
}

/**
 * 创建匿名用户 ID（首次访问时生成）
 */
export function generateAnonymousId(): string {
  return `anon-${crypto.randomUUID()}`;
}
