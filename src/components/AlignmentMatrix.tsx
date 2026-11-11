/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProductProject, StoryType, StakeholderRole } from '../types/framework';
import { STORY_OVERVIEWS } from '../data/defaultTemplates';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  Building2,
  Cpu,
  UserCheck,
  Award,
  Filter,
  Users2
} from 'lucide-react';

interface AlignmentMatrixProps {
  project: ProductProject;
  onNavigateToStory: (storyType: StoryType) => void;
  onUpdateProject: (updated: ProductProject) => void;
}

export const AlignmentMatrix: React.FC<AlignmentMatrixProps> = ({
  project,
  onNavigateToStory,
  onUpdateProject
}) => {
  const [roleFilter, setRoleFilter] = useState<'all' | StakeholderRole>('all');

  const storyIcons: Record<StoryType, React.ReactNode> = {
    market: <TrendingUp className="w-4 h-4 text-indigo-500" />,
    customer: <Building2 className="w-4 h-4 text-emerald-500" />,
    technology: <Cpu className="w-4 h-4 text-amber-500" />,
    user: <UserCheck className="w-4 h-4 text-sky-500" />,
    success: <Award className="w-4 h-4 text-violet-500" />
  };

  // Cross-functional responsibilities breakdown by role
  const roleResponsibilities: Record<
    StakeholderRole,
    { label: string; focus: string; storyInvolvement: Record<StoryType, string> }
  > = {
    product: {
      label: 'Product Management',
      focus: 'Value proposition, scope discipline, roadmap prioritization, and business justification.',
      storyInvolvement: {
        market: 'Leads TAM sizing, timing analysis, and competitor teardowns.',
        customer: 'Co-leads buyer discovery and pricing model definitions.',
        technology: 'Defines MVP scope boundaries and technical non-goals.',
        user: 'Validates task flows against customer jobs-to-be-done.',
        success: 'Owns North Star metric tracking and OKR cadence.'
      }
    },
    design: {
      label: 'UX & Product Design',
      focus: 'User empathy, workflow ergonomics, interaction design, and WCAG accessibility standards.',
      storyInvolvement: {
        market: 'Applies Competitive UX Teardowns & Heuristic Benchmarking to identify market differentiation.',
        customer: 'Conducts Jobs-to-be-Done (JTBD) interviews and Stakeholder Journey Mapping.',
        technology: 'Runs Technical POC Feasibility Spikes and enforces Perceptual Latency Budgets.',
        user: 'Executes Task Flow Modeling, OOUX, Enterprise Design Systems, and WCAG 2.2 AA Auditing.',
        success: 'Drives Empirical Usability Benchmarking (SUS/SEQ) and HEART Framework Telemetry.'
      }
    },
    engineering: {
      label: 'Engineering & Architecture',
      focus: 'System feasibility, high-concurrency scaling, API contracts, security, and data integrity.',
      storyInvolvement: {
        market: 'Evaluates emerging technology capabilities vs competitor tech stacks.',
        customer: 'Audits enterprise security/compliance procurement specs.',
        technology: 'Leads system architecture, pipeline spikes, and SLAs.',
        user: 'Implements accessible design tokens and ensures sub-200ms interaction latency.',
        success: 'Instruments telemetry logging and monitors uptime reliability.'
      }
    },
    business: {
      label: 'Executive & Customer Success',
      focus: 'Commercial viability, revenue realization, customer retention, and strategic positioning.',
      storyInvolvement: {
        market: 'Aligns market opportunity with board-level corporate targets.',
        customer: 'Participates in enterprise contract negotiations and pricing reviews.',
        technology: 'Reviews enterprise risk exposure and infrastructure expenditure.',
        user: 'Observes customer pilot demos and collects qualitative feedback.',
        success: 'Champions account expansion and quarterly business reviews.'
      }
    }
  };

  // Extract all cross-story alignment checks across the project
  const allChecks = (['market', 'customer', 'technology', 'user', 'success'] as StoryType[]).flatMap(
    (sourceStory) =>
      project.stories[sourceStory].alignmentChecks.map((check, idx) => ({
        ...check,
        sourceStory,
        checkIndex: idx
      }))
  );

  const alignedCount = allChecks.filter((c) => c.status === 'aligned').length;
  const reviewCount = allChecks.filter((c) => c.status === 'review_needed').length;
  const inProgressCount = allChecks.filter((c) => c.status === 'in_progress').length;

  const handleToggleCheckStatus = (
    sourceStory: StoryType,
    checkIndex: number
  ) => {
    const statuses: ('aligned' | 'review_needed' | 'in_progress')[] = [
      'aligned',
      'review_needed',
      'in_progress'
    ];
    const current = project.stories[sourceStory].alignmentChecks[checkIndex].status;
    const nextIdx = (statuses.indexOf(current) + 1) % statuses.length;
    const nextStatus = statuses[nextIdx];

    const updatedChecks = [...project.stories[sourceStory].alignmentChecks];
    updatedChecks[checkIndex] = {
      ...updatedChecks[checkIndex],
      status: nextStatus
    };

    onUpdateProject({
      ...project,
      stories: {
        ...project.stories,
        [sourceStory]: {
          ...project.stories[sourceStory],
          alignmentChecks: updatedChecks
        }
      }
    });
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Silo Breakdown & Team Harmony
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
          Cross-Functional Alignment Matrix
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-3xl leading-relaxed">
          The core breakthrough of John Papadami's E2E Framework is enforcing continuous bilateral checks
          between all 5 stories. When product strategy, deep technical architecture, and ergonomic UX are aligned,
          engineering rework drops and execution velocity triples.
        </p>
      </div>

      {/* Alignment Status Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Fully Aligned</div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {alignedCount} / {allChecks.length} checks
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Requires Review</div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {reviewCount} checks
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">In Progress</div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {inProgressCount} checks
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Story Cohesion Checks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Bilateral Story Verification Checks
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive criteria ensuring no story operates in a vacuum. Click any status tag to cycle state.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
            {allChecks.length} verification gates
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allChecks.map((item, idx) => {
            const statusBadge = {
              aligned: {
                label: 'Aligned',
                class: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
              },
              review_needed: {
                label: 'Review Needed',
                class: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
              },
              in_progress: {
                label: 'In Progress',
                class: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800'
              }
            }[item.status];

            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <span>{storyIcons[item.sourceStory]}</span>
                    <span className="capitalize">{item.sourceStory}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span>{storyIcons[item.targetStory]}</span>
                    <span className="capitalize">{item.targetStory}</span>
                  </div>

                  <button
                    onClick={() => handleToggleCheckStatus(item.sourceStory, item.checkIndex)}
                    className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded border transition-colors ${statusBadge.class}`}
                  >
                    {statusBadge.label}
                  </button>
                </div>

                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug">
                  "{item.question}"
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-2 text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400 italic">
                    {item.notes}
                  </span>
                  <button
                    onClick={() => onNavigateToStory(item.sourceStory)}
                    className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold whitespace-nowrap shrink-0"
                  >
                    View Canvas →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role-by-Role Contribution Matrix */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users2 className="w-5 h-5 text-slate-500" />
              <span>Multi-Disciplinary Responsibility Matrix</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              How each core discipline engages across all 5 stories throughout the lifecycle.
            </p>
          </div>

          {/* Interactive Filter Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
            {(['all', 'product', 'design', 'engineering', 'business'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors capitalize ${
                  roleFilter === role
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {role === 'all' ? 'All Roles' : role}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-mono">
                <th className="py-3 px-4 font-semibold w-48">Stakeholder Discipline</th>
                <th className="py-3 px-4 font-semibold">Market Story</th>
                <th className="py-3 px-4 font-semibold">Customer Story</th>
                <th className="py-3 px-4 font-semibold">Technology Story</th>
                <th className="py-3 px-4 font-semibold">User Story</th>
                <th className="py-3 px-4 font-semibold">Success Story</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {(['product', 'design', 'engineering', 'business'] as StakeholderRole[])
                .filter((r) => roleFilter === 'all' || roleFilter === r)
                .map((role) => {
                  const info = roleResponsibilities[role];
                  return (
                    <tr
                      key={role}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white align-top">
                        <div className="text-xs">{info.label}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-1 leading-snug">
                          {info.focus}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 align-top leading-relaxed">
                        {info.storyInvolvement.market}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 align-top leading-relaxed">
                        {info.storyInvolvement.customer}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 align-top leading-relaxed">
                        {info.storyInvolvement.technology}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 align-top leading-relaxed">
                        {info.storyInvolvement.user}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 align-top leading-relaxed">
                        {info.storyInvolvement.success}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
