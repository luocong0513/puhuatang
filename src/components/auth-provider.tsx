/**
 * 认证上下文 Provider（客户端）
 * 
 * 两种模式：
 * 1. Supabase 已配置：使用真实用户认证
 * 2. Supabase 未配置：匿名模式，使用 localStorage 的 UUID
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface AuthUser {
  id: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ANON_ID_KEY = 'puhuatang_anon_id';

function getOrCreateAnonId(): string {
  if (typeof window === 'undefined') return 'anon-ssr';
  let id = localStorage.getItem(ANON_ID_KEY);
  if (!id) {
    id = `anon-${crypto.randomUUID()}`;
    localStorage.setItem(ANON_ID_KEY, id);
  }
  return id;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseReady, setSupabaseReady] = useState(false);
  const [supabaseClient, setSupabaseClient] = useState<any>(null);

  // 初始化 Supabase 客户端（如果配置了）
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      import('@supabase/supabase-js').then(({ createClient }) => {
        const client = createClient(supabaseUrl, supabaseKey);
        setSupabaseClient(client);
        setSupabaseReady(true);

        // 检查当前会话
        client.auth.getSession().then(({ data: { session } }: any) => {
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0],
              avatarUrl: session.user.user_metadata?.avatar_url,
              isAuthenticated: true,
            });
          }
          setLoading(false);
        });

        // 监听认证状态变化
        client.auth.onAuthStateChange((_event: string, session: any) => {
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0],
              avatarUrl: session.user.user_metadata?.avatar_url,
              isAuthenticated: true,
            });
          } else {
            setUser(null);
          }
        });
      });
    } else {
      // 匿名模式
      const anonId = getOrCreateAnonId();
      setUser({
        id: anonId,
        displayName: '访客',
        isAuthenticated: false,
      });
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabaseReady || !supabaseClient) {
      return { error: '认证服务未配置' };
    }
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    return { error: error?.message };
  }, [supabaseReady, supabaseClient]);

  const signUp = useCallback(async (email: string, password: string) => {
    if (!supabaseReady || !supabaseClient) {
      return { error: '认证服务未配置' };
    }
    const { error } = await supabaseClient.auth.signUp({ email, password });
    return { error: error?.message };
  }, [supabaseReady, supabaseClient]);

  const signOut = useCallback(async () => {
    if (supabaseReady && supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    setUser({
      id: getOrCreateAnonId(),
      displayName: '访客',
      isAuthenticated: false,
    });
  }, [supabaseReady, supabaseClient]);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
