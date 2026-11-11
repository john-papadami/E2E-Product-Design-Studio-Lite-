/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StoryType = 'market' | 'customer' | 'technology' | 'user' | 'success';

export type LifecyclePhase = 'discover' | 'define' | 'design' | 'validate' | 'deliver';

export type StakeholderRole = 'product' | 'design' | 'engineering' | 'business';

export interface StorySection {
  id: string;
  title: string;
  description: string;
  content: string;
  keyQuestions: string[];
  deliverables: string[];
  risks: string[];
}

export interface UXMethodology {
  id: string;
  name: string;
  category: string;
  description: string;
  whenToUse: string;
  keyOutputs: string[];
  isPrimary?: boolean;
}

export interface StoryDefinition {
  type: StoryType;
  title: string;
  subtitle: string;
  objective: string;
  primaryStakeholders: string[];
  sections: StorySection[];
  uxMethodologies: UXMethodology[];
  alignmentChecks: {
    question: string;
    targetStory: StoryType;
    status: 'aligned' | 'review_needed' | 'in_progress';
    notes: string;
  }[];
}

export interface PhaseDeliverable {
  id: string;
  phase: LifecyclePhase;
  storyType: StoryType;
  title: string;
  description: string;
  completed: boolean;
  ownerRole: StakeholderRole;
}

export interface ProductProject {
  id: string;
  name: string;
  domain: string;
  targetAudience: string;
  visionStatement: string;
  lastUpdated: string;
  stories: {
    market: StoryDefinition;
    customer: StoryDefinition;
    technology: StoryDefinition;
    user: StoryDefinition;
    success: StoryDefinition;
  };
  deliverables: PhaseDeliverable[];
}
