'use client';

import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';
import { PlayIcon, PauseIcon } from '@/components/icons';

// ===== 类型定义 =====
export interface AudioTrack {
  id: string;
  name: string;
  audioUrl: string;
  coverUrl?: string;
}

interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  play: (track: AudioTrack) => void;
  pause: () => void;
  resume: () => void;
  seek: (time: number) => void;
  stop: () => void;
}

// ===== Context =====
const AudioPlayerContext = createContext<AudioPlayerState | null>(null);

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  return ctx;
}

// ===== Provider =====
export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // 初始化 audio 元素
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const play = useCallback((track: AudioTrack) => {
    const audio = audioRef.current;
    if (!audio) return;

    // 同一曲目则切换播放/暂停
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(console.error);
      }
      return;
    }

    // 切换曲目
    audio.src = track.audioUrl;
    setCurrentTrack(track);
    setCurrentTime(0);
    setDuration(0);
    setIsVisible(true);
    audio.play().catch(console.error);
  }, [currentTrack, isPlaying]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    audioRef.current?.play().catch(console.error);
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = '';
    }
    setCurrentTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsVisible(false);
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        play,
        pause,
        resume,
        seek,
        stop,
      }}
    >
      {children}
      {isVisible && currentTrack && <AudioPlayerBar />}
    </AudioPlayerContext.Provider>
  );
}

// ===== 底部迷你播放条 =====
function AudioPlayerBar() {
  const { currentTrack, isPlaying, currentTime, duration, play, pause, seek, stop } = useAudioPlayer();
  const progressRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(ratio * duration);
  };

  const handleToggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play(currentTrack);
    }
  };

  return (
    <div
      className="fixed bottom-[56px] left-0 right-0 z-50 mx-auto"
      style={{ maxWidth: 768 }}
    >
      <div
        className="mx-3 rounded-2xl shadow-lg border overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #F5F0E8 0%, #EDE6D6 100%)',
          borderColor: '#D4C5A0',
        }}
      >
        {/* 进度条（顶部细线） */}
        <div
          ref={progressRef}
          className="relative h-1 cursor-pointer"
          style={{ background: '#D4C5A0' }}
          onClick={handleProgressClick}
        >
          <div
            className="absolute top-0 left-0 h-full transition-all duration-200"
            style={{
              width: `${progress}%`,
              background: 'var(--primary, #C75450)',
            }}
          />
        </div>

        {/* 主体 */}
        <div className="flex items-center gap-3 px-3 py-2.5">
          {/* 封面小图 */}
          {currentTrack.coverUrl ? (
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.name}
              className="w-9 h-9 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div
              className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center"
              style={{ background: '#D4C5A0' }}
            >
              <span className="text-white text-xs" style={{ fontFamily: 'var(--font-serif)' }}>蒲</span>
            </div>
          )}

          {/* 曲目信息 */}
          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-bold truncate"
              style={{ fontFamily: 'var(--font-serif)', color: '#3D2B1F' }}
            >
              {currentTrack.name}
            </p>
            <p className="text-[10px]" style={{ color: '#8B7E6A' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>

          {/* 播放/暂停按钮 */}
          <button
            onClick={handleToggle}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all min-h-[36px] min-w-[36px]"
            style={{
              background: 'var(--primary, #C75450)',
              color: '#FFFFFF',
            }}
          >
            {isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
          </button>

          {/* 关闭按钮 */}
          <button
            onClick={stop}
            className="w-7 h-7 flex items-center justify-center shrink-0 min-h-[36px] min-w-[36px]"
            style={{ color: '#8B7E6A' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
