'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

const STORAGE_KEY = 'puhuatang_favorites';

interface FavoritesState {
  operaIds: string[];
  solarTermNames: string[];
  reportIds: string[];
}

interface FavoritesContextType extends FavoritesState {
  toggleOpera: (id: string) => void;
  toggleSolarTerm: (name: string) => void;
  toggleReport: (id: string) => void;
  isOperaFav: (id: string) => boolean;
  isSolarTermFav: (name: string) => boolean;
  isReportFav: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

// 从 localStorage 加载收藏数据（SSR 安全）
function loadFavorites(): FavoritesState {
  if (typeof window === 'undefined') {
    return { operaIds: [], solarTermNames: [], reportIds: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        operaIds: Array.isArray(parsed.operaIds) ? parsed.operaIds : [],
        solarTermNames: Array.isArray(parsed.solarTermNames) ? parsed.solarTermNames : [],
        reportIds: Array.isArray(parsed.reportIds) ? parsed.reportIds : [],
      };
    }
  } catch (e) {
    console.error('加载收藏数据失败:', e);
  }
  return { operaIds: [], solarTermNames: [], reportIds: [] };
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  // 初始化时从 localStorage 读取
  const [operaIds, setOperaIds] = useState<string[]>([]);
  const [solarTermNames, setSolarTermNames] = useState<string[]>([]);
  const [reportIds, setReportIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // 客户端挂载后从 localStorage 加载
  useEffect(() => {
    const saved = loadFavorites();
    setOperaIds(saved.operaIds);
    setSolarTermNames(saved.solarTermNames);
    setReportIds(saved.reportIds);
    setLoaded(true);
  }, []);

  // 收藏变化时自动保存到 localStorage
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ operaIds, solarTermNames, reportIds }));
    } catch (e) {
      console.error('保存收藏数据失败:', e);
    }
  }, [operaIds, solarTermNames, reportIds, loaded]);

  const toggleOpera = useCallback((id: string) => {
    setOperaIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const toggleSolarTerm = useCallback((name: string) => {
    setSolarTermNames(prev => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]);
  }, []);

  const toggleReport = useCallback((id: string) => {
    setReportIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const isOperaFav = useCallback((id: string) => operaIds.includes(id), [operaIds]);
  const isSolarTermFav = useCallback((name: string) => solarTermNames.includes(name), [solarTermNames]);
  const isReportFav = useCallback((id: string) => reportIds.includes(id), [reportIds]);

  return (
    <FavoritesContext.Provider value={{
      operaIds, solarTermNames, reportIds,
      toggleOpera, toggleSolarTerm, toggleReport,
      isOperaFav, isSolarTermFav, isReportFav,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
