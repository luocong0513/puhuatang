'use client';

import React from 'react';
import Header from '@/components/layout/header';
import TabBar from '@/components/layout/tab-bar';
import { FavoritesProvider } from '@/components/favorites-context';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <FavoritesProvider>
      <div className="mx-auto max-w-lg min-h-screen">
        <Header />
        <main className="pb-tab-bar">
          {children}
        </main>
        <TabBar />
      </div>
    </FavoritesProvider>
  );
}
