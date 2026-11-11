/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ProductProject,
  LifecyclePhase,
  StoryType,
  StakeholderRole,
  PhaseDeliverable
} from '../types/framework';
import { LIFECYCLE_PHASES, STORY_OVERVIEWS } from '../data/defaultTemplates';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  Filter,
  Layers,
  ArrowRight
} from 'lucide-react';

interface PhaseRoadmapProps {
  project: ProductProject;
  onUpdateProject: (updated: ProductProject) => void;
}

export const PhaseRoadmap: React.FC<PhaseRoadmapProps> = ({
  project,
  onUpdateProject
}) => {
  const [selectedPhase, setSelectedPhase] = useState<'all' | LifecyclePhase>('all');
  const [selectedRole, setSelectedRole] = useState<'all' | StakeholderRole>('all');

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPhase, setNewPhase] = useState<LifecyclePhase>('discover');
  const [newStory, setNewStory] = useState<StoryType>('market');
  const [newRole, setNewRole] = useState<StakeholderRole>('design');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleToggleDeliverable = (delId: string) => {
    const updated = project.deliverables.map((del) =>
      del.id === delId ? { ...del, completed: !del.completed } : del
    );
    onUpdateProject({
      ...project,
      deliverables: updated
    });
  };

  const handleRemoveDeliverable = (delId: string) => {
    const updated = project.deliverables.filter((del) => del.id !== delId);
    onUpdateProject({
      ...project,
      deliverables: updated
    });
  };

  const handleAddDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newDeliverable: PhaseDeliverable = {
      id: `del-${Date.now()}`,
      phase: newPhase,
      storyType: newStory,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Key artifact or operational gate.',
      completed: false,
      ownerRole: newRole
    };

    onUpdateProject({
      ...project,
      deliverables: [...project.deliverables, newDeliverable]
    });

    setNewTitle('');
    setNewDesc('');
    setShowAddForm(false);
  };

  const filteredDeliverables = project.deliverables.filter((d) => {
    const phaseMatch = selectedPhase === 'all' || d.phase === selectedPhase;
    const roleMatch = selectedRole === 'all' || d.ownerRole === selectedRole;
    return phaseMatch && roleMatch;
  });

  const total = project.deliverables.length;
  const completed = project.deliverables.filter((d) => d.completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Continuous Delivery Pipeline
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
            Phase Deliverables & Verification Gates
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Track key milestones across the 5 continuous phases: Discover, Define, Design, Validate, and Deliver.
            Ensure each story has verified proof points before deployment lock.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Deliverable</span>
        </button>
      </div>

      {/* Progress Metric Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Overall Lifecycle Execution Progress
          </span>
          <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">
            {completed} of {total} Milestones Complete ({percentage}%)
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-slate-900 dark:bg-white h-full rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* New Deliverable Form Modal/Collapsible */}
      {showAddForm && (
        <form
          onSubmit={handleAddDeliverable}
          className="p-5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-4 shadow-md"
        >
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            Log New Deliverable / Milestone
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                Lifecycle Phase
              </label>
              <select
                value={newPhase}
                onChange={(e) => setNewPhase(e.target.value as LifecyclePhase)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white capitalize"
              >
                {LIFECYCLE_PHASES.map((p) => (
                  <option key={p.phase} value={p.phase}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                Associated Story
              </label>
              <select
                value={newStory}
                onChange={(e) => setNewStory(e.target.value as StoryType)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white capitalize"
              >
                {(['market', 'customer', 'technology', 'user', 'success'] as StoryType[]).map((st) => (
                  <option key={st} value={st}>
                    {STORY_OVERVIEWS[st].title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                Lead Discipline Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as StakeholderRole)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white capitalize"
              >
                <option value="product">Product Management</option>
                <option value="design">UX & Product Design</option>
                <option value="engineering">Engineering & Arch</option>
                <option value="business">Business & Executive</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                Deliverable Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., WCAG 2.2 AA Audit Report"
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Deliverable Scope & Verification Criteria
            </label>
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="e.g., Conducted usability benchmark with 8 senior cloud engineers; measured task completion latency."
              className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Filter Controls: Tabs for Phases and Roles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        {/* Phase Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedPhase('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedPhase === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Phases
          </button>
          {LIFECYCLE_PHASES.map((p) => (
            <button
              key={p.phase}
              onClick={() => setSelectedPhase(p.phase)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedPhase === p.phase
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {p.name.replace(/^\d+\.\s*/, '')}
            </button>
          ))}
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Role:</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as any)}
            className="text-xs p-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 capitalize"
          >
            <option value="all">All Roles</option>
            <option value="product">Product</option>
            <option value="design">Design</option>
            <option value="engineering">Engineering</option>
            <option value="business">Business</option>
          </select>
        </div>
      </div>

      {/* Deliverables List */}
      <div className="space-y-3">
        {filteredDeliverables.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            No deliverables found for this phase and filter. Click "Add Deliverable" to log one.
          </div>
        ) : (
          filteredDeliverables.map((del) => {
            return (
              <div
                key={del.id}
                className={`flex items-start justify-between gap-4 p-4 rounded-xl border transition-all ${
                  del.completed
                    ? 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-80'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => handleToggleDeliverable(del.id)}
                    className="mt-0.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    aria-label={del.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {del.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-mono uppercase font-semibold text-slate-700 dark:text-slate-300">
                        {del.phase}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{del.storyType} Story</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize font-mono">Owner: {del.ownerRole}</span>
                    </div>

                    <div
                      className={`font-bold text-sm text-slate-900 dark:text-white ${
                        del.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                      }`}
                    >
                      {del.title}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {del.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveDeliverable(del.id)}
                  className="text-slate-400 hover:text-rose-500 p-1.5 transition-colors"
                  aria-label="Delete milestone"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
