/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProductProject, StoryType } from '../types/framework';
import { STORY_OVERVIEWS, LIFECYCLE_PHASES } from '../data/defaultTemplates';
import {
  TrendingUp,
  Building2,
  Cpu,
  UserCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Sparkles,
  Compass,
  BookOpen
} from 'lucide-react';

interface FrameworkOverviewProps {
  project: ProductProject;
  onNavigateToStory: (storyType: StoryType) => void;
  onNavigateToPhases: () => void;
}

export const FrameworkOverview: React.FC<FrameworkOverviewProps> = ({
  project,
  onNavigateToStory,
  onNavigateToPhases
}) => {
  const [selectedStory, setSelectedStory] = useState<StoryType>('market');

  const storyIcons: Record<StoryType, React.ReactNode> = {
    market: <TrendingUp className="w-5 h-5 text-indigo-500" />,
    customer: <Building2 className="w-5 h-5 text-emerald-500" />,
    technology: <Cpu className="w-5 h-5 text-amber-500" />,
    user: <UserCheck className="w-5 h-5 text-sky-500" />,
    success: <Award className="w-5 h-5 text-violet-500" />
  };

  const currentOverview = STORY_OVERVIEWS[selectedStory];
  const activeStoryData = project.stories[selectedStory];

  // Calculate project deliverables progress
  const totalDeliverables = project.deliverables.length;
  const completedDeliverables = project.deliverables.filter((d) => d.completed).length;
  const progressPercent = totalDeliverables > 0 ? Math.round((completedDeliverables / totalDeliverables) * 100) : 0;

  // Calculate alignment checks count
  const allChecks = Object.values(project.stories).flatMap((s) => s.alignmentChecks);
  const alignedCount = allChecks.filter((c) => c.status === 'aligned').length;

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative pt-6 pb-2 flex flex-col w-full">
        <div className="w-full max-w-none flex flex-col h-full flex-1">
          <div className="mb-3"></div>

          <h1 className="block w-full max-w-none text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]" style={{ textWrap: 'balance' }}>
            Bridging Product Strategy, Deep Architecture & User Experience.
          </h1>

          <p className="w-full max-w-none mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            A strategic 5-story framework that breaks down organizational silos. Connect business viability,
            buyer procurement, technological feasibility, ergonomic UI execution, and verifiable ROI into one continuous delivery engine.
          </p>

          {/* Quick Metrics Bar - Full width with equal spacing between sections */}
          <div
            className="w-full my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm h-full min-h-full flex-1 self-stretch items-stretch"
            style={{ height: '100%', minHeight: '100%', width: '100%' }}
          >
            <div className="flex flex-col justify-start space-y-2 h-full">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Current Initiative</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white whitespace-normal break-words leading-snug">
                {project.name}
              </div>
            </div>
            <div className="flex flex-col justify-start space-y-2 h-full">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Deliverables Complete</div>
              <div className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {completedDeliverables}/{totalDeliverables} ({progressPercent}%)
              </div>
            </div>
            <div className="flex flex-col justify-start space-y-2 h-full">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Story Alignment</div>
              <div className="text-sm font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                {alignedCount}/{allChecks.length} Verified
              </div>
            </div>
            <div className="flex flex-col justify-start space-y-2 h-full">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Target Industry</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white whitespace-normal break-words leading-snug">
                {project.domain}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 5 Stories Interactive Blueprint Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              The 5-Story Narrative Architecture
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Select any story below to inspect its core thesis, strategic questions, and cross-functional alignment.
            </p>
          </div>
        </div>

        {/* 5-Story Horizontal Visual Chain */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {(['market', 'customer', 'technology', 'user', 'success'] as StoryType[]).map((st, idx) => {
            const overview = STORY_OVERVIEWS[st];
            const isSelected = selectedStory === st;
            const storyData = project.stories[st];

            return (
              <button
                key={st}
                onClick={() => setSelectedStory(st)}
                className={`text-left p-4 rounded-xl border transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-xs font-mono font-medium ${isSelected ? 'text-slate-300 dark:text-slate-600' : 'text-slate-400 dark:text-slate-500'}`}>
                      Story 0{idx + 1}
                    </span>
                    <span className="p-1 rounded-md bg-slate-100 dark:bg-slate-800">
                      {storyIcons[st]}
                    </span>
                  </div>
                  <h3 className="font-bold text-base leading-tight">
                    {overview.title}
                  </h3>
                  <p className={`text-xs mt-1.5 line-clamp-2 ${isSelected ? 'text-slate-200 dark:text-slate-700' : 'text-slate-500 dark:text-slate-400'}`}>
                    {storyData.subtitle || overview.shortDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/20 dark:border-slate-800/20 flex items-center justify-between text-xs font-medium">
                  <span className={isSelected ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500'}>
                    {storyData.sections.length} sections
                  </span>
                  <span className={`inline-flex items-center gap-1 ${isSelected ? 'text-white dark:text-slate-900' : 'text-slate-900 dark:text-white'}`}>
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Story Deep Dive Inspector Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 mt-1 shrink-0">
                {storyIcons[selectedStory]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Story Specification
                  </span>
                  <span aria-hidden="true" className="text-slate-400">·</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {activeStoryData.primaryStakeholders.join(', ')}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {currentOverview.title}: {activeStoryData.subtitle}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
                  {activeStoryData.objective}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateToStory(selectedStory)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shrink-0"
            >
              <span>Edit {currentOverview.title} Canvas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Deep dive 3-column breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <HelpCircle className="w-4 h-4" />
                <span>Foundational Question</span>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 leading-relaxed">
                "{currentOverview.coreQuestion}"
              </p>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <strong>Focus:</strong> {currentOverview.focus}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Layers className="w-4 h-4" />
                <span>Key Deliverables & Artifacts</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {currentOverview.typicalArtifacts.map((art, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mt-1.5 shrink-0" />
                    <span>{art}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Cross-Story Alignment Checks</span>
              </div>
              <div className="space-y-2">
                {activeStoryData.alignmentChecks.map((check, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs space-y-1"
                  >
                    <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                      <span>With {check.targetStory.toUpperCase()} Story</span>
                      <span className="font-mono text-[10px] uppercase text-emerald-600 dark:text-emerald-400 font-bold">
                        {check.status}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{check.question}</p>
                    <p className="text-slate-500 dark:text-slate-500 italic text-[11px] mt-1">
                      {check.notes}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Integrated UX Methodologies for this story */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>Integrated UX Methodologies for {currentOverview.title}</span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {(activeStoryData.uxMethodologies || currentOverview.uxMethodologies || []).length} Framework Methods
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(activeStoryData.uxMethodologies || currentOverview.uxMethodologies || []).slice(0, 3).map((method) => (
                <div
                  key={method.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1.5 text-xs flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono font-semibold uppercase text-slate-500">
                      <span>{method.category}</span>
                      {method.isPrimary && (
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white leading-snug">
                      {method.name}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                      {method.description}
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/50 dark:border-slate-800/50">
                    <strong className="text-slate-700 dark:text-slate-300">Output:</strong> {method.keyOutputs.slice(0, 2).join(' · ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The 5 Continuous Lifecycle Phases */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Continuous Delivery Trajectory
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              From discovering the right problem to delivering measurable business & user value.
            </p>
          </div>
          <button
            onClick={onNavigateToPhases}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5"
          >
            <span>View Full Deliverables Checklist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {LIFECYCLE_PHASES.map((p, idx) => {
            const phaseDeliverables = project.deliverables.filter((d) => d.phase === p.phase);
            const doneCount = phaseDeliverables.filter((d) => d.completed).length;

            return (
              <div
                key={p.phase}
                className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 dark:text-slate-500 mb-2">
                    <span>Phase 0{idx + 1}</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-700 dark:text-slate-300">
                      {doneCount}/{phaseDeliverables.length}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {p.name.replace(/^\d+\.\s*/, '')}
                  </h3>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    {p.tagline}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="font-medium text-slate-700 dark:text-slate-300 mb-1">Key outputs:</div>
                  <div className="truncate">{p.keyOutputs.slice(0, 2).join(', ')}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Strategic Tenets & Design Constitution */}
      <section className="bg-slate-100 dark:bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Compass className="w-4 h-4" />
            <span>Framework Guiding Principles</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            "Design is not decoration at the end; it is the synthesis of strategy, architecture, and ergonomics."
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">No Siloed Handoffs</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Engineering feasibility informs product scope from Day 1; UI designers participate in buyer discovery to understand true workflow pressure.
              </p>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Objective Alignment</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Every user story links directly to a customer business driver, which in turn justifies the technology investment and market bet.
              </p>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Measurable Outcomes</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Success is never "feature shipped" — it is quantifiable cycle time reduction, verifiable adoption, and retained business ROI.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
