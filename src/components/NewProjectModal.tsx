/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProductProject } from '../types/framework';
import { TEMPLATE_PROJECTS, STORY_OVERVIEWS } from '../data/defaultTemplates';
import { X, Check, Plus, FolderKanban, Sparkles } from 'lucide-react';

interface NewProjectModalProps {
  currentProjectId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: ProductProject) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  currentProjectId,
  isOpen,
  onClose,
  onSelectProject
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'custom'>('templates');

  const [customName, setCustomName] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [customAudience, setCustomAudience] = useState('');
  const [customVision, setCustomVision] = useState('');

  if (!isOpen) return null;

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newProject: ProductProject = {
      id: `proj-${Date.now()}`,
      name: customName.trim(),
      domain: customDomain.trim() || 'Enterprise Software',
      targetAudience: customAudience.trim() || 'Enterprise Decision Makers & Operators',
      visionStatement: customVision.trim() || 'Transform complex workflows into a unified, high-efficiency experience.',
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      stories: {
        market: {
          type: 'market',
          title: 'Market Story',
          subtitle: 'The Strategic Market Bet',
          objective: 'Capitalize on market shift and define competitive differentiation.',
          primaryStakeholders: ['Product Strategy Lead', 'Executive Sponsors'],
          sections: [
            {
              id: `sec-${Date.now()}-1`,
              title: 'Market Landscape & Timing',
              description: 'Why is this market opportunity viable right now?',
              content: 'Define macro market growth, industry trends, and competitive gaps.',
              keyQuestions: ['What macro tailwind justifies building this now?'],
              deliverables: ['Market Sizing & Competitor Matrix'],
              risks: ['Entrenched incumbent inertia']
            }
          ],
          uxMethodologies: STORY_OVERVIEWS.market.uxMethodologies,
          alignmentChecks: [
            {
              question: 'Does the Technology Story substantiate the market speed advantage?',
              targetStory: 'technology',
              status: 'in_progress',
              notes: 'Architecture spike pending validation.'
            }
          ]
        },
        customer: {
          type: 'customer',
          title: 'Customer Story',
          subtitle: 'The Organizational Buyer & JTBD',
          objective: 'Identify the economic buyer, procurement friction, and ROI expectations.',
          primaryStakeholders: ['Head of Sales', 'Customer Success Director'],
          sections: [
            {
              id: `sec-${Date.now()}-2`,
              title: 'Buyer Personas & Severe Pain Points',
              description: 'Who writes the check and what problem keeps them awake?',
              content: 'Document the economic buyer profile and organizational bottlenecks.',
              keyQuestions: ['What is the quantifiable financial cost of not solving this?'],
              deliverables: ['Customer Journey & Willingness-to-Pay Analysis'],
              risks: ['Lengthy multi-department procurement approvals']
            }
          ],
          uxMethodologies: STORY_OVERVIEWS.customer.uxMethodologies,
          alignmentChecks: [
            {
              question: 'Does the User Story address the frontline pain that buyers report?',
              targetStory: 'user',
              status: 'in_progress',
              notes: 'Operator interview synthesis in progress.'
            }
          ]
        },
        technology: {
          type: 'technology',
          title: 'Technology Story',
          subtitle: 'Architectural Blueprint & Non-Functionals',
          objective: 'Ensure feasibility, SLA reliability, integration contracts, and security compliance.',
          primaryStakeholders: ['Chief Architect', 'Staff Security Engineer'],
          sections: [
            {
              id: `sec-${Date.now()}-3`,
              title: 'System Architecture & Data Flows',
              description: 'Core infrastructure, APIs, and scaling topology.',
              content: 'Outline the data pipelines, cloud services, and integration boundaries.',
              keyQuestions: ['What are the latency and throughput requirements?'],
              deliverables: ['System Architecture Diagram & API Contract'],
              risks: ['Third-party system dependency availability']
            }
          ],
          uxMethodologies: STORY_OVERVIEWS.technology.uxMethodologies,
          alignmentChecks: [
            {
              question: 'Can the UI deliver instant response times within architectural latency bounds?',
              targetStory: 'user',
              status: 'in_progress',
              notes: 'Caching and state synchronization contract to be refined.'
            }
          ]
        },
        user: {
          type: 'user',
          title: 'User Story',
          subtitle: 'Ergonomic Workflows & UI Design System',
          objective: 'Craft intuitive, accessible, and high-efficiency interfaces for human operators.',
          primaryStakeholders: ['Lead Product Designer', 'UX Researcher'],
          sections: [
            {
              id: `sec-${Date.now()}-4`,
              title: 'Primary Workflows & Cognitive Ergonomics',
              description: 'Day-in-the-life of the frontline operator.',
              content: 'Map out the step-by-step task completion and error recovery paths.',
              keyQuestions: ['How do we reduce cognitive overload during high-stress operations?'],
              deliverables: ['Interactive Wireframe Prototypes & WCAG Audit'],
              risks: ['Operator resistance to changing legacy muscle-memory habits']
            }
          ],
          uxMethodologies: STORY_OVERVIEWS.user.uxMethodologies,
          alignmentChecks: [
            {
              question: 'Do user efficiencies directly drive customer ROI goals?',
              targetStory: 'customer',
              status: 'in_progress',
              notes: 'Need to measure task speedup in pilot sessions.'
            }
          ]
        },
        success: {
          type: 'success',
          title: 'Success Story',
          subtitle: 'Quantifiable KPIs & Verification Gates',
          objective: 'Define measurable North Star outcomes, pilot validation, and continuous feedback.',
          primaryStakeholders: ['VP Product', 'Analytics Lead'],
          sections: [
            {
              id: `sec-${Date.now()}-5`,
              title: 'North Star Metric & Business Impact',
              description: 'How we prove value realization empirically.',
              content: 'Establish the primary metric, leading indicators, and telemetry instrumentation.',
              keyQuestions: ['What metric indicates unambiguous success 90 days after launch?'],
              deliverables: ['Telemetry Tracking Plan & Executive Scorecard'],
              risks: ['Delayed instrumentation skewing early adoption data']
            }
          ],
          uxMethodologies: STORY_OVERVIEWS.success.uxMethodologies,
          alignmentChecks: [
            {
              question: 'Does the success metric fulfill the initial Market Story promise?',
              targetStory: 'market',
              status: 'in_progress',
              notes: 'Metrics match initial investor & strategic targets.'
            }
          ]
        }
      },
      deliverables: [
        { id: `del-${Date.now()}-1`, phase: 'discover', storyType: 'market', title: 'Market Opportunity Brief', description: 'Synthesis of competitor landscape and TAM sizing.', completed: false, ownerRole: 'product' },
        { id: `del-${Date.now()}-2`, phase: 'define', storyType: 'customer', title: 'Buyer & Operator Persona Mapping', description: 'Qualitative interview insights and JTBD matrix.', completed: false, ownerRole: 'design' },
        { id: `del-${Date.now()}-3`, phase: 'design', storyType: 'technology', title: 'System Architecture Specification', description: 'Data flow contracts and security review sign-off.', completed: false, ownerRole: 'engineering' },
        { id: `del-${Date.now()}-4`, phase: 'validate', storyType: 'user', title: 'Usability Lab Benchmark', description: 'Testing interactive prototype with 6 representative users.', completed: false, ownerRole: 'design' },
        { id: `del-${Date.now()}-5`, phase: 'deliver', storyType: 'success', title: 'Executive Launch Telemetry Dashboard', description: 'Live monitoring of adoption and cycle time reduction.', completed: false, ownerRole: 'product' }
      ]
    };

    onSelectProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Project Initiative Workspace
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an industry reference template or draft a custom 5-story initiative.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'templates'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Industry Templates
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'custom'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Create Custom Initiative
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {activeTab === 'templates' ? (
            <div className="space-y-3">
              {TEMPLATE_PROJECTS.map((proj) => {
                const isCurrent = proj.id === currentProjectId;
                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      onSelectProject(proj);
                      onClose();
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isCurrent
                        ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/60 ring-1 ring-slate-900 dark:ring-white'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-mono text-slate-500 uppercase">
                          {proj.domain}
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                          {proj.name}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                          {proj.visionStatement}
                        </p>
                      </div>

                      {isCurrent ? (
                        <span className="p-1 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <button className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 shrink-0 mt-1">
                          Load →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleCreateCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Product / Initiative Name
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g., OmniLog: Global Supply Chain Real-Time Tracking"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Industry / Domain
                </label>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="e.g., Logistics & Autonomous Freight"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Target Decision Makers & Users
                </label>
                <input
                  type="text"
                  value={customAudience}
                  onChange={(e) => setCustomAudience(e.target.value)}
                  placeholder="e.g., Fleet Logistics Directors & Warehouse Dispatch Operators"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  High-Level Strategic Vision
                </label>
                <textarea
                  value={customVision}
                  onChange={(e) => setCustomVision(e.target.value)}
                  rows={3}
                  placeholder="e.g., Provide end-to-end freight visibility from port to final depot with automated customs clearing."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                >
                  Initialize 5-Story Blueprint
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
