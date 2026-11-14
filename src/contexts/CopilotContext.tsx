/* ═══════════════════════════════════════════════════════
   Planly — Copilot Context & State Provider
   Manages the AI assistant panel, message history,
   streaming state, and focus modal.
   ═══════════════════════════════════════════════════════ */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { generateCopilotAnswer } from '@/lib/copilotResponses';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thinking?: string;
  timestamp: string;
}

interface CopilotContextType {
  isOpen: boolean;
  toggleCopilot: () => void;
  openCopilot: () => void;
  closeCopilot: () => void;
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (query: string) => Promise<void>;
  clearMessages: () => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

const CopilotContext = createContext<CopilotContextType | undefined>(undefined);

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'assistant',
    content: `### Welcome to Planly Co-pilot! ⚡

I'm your personalized CS & SDE study assistant. I can help you:
- **Deconstruct complex topics** (Binary search invariants, Two Pointers, Dynamic Programming, Virtual Memory)
- **Review and debug code** with optimal time/space complexities
- **Conduct mock technical interviews** with hints and follow-ups

What are you working on today?`,
    thinking: 'Initialized session context for SDE-1 study track. Pre-loaded current focus: Search in Rotated Sorted Array.',
    timestamp: '10:00 AM',
  },
];

export function CopilotProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('planly_copilot_open');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('planly_copilot_messages');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Save messages to local storage
  useEffect(() => {
    try {
      localStorage.setItem('planly_copilot_messages', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Global Cmd+J / Ctrl+J listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleCopilot = () => {
    setIsOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('planly_copilot_open', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const openCopilot = () => {
    setIsOpen(true);
    try {
      localStorage.setItem('planly_copilot_open', JSON.stringify(true));
    } catch {}
  };

  const closeCopilot = () => {
    setIsOpen(false);
    try {
      localStorage.setItem('planly_copilot_open', JSON.stringify(false));
    } catch {}
  };

  const sendMessage = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    openCopilot();

    // Simulate realistic AI thinking/streaming latency
    await new Promise((resolve) => setTimeout(resolve, 450));

    const answer = generateCopilotAnswer(trimmed);

    const assistantMsg: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: answer.markdown,
      thinking: answer.thinking,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  const clearMessages = () => {
    setMessages(INITIAL_MESSAGES);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleModal = () => setIsModalOpen((prev) => !prev);

  return (
    <CopilotContext.Provider
      value={{
        isOpen,
        toggleCopilot,
        openCopilot,
        closeCopilot,
        messages,
        isLoading,
        sendMessage,
        clearMessages,
        isModalOpen,
        openModal,
        closeModal,
        toggleModal,
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
}

export function useCopilot() {
  const context = useContext(CopilotContext);
  if (!context) {
    throw new Error('useCopilot must be used within a CopilotProvider');
  }
  return context;
}
