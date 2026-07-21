'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [operaIds, setOperaIds] = useState<string[]>([]);
  const [solarTermNames, setSolarTermNames] = useState<string[]>([]);
  const [reportIds, setReportIds] = useState<string[]>([]);

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
