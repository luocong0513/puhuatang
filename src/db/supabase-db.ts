/**
 * Supabase REST API 数据访问层
 * 当直接 PostgreSQL 连接不可用时，使用 Supabase 客户端（HTTPS REST API）
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

/**
 * 获取服务端 Supabase 客户端
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  supabaseClient = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return supabaseClient;
}

/**
 * 检查 Supabase REST API 是否可用
 */
export function isSupabaseAvailable(): boolean {
  return !!(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// ========== 类型定义 ==========

export interface FavoriteRow {
  id: string;
  user_id: string;
  type: 'opera' | 'solar_term' | 'report';
  item_id: string;
  created_at: string;
}

export interface ReportRow {
  id: string;
  user_id: string;
  birth_year: number;
  birth_month: number | null;
  birth_day: number | null;
  birth_hour: number | null;
  main_element: string;
  report_data: Record<string, unknown>;
  is_public: boolean;
  created_at: string;
}

export interface ChatMessageRow {
  id: string;
  user_id: string;
  role: string;
  content: string;
  session_id: string | null;
  created_at: string;
}

// ========== 用户操作 ==========

/**
 * 确保用户记录存在（匿名或认证用户首次操作时自动创建）
 */
export async function supabaseEnsureUser(userId: string, displayName?: string) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');

  // 检查是否已存在
  const { data: existing } = await client
    .from('users')
    .select('id')
    .eq('id', userId)
    .limit(1);

  if (existing && existing.length > 0) return;

  // 创建用户记录
  const { error } = await client
    .from('users')
    .insert({
      id: userId,
      display_name: displayName || '访客',
    });

  if (error) throw error;
}

// ========== 收藏操作 ==========

export async function supabaseGetFavorites(userId: string) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');

  const { data, error } = await client
    .from('favorites')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return (data || []) as FavoriteRow[];
}

export async function supabaseAddFavorite(
  userId: string,
  type: 'opera' | 'solar_term' | 'report',
  itemId: string
) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');

  // Check if already exists
  const { data: existing } = await client
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('type', type)
    .eq('item_id', itemId)
    .limit(1);

  if (existing && existing.length > 0) {
    return { alreadyFavorited: true };
  }

  const { data, error } = await client
    .from('favorites')
    .insert({ user_id: userId, type, item_id: itemId })
    .select()
    .single();

  if (error) throw error;
  return data as FavoriteRow;
}

export async function supabaseRemoveFavorite(
  userId: string,
  type: string,
  itemId: string
) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');

  const { error } = await client
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('type', type)
    .eq('item_id', itemId);

  if (error) throw error;
  return { removed: true };
}

// ========== 聊天历史操作 ==========

export async function supabaseSaveChatMessage(
  userId: string,
  role: string,
  content: string,
  sessionId?: string
) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');

  const { error } = await client
    .from('chat_history')
    .insert({
      user_id: userId,
      role,
      content,
      session_id: sessionId || null,
    });

  if (error) throw error;
}

export async function supabaseGetChatHistory(userId: string, sessionId?: string) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');

  let query = client
    .from('chat_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (sessionId) {
    query = query.eq('session_id', sessionId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as ChatMessageRow[];
}

// ========== 报告操作 ==========

export async function supabaseSaveReport(
  userId: string,
  report: {
    birthYear: number;
    birthMonth?: number;
    birthDay?: number;
    birthHour?: number;
    mainElement: string;
    reportData: Record<string, unknown>;
    isPublic?: boolean;
  }
) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');

  const { data, error } = await client
    .from('reports')
    .insert({
      user_id: userId,
      birth_year: report.birthYear,
      birth_month: report.birthMonth || null,
      birth_day: report.birthDay || null,
      birth_hour: report.birthHour || null,
      main_element: report.mainElement,
      report_data: report.reportData,
      is_public: report.isPublic || false,
    })
    .select()
    .single();

  if (error) throw error;
  return data as ReportRow;
}

export async function supabaseGetReports(userId: string) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');

  const { data, error } = await client
    .from('reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as ReportRow[];
}
