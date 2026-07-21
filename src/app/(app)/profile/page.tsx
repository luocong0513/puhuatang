'use client';

import React from 'react';
import { useFavorites } from '@/components/favorites-context';
import { BookmarkIcon, MaskIcon, FlowerIcon, BaGuaIcon } from '@/components/icons';
import { operaPieces } from '@/lib/opera-data';
import { solarTerms } from '@/lib/solar-terms';
import Link from 'next/link';

export default function ProfilePage() {
  const { operaIds, solarTermNames, reportIds } = useFavorites();

  const favOperas = operaPieces.filter(p => operaIds.includes(p.id));
  const favTerms = solarTerms.filter(t => solarTermNames.includes(t.name));

  return (
    <div className="px-4 py-4">
      <h1 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>我的</h1>

      {/* 用户卡片 */}
      <div className="xuan-card p-5 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--background)] text-xl font-bold" style={{ fontFamily: 'var(--font-serif)' }}>
            生
          </div>
          <div>
            <h2 className="text-base font-bold" style={{ fontFamily: 'var(--font-serif)' }}>蒲生访客</h2>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">五行康养 · 戏曲疗愈</p>
          </div>
        </div>
      </div>

      {/* 收藏的八字报告 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <BaGuaIcon size={18} className="text-[var(--primary)]" />
          <h3 className="text-sm font-bold" style={{ fontFamily: 'var(--font-serif)' }}>收藏的报告</h3>
          <span className="text-xs text-[var(--muted-foreground)]">({reportIds.length})</span>
        </div>
        {reportIds.length === 0 ? (
          <div className="xuan-card p-4 text-center">
            <p className="text-xs text-[var(--muted-foreground)]" style={{ fontFamily: 'var(--font-serif)' }}>
              暂无收藏的报告，前往首页探己
            </p>
            <Link href="/" className="xuan-btn mt-3 text-xs inline-block">去探己</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {reportIds.map(id => {
              const element = id.replace('report-', '');
              return (
                <Link key={id} href={`/report?year=1990`} className="xuan-card p-3 flex items-center gap-3 block">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-[var(--background)]"
                    style={{
                      fontFamily: 'var(--font-serif)',
                      backgroundColor: element === '木' ? '#4A6B3A' : element === '火' ? '#C0392B' : element === '土' ? '#D4A574' : element === '金' ? '#8B7E6A' : '#4A6670',
                    }}
                  >
                    {element}
                  </span>
                  <span className="text-sm" style={{ fontFamily: 'var(--font-serif)' }}>{element}行体质报告</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="xuan-divider">·我的·收藏·</div>

      {/* 戏曲歌单 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <MaskIcon size={18} className="text-[var(--primary)]" />
          <h3 className="text-sm font-bold" style={{ fontFamily: 'var(--font-serif)' }}>我的歌单</h3>
          <span className="text-xs text-[var(--muted-foreground)]">({favOperas.length})</span>
        </div>
        {favOperas.length === 0 ? (
          <div className="xuan-card p-4 text-center">
            <p className="text-xs text-[var(--muted-foreground)]" style={{ fontFamily: 'var(--font-serif)' }}>
              暂无收藏的唱段，前往戏曲馆试听
            </p>
            <Link href="/opera" className="xuan-btn mt-3 text-xs inline-block">去听戏</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {favOperas.map(opera => (
              <Link key={opera.id} href="/opera" className="xuan-card p-3 flex items-center gap-3 block">
                <BookmarkIcon size={16} filled className="text-[var(--primary)]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ fontFamily: 'var(--font-serif)' }}>{opera.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{opera.wuxingName} · {opera.banShi}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 节气提醒 */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <FlowerIcon size={18} className="text-[var(--bamboo)]" />
          <h3 className="text-sm font-bold" style={{ fontFamily: 'var(--font-serif)' }}>节气提醒</h3>
          <span className="text-xs text-[var(--muted-foreground)]">({favTerms.length})</span>
        </div>
        {favTerms.length === 0 ? (
          <div className="xuan-card p-4 text-center">
            <p className="text-xs text-[var(--muted-foreground)]" style={{ fontFamily: 'var(--font-serif)' }}>
              暂无收藏的节气，前往节气馆收藏
            </p>
            <Link href="/solar" className="xuan-btn mt-3 text-xs inline-block">去收藏</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {favTerms.map(term => (
              <Link key={term.name} href="/solar" className="xuan-card p-3 flex items-center gap-3 block">
                <BookmarkIcon size={16} filled className="text-[var(--bamboo)]" />
                <div className="flex-1">
                  <p className="text-sm" style={{ fontFamily: 'var(--font-serif)' }}>{term.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{term.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 版本信息 */}
      <div className="text-center py-6 text-xs text-[var(--muted-foreground)]" style={{ fontFamily: 'var(--font-serif)' }}>
        蒲华堂 v2.0 · 五行康养·戏曲疗愈
      </div>
    </div>
  );
}
