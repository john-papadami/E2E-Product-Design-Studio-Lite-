/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProductProject, StoryType } from '../types/framework';
import { STORY_OVERVIEWS } from '../data/defaultTemplates';
import {
  X,
  Copy,
  Check,
  Printer,
  FileCode,
  FileText,
  Download
} from 'lucide-react';

interface ExecutiveExportModalProps {
  project: ProductProject;
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveExportModal: React.FC<ExecutiveExportModalProps> = ({
  project,
  isOpen,
  onClose
}) => {
  const [activeFormat, setActiveFormat] = useState<'preview' | 'markdown' | 'json'>('preview');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdown = (): string => {
    let md = `# E2E Product Design Framework: Alignment & Executive Brief\n\n`;
    md += `**Initiative:** ${project.name}\n`;
    md += `**Industry Domain:** ${project.domain}\n`;
    md += `**Target Audience:** ${project.targetAudience}\n`;
    md += `**Vision Statement:** ${project.visionStatement}\n`;
    md += `**Date:** ${project.lastUpdated}\n\n`;
    md += `*Methodology: John Papadami 5-Story End-to-End Product Design Framework*\n\n`;
    md += `---\n\n`;

    // 5 Stories
    (['market', 'customer', 'technology', 'user', 'success'] as StoryType[]).forEach((st, idx) => {
      const s = project.stories[st];
      const overview = STORY_OVERVIEWS[st];
      md += `## 0${idx + 1}. ${overview.title}: ${s.subtitle}\n\n`;
      md += `**Strategic Objective:** ${s.objective}\n\n`;
      md += `**Primary Stakeholders:** ${s.primaryStakeholders.join(', ')}\n\n`;
      md += `**Core Question:** *"${overview.coreQuestion}"*\n\n`;

      const uxMethods = s.uxMethodologies || overview.uxMethodologies || [];
      if (uxMethods.length > 0) {
        md += `**Applied UX Methodologies:**\n`;
        uxMethods.forEach((m) => {
          md += `- **${m.name}** [${m.category}]: ${m.description} *(Key Outputs: ${m.keyOutputs.join(', ')})*\n`;
        });
        md += `\n`;
      }

      s.sections.forEach((sec, sIdx) => {
        md += `### ${idx + 1}.${sIdx + 1} ${sec.title}\n\n`;
        md += `${sec.content}\n\n`;
        if (sec.keyQuestions.length > 0) {
          md += `**Questions to Validate:**\n`;
          sec.keyQuestions.forEach((q) => (md += `- ${q}\n`));
          md += `\n`;
        }
        if (sec.risks.length > 0) {
          md += `**Identified Risks & Friction:**\n`;
          sec.risks.forEach((r) => (md += `- ${r}\n`));
          md += `\n`;
        }
      });

      md += `**Alignment Checks:**\n`;
      s.alignmentChecks.forEach((chk) => {
        md += `- **With ${chk.targetStory.toUpperCase()} [${chk.status.toUpperCase()}]:** ${chk.question} *(Note: ${chk.notes})*\n`;
      });
      md += `\n---\n\n`;
    });

    // Deliverables
    md += `## Lifecycle Phase Deliverables & Verification Gates\n\n`;
    project.deliverables.forEach((d) => {
      md += `- [${d.completed ? 'x' : ' '}] **[${d.phase.toUpperCase()}]** (${d.storyType.toUpperCase()} / ${d.ownerRole.toUpperCase()}): ${d.title} — ${d.description}\n`;
    });

    return md;
  };

  const markdownContent = generateMarkdown();
  const jsonContent = JSON.stringify(project, null, 2);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Export Executive Alignment Brief
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {project.name} · Complete 5-Story Strategy & Delivery Dossier
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={() => handleCopy(activeFormat === 'json' ? jsonContent : markdownContent)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Content'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Format Selector Bar */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setActiveFormat('preview')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeFormat === 'preview'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Formatted Brief
          </button>
          <button
            onClick={() => setActiveFormat('markdown')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeFormat === 'markdown'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Markdown (.md)
          </button>
          <button
            onClick={() => setActiveFormat('json')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              activeFormat === 'json'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Raw JSON
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-800 dark:text-slate-200 font-sans">
          {activeFormat === 'preview' && (
            <div className="space-y-8 max-w-3xl mx-auto print:max-w-none print:text-black">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="text-xs font-mono uppercase text-slate-500">
                  John Papadami E2E Product Design Framework
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {project.name}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Domain: {project.domain} · Audience: {project.targetAudience}
                </p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                  "{project.visionStatement}"
                </p>
              </div>

              {(['market', 'customer', 'technology', 'user', 'success'] as StoryType[]).map((st, i) => {
                const s = project.stories[st];
                const overview = STORY_OVERVIEWS[st];
                return (
                  <div key={st} className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        0{i + 1}. {overview.title}: {s.subtitle}
                      </h2>
                      <span className="text-[11px] font-mono text-slate-500">
                        {s.primaryStakeholders.join(', ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                      Objective: {s.objective}
                    </p>

                    <div className="space-y-4 pt-2">
                      {s.sections.map((sec) => (
                        <div key={sec.id} className="p-3.5 rounded-lg bg-slate-50/70 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/60 space-y-2">
                          <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                            {sec.title}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {sec.content}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Applied UX Methodologies */}
                    <div className="pt-2">
                      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Applied UX Methodologies:
                      </div>
                      <div className="flex flex-wrap gap-1.5 text-xs">
                        {(s.uxMethodologies || overview.uxMethodologies || []).map((m) => (
                          <span
                            key={m.id}
                            className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]"
                          >
                            {m.name} <span className="text-slate-400">({m.category})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Lifecycle Phase Milestones
                </h3>
                <div className="space-y-1 text-xs">
                  {project.deliverables.map((del) => (
                    <div key={del.id} className="flex items-center gap-2 py-1">
                      <span className="font-mono text-[10px] uppercase text-slate-500 font-semibold w-16">
                        [{del.phase}]
                      </span>
                      <span className={del.completed ? 'text-slate-400 line-through' : 'font-medium text-slate-800 dark:text-slate-200'}>
                        {del.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeFormat === 'markdown' && (
            <pre className="font-mono text-xs whitespace-pre-wrap p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed">
              {markdownContent}
            </pre>
          )}

          {activeFormat === 'json' && (
            <pre className="font-mono text-xs whitespace-pre p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto leading-relaxed">
              {jsonContent}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
