/* ═══════════════════════════════════════════════════════
   Planly — AI Co-pilot Assistant Panel
   Clean, IDE-grade developer chat panel matching
   Antigravity & Cursor aesthetics and real conversational behavior.
   ═══════════════════════════════════════════════════════ */

import { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  ArrowUp,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  BrainCircuit,
  Zap,
} from 'lucide-react';
import { useCopilot } from '@/contexts/CopilotContext';
import { MarkdownMessage } from '../common/MarkdownMessage';
import { cn } from '@/lib/utils';

const SUGGESTIONS = [
  {
    icon: '⚡',
    label: 'Optimal O(log N) for Rotated Array',
    prompt: 'Explain the optimal O(log N) binary search solution for Search in Rotated Sorted Array with invariants.',
  },
  {
    icon: '🌊',
    label: 'Two Pointers for Trapping Rain Water',
    prompt: 'Walk through the two-pointer approach for Trapping Rain Water in O(1) space.',
  },
  {
    icon: '🧠',
    label: 'Virtual Memory, TLB & Paging',
    prompt: 'Explain how virtual memory, TLB hits/misses, and page fault handling work in Operating Systems.',
  },
  {
    icon: '💾',
    label: 'Redis Cache-Aside Architecture',
    prompt: 'How does the Cache-Aside pattern work with Redis, and how do you prevent cache stampedes?',
  },
];

export function CopilotPanel() {
  const { isOpen, closeCopilot, messages, isLoading, sendMessage, clearMessages } =
    useCopilot();
  const [input, setInput] = useState('');
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus textarea when panel opens
  useEffect(() => {
    if (isOpen) {
      textareaRef.current?.focus();
    }
  }, [isOpen]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleThinking = (id: string) => {
    setExpandedThinking((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={closeCopilot}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
        />
      )}

      {/* Main IDE Assistant Panel */}
      <aside
        className={cn(
          'fixed lg:static top-0 bottom-0 right-0 z-50 flex flex-col shrink-0 bg-[#090d16] border-l border-white/[0.08] select-none transition-all duration-300 ease-in-out h-full overflow-hidden shadow-2xl',
          isOpen
            ? 'w-[380px] max-w-[100vw] opacity-100 translate-x-0'
            : 'translate-x-full lg:translate-x-0 lg:w-0 lg:border-none lg:opacity-0 pointer-events-none'
        )}
      >
        <div className="w-[380px] min-w-[380px] flex flex-col h-full bg-[#090d16]">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 h-14 shrink-0 border-b border-white/[0.08] bg-[#0c1220]/50 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-blue-600/20 border border-blue-500/35 flex items-center justify-center text-blue-400 shadow-sm shadow-blue-500/20">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[13.5px] tracking-tight text-white">
                  Co-pilot
                </span>
                <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.05] border border-white/[0.08] px-1.5 py-0.5 rounded-full">
                  Planly SDE
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearMessages}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
                title="New Chat / Reset Conversation"
                aria-label="New Chat"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={closeCopilot}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
                title="Close Co-pilot"
                aria-label="Close Co-pilot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-1.5">
                {/* User Message */}
                {msg.role === 'user' ? (
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1 pr-1">
                      <span className="font-medium text-zinc-300">You</span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-zinc-500">{msg.timestamp}</span>
                    </div>
                    <div className="max-w-[92%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm shadow-blue-600/20 font-sans">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  /* Assistant Message */
                  <div className="flex flex-col items-start w-full">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1.5 pl-1">
                      <div className="w-4 h-4 rounded-full bg-blue-600/30 border border-blue-400/30 flex items-center justify-center">
                        <Sparkles className="w-2.5 h-2.5 text-blue-300" />
                      </div>
                      <span className="font-medium text-zinc-200">Co-pilot</span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-zinc-500">{msg.timestamp}</span>
                    </div>

                    <div className="w-full rounded-2xl rounded-tl-sm bg-[#0c1220] border border-white/[0.08] p-4 text-[13px] shadow-sm">
                      {/* Antigravity-style Collapsible Thinking Process */}
                      {msg.thinking && (
                        <div className="mb-3.5 border-b border-white/[0.06] pb-2.5">
                          <button
                            type="button"
                            onClick={() => toggleThinking(msg.id)}
                            className="flex items-center gap-1.5 text-[11.5px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer select-none"
                          >
                            <BrainCircuit className="w-3.5 h-3.5 text-blue-400" />
                            <span>Thinking Process</span>
                            {expandedThinking[msg.id] ? (
                              <ChevronDown className="w-3 h-3 text-zinc-500" />
                            ) : (
                              <ChevronRight className="w-3 h-3 text-zinc-500" />
                            )}
                          </button>
                          {expandedThinking[msg.id] && (
                            <div className="mt-2 text-[12px] font-mono text-zinc-400/90 leading-relaxed pl-2 border-l-2 border-blue-500/40 bg-white/[0.02] p-2 rounded-r-md">
                              {msg.thinking}
                            </div>
                          )}
                        </div>
                      )}

                      <MarkdownMessage content={msg.content} />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading / Thinking Streaming Indicator */}
            {isLoading && (
              <div className="flex flex-col items-start w-full animate-fade-in">
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1 pl-1">
                  <div className="w-4 h-4 rounded-full bg-blue-600/30 border border-blue-400/30 flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-blue-300" />
                  </div>
                  <span className="font-medium text-zinc-200">Co-pilot</span>
                </div>
                <div className="w-full rounded-2xl rounded-tl-sm bg-[#0c1220] border border-white/[0.08] p-3.5 text-[12.5px] flex items-center gap-2.5 text-zinc-400 font-mono shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  <span>Thinking & reasoning...</span>
                </div>
              </div>
            )}

            {/* Quick Suggestions (Shown when only initial message) */}
            {messages.length <= 1 && !isLoading && (
              <div className="pt-2 pb-1 space-y-2">
                <div className="text-[11px] font-medium text-zinc-400 px-1 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Suggested Study Topics</span>
                </div>
                <div className="space-y-1.5">
                  {SUGGESTIONS.map((sugg) => (
                    <button
                      key={sugg.label}
                      type="button"
                      onClick={() => sendMessage(sugg.prompt)}
                      className="w-full text-left px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.07] hover:border-blue-500/30 text-zinc-300 hover:text-white transition-all text-[12px] flex items-center gap-2.5 cursor-pointer group shadow-sm"
                    >
                      <span className="text-sm group-hover:scale-110 transition-transform">
                        {sugg.icon}
                      </span>
                      <span className="truncate">{sugg.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="shrink-0 p-3 bg-[#080c14] border-t border-white/[0.08]">
            {/* Unified Input Card matching Antigravity IDE */}
            <div className="relative rounded-2xl bg-[#0e1320] border border-white/[0.12] focus-within:border-blue-500/60 focus-within:ring-1 focus-within:ring-blue-500/25 transition-all shadow-lg overflow-hidden">
              {/* Textarea container with balanced horizontal & vertical padding */}
              <div style={{ padding: '12px 14px 8px 14px' }}>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Co-pilot a question, explain concepts, debug code..."
                  rows={1}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                    resize: 'none',
                    padding: '0',
                    margin: '0',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    color: '#f4f4f6',
                    display: 'block',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                  }}
                  className="custom-scrollbar max-h-36 overflow-y-auto placeholder-zinc-500"
                />
              </div>

              {/* Bottom Toolbar inside the Input Card */}
              <div
                style={{ padding: '4px 12px 10px 12px' }}
                className="flex items-center justify-between border-t border-white/[0.04]"
              >
                {/* Context Pill */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-[11px] text-zinc-300 font-medium cursor-default select-none transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="text-zinc-400 font-normal shrink-0">Context:</span>
                    <span className="truncate max-w-[120px] text-zinc-200">Rotated Array</span>
                  </div>
                </div>

                {/* Right Controls: Model Pill + Send Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-1.5 py-0.5 rounded select-none">
                    SDE AI
                  </span>
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0',
                      input.trim() && !isLoading
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/40 active:scale-95'
                        : 'bg-white/[0.06] text-zinc-500 pointer-events-none'
                    )}
                    title="Send message (Enter)"
                    aria-label="Send message"
                  >
                    <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Under-Card Micro Hints */}
            <div className="flex items-center justify-between px-2 mt-2 text-[10.5px] text-zinc-500">
              <span>Enter to send · Shift+Enter for newline</span>
              <span className="font-mono text-zinc-500">⌘J to close</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
