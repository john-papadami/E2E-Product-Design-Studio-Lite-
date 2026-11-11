/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ProductProject, StoryType } from './types/framework';
import { TEMPLATE_PROJECTS, STORY_OVERVIEWS } from './data/defaultTemplates';
import { Header } from './components/Header';
import { FrameworkOverview } from './components/FrameworkOverview';
import { StoryCanvas } from './components/StoryCanvas';
import { AlignmentMatrix } from './components/AlignmentMatrix';
import { PhaseRoadmap } from './components/PhaseRoadmap';
import { ExecutiveExportModal } from './components/ExecutiveExportModal';
import { NewProjectModal } from './components/NewProjectModal';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('e2e_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sync theme to document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('e2e_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('e2e_theme', 'light');
    }
  }, [isDark]);

  // Project state
  const [project, setProject] = useState<ProductProject>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('e2e_active_project');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          (['market', 'customer', 'technology', 'user', 'success'] as StoryType[]).forEach((st) => {
            if (parsed.stories && parsed.stories[st] && !parsed.stories[st].uxMethodologies) {
              parsed.stories[st].uxMethodologies = STORY_OVERVIEWS[st].uxMethodologies;
            }
          });
          return parsed;
        } catch (e) {
          console.error('Failed to parse saved project', e);
        }
      }
    }
    return TEMPLATE_PROJECTS[0];
  });

  // Auto-save project changes
  const handleUpdateProject = (updated: ProductProject) => {
    setProject(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('e2e_active_project', JSON.stringify(updated));
    }
  };

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    'blueprint' | 'canvas' | 'alignment' | 'phases'
  >('blueprint');

  // Currently focused story inside the Story Canvas
  const [activeStoryType, setActiveStoryType] = useState<StoryType>('market');

  // Modals
  const [showExportModal, setShowExportModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  // Navigation helpers
  const handleNavigateToStory = (storyType: StoryType) => {
    setActiveStoryType(storyType);
    setActiveTab('canvas');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToPhases = () => {
    setActiveTab('phases');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Bar adhering to the Top Bar Contract */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenExport={() => setShowExportModal(true)}
        onOpenNewProject={() => setShowNewProjectModal(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        projectName={project.name}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'blueprint' && (
          <FrameworkOverview
            project={project}
            onNavigateToStory={handleNavigateToStory}
            onNavigateToPhases={handleNavigateToPhases}
          />
        )}

        {activeTab === 'canvas' && (
          <StoryCanvas
            project={project}
            activeStoryType={activeStoryType}
            onSelectStoryType={setActiveStoryType}
            onUpdateProject={handleUpdateProject}
          />
        )}

        {activeTab === 'alignment' && (
          <AlignmentMatrix
            project={project}
            onNavigateToStory={handleNavigateToStory}
            onUpdateProject={handleUpdateProject}
          />
        )}

        {activeTab === 'phases' && (
          <PhaseRoadmap
            project={project}
            onUpdateProject={handleUpdateProject}
          />
        )}
      </main>

      {/* Quiet, Human Editorial Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 transition-colors mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              E2E Product Design Framework
            </span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span>Based on the strategic methodology by John Papadami</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('blueprint')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Blueprint View
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Export Dossier
            </button>
            <a
              href="https://jpapadami.wixsite.com/home/e2e-product-design-framework"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors underline underline-offset-4"
            >
              Original Portfolio Ref ↗
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ExecutiveExportModal
        project={project}
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      <NewProjectModal
        currentProjectId={project.id}
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onSelectProject={(newProj) => handleUpdateProject(newProj)}
      />
    </div>
  );
}
