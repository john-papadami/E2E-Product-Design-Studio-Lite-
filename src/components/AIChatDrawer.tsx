/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ProductProject, StoryType } from '../types/framework';
import {
  ChatMessageItem,
  ChatRolePersona,
  sendStrategyChatMessage,
  summarizeStories,
} from '../services/aiService';
import {
  MessageSquareText,
  X,
  Send,
  Loader2,
  Globe,
  Sparkles,
  Trash2,
  ExternalLink,
  AlertCircle,
  Zap,
  Brain,
} from 'lucide-react';

interface AIChatDrawerProps {
  project: ProductProject;
  activeStoryType: StoryType;
  isOpen: boolean;
  onToggleOpen: (open: boolean) => void;
}

const ROLE_OPTIONS: Array<{
  id: ChatRolePersona;
  label: string;
  shortDesc: string;
  defaultSearch: boolean;
}> = [
  {
    id: 'strategist',
    label: 'Lead E2E Strategist',
    shortDesc: 'Cross-story alignment & product bets',
    defaultSearch: false,
  },
  {
    id: 'market',
    label: 'Market Analyst',
    shortDesc: 'Competitors, sizing & live web trends',
    defaultSearch: true,
  },
  {
    id: 'researcher',
    label: 'UX & Customer Researcher',
    shortDesc: 'JTBD, user flows & usability tests',
    defaultSearch: false,
  },
  {
    id: 'architect',
    label: 'Systems Architect',
    shortDesc: 'Feasibility, SLAs, security & APIs',
    defaultSearch: false,
  },
  {
    id: 'analytics',
    label: 'Metrics & Success Lead',
    shortDesc: 'North Star KPIs & measurement plans',
    defaultSearch: false,
  },
];

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  project,
  activeStoryType,
  isOpen,
  onToggleOpen,
}) => {
  const [rolePersona, setRolePersona] = useState<ChatRolePersona>('strategist');
  const [mode, setMode] = useState<'balanced' | 'deep' | 'fast'>('balanced');
  const [useSearch, setUseSearch] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const threadEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSending, isOpen]);

  const handleSelectRole = (nextRole: ChatRolePersona) => {
    setRolePersona(nextRole);
    const meta = ROLE_OPTIONS.find((r) => r.id === nextRole);
    if (meta) {
      setUseSearch(meta.defaultSearch);
    }
  };

  const buildContextString = () => {
    const conceptsSummary =
      project.designConcepts && project.designConcepts.length > 0
        ? `\nDesign Concepts: ${project.designConcepts
            .map((c) => `${c.title} (${c.validationStatus}, ${c.validationScore ?? 'N/A'}/100)`)
            .join('; ')}`
        : '';

    return `Project Name: ${project.name}
Domain: ${project.domain}
Target Audience: ${project.targetAudience}
Vision Statement: ${project.visionStatement}
Currently Focused Story: ${activeStoryType.toUpperCase()}
${summarizeStories(project.stories)}${conceptsSummary}`;
  };

  const handleSend = async (promptText?: string) => {
    const textToSend = (promptText ?? input).trim();
    if (!textToSend || isSending) return;

    const userMsg: ChatMessageItem = {
      id: `msg-u-${Date.now()}`,
      role: 'user',
      text: textToSend,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    if (!promptText) setInput('');
    setIsSending(true);
    setError(null);

    try {
      const result = await sendStrategyChatMessage({
        messages: nextHistory.map((m) => ({ role: m.role, text: m.text })),
        rolePersona,
        mode,
        useSearch,
        projectContext: buildContextString(),
      });

      const assistantMsg: ChatMessageItem = {
        id: `msg-m-${Date.now()}`,
        role: 'model',
        text: result.reply,
        sources: result.sources,
        modelUsed: result.modelUsed,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response from Gemini.');
    } finally {
      setIsSending(false);
    }
  };

  const starterPrompts = [
    `Identify the top 3 cross-story gaps or misalignments in ${project.name}.`,
    `Search current competitors and recent industry shifts in ${project.domain}.`,
    `Challenge the riskiest assumptions in our ${activeStoryType} story.`,
    `Suggest concrete UX validation experiments for our user workflows.`,
  ];

  const activeRoleMeta = ROLE_OPTIONS.find((r) => r.id === rolePersona) || ROLE_OPTIONS[0];

  return (
    <>
      {/* Floating Chat Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => onToggleOpen(true)}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-slate-900 text-white dark:bg-indigo-600 dark:text-white hover:bg-slate-800 dark:hover:bg-indigo-700 shadow-lg border border-slate-700/40 transition-all text-xs font-semibold"
          aria-label="Open Gemini Strategy Chat"
        >
          <MessageSquareText className="w-4 h-4" />
          <span>AI Strategy Chat</span>
          {messages.length > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-mono rounded-full bg-indigo-500 text-white dark:bg-white dark:text-indigo-700">
              {messages.length}
            </span>
          )}
        </button>
      )}

      {/* Slide-over Chat Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    E2E Strategy AI Consultant
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {activeRoleMeta.shortDesc} · {project.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setMessages([]);
                      setError(null);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Clear conversation"
                    aria-label="Clear conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onToggleOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close chat drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Role Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {ROLE_OPTIONS.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleSelectRole(role.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors border ${
                    rolePersona === role.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>

            {/* Mode + Google Search Grounding Controls */}
            <div className="flex items-center justify-between gap-2 pt-1 text-[11px]">
              <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5">
                <button
                  type="button"
                  onClick={() => setMode('balanced')}
                  className={`px-2 py-1 rounded-md font-medium transition-colors ${
                    mode === 'balanced'
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Balanced
                </button>
                <button
                  type="button"
                  onClick={() => setMode('deep')}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md font-medium transition-colors ${
                    mode === 'deep'
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Brain className="w-3 h-3" />
                  <span>Deep</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('fast')}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md font-medium transition-colors ${
                    mode === 'fast'
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  <span>Fast</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setUseSearch(!useSearch)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-semibold transition-colors ${
                  useSearch
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-700'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
                title="Toggle live Google Search Grounding (gemini-4-hydrogen)"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Google Search {useSearch ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* Scrollable Message Thread */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 ? (
              <div className="space-y-4 py-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Context-Aware 5-Story Assistant
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Ask me to critique cross-story alignment, research live competitors with Google Search, refine technical constraints, or design validation experiments for{' '}
                    <strong className="text-slate-800 dark:text-slate-200">{project.name}</strong>.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Suggested Prompts
                  </div>
                  {starterPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (idx === 1) setUseSearch(true);
                        handleSend(prompt);
                      }}
                      className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-slate-900/80 text-xs text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {msg.text}

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Globe className="w-3 h-3 text-emerald-500" />
                          <span>Google Search Sources</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.slice(0, 6).map((src, sIdx) => (
                            <a
                              key={sIdx}
                              href={src.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline max-w-[220px] truncate"
                              title={src.title}
                            >
                              <span className="truncate">{src.title}</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {isSending && (
              <div className="flex items-start">
                <div className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 inline-flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                  <span>
                    {useSearch ? 'Searching the web & synthesizing...' : 'Thinking...'}
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div ref={threadEndRef} />
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900"
          >
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={2}
                placeholder={`Ask ${activeRoleMeta.label}... (Shift+Enter for new line)`}
                className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-40 shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
