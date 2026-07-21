'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, BaGuaIcon, FlowerIcon, MaskIcon, PersonIcon } from '@/components/icons';

const tabs = [
  { href: '/', label: '首页', Icon: HomeIcon },
  { href: '/report', label: '八字', Icon: BaGuaIcon },
  { href: '/solar', label: '节气', Icon: FlowerIcon },
  { href: '/opera', label: '戏曲', Icon: MaskIcon },
  { href: '/profile', label: '我的', Icon: PersonIcon },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--background)] border-t border-[var(--border)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="mx-auto max-w-lg flex items-center justify-around h-16">
        {tabs.map(({ href, label, Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[44px] min-h-[44px] transition-colors duration-200 ${
                isActive ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'
              }`}
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium font-[family-name:var(--font-serif)]">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
