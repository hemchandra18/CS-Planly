/* ═══════════════════════════════════════════════════════
   Planly — MarkdownMessage Component
   Renders developer-grade structured AI markdown with
   code blocks, copy button, inline tokens, and blockquotes.
   ═══════════════════════════════════════════════════════ */

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface MarkdownMessageProps {
  content: string;
}

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  // Split content into blocks (code blocks vs text blocks)
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts: Array<{ type: 'text' | 'code'; lang?: string; value: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        value: content.slice(lastIndex, match.index),
      });
    }
    parts.push({
      type: 'code',
      lang: match[1] || 'code',
      value: match[2].trim(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      value: content.slice(lastIndex),
    });
  }

  return (
    <div className="space-y-3 text-[13px] leading-relaxed text-zinc-200">
      {parts.map((part, idx) => {
        if (part.type === 'code') {
          return <CodeBlock key={idx} code={part.value} lang={part.lang} />;
        }
        return <TextBlock key={idx} text={part.value} />;
      })}
    </div>
  );
}

function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="relative my-2.5 rounded-xl bg-[#060911] border border-white/10 overflow-hidden shadow-inner group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.03] border-b border-white/[0.06] text-[11px] font-mono text-zinc-400">
        <span className="uppercase text-blue-400 font-semibold text-[10px] tracking-wider">
          {lang || 'code'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-md hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-all cursor-pointer select-none text-[11px]"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <pre className="p-3 text-[12px] font-mono text-zinc-200 overflow-x-auto custom-scrollbar leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function TextBlock({ text }: { text: string }) {
  const lines = text.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        // Heading 3: ### Title
        if (trimmed.startsWith('### ')) {
          return (
            <h3
              key={idx}
              className="text-[14.5px] font-bold text-white tracking-tight mt-3 mb-1 first:mt-0 flex items-center gap-2"
            >
              {renderFormattedInline(trimmed.replace(/^### /, ''))}
            </h3>
          );
        }

        // Heading 4: #### Title
        if (trimmed.startsWith('#### ')) {
          return (
            <h4
              key={idx}
              className="text-[13.5px] font-semibold text-zinc-100 tracking-tight mt-2.5 mb-1"
            >
              {renderFormattedInline(trimmed.replace(/^#### /, ''))}
            </h4>
          );
        }

        // Blockquote: > Note
        if (trimmed.startsWith('> ')) {
          return (
            <div
              key={idx}
              className="my-2 border-l-2 border-blue-500/60 bg-blue-500/[0.06] rounded-r-lg px-3 py-2 text-zinc-300 text-[12.5px]"
            >
              {renderFormattedInline(trimmed.replace(/^> /, ''))}
            </div>
          );
        }

        // Bullet: - item or * item
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 text-zinc-300 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400/80 mt-2 shrink-0" />
              <div className="flex-1">{renderFormattedInline(trimmed.replace(/^[-*] /, ''))}</div>
            </div>
          );
        }

        // Numbered list: 1. item
        if (/^\d+\.\s/.test(trimmed)) {
          const numberMatch = trimmed.match(/^(\d+)\.\s(.*)/);
          if (numberMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 text-zinc-300 pl-1">
                <span className="text-zinc-500 font-mono text-xs mt-0.5 shrink-0">
                  {numberMatch[1]}.
                </span>
                <div className="flex-1">{renderFormattedInline(numberMatch[2])}</div>
              </div>
            );
          }
        }

        // Regular paragraph
        return (
          <p key={idx} className="text-zinc-300 leading-relaxed">
            {renderFormattedInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Parses **bold** and `code` inline tokens
function renderFormattedInline(str: string) {
  const tokens: Array<{ type: 'text' | 'bold' | 'code'; value: string }> = [];
  let remaining = str;

  while (remaining.length > 0) {
    // Check for inline code `...`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      tokens.push({ type: 'code', value: codeMatch[1] });
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Check for bold **...**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      tokens.push({ type: 'bold', value: boldMatch[1] });
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Regular text up to next special char
    const nextSpecial = remaining.search(/[`*]/);
    if (nextSpecial === -1) {
      tokens.push({ type: 'text', value: remaining });
      break;
    } else if (nextSpecial > 0) {
      tokens.push({ type: 'text', value: remaining.slice(0, nextSpecial) });
      remaining = remaining.slice(nextSpecial);
    } else {
      // Single ` or * that didn't match a full token
      tokens.push({ type: 'text', value: remaining[0] });
      remaining = remaining.slice(1);
    }
  }

  return (
    <>
      {tokens.map((token, i) => {
        if (token.type === 'bold') {
          return (
            <strong key={i} className="font-semibold text-white">
              {token.value}
            </strong>
          );
        }
        if (token.type === 'code') {
          return (
            <code
              key={i}
              className="px-1.5 py-0.5 mx-0.5 rounded-md bg-white/[0.08] text-blue-300 font-mono text-[11.5px] border border-white/[0.08]"
            >
              {token.value}
            </code>
          );
        }
        return <span key={i}>{token.value}</span>;
      })}
    </>
  );
}
