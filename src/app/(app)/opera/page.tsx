'use client';

import React, { useState, useMemo } from 'react';
import {
  operaPieces, WUXING_CATEGORIES, SEASON_WUXING_MAP,
  operaOverview, operaAncestorReasons,
  operaMasters, otherArtists, operaArtFeatures,
  fenchengOpera, fenchengCulture,
  type OperaPiece, type WuxingCategory,
} from '@/lib/opera-data';
import { getCurrentSolarTerm } from '@/lib/solar-terms';
import { BookmarkIcon, PlayIcon, PauseIcon, MusicIcon, ScrollIcon, MaskIcon, WuXingIcon } from '@/components/icons';
import { useFavorites } from '@/components/favorites-context';
import { useAudioPlayer, type AudioTrack } from '@/components/audio-player';

// ===== 五行色映射 =====
const WUXING_ELEMENT_MAP: Record<string, string> = {
  'wood': '木',
  'fire': '火',
  'earth': '土',
  'metal': '金',
  'water': '水',
};

// 脸谱圆形组件
function FaceMaskCircle({ maskType, size = 120, className = '' }: { maskType: string; size?: number; className?: string }) {
  const maskMap: Record<string, string> = {
    '红生': '/images/masks_0_hongsheng.jpg',
    '黑净': '/images/masks_1_heijing.jpg',
    '白旦': '/images/masks_2_baidan.jpg',
    '丑角': '/images/masks_3_choujiao.jpg',
    '老生': '/images/masks_4_lasheng.jpg',
  };
  const url = maskMap[maskType];
  if (!url) return null;

  const borderColors: Record<string, string> = {
    '红生': '#C0392B',
    '黑净': '#1A1A1A',
    '白旦': '#D4A574',
    '丑角': '#8B7E6A',
    '老生': '#4A6B3A',
  };

  return (
    <img
      src={url}
      alt={`${maskType}脸谱`}
      loading="lazy"
      className={`rounded-full object-cover shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        border: `2px solid ${borderColors[maskType] || '#8B7E6A'}`,
      }}
    />
  );
}

// ===== 区块1：五行专属曲调卡 =====
function WuxingMusicCard() {
  // 默认根据当前节气推五行
  const currentTerm = getCurrentSolarTerm();
  const seasonWuxing = SEASON_WUXING_MAP[currentTerm.name] || 'wood';
  const category = WUXING_CATEGORIES.find(c => c.id === seasonWuxing) || WUXING_CATEGORIES[0];

  return (
    <div
      className="rounded-2xl p-4 border-l-4"
      style={{
        background: category.bgColor,
        borderColor: category.color,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <WuXingIcon size={20} className="shrink-0" />
        <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-serif)', color: category.color }}>
          {category.label}
        </span>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: '#5A5248' }}>
        {category.description}
      </p>
      <p className="text-xs mt-2 italic" style={{ color: '#8B7E6A' }}>
        当前节气「{currentTerm.name}」当令五行·{WUXING_ELEMENT_MAP[seasonWuxing]}
      </p>
    </div>
  );
}

// ===== 区块2：五行分类 Tab =====
function WuxingCategoryTabs({ onPlayClick }: { onPlayClick: (piece: OperaPiece) => void }) {
  const [activeTab, setActiveTab] = useState('wood');
  const { toggleOpera, isOperaFav } = useFavorites();
  const { currentTrack, isPlaying } = useAudioPlayer();

  const filteredPieces = useMemo(
    () => operaPieces.filter(p => p.wuxing === activeTab),
    [activeTab]
  );

  const activeCategory = WUXING_CATEGORIES.find(c => c.id === activeTab)!;

  return (
    <div>
      {/* Tab 栏 */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: 'none' }}>
        {WUXING_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className="shrink-0 px-3 py-2 rounded-xl text-sm font-medium transition-all min-h-[44px]"
            style={{
              fontFamily: 'var(--font-serif)',
              background: activeTab === cat.id ? cat.color : '#EDE6D6',
              color: activeTab === cat.id ? '#FFFFFF' : '#5A5248',
              border: activeTab === cat.id ? `1.5px solid ${cat.color}` : '1.5px solid #D4C5A0',
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 分类描述 */}
      <div
        className="rounded-xl p-3 mb-4"
        style={{ background: activeCategory.bgColor, borderLeft: `3px solid ${activeCategory.color}` }}
      >
        <p className="text-xs leading-relaxed" style={{ color: '#5A5248' }}>
          {activeCategory.description}
        </p>
      </div>

      {/* 剧目卡片网格 */}
      <div className="space-y-3">
        {filteredPieces.map(piece => (
          <OperaPieceCard
            key={piece.id}
            piece={piece}
            category={activeCategory}
            onPlayClick={onPlayClick}
            onToggleFav={() => toggleOpera(piece.id)}
            isFav={isOperaFav(piece.id)}
            isCurrentTrack={currentTrack?.id === piece.id}
            isPlaying={currentTrack?.id === piece.id && isPlaying}
          />
        ))}
      </div>
    </div>
  );
}

// ===== 单个剧目卡片 =====
function OperaPieceCard({
  piece,
  category,
  onPlayClick,
  onToggleFav,
  isFav,
  isCurrentTrack,
  isPlaying,
}: {
  piece: OperaPiece;
  category: WuxingCategory;
  onPlayClick: (piece: OperaPiece) => void;
  onToggleFav: () => void;
  isFav: boolean;
  isCurrentTrack: boolean;
  isPlaying: boolean;
}) {
  return (
    <div className="xuan-card p-4">
      {/* 上半：脸谱+信息 */}
      <div className="flex gap-4 items-start">
        {/* 左侧脸谱 */}
        <FaceMaskCircle maskType={piece.maskType} size={80} />

        {/* 右侧信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold truncate" style={{ fontFamily: 'var(--font-serif)' }}>
              {piece.name}
            </h3>
            <button
              onClick={onToggleFav}
              className="shrink-0 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <BookmarkIcon size={18} filled={isFav} className={isFav ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'} />
            </button>
          </div>

          {/* 五行标签 + 板式 */}
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className="text-xs px-2 py-0.5 rounded-md font-medium"
              style={{
                background: category.bgColor,
                color: category.color,
                border: `1px solid ${category.color}`,
                fontFamily: 'var(--font-serif)',
              }}
            >
              {piece.wuxingName}
            </span>
            <span className="text-xs text-[var(--muted-foreground)]" style={{ fontFamily: 'var(--font-serif)' }}>
              {piece.banShi}
            </span>
          </div>

          {/* 演员 */}
          <p className="text-xs mt-1.5 text-[var(--muted-foreground)]">
            {piece.actor}
          </p>

          {/* 康养解读 */}
          <p className="text-xs mt-1.5 leading-relaxed" style={{ color: '#5A5248' }}>
            {piece.healthNote}
          </p>

          {/* 播放按钮 */}
          <div className="mt-2.5">
            <button
              onClick={() => onPlayClick(piece)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all min-h-[36px]"
              style={{
                background: isCurrentTrack && isPlaying ? 'var(--primary)' : isCurrentTrack ? '#F5F0E8' : 'var(--primary)',
                color: isCurrentTrack && isPlaying ? '#FFFFFF' : isCurrentTrack ? 'var(--primary)' : '#FFFFFF',
                border: isCurrentTrack && !isPlaying ? '1.5px solid var(--primary)' : '1.5px solid transparent',
                fontFamily: 'var(--font-serif)',
              }}
            >
              {isCurrentTrack && isPlaying ? (
                <>
                  <PauseIcon size={14} />
                  正在播放
                </>
              ) : (
                <>
                  <PlayIcon size={14} />
                  {isCurrentTrack ? '继续播放' : '试听唱段'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 下半：封面图 */}
      <div className="mt-3 rounded-xl overflow-hidden" style={{ maxHeight: 160 }}>
        <img
          src={piece.coverUrl}
          alt={piece.name}
          loading="lazy"
          className="w-full h-[140px] object-cover"
          style={{ background: '#EDE6D6' }}
        />
      </div>
    </div>
  );
}

// ===== 区块3：节气推荐戏 =====
function SeasonRecommendSection() {
  const currentTerm = getCurrentSolarTerm();
  const wuxingId = SEASON_WUXING_MAP[currentTerm.name] || 'wood';
  const recommendedPieces = operaPieces.filter(p => p.wuxing === wuxingId);
  const category = WUXING_CATEGORIES.find(c => c.id === wuxingId)!;

  if (recommendedPieces.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: category.color }}
        >
          <span className="text-white text-[10px] font-bold">
            {WUXING_ELEMENT_MAP[wuxingId]}
          </span>
        </div>
        <h2 className="text-base font-bold" style={{ fontFamily: 'var(--font-serif)' }}>
          {currentTerm.name}推荐戏
        </h2>
      </div>

      <div
        className="rounded-2xl p-4 border-l-4 mb-3"
        style={{ background: category.bgColor, borderColor: category.color }}
      >
        <p className="text-xs leading-relaxed" style={{ color: '#5A5248' }}>
          {currentTerm.name}当令{WUXING_ELEMENT_MAP[wuxingId]}行，宜听{category.label.split('·')[1] || category.name}调之戏，{category.description}
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {recommendedPieces.map(piece => (
          <div
            key={piece.id}
            className="shrink-0 w-[160px] xuan-card p-3 flex flex-col items-center"
          >
            <FaceMaskCircle maskType={piece.maskType} size={60} />
            <h4 className="text-xs font-bold mt-2 text-center truncate w-full" style={{ fontFamily: 'var(--font-serif)' }}>
              {piece.name}
            </h4>
            <p className="text-[10px] mt-1 text-[var(--muted-foreground)] text-center line-clamp-2">
              {piece.healthNote}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== 蒲剧概述区（精简版） =====
function OverviewSection() {
  return (
    <div className="xuan-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <ScrollIcon size={18} className="text-[var(--primary)]" />
        <h2 className="text-base font-bold" style={{ fontFamily: 'var(--font-serif)' }}>{operaOverview.title}</h2>
      </div>
      <p className="text-sm leading-relaxed text-[var(--muted-foreground)] mb-3">{operaOverview.content}</p>
      <div className="flex flex-wrap gap-2">
        {operaOverview.highlights.map((h) => (
          <span key={h} className="text-xs px-2.5 py-1 rounded-full border border-[var(--primary)] text-[var(--primary)]" style={{ fontFamily: 'var(--font-serif)' }}>
            {h}
          </span>
        ))}
      </div>
    </div>
  );
}

// ===== 戏曲鼻祖论据（精简折叠） =====
function AncestorSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-full bg-[var(--primary)] flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">祖</span>
        </div>
        <h2 className="text-base font-bold" style={{ fontFamily: 'var(--font-serif)' }}>为什么说蒲剧是戏曲鼻祖</h2>
      </div>

      {expanded ? (
        <div className="space-y-2.5">
          {operaAncestorReasons.map((reason, idx) => (
            <div key={reason.id} className="xuan-card p-3 flex gap-3 items-start">
              <span className="text-lg font-bold text-[var(--primary)] shrink-0 w-6 text-center" style={{ fontFamily: 'var(--font-serif)' }}>
                {idx + 1}
              </span>
              <div>
                <h3 className="text-sm font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{reason.title}</h3>
                <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">{reason.content}</p>
              </div>
            </div>
          ))}
          <button
            onClick={() => setExpanded(false)}
            className="text-xs text-[var(--primary)] underline mt-1 min-h-[44px] flex items-center"
          >
            收起
          </button>
        </div>
      ) : (
        <div className="xuan-card p-4">
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)] mb-2">
            蒲剧历史逾八百年，是中国现存最早的戏曲剧种（无之一）。梆子腔从蒲州向四面八方辐射，衍生出晋剧、豫剧、秦腔等北方剧种...
          </p>
          <button
            onClick={() => setExpanded(true)}
            className="text-xs text-[var(--primary)] underline min-h-[44px] flex items-center"
          >
            展开五大论据
          </button>
        </div>
      )}
    </div>
  );
}

// ===== 名角区 =====
function MastersSection() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <MusicIcon size={18} className="text-[var(--primary)]" />
        <h2 className="text-base font-bold" style={{ fontFamily: 'var(--font-serif)' }}>蒲剧名角</h2>
      </div>
      <div className="space-y-2.5">
        {operaMasters.map((master) => (
          <div key={master.name} className="xuan-card p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-base font-bold" style={{ fontFamily: 'var(--font-serif)' }}>{master.name}</h3>
                <p className="text-xs text-[var(--muted-foreground)]">{master.years}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--primary)] text-white font-medium" style={{ fontFamily: 'var(--font-serif)' }}>
                {master.title}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[var(--muted-foreground)] mb-2">{master.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {master.representativeWorks.map((work) => (
                <span key={work} className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--muted-foreground)]" style={{ fontFamily: 'var(--font-serif)' }}>
                  {work}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* 其他艺术家 */}
      <div className="xuan-card p-3 mt-2.5">
        <h3 className="text-xs font-bold mb-2 text-[var(--muted-foreground)]" style={{ fontFamily: 'var(--font-serif)' }}>其他重要艺术家</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {otherArtists.map((a) => (
            <span key={a.role} className="text-xs text-[var(--muted-foreground)]">
              <span className="font-medium text-[var(--foreground)]">{a.role}</span>：{a.names}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== 艺术特色 =====
function ArtFeaturesSection() {
  const sections = [
    operaArtFeatures.singing,
    operaArtFeatures.acting,
    operaArtFeatures.roles,
    operaArtFeatures.orchestra,
  ];
  const sectionIcons = ['唱', '做', '行', '乐'];

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center">
          <span className="text-[10px] font-bold text-[var(--primary)]">艺</span>
        </div>
        <h2 className="text-base font-bold" style={{ fontFamily: 'var(--font-serif)' }}>艺术特色</h2>
      </div>
      <div className="space-y-2.5">
        {sections.map((section, idx) => (
          <div key={section.title} className="xuan-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs font-bold flex items-center justify-center" style={{ fontFamily: 'var(--font-serif)' }}>
                {sectionIcons[idx]}
              </span>
              <h3 className="text-sm font-bold" style={{ fontFamily: 'var(--font-serif)' }}>{section.title}</h3>
            </div>
            <ul className="space-y-1">
              {section.points.map((point, i) => (
                <li key={i} className="text-xs leading-relaxed text-[var(--muted-foreground)] flex gap-1.5">
                  <span className="text-[var(--primary)] shrink-0 mt-0.5">·</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== 汾城风物 =====
function FenchengSection() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center">
          <span className="text-[10px] font-bold text-[#4A6B3A]">汾</span>
        </div>
        <h2 className="text-base font-bold" style={{ fontFamily: 'var(--font-serif)' }}>蒲剧与汾城</h2>
      </div>

      <div className="xuan-card p-4 mb-2.5">
        <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">{fenchengOpera.content}</p>
      </div>

      <div className="xuan-card p-3 mb-2.5">
        <h3 className="text-sm font-bold mb-1.5" style={{ fontFamily: 'var(--font-serif)' }}>{fenchengCulture.history.title}</h3>
        <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">{fenchengCulture.history.content}</p>
      </div>

      <div className="xuan-card p-3 mb-2.5">
        <h3 className="text-sm font-bold mb-1.5" style={{ fontFamily: 'var(--font-serif)' }}>{fenchengCulture.architecture.title}</h3>
        <ul className="space-y-1">
          {fenchengCulture.architecture.items.map((item, i) => (
            <li key={i} className="text-xs leading-relaxed text-[var(--muted-foreground)] flex gap-1.5">
              <span className="text-[#4A6B3A] shrink-0 mt-0.5">·</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        <div className="xuan-card p-3">
          <h3 className="text-xs font-bold mb-1.5" style={{ fontFamily: 'var(--font-serif)' }}>{fenchengCulture.folk.title}</h3>
          <ul className="space-y-1">
            {fenchengCulture.folk.items.map((item, i) => (
              <li key={i} className="text-[11px] leading-relaxed text-[var(--muted-foreground)] flex gap-1">
                <span className="text-[#4A6B3A] shrink-0">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="xuan-card p-3">
          <h3 className="text-xs font-bold mb-1.5" style={{ fontFamily: 'var(--font-serif)' }}>{fenchengCulture.food.title}</h3>
          <ul className="space-y-1">
            {fenchengCulture.food.items.map((item, i) => (
              <li key={i} className="text-[11px] leading-relaxed text-[var(--muted-foreground)] flex gap-1">
                <span className="text-[var(--primary)] shrink-0">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="xuan-card p-3">
        <h3 className="text-sm font-bold mb-1.5" style={{ fontFamily: 'var(--font-serif)' }}>{fenchengCulture.dialect.title}</h3>
        <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">{fenchengCulture.dialect.content}</p>
      </div>
    </div>
  );
}

// ===== 主页面 =====
export default function OperaPage() {
  const { toggleOpera, isOperaFav } = useFavorites();
  const audioPlayer = useAudioPlayer();

  const handlePlayClick = (piece: OperaPiece) => {
    const track: AudioTrack = {
      id: piece.id,
      name: piece.name,
      audioUrl: piece.resourceUrl,
      coverUrl: piece.coverUrl,
    };
    audioPlayer.play(track);
  };

  return (
    <div className="px-4 py-4">
      <h1 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)' }}>蒲生 · 戏曲馆</h1>

      {/* ===== 区块1：五行专属曲调卡 ===== */}
      <WuxingMusicCard />

      {/* 分隔线 */}
      <div className="xuan-divider">·五行·蒲剧·</div>

      {/* ===== 区块2：五行分类 Tab ===== */}
      <WuxingCategoryTabs onPlayClick={handlePlayClick} />

      {/* 分隔线 */}
      <div className="xuan-divider">·节气·推荐·</div>

      {/* ===== 区块3：当前节气推荐戏 ===== */}
      <SeasonRecommendSection />

      {/* 分隔线 */}
      <div className="xuan-divider">·溯源·概述·</div>

      {/* 蒲剧概述 */}
      <OverviewSection />

      {/* 分隔线 */}
      <div className="xuan-divider">·鼻祖·论据·</div>

      {/* 戏曲鼻祖论据（精简折叠） */}
      <AncestorSection />

      {/* 分隔线 */}
      <div className="xuan-divider">·名角·风采·</div>

      {/* 名角区 */}
      <MastersSection />

      {/* 分隔线 */}
      <div className="xuan-divider">·艺术·特色·</div>

      {/* 艺术特色 */}
      <ArtFeaturesSection />

      {/* 分隔线 */}
      <div className="xuan-divider">·汾城·风物·</div>

      {/* 汾城风物 */}
      <FenchengSection />

      {/* ===== 区块4：免责声明 ===== */}
      <div className="mt-6 mb-4 px-4 py-3 rounded-xl" style={{ background: '#EDE6D6' }}>
        <p className="text-xs leading-relaxed text-center" style={{ color: '#8B7E6A' }}>
          戏曲为文化体验，康养建议基于中医五行理论，非医疗诊断。如有不适请及时就医。
        </p>
      </div>

      {/* 底部留白 */}
      <div className="h-4" />
    </div>
  );
}
