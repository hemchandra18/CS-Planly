/* ═══════════════════════════════════════════════════════
   Planly — AI Co-pilot Focus Modal (Morphing Orb Assistant)
   Full-screen immersive AI study assistant powered by
   MorphOrb in /components/ui/ai-thiking-orb-and-input
   ═══════════════════════════════════════════════════════ */

import { useEffect, useCallback } from 'react';
import { X, Sparkles, Command } from 'lucide-react';
import MorphOrb from '@/components/ui/ai-thiking-orb-and-input';
import { useCopilot } from '@/contexts/CopilotContext';
import { askCopilot, isGeminiConfigured } from '@/lib/gemini';

// Intelligent contextual study answers generator
function generateStudyResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('rotate') || (q.includes('binary') && q.includes('search'))) {
    return 'In rotated sorted arrays, one half is always strictly sorted. Compare nums[mid] with nums[left]: if nums[left] <= nums[mid], the left half is sorted. Check if target lies within that range; if yes, narrow right to mid - 1, otherwise search the right half in O(log N).';
  }

  if (q.includes('rain') || q.includes('water') || q.includes('two pointer')) {
    return 'For Trapping Rain Water, maintain leftMax and rightMax while advancing the pointer with the smaller boundary inward. Water trapped at each index depends strictly on min(leftMax, rightMax) - height[i], achieving optimal O(N) time and O(1) space.';
  }

  if (q.includes('dp') || q.includes('dynamic program') || q.includes('subsequence')) {
    return 'Break the problem into optimal subproblems. Define state dp[i][j], establish the base case, and formulate transitions. For space optimization, check if dp[i] depends only on row i-1 to compress memory from O(N*M) down to O(M).';
  }

  if (q.includes('system design') || q.includes('cache') || q.includes('redis') || q.includes('scale')) {
    return 'Use a Cache-Aside pattern with Redis and short TTLs to prevent stale reads. Add a Bloom Filter at the API gateway layer to prevent cache penetration, and use distributed locks or request coalescing to avert cache stampedes under high concurrency.';
  }

  if (q.includes('memory') || q.includes('page') || q.includes('os') || q.includes('virtual')) {
    return 'Virtual memory decouples process addresses from physical RAM using page tables and the MMU. On a TLB miss and page fault, the OS page fault handler interrupts execution, loads the requested frame from swap storage into RAM, and updates page descriptors.';
  }

  if (q.includes('dbms') || q.includes('index') || q.includes('sql') || q.includes('acid') || q.includes('b+')) {
    return 'B+ Trees provide O(log N) lookups and efficient sequential range scans because all data pointers reside in leaf nodes linked horizontally. For transactional safety, use WAL (Write-Ahead Logging) and two-phase locking for serializability.';
  }

  if (q.includes('tree') || q.includes('graph') || q.includes('dfs') || q.includes('bfs')) {
    return 'Use BFS with a Queue when searching for the shortest unweighted path or level-order traversal. Use DFS with recursion/stack for pathfinding, topological sorting, connected components, and cycle detection.';
  }

  return `Great question! Focus on breaking "${query}" down into core algorithmic invariants: identify boundary constraints, time/space trade-offs, and implement clean helper functions before testing edge cases.`;
}

export function CopilotModal() {
  const { isModalOpen, closeModal } = useCopilot();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const handleStudySubmit = useCallback(async (text: string): Promise<string> => {
    if (isGeminiConfigured()) {
      try {
        const reply = await askCopilot(text);
        if (reply) return reply;
      } catch (err) {
        console.warn('Gemini request failed, falling back to local reasoning:', err);
      }
    }
    // Fallback thinking delay & heuristic study response
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return generateStudyResponse(text);
  }, []);

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#04060b]/85 backdrop-blur-2xl text-white select-none animate-fade-in overflow-hidden">
      {/* Iridescent Ambient Chromatic Glow for Glass Refraction */}
      <div className="absolute -top-32 left-1/3 w-[640px] h-[640px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-purple-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-32 right-1/4 w-[560px] h-[560px] bg-gradient-to-br from-emerald-500/15 via-cyan-600/12 to-blue-600/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Glassmorphic Top Header Bar */}
      <header className="relative z-20 flex items-center justify-between px-6 py-3.5 bg-white/[0.03] backdrop-blur-2xl border-b border-white/[0.1] shadow-[0_4px_30px_rgba(0,0,0,0.4)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600/80 to-indigo-600/80 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                Planly AI Co-pilot
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[10px] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {isGeminiConfigured() ? 'Gemini 3.5 Active' : 'Glass Focus Mode'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Interactive Reasoning Orb & SDE Study Assistant</p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-300 bg-white/[0.05] backdrop-blur-xl border border-white/[0.12] px-3 py-1 rounded-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
            <Command className="w-3 h-3 text-zinc-400" />
            <span className="font-mono text-[11px] font-medium text-white">J</span>
            <span className="text-zinc-600 mx-1">·</span>
            <span className="text-zinc-400">ESC to close</span>
          </div>

          <button
            type="button"
            onClick={closeModal}
            className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] active:scale-95 backdrop-blur-xl border border-white/[0.1] hover:border-white/[0.2] flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
            title="Close Focus Mode"
            aria-label="Close Focus Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Interactive Stage with MorphOrb */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full min-h-[460px]">
        <MorphOrb onSubmit={handleStudySubmit} minThinkMs={2600} />
      </main>

      {/* Glassmorphic Footer Hints */}
      <footer className="relative z-20 flex flex-col items-center justify-center gap-2 px-6 py-4 bg-white/[0.02] backdrop-blur-2xl border-t border-white/[0.08] shadow-[0_-4px_30px_rgba(0,0,0,0.3)] shrink-0 text-center">
        <div className="flex items-center gap-2 text-xs text-zinc-400 flex-wrap justify-center">
          <span className="font-medium text-zinc-300">Try asking:</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] hover:border-blue-400/30 text-zinc-300 hover:text-white text-[11px] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_2px_8px_rgba(0,0,0,0.2)] transition-all cursor-pointer">
            Search in Rotated Sorted Array
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] hover:border-blue-400/30 text-zinc-300 hover:text-white text-[11px] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_2px_8px_rgba(0,0,0,0.2)] transition-all cursor-pointer">
            Trapping Rain Water
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] hover:border-blue-400/30 text-zinc-300 hover:text-white text-[11px] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_2px_8px_rgba(0,0,0,0.2)] transition-all cursor-pointer">
            Virtual Memory & Page Faults
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] hover:border-blue-400/30 text-zinc-300 hover:text-white text-[11px] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_2px_8px_rgba(0,0,0,0.2)] transition-all cursor-pointer">
            Cache-Aside with Redis
          </span>
        </div>
      </footer>
    </div>
  );
}
