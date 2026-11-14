/* ═══════════════════════════════════════════════════════
   Planly — Gemini AI Service
   Powered by Google GenAI (gemini-3.5-flash-lite)
   ═══════════════════════════════════════════════════════ */

import { GoogleGenAI } from '@google/genai';

// Retrieve API key from Vite environment or localStorage override
export function getGeminiApiKey(): string {
  const envKey = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_GEMINI_API_KEY || '';
  if (envKey) return envKey.trim();

  try {
    return localStorage.getItem('planly_gemini_api_key') || '';
  } catch {
    return '';
  }
}

export function setGeminiApiKey(key: string): void {
  try {
    localStorage.setItem('planly_gemini_api_key', key.trim());
  } catch {
    // Ignore storage errors
  }
}

export function isGeminiConfigured(): boolean {
  return Boolean(getGeminiApiKey());
}

let aiInstance: GoogleGenAI | null = null;
let currentKey = '';

function getAIClient(): GoogleGenAI {
  const key = getGeminiApiKey();
  if (!key) {
    throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env.local file.');
  }

  if (!aiInstance || currentKey !== key) {
    aiInstance = new GoogleGenAI({ apiKey: key });
    currentKey = key;
  }
  return aiInstance;
}

export interface CopilotContext {
  userName?: string;
  tasksCount?: number;
  completedTasksCount?: number;
  pendingTasks?: string[];
  currentGoals?: string[];
}

const SYSTEM_INSTRUCTION = `You are Planly Copilot, an expert AI career mentor and CS study planner.
Your goal is to guide software engineering candidates and students preparing for technical interviews (DSA, System Design, OS, DBMS, Networks) and career milestones.
Be concise, clear, encouraging, and highly actionable. Format your answers with markdown bullets or short paragraphs where appropriate.`;

/**
 * Ask the Copilot a question with optional workspace context
 */
export async function askCopilot(
  prompt: string,
  context?: CopilotContext
): Promise<string> {
  const ai = getAIClient();

  let contextPrompt = '';
  if (context) {
    const parts: string[] = [];
    if (context.userName) parts.push(`User: ${context.userName}`);
    if (context.tasksCount !== undefined) {
      parts.push(`Today's progress: ${context.completedTasksCount || 0}/${context.tasksCount} tasks completed.`);
    }
    if (context.pendingTasks && context.pendingTasks.length > 0) {
      parts.push(`Current pending tasks: ${context.pendingTasks.join(', ')}`);
    }
    if (context.currentGoals && context.currentGoals.length > 0) {
      parts.push(`Active goals: ${context.currentGoals.join(', ')}`);
    }
    if (parts.length > 0) {
      contextPrompt = `[Context: ${parts.join(' | ')}]\n\n`;
    }
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash-lite',
    contents: `${SYSTEM_INSTRUCTION}\n\n${contextPrompt}User Question: ${prompt}`,
  });

  return response.text || "I couldn't generate a response. Please try again.";
}

/**
 * AI-assisted task prioritizer
 */
export async function getAITaskAdvice(
  tasks: Array<{ id: number; title: string; priority: string; cat?: string; duration: string }>
): Promise<string> {
  const taskList = tasks
    .map((t, idx) => `${idx + 1}. [${t.priority}] ${t.title} (${t.cat || 'General'}, ${t.duration})`)
    .join('\n');

  const prompt = `Review these daily tasks and give me a brief 2-3 sentence strategic advice on the most efficient order to tackle them today:\n${taskList}`;
  return askCopilot(prompt);
}
