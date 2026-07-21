'use client';

import React, { useState, useEffect } from 'react';
import { solarTerms, getCurrentSolarTerm, getNextSolarTerm, daysUntilNextTerm, type SolarTerm } from '@/lib/solar-terms';
import { BookmarkIcon, ClockIcon, FlowerIcon } from '@/components/icons';
import { useFavorites } from '@/components/favorites-context';

// 节气详情展开
function SolarTermDetail({ term }: { term: SolarTerm }) {
  const { toggleSolarTerm, isSolarTermFav } = useFavorites();

  return (
    <div className="xuan-card p-5 animate-ink-fade">
      {/* 节气意象图 */}
      <div className="w-full h-[200px] rounded-2xl overflow-hidden mb-4">
        <img
          src={term.imageUrl}
          alt={term.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 标题 */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-serif)' }}>{term.name}</h3>
        <button
          onClick={() => toggleSolarTerm(term.name)}
          className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <BookmarkIcon size={20} filled={isSolarTermFav(term.name)} className={isSolarTermFav(term.name) ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'} />
        </button>
      </div>
      <p className="text-sm text-[var(--muted-foreground)] mb-4">{term.desc}</p>

      {/* 三候 */}
      <div className="mb-4">
        <h4 className="text-xs text-[var(--primary)] font-medium mb-2" style={{ fontFamily: 'var(--font-serif)' }}>三候</h4>
        <div className="space-y-1">
          {term.threeHou.map((hou, i) => (
            <p key={i} className="text-sm" style={{ fontFamily: 'var(--font-serif)' }}>
              <span className="text-[var(--muted-foreground)]">{['初候', '二候', '三候'][i]}：</span>
              {hou}
            </p>
          ))}
        </div>
      </div>

      {/* 气候特点 */}
      <div className="mb-4">
        <h4 className="text-xs text-[var(--bamboo)] font-medium mb-1" style={{ fontFamily: 'var(--font-serif)' }}>气候特点</h4>
        <p className="text-sm">{term.climate}</p>
      </div>

      {/* 养生重点 */}
      <div className="mb-4">
        <h4 className="text-xs text-[var(--primary)] font-medium mb-1" style={{ fontFamily: 'var(--font-serif)' }}>养生重点</h4>
        <p className="text-sm">{term.health}</p>
      </div>

      {/* 推荐食材 */}
      <div className="mb-4">
        <h4 className="text-xs text-[var(--bamboo)] font-medium mb-2" style={{ fontFamily: 'var(--font-serif)' }}>推荐食材</h4>
        <div className="flex flex-wrap gap-2">
          {term.foods.map((food) => (
            <span key={food} className="px-3 py-1 rounded-full text-xs bg-[var(--background)] border border-[var(--border)]" style={{ fontFamily: 'var(--font-serif)' }}>
              {food}
            </span>
          ))}
        </div>
      </div>

      {/* 对应蒲剧 */}
      <div className="xuan-card p-3 bg-[var(--background)]">
        <h4 className="text-xs text-[var(--primary)] font-medium mb-1" style={{ fontFamily: 'var(--font-serif)' }}>对应蒲剧</h4>
        <p className="text-sm" style={{ fontFamily: 'var(--font-serif)' }}>{term.opera}</p>
      </div>

      {/* 收藏按钮 */}
      <button
        onClick={() => toggleSolarTerm(term.name)}
        className={`mt-4 w-full flex items-center justify-center gap-2 ${isSolarTermFav(term.name) ? 'xuan-btn-filled' : 'xuan-btn'}`}
      >
        <BookmarkIcon size={18} filled={isSolarTermFav(term.name)} />
        <span>{isSolarTermFav(term.name) ? '已收藏' : '收藏到我的节气'}</span>
      </button>
    </div>
  );
}

export default function SolarPage() {
  const [selectedTerm, setSelectedTerm] = useState<SolarTerm | null>(null);
  const [currentTerm, setCurrentTerm] = useState<SolarTerm | null>(null);
  const [daysLeft, setDaysLeft] = useState(0);
  const [nextTerm, setNextTerm] = useState<SolarTerm | null>(null);

  useEffect(() => {
    setCurrentTerm(getCurrentSolarTerm());
    setDaysLeft(daysUntilNextTerm());
    setNextTerm(getNextSolarTerm());
  }, []);

  if (selectedTerm) {
    return (
      <div className="px-4 py-4">
        <button
          onClick={() => setSelectedTerm(null)}
          className="text-sm text-[var(--primary)] mb-3 min-h-[44px] flex items-center gap-1"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          &lt; 返回节气列表
        </button>
        <SolarTermDetail term={selectedTerm} />
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <h1 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>蒲生 · 节气馆</h1>

      {/* 当前节气大卡片 - 带背景图 */}
      {currentTerm && (
        <div className="relative rounded-2xl overflow-hidden mb-4" style={{ borderLeft: '4px solid var(--primary)' }}>
          <img
            src={currentTerm.imageUrl}
            alt={currentTerm.name}
            loading="lazy"
            className="w-full h-[200px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-xs text-white/80 mb-1" style={{ fontFamily: 'var(--font-serif)' }}>当前节气</p>
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>{currentTerm.name}</h2>
            <p className="text-sm text-white/90 mt-1">{currentTerm.desc}</p>
            {nextTerm && (
              <div className="mt-3 flex items-center gap-2 text-xs text-white/80">
                <ClockIcon size={14} className="text-white/80" />
                <span>距{nextTerm.name}还有 <span className="text-[#FFD700] font-bold">{daysLeft}</span> 天</span>
              </div>
            )}
            <div className="mt-2 text-xs text-white/70">
              <span style={{ fontFamily: 'var(--font-serif)' }}>三候：</span>
              {currentTerm.threeHou.join(' / ')}
            </div>
          </div>
        </div>
      )}

      {/* 分隔线 */}
      <div className="xuan-divider">·廿四·节气·</div>

      {/* 24节气横滑 - 带意象图 */}
      <div className="scroll-x-container flex gap-3 pb-3 -mx-4 px-4">
        {solarTerms.map((term) => {
          const isCurrent = currentTerm?.name === term.name;
          return (
            <button
              key={term.name}
              onClick={() => setSelectedTerm(term)}
              className={`shrink-0 w-[100px] rounded-xl overflow-hidden transition-all ${
                isCurrent
                  ? 'ring-2 ring-[var(--primary)]'
                  : 'border border-[var(--border)] hover:border-[var(--primary)]'
              }`}
            >
              <div className="w-[100px] h-[75px]">
                <img
                  src={term.imageUrl}
                  alt={term.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-2 py-1.5 bg-[var(--card)]">
                <span className="text-xs font-bold block text-center" style={{ fontFamily: 'var(--font-serif)' }}>{term.name}</span>
                <span className="text-[10px] text-[var(--muted-foreground)] block text-center">{term.date}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 分隔线 */}
      <div className="xuan-divider">·节气·详解·</div>

      {/* 当前节气详情 */}
      {currentTerm && <SolarTermDetail term={currentTerm} />}
    </div>
  );
}
