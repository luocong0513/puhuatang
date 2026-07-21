'use client';

import React from 'react';
import { SearchIcon } from '@/components/icons';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[var(--background)]/90 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="mx-auto max-w-lg flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          <img
            src="/logo-puhuatang.png"
            alt="蒲华堂"
            className="logo-puhuatang animate-seal-pulse"
          />
          <div className="vertical-text text-[10px] text-[var(--muted-foreground)] leading-tight tracking-widest">
            五行康养·戏曲疗愈
          </div>
        </div>
        <button
          className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
          aria-label="搜索"
        >
          <SearchIcon size={22} />
        </button>
      </div>
    </header>
  );
}
