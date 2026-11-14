/* ═══════════════════════════════════════════════════════
   Planly — Quick Search & Command Palette Modal
   Provides instant search for topics, sheets, problems, and roadmaps
   ═══════════════════════════════════════════════════════ */

import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  BookOpen,
  Code2,
  Database,
  Layers,
  FileText,
  ExternalLink,
  ArrowRight,
  X,
  Sparkles,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';

interface SearchItem {
  id: string;
  title: string;
  category: 'Topic' | 'DSA Sheet' | 'System Design' | 'Core CS' | 'Experience';
  description: string;
  path?: string;
  externalUrl?: string;
  badge?: string;
}

const SEARCH_CATALOG: SearchItem[] = [
  // DSA Sheets
  {
    id: 's-180',
    title: "Striver's SDE Sheet (Top 180)",
    category: 'DSA Sheet',
    description: 'Top coding interview problems patterned for FAANG & high-growth tech.',
    path: ROUTES.PLAN,
    badge: 'Popular',
  },
  {
    id: 's-a2z',
    title: "Striver's A2Z DSA Sheet",
    category: 'DSA Sheet',
    description: 'Complete step-by-step roadmap from basic data structures to advanced graphs and DP.',
    path: ROUTES.PLAN,
    badge: 'Comprehensive',
  },
  {
    id: 's-blind75',
    title: 'Blind 75 Must-Do LeetCode',
    category: 'DSA Sheet',
    description: 'Curated list of 75 essential problems covering key algorithmic patterns.',
    path: ROUTES.PLAN,
    badge: 'Essentials',
  },

  // System Design
  {
    id: 'sd-lld',
    title: 'Low Level Design (LLD) & Design Patterns',
    category: 'System Design',
    description: 'Object-oriented principles, SOLID, UML class diagrams, and machine coding.',
    path: ROUTES.PLAN,
    badge: 'Interview Ready',
  },
  {
    id: 'sd-hld',
    title: 'High Level Design (HLD) & Distributed Systems',
    category: 'System Design',
    description: 'Microservices, horizontal scaling, caching strategies, rate limiters, and sharding.',
    path: ROUTES.PLAN,
    badge: 'Advanced',
  },

  // Topics in Planly
  {
    id: 'dsa-binary-search-rotated',
    title: 'Search in Rotated Sorted Array',
    category: 'Topic',
    description: 'Binary search with modified conditions to detect sorted halves in O(log N).',
    path: '/topic/dsa-binary-search-rotated',
    badge: 'Medium',
  },
  {
    id: 'dsa-two-pointers-trap-rain',
    title: 'Trapping Rain Water',
    category: 'Topic',
    description: 'Compute trapped rainwater efficiently using the two-pointer technique in O(1) space.',
    path: '/topic/dsa-two-pointers-trap-rain',
    badge: 'Hard',
  },
  {
    id: 'os-virtual-memory',
    title: 'Virtual Memory & Page Replacement',
    category: 'Core CS',
    description: 'Paging mechanisms, TLB hit/miss handling, page faults, and LRU eviction.',
    path: '/topic/os-virtual-memory',
    badge: 'Operating Systems',
  },
  {
    id: 'dbms-indexing',
    title: 'Database Indexing & B+ Trees',
    category: 'Core CS',
    description: 'Clustered vs non-clustered indexes, B+ Tree internals, and query planner optimization.',
    path: ROUTES.PROGRESS,
    badge: 'DBMS',
  },
  {
    id: 'cn-tcp-handshake',
    title: 'TCP 3-Way Handshake & Connection Teardown',
    category: 'Core CS',
    description: 'SYN, SYN-ACK, ACK sequence numbering, congestion control, and TIME_WAIT state.',
    path: ROUTES.PROGRESS,
    badge: 'Networks',
  },

  // Interview Experiences
  {
    id: 'exp-google',
    title: 'Google L4 Software Engineer Experience',
    category: 'Experience',
    description: '4 technical rounds covering graph modeling, 2D dynamic programming, and system design.',
    path: ROUTES.DASHBOARD,
    badge: 'Selected',
  },
  {
    id: 'exp-amazon',
    title: 'Amazon SDE-2 Interview Experience',
    category: 'Experience',
    description: 'Leadership principles deep dive, Low Level Design for parking lot, and coding.',
    path: ROUTES.DASHBOARD,
    badge: 'Selected',
  },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Filter items
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_CATALOG;
    return SEARCH_CATALOG.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          handleSelect(filtered[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex]);

  const handleSelect = (item: SearchItem) => {
    onClose();
    if (item.externalUrl) {
      window.open(item.externalUrl, '_blank', 'noopener,noreferrer');
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const getCategoryIcon = (category: SearchItem['category']) => {
    switch (category) {
      case 'DSA Sheet':
        return <Code2 className="w-4 h-4 text-sky-400" />;
      case 'System Design':
        return <Layers className="w-4 h-4 text-purple-400" />;
      case 'Core CS':
        return <Database className="w-4 h-4 text-emerald-400" />;
      case 'Experience':
        return <FileText className="w-4 h-4 text-amber-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.16 }}
            className="relative w-full max-w-2xl bg-[#0c1017] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08]">
              <Search className="w-5 h-5 text-zinc-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search topics, DSA sheets, system design, or interview experiences..."
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono text-zinc-400 bg-white/[0.05] border border-white/10 rounded">
                ESC
              </kbd>
            </div>

            {/* Quick Categories Bar */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] border-b border-white/[0.06] text-xs text-zinc-400 overflow-x-auto no-scrollbar">
              <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold mr-1">
                Quick:
              </span>
              <button
                type="button"
                onClick={() => setQuery('DSA')}
                className="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                DSA Sheets
              </button>
              <button
                type="button"
                onClick={() => setQuery('Design')}
                className="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                System Design
              </button>
              <button
                type="button"
                onClick={() => setQuery('Core CS')}
                className="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Core Subjects
              </button>
              <button
                type="button"
                onClick={() => setQuery('Experience')}
                className="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Experiences
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[380px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 text-sm">
                  No matching results for "{query}". Try searching for "Binary Search", "A2Z", or "System Design".
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-start justify-between gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-600/15 border border-blue-500/30 text-white'
                          : 'hover:bg-white/[0.04] border border-transparent text-zinc-300'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-white/[0.05] shrink-0 mt-0.5">
                          {getCategoryIcon(item.category)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-white">
                              {item.title}
                            </span>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-400 border border-white/10">
                              {item.category}
                            </span>
                            {item.badge && (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/25">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1 text-zinc-500 self-center">
                        {item.externalUrl ? (
                          <ExternalLink className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer with Keyboard Shortcuts */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-t border-white/[0.06] text-xs text-zinc-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/[0.05] rounded border border-white/10">
                    ↑
                  </kbd>
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/[0.05] rounded border border-white/10">
                    ↓
                  </kbd>
                  <span>navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/[0.05] rounded border border-white/10">
                    ↵
                  </kbd>
                  <span>select</span>
                </span>
              </div>
              <div className="flex items-center gap-1 text-zinc-400">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>Planly Universal Search</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
