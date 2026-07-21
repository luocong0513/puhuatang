'use client';

import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 印章Logo - 圆形朱红印章 "蒲华堂"
export function SealLogo({ className, size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="24" r="22" stroke="#C0392B" strokeWidth="2.5" fill="none" />
      <circle cx="24" cy="24" r="19" stroke="#C0392B" strokeWidth="1" fill="none" />
      <text x="24" y="20" textAnchor="middle" fill="#C0392B" fontSize="10" fontFamily="Noto Serif SC, serif" fontWeight="700">蒲华</text>
      <text x="24" y="33" textAnchor="middle" fill="#C0392B" fontSize="10" fontFamily="Noto Serif SC, serif" fontWeight="700">堂</text>
    </svg>
  );
}

// 八字排盘 - 八卦图标
export function BaGuaIcon({ className, size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="16" cy="16" r="14" />
      <path d="M16 2v28" />
      <path d="M9 6c0 2.5 2 4.5 4 5s3-2.5 3-5" />
      <path d="M16 11c0 2.5 2 4.5 4 5s3-2.5 3-5" />
      <path d="M9 21c0 2.5 2 4.5 4 5s3-2.5 3-5" />
      <circle cx="16" cy="16" r="2" fill="currentColor" />
    </svg>
  );
}

// 节气 - 花朵图标
export function FlowerIcon({ className, size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="16" cy="12" r="3" />
      <path d="M16 15v11" />
      <path d="M16 20l-5-3" />
      <path d="M16 22l5-2" />
      <path d="M10 10c-2 0-4 2-3 5" />
      <path d="M22 10c2 0 4 2 3 5" />
      <path d="M13 7c0-2 1.5-4 3-4s3 2 3 4" />
    </svg>
  );
}

// 戏曲 - 戏脸谱图标
export function MaskIcon({ className, size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M16 3C10 3 5 8 5 14c0 4 2 7 5 9l2 6h8l2-6c3-2 5-5 5-9 0-6-5-11-11-11z" />
      <path d="M11 12v2" />
      <path d="M21 12v2" />
      <path d="M13 18c1.5 1.5 4.5 1.5 6 0" />
      <path d="M8 9c2-3 5-4 8-4s6 1 8 4" />
    </svg>
  );
}

// 首页 - 宣纸卷图标
export function HomeIcon({ className, size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M6 6h20v20H6z" />
      <path d="M6 6c0 0 2 4 10 4s10-4 10-4" />
      <path d="M10 13h12" />
      <path d="M10 17h12" />
      <path d="M10 21h8" />
    </svg>
  );
}

// 我的 - 人物图标
export function PersonIcon({ className, size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="16" cy="10" r="5" />
      <path d="M6 28c0-5.5 4.5-10 10-10s10 4.5 10 10" />
    </svg>
  );
}

// 搜索 - 放大镜
export function SearchIcon({ className, size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="14" cy="14" r="8" />
      <path d="M20 20l7 7" />
    </svg>
  );
}

// 收藏 - 书签
export function BookmarkIcon({ className, size = 24, filled = false }: IconProps & { filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M5 3h14v18l-7-4-7 4V3z" />
    </svg>
  );
}

// 播放
export function PlayIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

// 暂停
export function PauseIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

// 分享
export function ShareIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4" />
      <path d="M15.4 6.5l-6.8 4" />
    </svg>
  );
}

// 下载/保存
export function DownloadIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 3v12" />
      <path d="M8 11l4 4 4-4" />
      <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
    </svg>
  );
}

// 箭头左
export function ArrowLeftIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

// 卷轴 - 科普区
export function ScrollIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M4 4c-1 0-2 1-2 2s1 2 2 2" />
      <path d="M20 4c1 0 2 1 2 2s-1 2-2 2" />
      <path d="M4 4h16v16H4z" />
      <path d="M4 8v12c-1 0-2 1-2 2h2" />
      <path d="M20 8v12c1 0 2 1 2 2h-2" />
      <path d="M8 11h8" />
      <path d="M8 14h8" />
    </svg>
  );
}

// 五行图标
export function WuXingIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="4" r="2.5" />
      <circle cx="20" cy="10" r="2.5" />
      <circle cx="17" cy="19" r="2.5" />
      <circle cx="7" cy="19" r="2.5" />
      <circle cx="4" cy="10" r="2.5" />
      <path d="M12 6.5l6 3" />
      <path d="M18 12l-2.5 5" />
      <path d="M14.5 18h-5" />
      <path d="M7 17l-2-5" />
      <path d="M5 10l5-4" />
    </svg>
  );
}

// 时钟/时间
export function ClockIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

// 音乐
export function MusicIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

// 左箭头
export function ChevronLeftIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

// 右箭头
export function ChevronRightIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
