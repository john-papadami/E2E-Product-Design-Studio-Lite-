/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProductProject, StoryType, StoryDefinition, StorySection, UXMethodology } from '../types/framework';
import { STORY_OVERVIEWS } from '../data/defaultTemplates';
import {
  TrendingUp,
  Building2,
  Cpu,
  UserCheck,
  Award,
  Plus,
  Trash2,
  Edit2,
  Check,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HelpCircle,
  ShieldAlert,
  FolderGit2,
  BookOpen,
  X
} from 'lucide-react';

interface StoryCanvasProps {
  project: ProductProject;
  activeStoryType: StoryType;
  onSelectStoryType: (type: StoryType) => void;
  onUpdateProject: (updated: ProductProject) => void;
}

export const StoryCanvas: React.FC<StoryCanvasProps> = ({
  project,
  activeStoryType,
  onSelectStoryType,
  onUpdateProject
}) => {
  const currentStory: StoryDefinition = project.stories[activeStoryType];
  const overview = STORY_OVERVIEWS[activeStoryType];

  const [editingSubtitle, setEditingSubtitle] = useState(false);
  const [subtitleValue, setSubtitleValue] = useState(currentStory.subtitle);

  const [editingObjective, setEditingObjective] = useState(false);
  const [objectiveValue, setObjectiveValue] = useState(currentStory.objective);

  const [activeSectionId, setActiveSectionId] = useState<string>(
    currentStory.sections[0]?.id || ''
  );

  const storyIcons: Record<StoryType, React.ReactNode> = {
    market: <TrendingUp className="w-4 h-4 text-indigo-500" />,
    customer: <Building2 className="w-4 h-4 text-emerald-500" />,
    technology: <Cpu className="w-4 h-4 text-amber-500" />,
    user: <UserCheck className="w-4 h-4 text-sky-500" />,
    success: <Award className="w-4 h-4 text-violet-500" />
  };

  const handleSaveHeader = () => {
    const updatedStory: StoryDefinition = {
      ...currentStory,
      subtitle: subtitleValue,
      objective: objectiveValue
    };
    onUpdateProject({
      ...project,
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      stories: {
        ...project.stories,
        [activeStoryType]: updatedStory
      }
    });
    setEditingSubtitle(false);
    setEditingObjective(false);
  };

  const handleUpdateSectionContent = (sectionId: string, content: string) => {
    const updatedSections = currentStory.sections.map((sec) =>
      sec.id === sectionId ? { ...sec, content } : sec
    );
    const updatedStory: StoryDefinition = {
      ...currentStory,
      sections: updatedSections
    };
    onUpdateProject({
      ...project,
      stories: {
        ...project.stories,
        [activeStoryType]: updatedStory
      }
    });
  };

  const handleAddQuestion = (sectionId: string, question: string) => {
    if (!question.trim()) return;
    const updatedSections = currentStory.sections.map((sec) =>
      sec.id === sectionId
        ? { ...sec, keyQuestions: [...sec.keyQuestions, question.trim()] }
        : sec
    );
    onUpdateProject({
      ...project,
      stories: {
        ...project.stories,
        [activeStoryType]: { ...currentStory, sections: updatedSections }
      }
    });
  };

  const handleRemoveQuestion = (sectionId: string, qIndex: number) => {
    const updatedSections = currentStory.sections.map((sec) =>
      sec.id === sectionId
        ? { ...sec, keyQuestions: sec.keyQuestions.filter((_, idx) => idx !== qIndex) }
        : sec
    );
    onUpdateProject({
      ...project,
      stories: {
        ...project.stories,
        [activeStoryType]: { ...currentStory, sections: updatedSections }
      }
    });
  };

  const handleAddRisk = (sectionId: string, risk: string) => {
    if (!risk.trim()) return;
    const updatedSections = currentStory.sections.map((sec) =>
      sec.id === sectionId
        ? { ...sec, risks: [...sec.risks, risk.trim()] }
        : sec
    );
    onUpdateProject({
      ...project,
      stories: {
        ...project.stories,
        [activeStoryType]: { ...currentStory, sections: updatedSections }
      }
    });
  };

  const handleRemoveRisk = (sectionId: string, rIndex: number) => {
    const updatedSections = currentStory.sections.map((sec) =>
      sec.id === sectionId
        ? { ...sec, risks: sec.risks.filter((_, idx) => idx !== rIndex) }
        : sec
    );
    onUpdateProject({
      ...project,
      stories: {
        ...project.stories,
        [activeStoryType]: { ...currentStory, sections: updatedSections }
      }
    });
  };

  const handleAddSection = () => {
    const newId = `sec-${Date.now()}`;
    const newSection: StorySection = {
      id: newId,
      title: 'New Strategic Dimension',
      description: 'Define the scope and operational parameters.',
      content: 'Synthesize research, empirical evidence, and decisions for this dimension.',
      keyQuestions: ['What is the core premise behind this decision?'],
      deliverables: ['Specification document'],
      risks: ['Potential dependency blocker']
    };

    const updatedStory: StoryDefinition = {
      ...currentStory,
      sections: [...currentStory.sections, newSection]
    };

    onUpdateProject({
      ...project,
      stories: {
        ...project.stories,
        [activeStoryType]: updatedStory
      }
    });
    setActiveSectionId(newId);
  };

  const handleDeleteSection = (sectionId: string) => {
    if (currentStory.sections.length <= 1) {
      alert("A story must maintain at least one dimension.");
      return;
    }
    const updatedSections = currentStory.sections.filter((s) => s.id !== sectionId);
    const updatedStory: StoryDefinition = {
      ...currentStory,
      sections: updatedSections
    };

    onUpdateProject({
      ...project,
      stories: {
        ...project.stories,
        [activeStoryType]: updatedStory
      }
    });

    if (activeSectionId === sectionId) {
      setActiveSectionId(updatedSections[0]?.id || '');
    }
  };

  const handleToggleAlignmentCheck = (checkIndex: number) => {
    const statuses: ('aligned' | 'review_needed' | 'in_progress')[] = [
      'aligned',
      'review_needed',
      'in_progress'
    ];
    const current = currentStory.alignmentChecks[checkIndex].status;
    const nextIdx = (statuses.indexOf(current) + 1) % statuses.length;
    const nextStatus = statuses[nextIdx];

    const updatedChecks = [...currentStory.alignmentChecks];
    updatedChecks[checkIndex] = {
      ...updatedChecks[checkIndex],
      status: nextStatus
    };

    onUpdateProject({
      ...project,
      stories: {
        ...project.stories,
        [activeStoryType]: {
          ...currentStory,
          alignmentChecks: updatedChecks
        }
      }
    });
  };

  const [newQuestionInput, setNewQuestionInput] = useState('');
  const [newRiskInput, setNewRiskInput] = useState('');

  // UX Methodologies state and handlers
  const methodologies: UXMethodology[] = currentStory.uxMethodologies || overview.uxMethodologies || [];

  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  const [methodName, setMethodName] = useState('');
  const [methodCategory, setMethodCategory] = useState('UX Research');
  const [methodDesc, setMethodDesc] = useState('');
  const [methodWhen, setMethodWhen] = useState('');
  const [methodOutputs, setMethodOutputs] = useState('');

  const handleAddCustomMethodology = (e: React.FormEvent) => {
    e.preventDefault();
    if (!methodName.trim()) return;

    const newMethod: UXMethodology = {
      id: `ux-custom-${Date.now()}`,
      name: methodName.trim(),
      category: methodCategory.trim() || 'Custom Methodology',
      description: methodDesc.trim() || 'Specialized UX protocol for this strategic story.',
      whenToUse: methodWhen.trim() || 'During story discovery and definition.',
      keyOutputs: methodOutputs.split(',').map((s) => s.trim()).filter(Boolean),
      isPrimary: false
    };

    const updatedStory: StoryDefinition = {
      ...currentStory,
      uxMethodologies: [...methodologies, newMethod]
    };

    onUpdateProject({
      ...project,
      stories: {
        ...project.stories,
        [activeStoryType]: updatedStory
      }
    });

    setMethodName('');
    setMethodDesc('');
    setMethodWhen('');
    setMethodOutputs('');
    setShowAddMethodModal(false);
  };

  const handleRemoveMethodology = (methodId: string) => {
    const updatedStory: StoryDefinition = {
      ...currentStory,
      uxMethodologies: methodologies.filter((m) => m.id !== methodId)
    };
    onUpdateProject({
      ...project,
      stories: {
        ...project.stories,
        [activeStoryType]: updatedStory
      }
    });
  };

  const handleResetDefaultMethodologies = () => {
    const updatedStory: StoryDefinition = {
      ...currentStory,
      uxMethodologies: [...(overview.uxMethodologies || [])]
    };
    onUpdateProject({
      ...project,
      stories: {
        ...project.stories,
        [activeStoryType]: updatedStory
      }
    });
  };

  const currentSection =
    currentStory.sections.find((s) => s.id === activeSectionId) ||
    currentStory.sections[0];

  return (
    <div className="space-y-8">
      {/* Top Story Selector Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-1">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {(['market', 'customer', 'technology', 'user', 'success'] as StoryType[]).map((st, i) => {
            const isActive = activeStoryType === st;
            return (
              <button
                key={st}
                onClick={() => {
                  onSelectStoryType(st);
                  setSubtitleValue(project.stories[st].subtitle);
                  setObjectiveValue(project.stories[st].objective);
                  setActiveSectionId(project.stories[st].sections[0]?.id || '');
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{storyIcons[st]}</span>
                <span>0{i + 1}. {STORY_OVERVIEWS[st].title}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-slate-800 text-slate-200 dark:bg-slate-200 dark:text-slate-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {project.stories[st].sections.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Story Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              <span className="uppercase font-semibold">{overview.title} Canvas</span>
              <span aria-hidden="true">·</span>
              <span>Primary Stakeholders: {currentStory.primaryStakeholders.join(', ')}</span>
            </div>

            {editingSubtitle ? (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={subtitleValue}
                  onChange={(e) => setSubtitleValue(e.target.value)}
                  className="w-full text-xl font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white"
                />
                <button
                  onClick={handleSaveHeader}
                  className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {currentStory.subtitle}
                </h2>
                <button
                  onClick={() => {
                    setSubtitleValue(currentStory.subtitle);
                    setEditingSubtitle(true);
                  }}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {editingObjective ? (
              <div className="flex items-center gap-2 mt-2">
                <textarea
                  value={objectiveValue}
                  onChange={(e) => setObjectiveValue(e.target.value)}
                  rows={2}
                  className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white"
                />
                <button
                  onClick={handleSaveHeader}
                  className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 self-start"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-300 pt-1 flex items-start gap-2">
                <span>{currentStory.objective}</span>
                <button
                  onClick={() => {
                    setObjectiveValue(currentStory.objective);
                    setEditingObjective(true);
                  }}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shrink-0 mt-0.5"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </p>
            )}
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs shrink-0 max-w-xs">
            <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Core Guiding Question</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-1 italic leading-snug">
              "{overview.coreQuestion}"
            </p>
          </div>
        </div>
      </div>

      {/* Applied UX Methodologies Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>Applied UX Methodologies</span>
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {methodologies.length} Framework Protocols
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Standardized human-centered methods, testing protocols, and design systems applied to validate this story.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAddMethodModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Methodology</span>
            </button>
            {methodologies.length < overview.uxMethodologies.length && (
              <button
                onClick={handleResetDefaultMethodologies}
                className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white px-2 py-1"
              >
                Reset Defaults
              </button>
            )}
          </div>
        </div>

        {/* Methodologies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {methodologies.map((method) => (
            <div
              key={method.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-semibold uppercase text-slate-600 dark:text-slate-400">
                    {method.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {method.isPrimary && (
                      <span className="text-[9px] font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400">
                        Primary
                      </span>
                    )}
                    <button
                      onClick={() => handleRemoveMethodology(method.id)}
                      className="text-slate-400 hover:text-rose-500 p-0.5 transition-colors"
                      aria-label="Remove methodology"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">
                  {method.name}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {method.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 space-y-1.5 text-[11px]">
                <div className="text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-700 dark:text-slate-300">When to use:</strong> {method.whenToUse}
                </div>
                {method.keyOutputs && method.keyOutputs.length > 0 && (
                  <div className="text-slate-500 dark:text-slate-400">
                    <strong className="text-slate-700 dark:text-slate-300">Key outputs:</strong> {method.keyOutputs.join(' · ')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Methodology Modal */}
      {showAddMethodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <form
            onSubmit={handleAddCustomMethodology}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>Add UX Methodology to {overview.title}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddMethodModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Methodology Name
                </label>
                <input
                  type="text"
                  value={methodName}
                  onChange={(e) => setMethodName(e.target.value)}
                  placeholder="e.g., Treejack Taxonomy Testing"
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  UX Category
                </label>
                <select
                  value={methodCategory}
                  onChange={(e) => setMethodCategory(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Generative Research">Generative Research</option>
                  <option value="Customer Discovery">Customer Discovery</option>
                  <option value="Market Discovery">Market Discovery</option>
                  <option value="Strategic UX">Strategic UX</option>
                  <option value="Interaction Design">Interaction Design</option>
                  <option value="Design Systems">Design Systems</option>
                  <option value="Technical UX">Technical UX</option>
                  <option value="Quantitative UX">Quantitative UX</option>
                  <option value="Compliance & Accessibility">Compliance & Accessibility</option>
                  <option value="Product Analytics">Product Analytics</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  value={methodDesc}
                  onChange={(e) => setMethodDesc(e.target.value)}
                  rows={2}
                  placeholder="Briefly describe what this UX method achieves..."
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  When to Use
                </label>
                <input
                  type="text"
                  value={methodWhen}
                  onChange={(e) => setMethodWhen(e.target.value)}
                  placeholder="e.g., Early discovery before information architecture freeze."
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Key Outputs (comma-separated)
                </label>
                <input
                  type="text"
                  value={methodOutputs}
                  onChange={(e) => setMethodOutputs(e.target.value)}
                  placeholder="e.g., IA Tree Matrix, Navigation Friction Report"
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddMethodModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
              >
                Attach Method
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Canvas Workspace: Section Nav + Deep Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Sections List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Story Dimensions
            </span>
            <button
              onClick={handleAddSection}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Dimension</span>
            </button>
          </div>

          <div className="space-y-2">
            {currentStory.sections.map((sec, idx) => {
              const isSelected = sec.id === currentSection?.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={isSelected ? 'text-slate-300 dark:text-slate-600' : 'text-slate-400'}>
                      0{idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={isSelected ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500'}>
                        {sec.keyQuestions.length} Qs · {sec.risks.length} Risks
                      </span>
                      {currentStory.sections.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSection(sec.id);
                          }}
                          className={`p-1 rounded transition-colors ${
                            isSelected
                              ? 'text-slate-300 hover:text-rose-400 dark:text-slate-600 dark:hover:text-rose-600'
                              : 'text-slate-400 hover:text-rose-500'
                          }`}
                          title="Delete Dimension"
                          aria-label="Delete Dimension"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="font-bold text-sm mt-1 leading-snug">
                    {sec.title}
                  </div>
                  <div className={`text-xs mt-1 line-clamp-1 ${
                    isSelected ? 'text-slate-300 dark:text-slate-700' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {sec.description}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Cross-Story Alignment Box */}
          <div className="mt-6 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span>Cohesion With Other Stories</span>
              <span className="text-[10px] font-normal lowercase">(Click status to cycle)</span>
            </div>

            <div className="space-y-2">
              {currentStory.alignmentChecks.map((check, idx) => {
                const statusStyles = {
                  aligned: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
                  review_needed: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
                  in_progress: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800'
                };

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        → {check.targetStory.toUpperCase()} STORY
                      </span>
                      <button
                        onClick={() => handleToggleAlignmentCheck(idx)}
                        className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded border transition-colors ${statusStyles[check.status]}`}
                      >
                        {check.status.replace('_', ' ')}
                      </button>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-snug">
                      {check.question}
                    </p>
                    <p className="text-slate-500 dark:text-slate-500 italic text-[11px] pt-0.5">
                      {check.notes}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Section Editor & Detail */}
        {currentSection && (
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-mono uppercase text-slate-400 dark:text-slate-500">
                  Dimension Workspace
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {currentSection.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {currentSection.description}
                </p>
              </div>

              {currentStory.sections.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteSection(currentSection.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-lg transition-colors shrink-0 border border-rose-200 dark:border-rose-900/60"
                  title="Delete this dimension"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Dimension</span>
                </button>
              )}
            </div>

            {/* Main Content Area */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Strategic Thesis & Empirical Findings
              </label>
              <textarea
                value={currentSection.content}
                onChange={(e) => handleUpdateSectionContent(currentSection.id, e.target.value)}
                rows={5}
                className="w-full text-sm leading-relaxed p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
                placeholder="Document the strategic decisions, research findings, and technical boundaries..."
              />
            </div>

            {/* Key Questions to Resolve */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Key Questions to Validate</span>
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {currentSection.keyQuestions.length} questions
                </span>
              </div>

              <div className="space-y-2">
                {currentSection.keyQuestions.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      {q}
                    </span>
                    <button
                      onClick={() => handleRemoveQuestion(currentSection.id, qIdx)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                      aria-label="Remove question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newQuestionInput}
                  onChange={(e) => setNewQuestionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddQuestion(currentSection.id, newQuestionInput);
                      setNewQuestionInput('');
                    }
                  }}
                  placeholder="Add critical question (e.g., What are the SLA penalties?)"
                  className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
                <button
                  onClick={() => {
                    handleAddQuestion(currentSection.id, newQuestionInput);
                    setNewQuestionInput('');
                  }}
                  className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shrink-0"
                >
                  Add Q
                </button>
              </div>
            </div>

            {/* Deliverables & Risks 2-column strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Deliverables */}
              <div className="space-y-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Associated Deliverables</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {currentSection.deliverables.map((del, dIdx) => (
                    <li key={dIdx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks & Dependencies */}
              <div className="space-y-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  <span>Identified Friction & Risks</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {currentSection.risks.map((risk, rIdx) => (
                    <li key={rIdx} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span>{risk}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveRisk(currentSection.id, rIdx)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newRiskInput}
                    onChange={(e) => setNewRiskInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddRisk(currentSection.id, newRiskInput);
                        setNewRiskInput('');
                      }
                    }}
                    placeholder="Log friction or risk..."
                    className="flex-1 text-xs px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  <button
                    onClick={() => {
                      handleAddRisk(currentSection.id, newRiskInput);
                      setNewRiskInput('');
                    }}
                    className="px-2.5 py-1.5 text-xs font-medium rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors shrink-0"
                  >
                    + Risk
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
