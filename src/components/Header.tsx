/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Download, Sun, Moon, Plus } from 'lucide-react';

interface HeaderProps {
  activeTab: 'blueprint' | 'canvas' | 'alignment' | 'phases';
  onSelectTab: (tab: 'blueprint' | 'canvas' | 'alignment' | 'phases') => void;
  onOpenExport: () => void;
  onOpenNewProject: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  projectName: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenExport,
  onOpenNewProject,
  isDark,
  onToggleTheme,
  projectName
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark */}
        <button
          onClick={() => onSelectTab('blueprint')}
          className="text-left group flex items-baseline gap-2 whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:focus-visible:ring-slate-100 rounded-md"
        >
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            E2E Product Design Studio
          </span>
          <span className="hidden lg:inline text-xs font-mono text-slate-500 dark:text-slate-400">
            · 5-Story Pipeline
          </span>
        </button>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onSelectTab('blueprint')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              activeTab === 'blueprint'
                ? 'text-slate-900 dark:text-white font-semibold underline underline-offset-8 decoration-2 decoration-slate-900 dark:decoration-white'
                : ''
            }`}
          >
            Blueprint
          </button>
          <button
            onClick={() => onSelectTab('canvas')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              activeTab === 'canvas'
                ? 'text-slate-900 dark:text-white font-semibold underline underline-offset-8 decoration-2 decoration-slate-900 dark:decoration-white'
                : ''
            }`}
          >
            Story Canvas
          </button>
          <button
            onClick={() => onSelectTab('alignment')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              activeTab === 'alignment'
                ? 'text-slate-900 dark:text-white font-semibold underline underline-offset-8 decoration-2 decoration-slate-900 dark:decoration-white'
                : ''
            }`}
          >
            Alignment Matrix
          </button>
          <button
            onClick={() => onSelectTab('phases')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white ${
              activeTab === 'phases'
                ? 'text-slate-900 dark:text-white font-semibold underline underline-offset-8 decoration-2 decoration-slate-900 dark:decoration-white'
                : ''
            }`}
          >
            Phase Deliverables
          </button>
        </nav>

        {/* Zone 3: 1 primary action + subtle utilities */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg transition-colors border border-slate-200 dark:border-slate-800"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenNewProject}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Switch Project</span>
          </button>

          <button
            onClick={onOpenExport}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Brief</span>
          </button>
        </div>
      </div>

      {/* Mobile nav drawer strip */}
      <div className="md:hidden flex items-center justify-around px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs font-medium text-slate-600 dark:text-slate-400 overflow-x-auto">
        {(['blueprint', 'canvas', 'alignment', 'phases'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onSelectTab(tab)}
            className={`px-2 py-1 capitalize whitespace-nowrap ${
              activeTab === tab
                ? 'text-slate-900 dark:text-white font-bold'
                : 'hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </header>
  );
};
