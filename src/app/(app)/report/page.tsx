'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeftIcon, DownloadIcon, ShareIcon } from '@/components/icons';
import { getElementFromYear, generateReport, type FiveElementsReport, shengSequence } from '@/lib/five-elements';
import { useFavorites } from '@/components/favorites-context';
import { BookmarkIcon } from '@/components/icons';
import { parseLunarInput, parseSolarInput, calculateBaZi, type BaZiResult } from '@/lib/lunar-utils';
import Link from 'next/link';

// 历法日期信息行 + 八字四柱（仅客户端渲染，因为 lunar-javascript 不支持 SSR）
function DateInfoRow({ calendar, inputText, shichen }: { calendar: 'solar' | 'lunar'; inputText: string; shichen?: string | null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="mb-4 px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--muted-foreground)] leading-relaxed" style={{ fontFamily: 'var(--font-serif)' }}>
        加载历法信息...
      </div>
    );
  }

  // 解析输入
  let year: number | null = null;
  let month: number | null = null;
  let day: number | null = null;
  let isLeapMonth = false;

  if (calendar === 'lunar') {
    const parsed = parseLunarInput(inputText);
    year = parsed.year;
    month = parsed.month;
    day = parsed.day;
    isLeapMonth = parsed.isLeapMonth;
  } else {
    const parsed = parseSolarInput(inputText);
    year = parsed.year;
    month = parsed.month;
    day = parsed.day;
  }

  // 优先使用URL中的shichen参数（来自首页时辰选择器），否则从输入文本解析
  const hourZhi = shichen || null;

  if (!year || !month || !day) {
    return (
      <div className="mb-4 px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--muted-foreground)] leading-relaxed" style={{ fontFamily: 'var(--font-serif)' }}>
        {inputText && <span>{inputText}</span>}
      </div>
    );
  }

  const bazi = calculateBaZi(year, month, day, hourZhi, calendar, isLeapMonth);

  if (!bazi) {
    return (
      <div className="mb-4 px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--muted-foreground)] leading-relaxed" style={{ fontFamily: 'var(--font-serif)' }}>
        <span>日期解析失败，请检查输入</span>
      </div>
    );
  }

  return <BaZiDisplay bazi={bazi} />;
}

// 八字完整展示组件
function BaZiDisplay({ bazi }: { bazi: BaZiResult }) {
  const wuXingColor: Record<string, string> = {
    '木': '#4A6B3A', '火': '#C0392B', '土': '#D4A574', '金': '#8B7E6A', '水': '#4A6670',
  };

  return (
    <div className="mb-4 space-y-3">
      {/* 第一行：原始输入 + 转换结果（双历法对照） */}
      <div className="px-3 py-3 rounded-lg bg-[var(--background)] border-l-4 border-[#C0392B] text-sm leading-relaxed" style={{ fontFamily: 'var(--font-serif)' }}>
        <div className="font-bold text-[var(--foreground)]">
          {bazi.originalInput}
        </div>
        {bazi.convertedSolar && (
          <div className="mt-1 text-[#C0392B] font-medium">
            {bazi.convertedSolar}
          </div>
        )}
      </div>

      {/* 第二行：八字四柱 */}
      <div className="px-3 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]" style={{ fontFamily: 'var(--font-serif)' }}>
        <div className="text-xs text-[var(--muted-foreground)] mb-2">八字四柱</div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: '年柱', pillar: bazi.yearPillar, gan: bazi.yearGan, zhi: bazi.yearZhi },
            { label: '月柱', pillar: bazi.monthPillar, gan: bazi.monthGan, zhi: bazi.monthZhi },
            { label: '日柱', pillar: bazi.dayPillar, gan: bazi.dayGan, zhi: bazi.dayZhi },
            { label: '时柱', pillar: bazi.hourPillar || '未知', gan: bazi.hourGan, zhi: bazi.hourZhi },
          ].map(({ label, pillar, gan, zhi }) => (
            <div key={label} className="text-center">
              <div className="text-[10px] text-[var(--muted-foreground)] mb-1">{label}</div>
              <div className="text-lg font-bold leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                <span style={{ color: gan ? wuXingColor[ganWuXingMap[gan] || '土'] : 'var(--muted-foreground)' }}>{pillar.charAt(0)}</span>
                <span style={{ color: zhi ? wuXingColor[zhiWuXingMap[zhi] || '土'] : 'var(--muted-foreground)' }}>{pillar.charAt(1)}</span>
              </div>
            </div>
          ))}
        </div>
        {bazi.hourLabel && (
          <div className="text-[10px] text-[var(--muted-foreground)] mt-1.5 text-center">{bazi.hourLabel}</div>
        )}
        {bazi.animal && (
          <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5 text-center">属{bazi.animal} · 日主{bazi.dayMaster}{bazi.dayMasterElement}行</div>
        )}
      </div>

      {/* 第三行：五行统计 */}
      <div className="px-3 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]" style={{ fontFamily: 'var(--font-serif)' }}>
        <div className="text-xs text-[var(--muted-foreground)] mb-2">五行统计</div>
        <div className="flex justify-between gap-1">
          {(['木', '火', '土', '金', '水'] as const).map((el) => {
            const count = bazi.wuXingCount[el];
            const maxCount = Math.max(...Object.values(bazi.wuXingCount), 1);
            const pct = (count / maxCount) * 100;
            return (
              <div key={el} className="flex-1 text-center">
                <div className="text-base font-bold" style={{ color: wuXingColor[el], fontFamily: 'var(--font-serif)' }}>{el}</div>
                <div className="mx-auto mt-1 w-full h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: wuXingColor[el] }} />
                </div>
                <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 第四行：十神关系 */}
      <div className="px-3 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]" style={{ fontFamily: 'var(--font-serif)' }}>
        <div className="text-xs text-[var(--muted-foreground)] mb-2">十神关系</div>
        <div className="grid grid-cols-4 gap-x-2 gap-y-1.5">
          {bazi.shiShen.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-[10px] text-[var(--muted-foreground)]">{s.position}</div>
              <div className="text-sm font-bold" style={{ color: wuXingColor[s.wuXing] }}>{s.character}</div>
              <div className="text-[9px] text-[var(--muted-foreground)]">{s.shiShen}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 天干→五行映射（组件内使用）
const ganWuXingMap: Record<string, string> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
};
const zhiWuXingMap: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水',
};

function FiveElementsDiagram() {
  const elements = shengSequence;
  const colors: Record<string, string> = {
    '木': '#4A6B3A', '火': '#C0392B', '土': '#D4A574', '金': '#8B7E6A', '水': '#4A6670',
  };

  return (
    <div className="flex justify-center py-6">
      <div className="relative w-56 h-56">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="56" height="56" viewBox="0 0 56 56" className="animate-gentle-rotate">
            <circle cx="28" cy="28" r="26" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>
        {elements.map((el, i) => {
          const angle = (i * 72 - 90) * (Math.PI / 180);
          const cx = 88 + 70 * Math.cos(angle);
          const cy = 88 + 70 * Math.sin(angle);
          return (
            <div
              key={el}
              className="absolute w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-transform duration-300 hover:scale-110 cursor-pointer"
              style={{
                left: cx - 24,
                top: cy - 24,
                backgroundColor: colors[el],
                color: el === '土' ? '#1A1A1A' : '#F5F0E8',
                fontFamily: 'var(--font-serif)',
                border: '2px solid var(--background)',
              }}
            >
              {el}
            </div>
          );
        })}
        <svg className="absolute inset-0 w-56 h-56" viewBox="0 0 176 176">
          {elements.map((_, i) => {
            const angle1 = (i * 72 - 90) * (Math.PI / 180);
            const angle2 = ((i + 1) % 5 * 72 - 90) * (Math.PI / 180);
            const x1 = 88 + 70 * Math.cos(angle1);
            const y1 = 88 + 70 * Math.sin(angle1);
            const x2 = 88 + 70 * Math.cos(angle2);
            const y2 = 88 + 70 * Math.sin(angle2);
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="var(--muted-foreground)"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.5"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function ReportContent({ report, calendar, inputText, shichen }: { report: FiveElementsReport; calendar: 'solar' | 'lunar'; inputText: string; shichen: string | null }) {
  const { toggleReport, isReportFav } = useFavorites();
  const reportId = `report-${report.mainElement}`;

  const modules = [
    {
      title: '体质特征',
      content: (
        <div className="space-y-3">
          <p className="text-sm leading-relaxed">{report.bodyFeature}</p>
          <div className="space-y-2">
            {report.bodySigns.map((sign, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="text-[var(--primary)] mt-0.5 shrink-0">·</span>
                <span>{sign}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: '饮食调养',
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="text-xs text-[var(--muted-foreground)] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>推荐食材</h4>
            <div className="flex flex-wrap gap-2">
              {report.dietAdvice.foods.map((food) => (
                <span key={food} className="px-3 py-1 rounded-full text-xs bg-[var(--background)] border border-[var(--border)]" style={{ fontFamily: 'var(--font-serif)' }}>
                  {food}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs text-[var(--muted-foreground)] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>五行食谱</h4>
            <div className="space-y-2">
              {report.dietAdvice.recipes.map((recipe) => (
                <div key={recipe.name} className="xuan-card p-3">
                  <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-serif)' }}>{recipe.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">{recipe.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '季节养生',
      content: (
        <div className="space-y-2">
          {[
            { label: '春', text: report.seasonalAdvice.spring },
            { label: '夏', text: report.seasonalAdvice.summer },
            { label: '秋', text: report.seasonalAdvice.autumn },
            { label: '冬', text: report.seasonalAdvice.winter },
          ].map(({ label, text }) => (
            <div key={label} className="xuan-card p-3">
              <span className="text-xs text-[var(--primary)] font-bold mr-2" style={{ fontFamily: 'var(--font-serif)' }}>{label}</span>
              <span className="text-sm">{text}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: '情志调节',
      content: (
        <div className="space-y-3">
          <p className="text-sm leading-relaxed">{report.emotionAdvice.method}</p>
          <div className="xuan-card p-3 bg-[var(--background)]">
            <p className="text-xs text-[var(--muted-foreground)]" style={{ fontFamily: 'var(--font-serif)' }}>对应蒲剧唱段</p>
            <p className="text-sm mt-1" style={{ fontFamily: 'var(--font-serif)' }}>{report.emotionAdvice.operaSegment}</p>
          </div>
        </div>
      ),
    },
    {
      title: '起居指南',
      content: (
        <div className="space-y-3">
          <div className="xuan-card p-3">
            <p className="text-xs text-[var(--primary)] font-medium mb-1" style={{ fontFamily: 'var(--font-serif)' }}>作息时间</p>
            <p className="text-sm">{report.lifestyle.schedule}</p>
          </div>
          <div className="xuan-card p-3">
            <p className="text-xs text-[var(--bamboo)] font-medium mb-1" style={{ fontFamily: 'var(--font-serif)' }}>运动建议</p>
            <p className="text-sm">{report.lifestyle.exercise}</p>
          </div>
        </div>
      ),
    },
    {
      title: '文化溯源',
      content: (
        <div className="space-y-3">
          <div className="xuan-card p-3 bg-[var(--background)]">
            <p className="text-xs text-[var(--primary)] font-medium mb-1" style={{ fontFamily: 'var(--font-serif)' }}>《黄帝内经》原文</p>
            <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-serif)' }}>{report.culture.classic}</p>
          </div>
          <div className="xuan-card p-3">
            <p className="text-xs text-[var(--bamboo)] font-medium mb-1" style={{ fontFamily: 'var(--font-serif)' }}>现代解读</p>
            <p className="text-sm leading-relaxed">{report.culture.modern}</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="px-4 py-4">
      {/* 五行属性标签 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="inline-block px-3 py-1 rounded-full text-sm font-bold"
            style={{
              fontFamily: 'var(--font-serif)',
              backgroundColor: report.mainElement === '土' ? '#D4A574' : report.mainElement === '木' ? '#4A6B3A' : report.mainElement === '火' ? '#C0392B' : report.mainElement === '金' ? '#8B7E6A' : '#4A6670',
              color: '#F5F0E8',
            }}
          >
            {report.mainElement}行体质
          </span>
          <span className="text-xs text-[var(--muted-foreground)]" style={{ fontFamily: 'var(--font-serif)' }}>
            {report.profile.organ} | {report.profile.season}季 | {report.profile.direction}方
          </span>
        </div>
        <button
          onClick={() => toggleReport(reportId)}
          className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <BookmarkIcon size={20} filled={isReportFav(reportId)} className={isReportFav(reportId) ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'} />
        </button>
      </div>

      {/* 历法日期信息 + 八字四柱 + 五行统计 + 十神 */}
      <DateInfoRow calendar={calendar} inputText={inputText} shichen={shichen} />

      {/* 五行相生图 */}
      <FiveElementsDiagram />

      {/* 分隔线 */}
      <div className="xuan-divider">·五行·详析·</div>

      {/* 六大模块 */}
      <div className="space-y-4">
        {modules.map((mod, idx) => (
          <div key={mod.title} className="xuan-card p-5 animate-ink-fade" style={{ animationDelay: `${idx * 0.1}s` }}>
            <h3
              className="text-base font-bold mb-3 pb-2 border-b border-[var(--border)]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {mod.title}
            </h3>
            {mod.content}
          </div>
        ))}
      </div>

      {/* 底部操作 */}
      <div className="flex gap-3 mt-6 mb-4">
        <button className="xuan-btn flex-1 flex items-center justify-center gap-2">
          <DownloadIcon size={18} />
          <span>保存为图片</span>
        </button>
        <button className="xuan-btn-filled flex-1 flex items-center justify-center gap-2">
          <ShareIcon size={18} />
          <span>分享好友</span>
        </button>
      </div>
    </div>
  );
}

function ReportPageInner() {
  const searchParams = useSearchParams();
  const yearParam = searchParams.get('year');
  const calendarParam = searchParams.get('calendar');
  const inputParam = searchParams.get('input');
  const shichenParam = searchParams.get('shichen');
  const year = yearParam ? parseInt(yearParam) : 1990;
  const calendar: 'solar' | 'lunar' = calendarParam === 'lunar' ? 'lunar' : 'solar';
  const inputText = inputParam ? decodeURIComponent(inputParam) : '';
  const shichen = shichenParam || null;
  const element = getElementFromYear(year);
  const report = generateReport(element);

  return (
    <div>
      {/* 顶部导航 */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Link href="/" className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
          <ArrowLeftIcon size={22} />
        </Link>
        <h1 className="text-lg font-bold" style={{ fontFamily: 'var(--font-serif)' }}>蒲生 · 五行报告</h1>
        <span className="text-xs px-2 py-0.5 rounded border border-[var(--border)] text-[var(--muted-foreground)]" style={{ fontFamily: 'var(--font-serif)' }}>
          {calendar === 'lunar' ? '农历' : '阳历'}
        </span>
      </div>
      <ReportContent report={report} calendar={calendar} inputText={inputText} shichen={shichen} />
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="px-4 py-8 text-center text-[var(--muted-foreground)]" style={{ fontFamily: 'var(--font-serif)' }}>加载中...</div>}>
      <ReportPageInner />
    </Suspense>
  );
}
