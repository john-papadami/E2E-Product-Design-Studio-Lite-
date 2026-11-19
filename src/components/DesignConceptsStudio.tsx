/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DesignConcept, ProductProject } from '../types/framework';
import {
  buildProjectBrief,
  generateDesignConcepts,
  summarizeStories,
  validateDesignConcept,
} from '../services/aiService';
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  Loader2,
  Layers,
  X,
  ShieldCheck,
} from 'lucide-react';

interface DesignConceptsStudioProps {
  project: ProductProject;
  onUpdateProject: (updated: ProductProject) => void;
}

export const DesignConceptsStudio: React.FC<DesignConceptsStudioProps> = ({
  project,
  onUpdateProject,
}) => {
  const concepts = project.designConcepts || [];

  const [isGenerating, setIsGenerating] = useState(false);
  const [validatingId, setValidatingId] = useState<string | null>(null);
  const [focusPrompt, setFocusPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [targetUseCase, setTargetUseCase] = useState('');
  const [interactionModel, setInteractionModel] = useState('');
  const [keyFlowsInput, setKeyFlowsInput] = useState('');
  const [valueHypothesis, setValueHypothesis] = useState('');
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);

  const handleGenerateConcepts = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setError(null);
    try {
      const { concepts: newConcepts } = await generateDesignConcepts({
        projectBrief: buildProjectBrief(project),
        storyContext: summarizeStories(project.stories),
        focusArea: focusPrompt.trim() || undefined,
      });

      onUpdateProject({
        ...project,
        lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        designConcepts: [...concepts, ...newConcepts],
      });
      setFocusPrompt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate design concepts.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleValidateExisting = async (concept: DesignConcept) => {
    if (validatingId) return;
    setValidatingId(concept.id);
    setError(null);
    try {
      const result = await validateDesignConcept({
        projectBrief: buildProjectBrief(project),
        concept: {
          title: concept.title,
          targetUseCase: concept.targetUseCase,
          interactionModel: concept.interactionModel,
          keyFlows: concept.keyFlows,
          valueHypothesis: concept.valueHypothesis,
        },
        storyContext: summarizeStories(project.stories),
      });

      const updatedConcepts = concepts.map((c) =>
        c.id === concept.id
          ? {
              ...c,
              validationScore: result.validationScore,
              validationStatus: result.validationStatus,
              strengths: result.strengths,
              usabilityRisks: result.usabilityRisks,
              recommendedTests: result.recommendedTests,
            }
          : c
      );

      onUpdateProject({
        ...project,
        designConcepts: updatedConcepts,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate design concept.');
    } finally {
      setValidatingId(null);
    }
  };

  const handleCreateAndValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmittingCustom) return;

    setIsSubmittingCustom(true);
    setError(null);

    const parsedFlows = keyFlowsInput
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const draftConcept = {
      title: title.trim(),
      targetUseCase: targetUseCase.trim() || 'Primary operator workflow',
      interactionModel: interactionModel.trim() || 'Interactive single-pane workbench',
      keyFlows: parsedFlows.length > 0 ? parsedFlows : ['Enter task context', 'Review synthesized options', 'Confirm and execute'],
      valueHypothesis: valueHypothesis.trim() || 'Reduces task completion time and cognitive load.',
    };

    try {
      const validation = await validateDesignConcept({
        projectBrief: buildProjectBrief(project),
        concept: draftConcept,
        storyContext: summarizeStories(project.stories),
      });

      const newConcept: DesignConcept = {
        id: `concept-${Date.now()}`,
        ...draftConcept,
        validationScore: validation.validationScore,
        validationStatus: validation.validationStatus,
        strengths: validation.strengths,
        usabilityRisks: validation.usabilityRisks,
        recommendedTests: validation.recommendedTests,
      };

      onUpdateProject({
        ...project,
        designConcepts: [newConcept, ...concepts],
      });

      setTitle('');
      setTargetUseCase('');
      setInteractionModel('');
      setKeyFlowsInput('');
      setValueHypothesis('');
      setShowAddModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate concept.');
    } finally {
      setIsSubmittingCustom(false);
    }
  };

  const handleRemoveConcept = (id: string) => {
    onUpdateProject({
      ...project,
      designConcepts: concepts.filter((c) => c.id !== id),
    });
  };

  const statusBadge = (status: DesignConcept['validationStatus'], score?: number) => {
    if (status === 'validated') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-3 h-3" />
          <span>Validated{typeof score === 'number' ? ` · ${score}/100` : ''}</span>
        </span>
      );
    }
    if (status === 'needs_revision') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-3 h-3" />
          <span>Needs Revision{typeof score === 'number' ? ` · ${score}/100` : ''}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        <span>Draft{typeof score === 'number' ? ` · ${score}/100` : ''}</span>
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-500" />
              <span>Design Concepts & AI Validation Lab</span>
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {concepts.length} {concepts.length === 1 ? 'Concept' : 'Concepts'}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Generate candidate interaction models from your 5 stories or pitch a custom concept for AI usability & feasibility validation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={focusPrompt}
            onChange={(e) => setFocusPrompt(e.target.value)}
            placeholder="Optional focus (e.g., mobile offline triage)..."
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 w-56"
          />
          <button
            type="button"
            onClick={handleGenerateConcepts}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Generate Concepts</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pitch & Validate Concept</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {concepts.length === 0 ? (
        <div className="p-8 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3 bg-slate-50/40 dark:bg-slate-950/30">
          <div className="inline-flex p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              No Design Concepts Evaluated Yet
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Use AI to synthesize 3 distinct interaction concepts tailored to your Customer pain points and Technical constraints, or pitch your own concept for validation scoring.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {concepts.map((concept) => (
            <div
              key={concept.id}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  {statusBadge(concept.validationStatus, concept.validationScore)}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleValidateExisting(concept)}
                      disabled={validatingId === concept.id}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors disabled:opacity-50"
                      title="Run AI validation critique"
                    >
                      {validatingId === concept.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <ShieldCheck className="w-3 h-3" />
                      )}
                      <span>{validatingId === concept.id ? 'Validating...' : 'Re-Validate'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveConcept(concept.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                      aria-label="Delete design concept"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {concept.title}
                  </h4>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                    Use Case: {concept.targetUseCase}
                  </div>
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">Interaction Model:</strong>{' '}
                  {concept.interactionModel}
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 italic">
                  <strong>Value Hypothesis:</strong> {concept.valueHypothesis}
                </div>

                {concept.keyFlows.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Key Workflow Steps
                    </div>
                    <ol className="space-y-1 text-xs text-slate-700 dark:text-slate-300 list-decimal list-inside">
                      {concept.keyFlows.map((step, idx) => (
                        <li key={idx} className="leading-snug">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800 space-y-2 text-[11px]">
                {concept.strengths.length > 0 && (
                  <div>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">Strengths: </span>
                    <span className="text-slate-600 dark:text-slate-300">{concept.strengths.join(' · ')}</span>
                  </div>
                )}
                {concept.usabilityRisks.length > 0 && (
                  <div>
                    <span className="font-semibold text-amber-700 dark:text-amber-400">Usability Risks: </span>
                    <span className="text-slate-600 dark:text-slate-300">{concept.usabilityRisks.join(' · ')}</span>
                  </div>
                )}
                {concept.recommendedTests.length > 0 && (
                  <div>
                    <span className="font-semibold text-indigo-700 dark:text-indigo-400">Recommended Validation Tests: </span>
                    <span className="text-slate-600 dark:text-slate-300">{concept.recommendedTests.join(' · ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pitch & Validate Custom Concept Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <form
            onSubmit={handleCreateAndValidate}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-sky-500" />
                <span>Pitch & AI-Validate Design Concept</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Concept Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g., Split-Screen Evidence Copilot"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Target Use Case
                </label>
                <input
                  type="text"
                  value={targetUseCase}
                  onChange={(e) => setTargetUseCase(e.target.value)}
                  placeholder="e.g., Triaging incoming patient eligibility exceptions"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Interaction Model & UI Paradigm
                </label>
                <textarea
                  value={interactionModel}
                  onChange={(e) => setInteractionModel(e.target.value)}
                  rows={2}
                  placeholder="e.g., Left rail queue of flagged exceptions; center canvas shows side-by-side EHR source evidence and AI criteria checklist with one-click sign-off."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Key User Flow Steps (one per line)
                </label>
                <textarea
                  value={keyFlowsInput}
                  onChange={(e) => setKeyFlowsInput(e.target.value)}
                  rows={3}
                  placeholder={'Select highest-priority flagged case\nInspect highlighted pathology excerpt\nApprove or override match confidence'}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Value Hypothesis
                </label>
                <input
                  type="text"
                  value={valueHypothesis}
                  onChange={(e) => setValueHypothesis(e.target.value)}
                  placeholder="e.g., Cuts manual chart screening from 25 minutes to under 90 seconds with full auditability."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                disabled={isSubmittingCustom}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingCustom || !title.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isSubmittingCustom ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Validating with AI...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Save & Run AI Validation</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
