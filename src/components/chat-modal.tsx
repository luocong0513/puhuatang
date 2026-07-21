'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 弹窗打开时：禁止body滚动 + 添加chat-modal-open class隐藏Tab栏
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('chat-modal-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('chat-modal-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('chat-modal-open');
    };
  }, [isOpen]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // ESC关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 清空对话
  const handleClear = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setIsLoading(false);
  }, []);

  // 发送消息
  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const assistantMsg: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
    };
    setMessages(prev => [...prev, assistantMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationId,
          userId: 'web_user',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMsg.id
              ? { ...m, content: errData.error || `请求失败 (${res.status})` }
              : m
          )
        );
        setIsLoading(false);
        return;
      }

      // SSE streaming
      const reader = res.body?.getReader();
      if (!reader) {
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMsg.id ? { ...m, content: '连接中断' } : m
          )
        );
        setIsLoading(false);
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';
      let newConvId: string | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;

          const dataStr = trimmed.slice(5).trim();
          if (dataStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(dataStr);

            // 提取 conversation_id
            if (parsed.conversation_id && !newConvId) {
              newConvId = parsed.conversation_id;
            }

            // 提取消息内容
            // 兼容多种SSE格式：
            // 1. 豆包LLM: {"content":"..."} （无type字段）
            // 2. Coze v3: {"type":"answer","content":"..."} 或 {"type":"verbose","content":"..."}
            let chunk = '';
            if (parsed.content && typeof parsed.content === 'string') {
              if (!parsed.type || parsed.type === 'answer' || parsed.type === 'verbose') {
                chunk = parsed.content;
              }
            } else if (parsed.answer) {
              chunk = parsed.answer;
            }

            if (chunk) {
              fullContent += chunk;
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantMsg.id
                    ? { ...m, content: fullContent }
                    : m
                )
              );
            }
          } catch {
            // 忽略非JSON行
          }
        }
      }

      if (newConvId) {
        setConversationId(newConvId);
      }
    } catch {
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last && last.id === assistantMsg.id && !last.content) {
          return prev.map(m =>
            m.id === assistantMsg.id ? { ...m, content: '网络异常，请重试' } : m
          );
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, conversationId]);

  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100dvh',
        maxHeight: '100dvh',
        minHeight: '-webkit-fill-available',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        background: '#F5F0E8',
        overscrollBehavior: 'none',
        WebkitOverflowScrolling: 'touch',
        animation: 'fadeIn 200ms ease-out',
      }}
    >
      {/* 标题栏 */}
      <div
        style={{
          flexShrink: 0,
          padding: '12px 16px',
          background: '#F5F0E8',
          borderBottom: '2px solid #C0392B',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#1A1A1A',
            fontSize: '14px',
            cursor: 'pointer',
            minWidth: '60px',
            padding: '8px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: '"Noto Serif SC", serif',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 3L5 8L10 13" />
          </svg>
          返回
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#C0392B',
              color: '#F5F0E8',
              fontSize: '12px',
              fontWeight: 700,
              fontFamily: '"Noto Serif SC", serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            蒲
          </div>
          <span
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#1A1A1A',
              fontFamily: '"Noto Serif SC", serif',
              letterSpacing: '0.1em',
            }}
          >
            蒲生
          </span>
        </div>

        <button
          onClick={handleClear}
          style={{
            background: 'none',
            border: 'none',
            color: '#8B7E6A',
            fontSize: '12px',
            cursor: 'pointer',
            minWidth: '60px',
            textAlign: 'right',
            padding: '8px 0',
          }}
        >
          清空对话
        </button>
      </div>

      {/* 消息流 */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {messages.length === 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            color: '#8B7E6A',
          }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#C0392B',
                color: '#F5F0E8',
                fontSize: '24px',
                fontWeight: 700,
                fontFamily: '"Noto Serif SC", serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
              }}
            >
              蒲
            </div>
            <p style={{ fontSize: '14px', marginBottom: '4px', fontFamily: '"Noto Serif SC", serif', color: '#1A1A1A' }}>
              问蒲生
            </p>
            <p style={{ fontSize: '12px', color: '#8B7E6A' }}>
              五行康养、蒲剧文化、节气智慧
            </p>
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              marginBottom: '12px',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '8px 12px',
                fontSize: '14px',
                lineHeight: '1.6',
                borderRadius: msg.role === 'user'
                  ? '16px 16px 4px 16px'
                  : '16px 16px 16px 4px',
                background: msg.role === 'user' ? '#C0392B' : '#FFFFFF',
                color: msg.role === 'user' ? '#F5F0E8' : '#1A1A1A',
                fontFamily: msg.role === 'assistant' ? '"Noto Serif SC", serif' : 'inherit',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              {msg.content || (
                <span style={{ display: 'inline-flex', gap: '4px' }}>
                  <span className="animate-pulse" style={{ animationDelay: '0ms' }}>.</span>
                  <span className="animate-pulse" style={{ animationDelay: '300ms' }}>.</span>
                  <span className="animate-pulse" style={{ animationDelay: '600ms' }}>.</span>
                </span>
              )}
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
            <div
              style={{
                padding: '8px 12px',
                fontSize: '14px',
                borderRadius: '16px 16px 16px 4px',
                background: '#FFFFFF',
                color: '#8B7E6A',
                fontFamily: '"Noto Serif SC", serif',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <span style={{ display: 'inline-flex', gap: '4px' }}>
                <span className="animate-pulse" style={{ animationDelay: '0ms' }}>.</span>
                <span className="animate-pulse" style={{ animationDelay: '300ms' }}>.</span>
                <span className="animate-pulse" style={{ animationDelay: '600ms' }}>.</span>
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入区 */}
      <div
        style={{
          flexShrink: 0,
          padding: '12px 16px',
          background: '#F5F0E8',
          borderTop: '1px solid #D4C5A0',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="问蒲生……"
          inputMode="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '12px 16px',
            fontSize: 16,
            border: '1px solid #D4C5A0',
            borderRadius: 24,
            outline: 'none',
            background: '#FFFCF5',
            color: '#1A1A1A',
            WebkitUserSelect: 'text',
            userSelect: 'text',
            pointerEvents: 'auto',
            touchAction: 'manipulation',
          }}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          style={{
            padding: '12px 20px',
            background: isLoading || !input.trim() ? '#8B7E6A' : '#C0392B',
            color: '#fff',
            border: 'none',
            borderRadius: 24,
            fontSize: 16,
            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            pointerEvents: 'auto',
            flexShrink: 0,
            opacity: isLoading || !input.trim() ? 0.6 : 1,
            fontFamily: '"Noto Serif SC", serif',
            fontWeight: 600,
          }}
        >
          发送
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>,
    document.body
  );
}
