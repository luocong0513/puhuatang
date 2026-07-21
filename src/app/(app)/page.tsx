'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BaGuaIcon, FlowerIcon, MaskIcon } from '@/components/icons';
import { parseLunarInput, parseSolarInput, validateLunarDate, validateSolarDate, ALL_SHI_CHEN, type ShiChen } from '@/lib/lunar-utils';
import ChatModal from '@/components/chat-modal';

type CalendarType = 'solar' | 'lunar';

export default function HomePage() {
  const router = useRouter();
  const [birthInput, setBirthInput] = useState('');
  const [calendar, setCalendar] = useState<CalendarType>('solar');
  const [selectedShiChen, setSelectedShiChen] = useState<ShiChen | null>('辰');
  const [errorMsg, setErrorMsg] = useState('');
  const [chatOpen, setChatOpen] = useState(false);

  const placeholder = calendar === 'solar'
    ? '请输入阳历生日，如：1990年3月15日'
    : '请输入农历生日，如：1990年二月十九';

  const handleSubmit = () => {
    setErrorMsg('');
    if (!birthInput.trim()) {
      setErrorMsg('请输入出生日期');
      return;
    }

    // 按历法类型校验
    if (calendar === 'lunar') {
      const parsed = parseLunarInput(birthInput);
      const err = validateLunarDate(parsed.year, parsed.month, parsed.day, parsed.isLeapMonth);
      if (err) {
        setErrorMsg(err);
        return;
      }
    } else {
      const parsed = parseSolarInput(birthInput);
      const err = validateSolarDate(parsed.year, parsed.month, parsed.day);
      if (err) {
        setErrorMsg(err);
        return;
      }
    }

    // 简单解析年份
    const yearMatch = birthInput.match(/(\d{4})/);
    const year = yearMatch ? parseInt(yearMatch[1]) : 1990;
    router.push(`/report?year=${year}&calendar=${calendar}&shichen=${selectedShiChen || ''}&input=${encodeURIComponent(birthInput)}`);
  };

  return (
    <div className="px-4 py-6">
      {/* Hero区 */}
      <section className="text-center py-8 animate-ink-fade">
        <h1
          className="text-4xl font-bold tracking-wider mb-3"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          知五行·养身心
        </h1>
        <p className="text-[var(--muted-foreground)] text-sm" style={{ fontFamily: 'var(--font-serif)' }}>
          输入生辰，开启专属康养方案
        </p>
      </section>

      {/* ===== 探己区 - 首页视觉主角 ===== */}
      <section className="mb-8 animate-ink-fade" style={{ animationDelay: '0.1s' }}>
        <div className="tanji-card p-6">
          {/* 探己大标题 + 印章 */}
          <div className="text-center mb-5">
            <div className="flex items-center justify-center gap-3">
              <h2
                className="text-4xl font-bold tracking-widest"
                style={{ fontFamily: 'var(--font-serif)', color: '#C0392B', fontSize: '2.8rem' }}
              >
                探己
              </h2>
              {/* 朱砂红印章 */}
              <span
                className="inline-flex items-center justify-center flex-shrink-0"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  border: '1.5px solid #C0392B',
                  color: '#C0392B',
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: 'var(--font-serif)',
                  lineHeight: 1,
                  background: 'rgba(192,57,43,0.08)',
                }}
              >
                己
              </span>
            </div>
            <p
              className="text-sm mt-2 tracking-wide"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--muted-foreground)' }}
            >
              你的五行体质
            </p>
          </div>

          {/* 历法切换 */}
          <div className="flex mb-3 gap-0 rounded-lg overflow-hidden border-2 border-[#C0392B]" style={{ fontFamily: 'var(--font-serif)' }}>
            <button
              onClick={() => { setCalendar('solar'); setErrorMsg(''); }}
              className={`flex-1 py-2.5 text-sm text-center transition-all duration-200 min-h-[44px] flex items-center justify-center ${
                calendar === 'solar'
                  ? 'bg-[#C0392B] text-[#F5F0E8] font-bold'
                  : 'bg-[#F5F0E8] text-[#1A1A1A] hover:bg-[#EDE6D6]'
              }`}
            >
              阳历
            </button>
            <button
              onClick={() => { setCalendar('lunar'); setErrorMsg(''); }}
              className={`flex-1 py-2.5 text-sm text-center transition-all duration-200 min-h-[44px] flex items-center justify-center border-l-2 border-[#C0392B] ${
                calendar === 'lunar'
                  ? 'bg-[#C0392B] text-[#F5F0E8] font-bold'
                  : 'bg-[#F5F0E8] text-[#1A1A1A] hover:bg-[#EDE6D6]'
              }`}
            >
              农历
            </button>
          </div>

          {/* 日期输入 */}
          <div className="mb-3">
            <input
              type="text"
              value={birthInput}
              onChange={(e) => setBirthInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder={placeholder}
              className="w-full bg-transparent border border-[var(--border)] rounded-lg px-4 py-3 text-sm
                placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)]
                min-h-[44px]"
              style={{ fontFamily: 'var(--font-serif)' }}
            />
          </div>

          {calendar === 'lunar' && (
            <p className="text-[10px] text-[var(--muted-foreground)] mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
              农历输入将以闰月前月计算，如遇闰月请备注&ldquo;闰X月&rdquo;
            </p>
          )}

          {/* 时辰选择器 */}
          <div className="mb-4">
            <label className="text-xs text-[var(--muted-foreground)] mb-2 block" style={{ fontFamily: 'var(--font-serif)' }}>
              出生时辰（用于推算时柱）
            </label>
            <div className="grid grid-cols-6 gap-2">
              {ALL_SHI_CHEN.map((zhi) => {
                const isSelected = selectedShiChen === zhi;
                const shiChenLabels: Record<string, string> = {
                  '子': '23-1', '丑': '1-3', '寅': '3-5', '卯': '5-7',
                  '辰': '7-9', '巳': '9-11', '午': '11-13', '未': '13-15',
                  '申': '15-17', '酉': '17-19', '戌': '19-21', '亥': '21-23',
                };
                return (
                  <button
                    key={zhi}
                    onClick={() => setSelectedShiChen(zhi)}
                    className={`py-2 px-1 rounded-lg text-center transition-colors duration-200 min-h-[44px] flex flex-col items-center justify-center border ${
                      isSelected
                        ? 'bg-[#C0392B] text-[#F5F0E8] border-[#C0392B]'
                        : 'bg-[#F5F0E8] text-[#1A1A1A] border-[var(--border)] hover:border-[#C0392B]'
                    }`}
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    <span className="text-sm font-medium">{zhi}时</span>
                    <span className={`text-[9px] ${isSelected ? 'opacity-70' : 'text-[var(--muted-foreground)]'}`}>
                      {shiChenLabels[zhi]}点
                    </span>
                  </button>
                );
              })}
              {/* 未知/不记得 */}
              <button
                onClick={() => setSelectedShiChen(null)}
                className={`py-2 px-1 rounded-lg text-center transition-colors duration-200 min-h-[44px] flex flex-col items-center justify-center border ${
                  selectedShiChen === null
                    ? 'bg-[var(--muted-foreground)] text-[#F5F0E8] border-[var(--muted-foreground)]'
                    : 'bg-[#F5F0E8] text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--muted-foreground)]'
                }`}
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                <span className="text-xs font-medium">未知</span>
                <span className="text-[9px] opacity-70">不记得</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-[var(--primary)] mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
              {errorMsg}
            </p>
          )}

          {/* 开始探己按钮 */}
          <button
            onClick={handleSubmit}
            className="xuan-btn w-full text-base tracking-widest"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            开始探己
          </button>
        </div>
      </section>

      {/* ===== 问蒲生区 ===== */}
      <section className="mb-8 animate-ink-fade" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center justify-center gap-6">
          {/* 问蒲生按钮 */}
          <button
            onClick={() => setChatOpen(true)}
            className="flex flex-col items-center gap-2 group"
          >
            <span
              className="inline-flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
              style={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                background: '#C0392B',
                border: '2px solid rgba(192,57,43,0.3)',
                boxShadow: '0 0 0 4px rgba(192,57,43,0.08), 0 4px 16px rgba(192,57,43,0.2)',
              }}
            >
              <span
                style={{
                  color: '#F5F0E8',
                  fontSize: 32,
                  fontWeight: 700,
                  fontFamily: 'var(--font-serif)',
                  lineHeight: 1,
                }}
              >
                问
              </span>
            </span>
            <span
              className="text-sm tracking-wide"
              style={{ fontFamily: 'var(--font-serif)', color: '#1A1A1A' }}
            >
              问蒲生
            </span>
          </button>

          {/* 说明文字 */}
          <div className="flex flex-col gap-1 max-w-[180px]">
            <p
              className="text-xs leading-relaxed"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--muted-foreground)' }}
            >
              问八字、问五行
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--muted-foreground)' }}
            >
              问戏曲、问养生
            </p>
            <p
              className="text-[10px] mt-1"
              style={{ fontFamily: 'var(--font-serif)', color: '#8B7E6A' }}
            >
              蒲生与你闲聊解惑
            </p>
          </div>
        </div>
      </section>

      {/* 分隔线 */}
      <div className="xuan-divider">·五行·康养·</div>

      {/* 三大入口 */}
      <section className="grid grid-cols-3 gap-3 animate-ink-fade" style={{ animationDelay: '0.2s' }}>
        <button
          onClick={() => router.push('/report?year=1990&calendar=solar&shichen=辰')}
          className="xuan-card p-4 flex flex-col items-center gap-2 text-center min-h-[120px] justify-center"
        >
          <BaGuaIcon size={28} className="text-[var(--primary)]" />
          <span className="text-xs font-medium" style={{ fontFamily: 'var(--font-serif)' }}>八字排盘</span>
          <span className="text-[10px] text-[var(--muted-foreground)]">知命养身</span>
        </button>

        <button
          onClick={() => router.push('/solar')}
          className="xuan-card p-4 flex flex-col items-center gap-2 text-center min-h-[120px] justify-center"
        >
          <FlowerIcon size={28} className="text-[var(--bamboo)]" />
          <span className="text-xs font-medium" style={{ fontFamily: 'var(--font-serif)' }}>节气养生</span>
          <span className="text-[10px] text-[var(--muted-foreground)]">顺时调养</span>
        </button>

        <button
          onClick={() => router.push('/opera')}
          className="xuan-card p-4 flex flex-col items-center gap-2 text-center min-h-[120px] justify-center"
        >
          <MaskIcon size={28} className="text-[var(--primary)]" />
          <span className="text-xs font-medium" style={{ fontFamily: 'var(--font-serif)' }}>戏曲疗愈</span>
          <span className="text-[10px] text-[var(--muted-foreground)]">以戏养心</span>
        </button>
      </section>

      {/* 文化引言 */}
      <section className="mt-8 text-center animate-ink-fade" style={{ animationDelay: '0.3s' }}>
        <div className="xuan-card p-5">
          <p
            className="text-sm leading-relaxed text-[var(--muted-foreground)]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            &ldquo;上古之人，其知道者，法于阴阳，和于术数，食饮有节，起居有常，不妄作劳，故能形与神俱，而尽终其天年。&rdquo;
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-2" style={{ fontFamily: 'var(--font-serif)' }}>
            ——《黄帝内经·素问》
          </p>
        </div>
      </section>

      {/* 问蒲生对话弹窗 */}
      <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
