/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DesignConcept,
  PhaseDeliverable,
  ProductProject,
  StoryDefinition,
  StorySection,
  StoryType,
} from '../types/framework';

export interface ProjectBriefInput {
  name: string;
  domain: string;
  targetAudience: string;
  visionStatement: string;
  productIdea?: string;
}

async function postJson<TResponse>(url: string, body: unknown): Promise<TResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      (data && typeof data.error === 'string' && data.error) ||
        `Request failed with status ${response.status}`
    );
  }
  return data as TResponse;
}

export function buildProjectBrief(project: ProductProject): ProjectBriefInput {
  return {
    name: project.name,
    domain: project.domain,
    targetAudience: project.targetAudience,
    visionStatement: project.visionStatement,
    productIdea: project.aiDiscoveryBrief,
  };
}

export function summarizeStories(
  stories: Partial<Record<StoryType, StoryDefinition>>,
  excludeStory?: StoryType
): string {
  const order: StoryType[] = ['market', 'customer', 'technology', 'user', 'success'];
  return order
    .filter((st) => st !== excludeStory && stories[st])
    .map((st) => {
      const s = stories[st]!;
      const sectionSnippets = s.sections
        .map((sec) => `${sec.title}: ${sec.content.slice(0, 180)}`)
        .join(' | ');
      return `[${st.toUpperCase()} STORY - ${s.subtitle}]: Objective: ${s.objective} | Dimensions: ${sectionSnippets}`;
    })
    .join('\n');
}

export async function extractProjectBrief(params: {
  productIdea: string;
  domain?: string;
  targetAudience?: string;
  constraints?: string;
}): Promise<ProjectBriefInput> {
  return postJson<ProjectBriefInput>('/api/ai/extract-brief', params);
}

export async function generateStoryData(params: {
  projectBrief: ProjectBriefInput;
  storyType: StoryType;
  customInstructions?: string;
  existingStoriesSummary?: string;
}): Promise<StoryDefinition> {
  return postJson<StoryDefinition>('/api/ai/generate-story', params);
}

export async function generateDesignConcepts(params: {
  projectBrief: ProjectBriefInput;
  storyContext?: string;
  focusArea?: string;
}): Promise<{ concepts: DesignConcept[] }> {
  return postJson<{ concepts: DesignConcept[] }>('/api/ai/design-concepts', params);
}

export async function validateDesignConcept(params: {
  projectBrief: ProjectBriefInput;
  concept: {
    title: string;
    targetUseCase: string;
    interactionModel: string;
    keyFlows: string[];
    valueHypothesis: string;
  };
  storyContext?: string;
}): Promise<{
  validationScore: number;
  validationStatus: 'validated' | 'needs_revision';
  strengths: string[];
  usabilityRisks: string[];
  recommendedTests: string[];
}> {
  return postJson('/api/ai/validate-concept', params);
}

export async function generateLifecycleDeliverables(params: {
  projectBrief: ProjectBriefInput;
  storiesSummary?: string;
}): Promise<{ deliverables: PhaseDeliverable[] }> {
  return postJson<{ deliverables: PhaseDeliverable[] }>('/api/ai/generate-deliverables', params);
}

export async function enrichStoryDimension(params: {
  projectBrief: ProjectBriefInput;
  storyType: StoryType;
  section: StorySection;
  customPrompt?: string;
}): Promise<{
  title: string;
  description: string;
  content: string;
  keyQuestions: string[];
  deliverables: string[];
  risks: string[];
}> {
  return postJson('/api/ai/enrich-dimension', params);
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export type ChatRolePersona = 'strategist' | 'market' | 'researcher' | 'architect' | 'analytics';

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: GroundingSource[];
  modelUsed?: string;
}

export async function searchGroundingResearch(params: {
  query: string;
  storyType?: StoryType;
  projectBrief?: ProjectBriefInput;
}): Promise<{ summary: string; sources: GroundingSource[] }> {
  return postJson('/api/ai/search-grounding', params);
}

export async function sendStrategyChatMessage(params: {
  messages: Array<{ role: 'user' | 'model'; text: string }>;
  rolePersona: ChatRolePersona;
  mode: 'balanced' | 'deep' | 'fast';
  useSearch: boolean;
  projectContext?: string;
}): Promise<{ reply: string; sources: GroundingSource[]; modelUsed: string }> {
  return postJson('/api/ai/chat', params);
}

