import { useState, useRef, useEffect } from 'react';
import type { ChatMessage, TaskItem, GoalItem } from '../dashboardState';
import { askCopilot, getAITaskAdvice, isGeminiConfigured } from '@/lib/gemini';

interface DashCopilotPanelProps {
  isOpen: boolean;
  onClose: () => void;
  completedTasksCount: number;
  totalTasksCount: number;
  onPrioritizeTasks: () => void;
  tasks?: TaskItem[];
  goals?: GoalItem[];
  userName?: string;
}

export function DashCopilotPanel({
  isOpen,
  onClose,
  completedTasksCount,
  totalTasksCount,
  onPrioritizeTasks,
  tasks = [],
  goals = [],
  userName = 'Student',
}: DashCopilotPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const addMsg = (text: string, who: 'user' | 'bot') => {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, text, who },
    ]);
  };

  const getContext = () => ({
    userName,
    tasksCount: totalTasksCount,
    completedTasksCount,
    pendingTasks: tasks.filter((t) => !t.done).map((t) => `${t.title} (${t.priority} priority, ${t.cat})`),
    currentGoals: goals.map((g) => `${g.name} (${g.pct}% completed)`),
  });

  const handleSuggest = async (promptType: 'plan' | 'prioritize' | 'review') => {
    if (isThinking) return;

    if (promptType === 'plan') {
      addMsg('Plan my day', 'user');
      setIsThinking(true);
      try {
        const reply = await askCopilot(
          "Generate a focused, time-blocked daily schedule for me today based on my pending tasks and goals. Be concise and practical.",
          getContext()
        );
        addMsg(reply, 'bot');
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Error generating response';
        addMsg(`⚠️ ${errorMsg}`, 'bot');
      } finally {
        setIsThinking(false);
      }
    } else if (promptType === 'prioritize') {
      addMsg('Prioritize my tasks', 'user');
      onPrioritizeTasks();
      setIsThinking(true);
      try {
        const advice = await getAITaskAdvice(tasks);
        addMsg(`Tasks reordered by priority!\n\n${advice}`, 'bot');
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Error prioritizing tasks';
        addMsg(`Tasks reordered by priority. (AI advice: ${errorMsg})`, 'bot');
      } finally {
        setIsThinking(false);
      }
    } else if (promptType === 'review') {
      addMsg('Review my week', 'user');
      setIsThinking(true);
      try {
        const reply = await askCopilot(
          "Give me an analytical review of my progress this week, highlighting what is going well and 1 key improvement area.",
          getContext()
        );
        addMsg(reply, 'bot');
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Error reviewing week';
        addMsg(`⚠️ ${errorMsg}`, 'bot');
      } finally {
        setIsThinking(false);
      }
    }
  };

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isThinking) return;

    addMsg(text, 'user');
    setInputValue('');
    setIsThinking(true);

    try {
      const reply = await askCopilot(text, getContext());
      addMsg(reply, 'bot');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to reach Gemini API';
      addMsg(`⚠️ Could not reach Gemini: ${errorMsg}`, 'bot');
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <aside className={`copilot ${isOpen ? 'open' : ''}`} id="copilotPanel">
      <div className="copilot-inner">
        {/* Header */}
        <div className="copilot-head">
          <div className="t" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', color: '#5b8def' }}>
              <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
              <circle cx="12" cy="12" r="3.2" />
            </svg>
            <span>Planly Copilot</span>
            <span
              style={{
                fontSize: '11px',
                padding: '2px 7px',
                borderRadius: '12px',
                background: isGeminiConfigured() ? 'rgba(61, 220, 151, 0.15)' : 'rgba(240, 168, 58, 0.15)',
                color: isGeminiConfigured() ? '#3ddc97' : '#f0a83a',
                border: `1px solid ${isGeminiConfigured() ? 'rgba(61, 220, 151, 0.3)' : 'rgba(240, 168, 58, 0.3)'}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 500,
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: isGeminiConfigured() ? '#3ddc97' : '#f0a83a',
                  display: 'inline-block',
                }}
              />
              {isGeminiConfigured() ? 'Gemini 3.5 AI' : 'Key Needed'}
            </span>
          </div>
          <button className="copilot-close" id="copilotClose" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Chat Body */}
        <div className="copilot-body" id="copilotBody" ref={bodyRef}>
          <div className="copilot-intro">
            <div className="copilot-orb">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
                <circle cx="12" cy="12" r="3.2" />
              </svg>
            </div>
            <h3>Hi {userName}! I'm Planly Copilot.</h3>
            <p>
              Powered by Google Gemini 3.5. Ask me anything about your study plan,
              DSA problems, interview strategies, or schedule optimization.
            </p>
          </div>

          <button
            className="suggest-btn"
            disabled={isThinking}
            onClick={() => handleSuggest('plan')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Plan my day<span className="arrow">→</span>
          </button>

          <button
            className="suggest-btn"
            disabled={isThinking}
            onClick={() => handleSuggest('prioritize')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m3 16 4 4 4-4" />
              <path d="M7 20V4" />
              <path d="m21 8-4-4-4 4" />
              <path d="M17 4v16" />
            </svg>
            Prioritize my tasks<span className="arrow">→</span>
          </button>

          <button
            className="suggest-btn"
            disabled={isThinking}
            onClick={() => handleSuggest('review')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Review my week<span className="arrow">→</span>
          </button>

          {/* Messages */}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`msg ${m.who}`}
              style={{
                whiteSpace: 'pre-wrap',
                lineHeight: 1.5,
              }}
            >
              {m.text}
            </div>
          ))}

          {/* Thinking indicator */}
          {isThinking && (
            <div
              className="msg bot"
              style={{
                fontStyle: 'italic',
                color: '#8c8f99',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#5b8def',
                  animation: 'pulse 1s infinite alternate',
                }}
              />
              Gemini is thinking…
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="copilot-foot">
          <div className="copilot-input">
            <input
              id="copilotInput"
              placeholder={isThinking ? 'Waiting for Gemini…' : 'Ask Copilot anything…'}
              value={inputValue}
              disabled={isThinking}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <button
              className="copilot-send"
              id="copilotSend"
              disabled={isThinking || !inputValue.trim()}
              onClick={handleSend}
              title="Send to Gemini"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 20l18-8L3 4v6l12 2-12 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
