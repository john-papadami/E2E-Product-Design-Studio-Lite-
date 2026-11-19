/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  DesignConcept,
  PhaseDeliverable,
  ProductProject,
  StoryDefinition,
  StoryType,
} from '../types/framework';
import {
  extractProjectBrief,
  generateDesignConcepts,
  generateLifecycleDeliverables,
  generateStoryData,
  GroundingSource,
  ProjectBriefInput,
  searchGroundingResearch,
  summarizeStories,
} from '../services/aiService';
import {
  Sparkles,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Building2,
  Cpu,
  UserCheck,
  Award,
  Lightbulb,
  Layers,
  ListChecks,
  Globe,
  ExternalLink,
} from 'lucide-react';

interface AIDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectGenerated: (project: ProductProject, initialStory?: StoryType) => void;
}

type StageStatus = 'pending' | 'running' | 'completed' | 'error';

interface PipelineStage {
  id: string;
  stepNumber: number;
  label: string;
  description: string;
  status: StageStatus;
  summary?: string;
  sources?: GroundingSource[];
}

const SAMPLE_FOUNDER_IDEAS = [
  {
    label: 'Clinical Trial Patient Matching AI',
    idea: 'An AI clinical trial pre-screening and patient-matching platform for oncology clinics that parses unstructured pathology EHR notes, matches patients to open Phase II/III trials in under 60 seconds, and handles IRB-compliant consent routing.',
    domain: 'Healthcare & Life Sciences',
    audience: 'Oncology Principal Investigators, Clinical Research Coordinators, Biotech Sponsors',
    constraints: 'HIPAA & FDA 21 CFR Part 11 auditability, zero hallucinated eligibility exclusions, Epic/Cerner FHIR read integration.',
  },
  {
    label: 'Cold-Chain Freight Exception Copilot',
    idea: 'A real-time logistics command platform for pharmaceutical cold-chain distributors that predicts thermal excursion risks from IoT sensor telemetry, automates carrier rerouting, and generates QA release dossiers.',
    domain: 'Supply Chain & Cold-Chain Logistics',
    audience: 'VP of Cold-Chain Quality, Fleet Dispatch Operators, Third-Party Logistics Partners',
    constraints: 'Sub-3-second telemetry alert latency, offline-resilient driver handoff, EU GDP & FDA compliance logs.',
  },
  {
    label: 'FinOps Cloud Waste Guardian',
    idea: 'An autonomous cloud cost governance workspace for platform engineering teams that detects idle Kubernetes clusters, GPU underutilization, and orphaned data warehouses, then proposes safe Terraform PRs with rollback guarantees.',
    domain: 'Developer Infrastructure & FinOps',
    audience: 'VP of Infrastructure, Platform Engineers, Engineering Finance Controllers',
    constraints: 'Read-only IAM by default with GitOps PR approval gates, SOC2 Type II readiness, AWS/GCP multi-cloud support.',
  },
];

const INITIAL_STAGES: PipelineStage[] = [
  {
    id: 'brief',
    stepNumber: 1,
    label: 'Frame Product Vision & Scope',
    description: 'Synthesizing founder pitch into strategic positioning and target cohort framing.',
    status: 'pending',
  },
  {
    id: 'market',
    stepNumber: 2,
    label: 'Investigate Market & Competitive Landscape',
    description: 'Analyzing macro timing, TAM/SAM dynamics, incumbent gaps, and Market UX methods.',
    status: 'pending',
  },
  {
    id: 'customer',
    stepNumber: 3,
    label: 'Identify Customer Segments & Problems',
    description: 'Mapping economic buyers, severe pains, JTBD drivers, and procurement friction.',
    status: 'pending',
  },
  {
    id: 'technology',
    stepNumber: 4,
    label: 'Establish Technical Requirements & Constraints',
    description: 'Defining system architecture, data flows, SLAs, security/compliance boundaries.',
    status: 'pending',
  },
  {
    id: 'user',
    stepNumber: 5,
    label: 'Develop Use Cases & User Workflows',
    description: 'Designing core task flows, cognitive ergonomics, accessibility, and edge recovery.',
    status: 'pending',
  },
  {
    id: 'concepts',
    stepNumber: 6,
    label: 'Generate & Validate Design Concepts',
    description: 'Synthesizing interaction models and running pre-build usability & feasibility scoring.',
    status: 'pending',
  },
  {
    id: 'success',
    stepNumber: 7,
    label: 'Establish Success Criteria, Measurement Plan & Roadmap',
    description: 'Defining North Star KPIs, telemetry instrumentation, and 5-phase deliverables.',
    status: 'pending',
  },
];

export const AIDiscoveryModal: React.FC<AIDiscoveryModalProps> = ({
  isOpen,
  onClose,
  onProjectGenerated,
}) => {
  const [productIdea, setProductIdea] = useState('');
  const [domain, setDomain] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [constraints, setConstraints] = useState('');
  const [useSearchGrounding, setUseSearchGrounding] = useState(true);

  const [isRunning, setIsRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stages, setStages] = useState<PipelineStage[]>(INITIAL_STAGES);
  const [generatedProject, setGeneratedProject] = useState<ProductProject | null>(null);

  if (!isOpen) return null;

  const updateStage = (id: string, patch: Partial<PipelineStage>) => {
    setStages((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const handleLoadSample = (sample: (typeof SAMPLE_FOUNDER_IDEAS)[number]) => {
    setProductIdea(sample.idea);
    setDomain(sample.domain);
    setTargetAudience(sample.audience);
    setConstraints(sample.constraints);
    setErrorMessage(null);
  };

  const handleReset = () => {
    setStages(INITIAL_STAGES);
    setGeneratedProject(null);
    setErrorMessage(null);
    setIsRunning(false);
  };

  const runDiscoveryPipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productIdea.trim() || isRunning) return;

    setIsRunning(true);
    setErrorMessage(null);
    setGeneratedProject(null);
    setStages(INITIAL_STAGES.map((s) => ({ ...s, status: 'pending', summary: undefined })));

    let activeStageId = 'brief';

    try {
      // Step 1: Frame Brief
      activeStageId = 'brief';
      updateStage('brief', { status: 'running' });
      const brief: ProjectBriefInput = await extractProjectBrief({
        productIdea: productIdea.trim(),
        domain: domain.trim() || undefined,
        targetAudience: targetAudience.trim() || undefined,
        constraints: constraints.trim() || undefined,
      });
      const fullBrief: ProjectBriefInput = { ...brief, productIdea: productIdea.trim() };
      updateStage('brief', {
        status: 'completed',
        summary: `${brief.name} — ${brief.domain}`,
      });

      const partialStories: Partial<Record<StoryType, StoryDefinition>> = {};

      // Step 2: Market Story (optionally grounded with live Google Search)
      activeStageId = 'market';
      updateStage('market', { status: 'running' });
      let marketSearchNotes = '';
      let marketSources: GroundingSource[] = [];
      if (useSearchGrounding) {
        try {
          const research = await searchGroundingResearch({
            projectBrief: fullBrief,
            storyType: 'market',
            query: `Current market size, key incumbent competitors, recent industry shifts, and differentiation opportunities for ${brief.name} in ${brief.domain}`,
          });
          marketSearchNotes = research.summary;
          marketSources = research.sources;
        } catch {
          // Proceed cleanly if search grounding is unavailable; core synthesis still runs
        }
      }
      const marketInstructions = [
        constraints.trim(),
        marketSearchNotes ? `Incorporate these live Google Search market findings:\n${marketSearchNotes}` : '',
      ]
        .filter(Boolean)
        .join('\n\n');

      const marketStory = await generateStoryData({
        projectBrief: fullBrief,
        storyType: 'market',
        customInstructions: marketInstructions || undefined,
      });
      partialStories.market = marketStory;
      updateStage('market', {
        status: 'completed',
        summary: `${marketStory.subtitle} (${marketStory.sections.length} dimensions${
          marketSources.length > 0 ? ` · ${marketSources.length} web sources` : ''
        })`,
        sources: marketSources,
      });

      // Step 3: Customer Story
      activeStageId = 'customer';
      updateStage('customer', { status: 'running' });
      const customerStory = await generateStoryData({
        projectBrief: fullBrief,
        storyType: 'customer',
        existingStoriesSummary: summarizeStories(partialStories),
        customInstructions: constraints.trim() || undefined,
      });
      partialStories.customer = customerStory;
      updateStage('customer', {
        status: 'completed',
        summary: `${customerStory.subtitle} (${customerStory.sections.length} dimensions)`,
      });

      // Step 4: Technology Story
      activeStageId = 'technology';
      updateStage('technology', { status: 'running' });
      const technologyStory = await generateStoryData({
        projectBrief: fullBrief,
        storyType: 'technology',
        existingStoriesSummary: summarizeStories(partialStories),
        customInstructions: constraints.trim() || undefined,
      });
      partialStories.technology = technologyStory;
      updateStage('technology', {
        status: 'completed',
        summary: `${technologyStory.subtitle} (${technologyStory.sections.length} dimensions)`,
      });

      // Step 5: User Story (Use Cases & Workflows)
      activeStageId = 'user';
      updateStage('user', { status: 'running' });
      const userStory = await generateStoryData({
        projectBrief: fullBrief,
        storyType: 'user',
        existingStoriesSummary: summarizeStories(partialStories),
        customInstructions: constraints.trim() || undefined,
      });
      partialStories.user = userStory;
      updateStage('user', {
        status: 'completed',
        summary: `${userStory.subtitle} (${userStory.sections.length} dimensions)`,
      });

      // Step 6: Generate & Validate Design Concepts
      activeStageId = 'concepts';
      updateStage('concepts', { status: 'running' });
      const { concepts } = await generateDesignConcepts({
        projectBrief: fullBrief,
        storyContext: summarizeStories(partialStories),
        focusArea: constraints.trim() || undefined,
      });
      const designConcepts: DesignConcept[] = concepts;
      updateStage('concepts', {
        status: 'completed',
        summary: `${designConcepts.length} concepts generated & scored (avg ${
          designConcepts.length
            ? Math.round(
                designConcepts.reduce((acc, c) => acc + (c.validationScore || 75), 0) /
                  designConcepts.length
              )
            : 0
        }/100)`,
      });

      // Step 7: Success Story & Lifecycle Deliverables
      activeStageId = 'success';
      updateStage('success', { status: 'running' });
      const [successStory, deliverablesRes] = await Promise.all([
        generateStoryData({
          projectBrief: fullBrief,
          storyType: 'success',
          existingStoriesSummary: summarizeStories(partialStories),
          customInstructions: constraints.trim() || undefined,
        }),
        generateLifecycleDeliverables({
          projectBrief: fullBrief,
          storiesSummary: summarizeStories(partialStories),
        }),
      ]);
      partialStories.success = successStory;
      const deliverables: PhaseDeliverable[] = deliverablesRes.deliverables;
      updateStage('success', {
        status: 'completed',
        summary: `${successStory.subtitle} · ${deliverables.length} lifecycle deliverables`,
      });

      const newProject: ProductProject = {
        id: `ai-proj-${Date.now()}`,
        name: brief.name,
        domain: brief.domain,
        targetAudience: brief.targetAudience,
        visionStatement: brief.visionStatement,
        aiDiscoveryBrief: productIdea.trim(),
        lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        stories: {
          market: marketStory,
          customer: customerStory,
          technology: technologyStory,
          user: userStory,
          success: successStory,
        },
        designConcepts,
        deliverables,
      };

      setGeneratedProject(newProject);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Discovery pipeline failed.';
      updateStage(activeStageId, { status: 'error' });
      setErrorMessage(msg);
    } finally {
      setIsRunning(false);
    }
  };

  const stageIcons: Record<string, React.ReactNode> = {
    brief: <Lightbulb className="w-4 h-4 text-indigo-500" />,
    market: <TrendingUp className="w-4 h-4 text-indigo-500" />,
    customer: <Building2 className="w-4 h-4 text-emerald-500" />,
    technology: <Cpu className="w-4 h-4 text-amber-500" />,
    user: <UserCheck className="w-4 h-4 text-sky-500" />,
    concepts: <Layers className="w-4 h-4 text-fuchsia-500" />,
    success: <Award className="w-4 h-4 text-violet-500" />,
  };

  const completedCount = stages.filter((s) => s.status === 'completed').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl flex flex-col shadow-2xl overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                AI Product Discovery & Synthesis Studio
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Turn a founder product idea into a complete, cross-aligned 5-Story workspace, validated design concepts, and measurement plan.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isRunning}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-40"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Founder Input Form */}
          <form onSubmit={runDiscoveryPipeline} className="lg:col-span-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  1. Founder Product Idea *
                </label>
                <span className="text-[11px] text-slate-400">Or load a sample pitch</span>
              </div>

              <div className="flex flex-wrap gap-1.5 pb-1">
                {SAMPLE_FOUNDER_IDEAS.map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    disabled={isRunning}
                    onClick={() => handleLoadSample(sample)}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>

              <textarea
                value={productIdea}
                onChange={(e) => setProductIdea(e.target.value)}
                rows={4}
                required
                disabled={isRunning}
                placeholder="Describe your product idea, who it serves, the problem you want to solve, and the core mechanism..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Industry / Domain (Optional)
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  disabled={isRunning}
                  placeholder="Auto-detected if blank"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Target Segment (Optional)
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  disabled={isRunning}
                  placeholder="Auto-identified if blank"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Technical, Compliance or GTM Constraints (Optional)
              </label>
              <input
                type="text"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                disabled={isRunning}
                placeholder="e.g., HIPAA compliance, mobile-first offline mode, PLG self-serve pricing..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white disabled:opacity-60"
              />
            </div>

            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 cursor-pointer">
              <input
                type="checkbox"
                checked={useSearchGrounding}
                onChange={(e) => setUseSearchGrounding(e.target.checked)}
                disabled={isRunning}
                className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="text-xs">
                <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Ground Market & Competitor Research with Google Search</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Uses live Google Search data via Gemini to enrich competitor benchmarks and market signals.
                </p>
              </div>
            </label>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-semibold">Discovery Pipeline Interrupted</div>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isRunning || !productIdea.trim()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-50 shadow-sm"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Running 7-Step Discovery ({completedCount}/7)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{generatedProject ? 'Re-Run Discovery Pipeline' : 'Generate Complete 5-Story Workspace'}</span>
                  </>
                )}
              </button>

              {generatedProject && !isRunning && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-2 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {/* Right Column: Live 7-Step Discovery Progress */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                <ListChecks className="w-4 h-4 text-indigo-500" />
                <span>AI Discovery Execution Pipeline</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {completedCount}/7 Complete
              </span>
            </div>

            <div className="space-y-2.5 flex-1">
              {stages.map((stage) => {
                const isDone = stage.status === 'completed';
                const isActive = stage.status === 'running';
                const isErr = stage.status === 'error';

                return (
                  <div
                    key={stage.id}
                    className={`p-3 rounded-lg border transition-all text-xs ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 border-indigo-400 dark:border-indigo-500 shadow-xs'
                        : isDone
                          ? 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/60'
                          : isErr
                            ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                            : 'bg-white/60 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800/70 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 shrink-0">
                          {isActive ? (
                            <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                          ) : isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : isErr ? (
                            <AlertCircle className="w-4 h-4 text-rose-500" />
                          ) : (
                            stageIcons[stage.id]
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            0{stage.stepNumber}. {stage.label}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            {stage.summary ? (
                              <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                                {stage.summary}
                              </span>
                            ) : (
                              stage.description
                            )}
                          </div>
                          {stage.sources && stage.sources.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {stage.sources.slice(0, 4).map((src, sIdx) => (
                                <a
                                  key={sIdx}
                                  href={src.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline max-w-[180px] truncate"
                                  title={src.title}
                                >
                                  <span className="truncate">{src.title}</span>
                                  <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {generatedProject && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">
                    Workspace Ready: {generatedProject.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    5 stories, {generatedProject.designConcepts?.length || 0} design concepts & {generatedProject.deliverables.length} deliverables synthesized.
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onProjectGenerated(generatedProject, 'market');
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
