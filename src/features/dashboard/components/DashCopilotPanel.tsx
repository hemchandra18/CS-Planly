import { useState, useRef, useEffect } from 'react';
import type { ChatMessage, TaskItem, GoalItem } from '../dashboardState';
import { askCopilot, getAITaskAdvice, isGeminiConfigured, setGeminiApiKey, getGeminiApiKey } from '@/lib/gemini';

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
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [apiKeyVal, setApiKeyVal] = useState(getGeminiApiKey());
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

    if (!isGeminiConfigured()) {
      setShowKeyInput(true);
      if (promptType === 'plan') {
        addMsg('Plan my day', 'user');
        const pendingTitles = tasks.filter((t) => !t.done).map((t) => t.title);
        const topTask = pendingTitles[0] || 'Portfolio case study';
        const secondTask = pendingTitles[1] || 'Deep work session';
        const thirdTask = pendingTitles[2] || 'Review weekly goals';
        addMsg(
          `Here is your focused schedule for today:\n\n• 09:00 AM – 11:00 AM: Focus block on "${topTask}"\n• 11:30 AM – 01:00 PM: Deep study session on "${secondTask}"\n• 02:00 PM – 03:30 PM: Milestone progress on "${thirdTask}"\n• 04:30 PM – 05:30 PM: Spaced review & plan tomorrow\n\n💡 Tip: Enter your Gemini API key in the bar above to unlock live personalized AI generation!`,
          'bot'
        );
      } else if (promptType === 'prioritize') {
        addMsg('Prioritize my tasks', 'user');
        onPrioritizeTasks();
        addMsg(
          `Tasks reordered by priority!\n\nHigh-priority tasks have been moved to the top of your schedule. Focus on completing these before moving on to medium or routine items.\n\n💡 Tip: Enter your Gemini API key in the bar above for deeper AI task prioritization insights.`,
          'bot'
        );
      } else if (promptType === 'review') {
        addMsg('Review my week', 'user');
        addMsg(
          `Here is your weekly progress overview:\n\n• Completed tasks: ${completedTasksCount} of ${totalTasksCount} tasks done today.\n• Active goals: ${goals.map((g) => `${g.name} (${g.pct}%)`).join(', ') || '3 goals in progress'}.\n• Recommendation: Keep up momentum on your high-priority items and schedule your next spaced repetition review.\n\n💡 Tip: Enter your Gemini API key in the bar above for in-depth AI progress reviews!`,
          'bot'
        );
      }
      return;
    }

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
        if (errorMsg.includes('key') || errorMsg.includes('API')) {
          setShowKeyInput(true);
        }
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
        if (errorMsg.includes('key') || errorMsg.includes('API')) {
          setShowKeyInput(true);
        }
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
        if (errorMsg.includes('key') || errorMsg.includes('API')) {
          setShowKeyInput(true);
        }
      } finally {
        setIsThinking(false);
      }
    }
  };

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isThinking) return;

    if (!isGeminiConfigured()) {
      addMsg(text, 'user');
      setInputValue('');
      setShowKeyInput(true);
      addMsg("I've noted that! Enter your Gemini API key in the bar above to unlock real-time AI responses.", 'bot');
      return;
    }

    addMsg(text, 'user');
    setInputValue('');
    setIsThinking(true);

    try {
      const reply = await askCopilot(text, getContext());
      addMsg(reply, 'bot');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to reach Gemini API';
      addMsg(`⚠️ Could not reach Gemini: ${errorMsg}`, 'bot');
      if (errorMsg.includes('key') || errorMsg.includes('API')) {
        setShowKeyInput(true);
      }
    } finally {
      setIsThinking(false);
    }
  };

  const handleSaveKey = () => {
    if (!apiKeyVal.trim()) return;
    setGeminiApiKey(apiKeyVal.trim());
    setShowKeyInput(false);
    addMsg("✅ Gemini API key saved successfully! You can now ask Copilot anything.", 'bot');
  };

  return (
    <aside className={`copilot-panel ${isOpen ? 'open' : ''}`} id="copilotPanel">
      <div className="copilot-panel-inner">
        {/* Panel Header */}
        <div className="copilot-head">
          <div className="t">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
              <circle cx="12" cy="12" r="3.2" />
            </svg>
            Study Copilot
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              title="Click to configure Gemini API Key"
              style={{
                marginLeft: '8px',
                padding: '2px 8px',
                borderRadius: '12px',
                background: isGeminiConfigured() ? 'rgba(61, 220, 151, 0.15)' : 'rgba(240, 168, 58, 0.15)',
                border: `1px solid ${isGeminiConfigured() ? 'rgba(61, 220, 151, 0.3)' : 'rgba(240, 168, 58, 0.3)'}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                fontSize: '11px',
                color: isGeminiConfigured() ? '#3ddc97' : '#f0a83a',
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
              {isGeminiConfigured() ? 'Gemini 3.5 AI' : 'Key Needed ⚙️'}
            </button>
          </div>
          <button className="copilot-close" id="copilotClose" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Optional In-Chat Key Setup Bar */}
        {showKeyInput && (
          <div
            style={{
              padding: '12px 16px',
              background: '#161922',
              borderBottom: '1px solid #24262d',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#e9eaed', fontWeight: 600 }}>
              🔑 Google Gemini API Key
            </div>
            <div style={{ fontSize: '11px', color: '#8c8f99', lineHeight: 1.4 }}>
              Enter your Gemini API key below. It is saved in your browser and used securely for live AI responses.
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="password"
                placeholder="Paste Gemini API key (AIzaSy... / AQ...)"
                value={apiKeyVal}
                onChange={(e) => setApiKeyVal(e.target.value)}
                style={{
                  flex: 1,
                  background: '#0c0d10',
                  border: '1px solid #2e323e',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  color: '#fff',
                  fontSize: '12px',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSaveKey}
                style={{
                  background: '#3478f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
            </div>
          </div>
        )}

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
