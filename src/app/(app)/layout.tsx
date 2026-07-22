'use client';

import React from 'react';
import Header from '@/components/layout/header';
import TabBar from '@/components/layout/tab-bar';
import { FavoritesProvider } from '@/components/favorites-context';
import { AuthProvider } from '@/components/auth-provider';
import { AudioPlayerProvider } from '@/components/audio-player';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <AudioPlayerProvider>
        <div className="mx-auto max-w-lg min-h-screen">
          <Header />
          <main className="pb-tab-bar">
            {children}
          </main>
          <TabBar />
        </div>
        </AudioPlayerProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}
