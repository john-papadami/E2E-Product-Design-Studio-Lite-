import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type StoryType = 'market' | 'customer' | 'technology' | 'user' | 'success';

interface ProjectBrief {
  name: string;
  domain: string;
  targetAudience: string;
  visionStatement: string;
  productIdea?: string;
}

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    const err = new Error(
      'GEMINI_API_KEY is not configured. Please add your Gemini API key in Settings > Secrets.'
    ) as Error & { statusCode?: number };
    err.statusCode = 500;
    throw err;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function extractErrorDetails(error: unknown): { status: number; message: string } {
  const rawMessage = error instanceof Error ? error.message : String(error);
  const lower = rawMessage.toLowerCase();

  if (lower.includes('api_key_invalid') || lower.includes('permission_denied') || lower.includes('403') || lower.includes('api key')) {
    return {
      status: 403,
      message: 'Gemini API key is missing or invalid. Please verify your key in Settings > Secrets.',
    };
  }
  if (lower.includes('resource_exhausted') || lower.includes('429') || lower.includes('quota')) {
    return {
      status: 429,
      message: 'Gemini API rate limit or quota reached. Please wait a moment and try again, or check your API key quota in Settings > Secrets.',
    };
  }
  if (lower.includes('not_found') || lower.includes('404')) {
    return {
      status: 404,
      message: `Requested Gemini model was not found: ${rawMessage}`,
    };
  }
  return {
    status: 500,
    message: rawMessage || 'Unexpected error communicating with Gemini API.',
  };
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
      const isNonRetryable =
        msg.includes('api_key_invalid') ||
        msg.includes('permission_denied') ||
        msg.includes('not configured') ||
        msg.includes('400');
      if (isNonRetryable || attempt === maxRetries) {
        throw err;
      }
      const delayMs = 800 * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
}

const STORY_DIRECTIVES: Record<
  StoryType,
  {
    title: string;
    roleFocus: string;
    targetStories: StoryType[];
  }
> = {
  market: {
    title: 'Market Story',
    roleFocus:
      'Investigate the market landscape, macro economic/industry timing, TAM/SAM/SOM sizing assumptions, incumbent competitors, competitive vulnerabilities, and strategic differentiation wedges. Include Market Discovery & Strategic UX methodologies.',
    targetStories: ['customer', 'technology'],
  },
  customer: {
    title: 'Customer Story',
    roleFocus:
      'Identify distinct customer segments (economic buyers, champions, and end-user organizations), severe pain points, manual workarounds, Jobs-to-be-Done (JTBD), procurement barriers, and willingness-to-pay drivers. Include Generative Research & Customer Discovery UX methodologies.',
    targetStories: ['market', 'user'],
  },
  technology: {
    title: 'Technology Story',
    roleFocus:
      'Establish technical requirements, system architecture, data flows, API/integration contracts, scalability/latency SLAs, security/compliance constraints (e.g., SOC2, GDPR, HIPAA where relevant), AI/ML or compute trade-offs, and build-vs-buy risks. Include Technical UX & Architectural UX methodologies.',
    targetStories: ['market', 'user'],
  },
  user: {
    title: 'User Story',
    roleFocus:
      'Develop primary use cases, end-to-end user workflows, role-based interaction ergonomics, edge-case error recovery, information architecture, and WCAG accessibility requirements. Include Interaction Design, Design Systems & IA methodologies.',
    targetStories: ['customer', 'technology'],
  },
  success: {
    title: 'Success Story',
    roleFocus:
      'Establish verifiable success criteria, North Star metric, leading adoption indicators, business ROI benchmarks, instrumentation/telemetry measurement plan, and post-launch verification gates. Include Quantitative UX, HEART & Continuous Discovery methodologies.',
    targetStories: ['market', 'customer'],
  },
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  // 1. Frame raw founder product idea into structured ProjectBrief
  app.post('/api/ai/extract-brief', async (req: Request, res: Response) => {
    try {
      const { productIdea, domain, targetAudience, constraints } = req.body as {
        productIdea?: string;
        domain?: string;
        targetAudience?: string;
        constraints?: string;
      };

      if (!productIdea || !productIdea.trim()) {
        res.status(400).json({ error: 'Please provide a product idea to analyze.' });
        return;
      }

      const ai = getAiClient();
      const response = await withRetry(() =>
        ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: `Analyze this founder product idea and synthesize a crisp strategic project brief.
Product Idea: ${productIdea.trim()}
${domain?.trim() ? `Preferred Industry/Domain: ${domain.trim()}` : ''}
${targetAudience?.trim() ? `Preferred Target Audience: ${targetAudience.trim()}` : ''}
${constraints?.trim() ? `Known Constraints/Goals: ${constraints.trim()}` : ''}`,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            systemInstruction:
              'You are a Principal Product Strategist working within John Papadami’s 5-Story End-to-End Product Design Framework. Produce concise, executive-grade product framing.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                name: {
                  type: Type.STRING,
                  description: 'Crisp product name and 4-7 word positioning tagline, e.g., "VeriFlow: Automated Freight Audit Engine".',
                },
                domain: {
                  type: Type.STRING,
                  description: 'Specific industry/domain category, e.g., "B2B Logistics & Autonomous Supply Chain".',
                },
                targetAudience: {
                  type: Type.STRING,
                  description: 'Primary organizational buyers and frontline end users.',
                },
                visionStatement: {
                  type: Type.STRING,
                  description: 'Clear 1-2 sentence strategic vision statement articulating value and transformation.',
                },
              },
              required: ['name', 'domain', 'targetAudience', 'visionStatement'],
            },
          },
        })
      );

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (err) {
      const { status, message } = extractErrorDetails(err);
      res.status(status).json({ error: message });
    }
  });

  // 2. Generate complete data for a single Story (Market, Customer, Technology, User, or Success)
  app.post('/api/ai/generate-story', async (req: Request, res: Response) => {
    try {
      const { projectBrief, storyType, customInstructions, existingStoriesSummary } = req.body as {
        projectBrief?: ProjectBrief;
        storyType?: StoryType;
        customInstructions?: string;
        existingStoriesSummary?: string;
      };

      if (!projectBrief || !storyType || !STORY_DIRECTIVES[storyType]) {
        res.status(400).json({ error: 'Valid projectBrief and storyType are required.' });
        return;
      }

      const directive = STORY_DIRECTIVES[storyType];
      const ai = getAiClient();

      const prompt = `Generate comprehensive, realistic, industry-specific ${directive.title} data for this product initiative.

Product Name: ${projectBrief.name}
Domain: ${projectBrief.domain}
Target Audience: ${projectBrief.targetAudience}
Vision Statement: ${projectBrief.visionStatement}
${projectBrief.productIdea ? `Founder Pitch / Raw Idea: ${projectBrief.productIdea}` : ''}
${existingStoriesSummary ? `\nContext from previously generated stories (ensure tight cross-story alignment):\n${existingStoriesSummary}` : ''}
${customInstructions?.trim() ? `\nSpecific Focus / User Instructions: ${customInstructions.trim()}` : ''}

Focus Mandate for ${directive.title}:
${directive.roleFocus}

Requirements:
- Generate 3 distinct, substantive dimensions ("sections") tailored specifically to this product (no generic boilerplate).
- Each section must have a rich, analytical "content" paragraph (3-5 sentences with concrete specifics, mechanisms, or competitor/segment/technical/workflow/metric details), 2-3 sharp validation "keyQuestions", 2-3 concrete "deliverables", and 2-3 realistic "risks".
- Generate 3 tailored "uxMethodologies" relevant to ${directive.title} and this specific product.
- Generate 2 "alignmentChecks" linking this story to ${directive.targetStories.join(' and ')} stories.`;

      const response = await withRetry(() =>
        ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
            systemInstruction:
              'You are an elite cross-functional Product Strategy, UX Architecture, and Systems Engineering co-pilot using the 5-Story E2E Product Design Framework. Provide concrete, domain-accurate, non-generic product discovery artifacts.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                subtitle: {
                  type: Type.STRING,
                  description: 'Compelling 3-7 word subtitle capturing the thesis of this story.',
                },
                objective: {
                  type: Type.STRING,
                  description: 'Clear 1-2 sentence strategic objective for this story.',
                },
                primaryStakeholders: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3-4 specific stakeholder roles accountable for this story.',
                },
                sections: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      content: { type: Type.STRING },
                      keyQuestions: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      deliverables: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      risks: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                    required: ['title', 'description', 'content', 'keyQuestions', 'deliverables', 'risks'],
                  },
                },
                uxMethodologies: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      category: { type: Type.STRING },
                      description: { type: Type.STRING },
                      whenToUse: { type: Type.STRING },
                      keyOutputs: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      isPrimary: { type: Type.BOOLEAN },
                    },
                    required: ['name', 'category', 'description', 'whenToUse', 'keyOutputs', 'isPrimary'],
                  },
                },
                alignmentChecks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      targetStory: {
                        type: Type.STRING,
                        description: `One of: ${directive.targetStories.join(', ')}`,
                      },
                      status: {
                        type: Type.STRING,
                        description: 'One of: aligned, review_needed, in_progress',
                      },
                      notes: { type: Type.STRING },
                    },
                    required: ['question', 'targetStory', 'status', 'notes'],
                  },
                },
              },
              required: ['subtitle', 'objective', 'primaryStakeholders', 'sections', 'uxMethodologies', 'alignmentChecks'],
            },
          },
        })
      );

      const raw = JSON.parse((response.text ?? '{}').trim());
      const now = Date.now();
      const validTargets: StoryType[] = ['market', 'customer', 'technology', 'user', 'success'];
      const validStatuses = ['aligned', 'review_needed', 'in_progress'];

      const storyDefinition = {
        type: storyType,
        title: directive.title,
        subtitle: raw.subtitle || directive.title,
        objective: raw.objective || '',
        primaryStakeholders: Array.isArray(raw.primaryStakeholders) ? raw.primaryStakeholders : [],
        sections: (Array.isArray(raw.sections) ? raw.sections : []).map((s: Record<string, unknown>, idx: number) => ({
          id: `sec-${storyType}-${now}-${idx + 1}`,
          title: String(s.title || `Dimension ${idx + 1}`),
          description: String(s.description || ''),
          content: String(s.content || ''),
          keyQuestions: Array.isArray(s.keyQuestions) ? s.keyQuestions.map(String) : [],
          deliverables: Array.isArray(s.deliverables) ? s.deliverables.map(String) : [],
          risks: Array.isArray(s.risks) ? s.risks.map(String) : [],
        })),
        uxMethodologies: (Array.isArray(raw.uxMethodologies) ? raw.uxMethodologies : []).map(
          (m: Record<string, unknown>, idx: number) => ({
            id: `ux-${storyType}-${now}-${idx + 1}`,
            name: String(m.name || 'UX Methodology'),
            category: String(m.category || 'UX Research'),
            description: String(m.description || ''),
            whenToUse: String(m.whenToUse || ''),
            keyOutputs: Array.isArray(m.keyOutputs) ? m.keyOutputs.map(String) : [],
            isPrimary: Boolean(m.isPrimary),
          })
        ),
        alignmentChecks: (Array.isArray(raw.alignmentChecks) ? raw.alignmentChecks : []).map(
          (c: Record<string, unknown>, idx: number) => {
            const target = String(c.targetStory || '').toLowerCase() as StoryType;
            const status = String(c.status || '').toLowerCase();
            return {
              question: String(c.question || ''),
              targetStory: validTargets.includes(target) && target !== storyType
                ? target
                : directive.targetStories[idx % directive.targetStories.length],
              status: validStatuses.includes(status)
                ? (status as 'aligned' | 'review_needed' | 'in_progress')
                : 'in_progress',
              notes: String(c.notes || ''),
            };
          }
        ),
      };

      res.json(storyDefinition);
    } catch (err) {
      const { status, message } = extractErrorDetails(err);
      res.status(status).json({ error: message });
    }
  });

  // 3. Generate & initially validate Design Concepts from product & story context
  app.post('/api/ai/design-concepts', async (req: Request, res: Response) => {
    try {
      const { projectBrief, storyContext, focusArea } = req.body as {
        projectBrief?: ProjectBrief;
        storyContext?: string;
        focusArea?: string;
      };

      if (!projectBrief) {
        res.status(400).json({ error: 'projectBrief is required.' });
        return;
      }

      const ai = getAiClient();
      const prompt = `Generate 3 distinct, concrete UX Design Concepts for this product and evaluate each concept against customer needs, technical constraints, and usability ergonomics.

Product Name: ${projectBrief.name}
Domain: ${projectBrief.domain}
Target Audience: ${projectBrief.targetAudience}
Vision Statement: ${projectBrief.visionStatement}
${storyContext ? `\nCross-Story Context:\n${storyContext}` : ''}
${focusArea?.trim() ? `\nSpecific Concept Focus: ${focusArea.trim()}` : ''}

Create 3 diverse approaches (e.g., an autonomous/copilot workflow, a progressive disclosure workbench, and a high-leverage exception-first interface) tailored to the product.`;

      const response = await withRetry(() =>
        ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
            systemInstruction:
              'You are a Staff Product Designer and UX Architect specializing in concept generation, interaction modeling, and empirical usability validation.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  targetUseCase: { type: Type.STRING },
                  interactionModel: {
                    type: Type.STRING,
                    description: 'Core UI paradigm, layout structure, and user-system interaction pattern.',
                  },
                  keyFlows: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: '3-4 sequential steps in the primary user workflow.',
                  },
                  valueHypothesis: { type: Type.STRING },
                  validationScore: {
                    type: Type.INTEGER,
                    description: 'Estimated concept viability score from 1 to 100 based on usability, desirability, and technical feasibility.',
                  },
                  validationStatus: {
                    type: Type.STRING,
                    description: 'One of: validated, needs_revision, draft',
                  },
                  strengths: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  usabilityRisks: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  recommendedTests: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: '2-3 specific UX validation protocols (e.g., Wizard-of-Oz test, 5-second comprehension check, cognitive walkthrough).',
                  },
                },
                required: [
                  'title',
                  'targetUseCase',
                  'interactionModel',
                  'keyFlows',
                  'valueHypothesis',
                  'validationScore',
                  'validationStatus',
                  'strengths',
                  'usabilityRisks',
                  'recommendedTests',
                ],
              },
            },
          },
        })
      );

      const rawList = JSON.parse((response.text ?? '[]').trim());
      const now = Date.now();
      const validStatuses = ['draft', 'validated', 'needs_revision'];
      const concepts = (Array.isArray(rawList) ? rawList : []).map(
        (c: Record<string, unknown>, idx: number) => {
          const status = String(c.validationStatus || 'draft').toLowerCase();
          const scoreNum = Number(c.validationScore);
          return {
            id: `concept-${now}-${idx + 1}`,
            title: String(c.title || `Design Concept ${idx + 1}`),
            targetUseCase: String(c.targetUseCase || ''),
            interactionModel: String(c.interactionModel || ''),
            keyFlows: Array.isArray(c.keyFlows) ? c.keyFlows.map(String) : [],
            valueHypothesis: String(c.valueHypothesis || ''),
            validationScore: Number.isFinite(scoreNum) ? Math.max(1, Math.min(100, Math.round(scoreNum))) : 75,
            validationStatus: validStatuses.includes(status)
              ? (status as 'draft' | 'validated' | 'needs_revision')
              : 'draft',
            strengths: Array.isArray(c.strengths) ? c.strengths.map(String) : [],
            usabilityRisks: Array.isArray(c.usabilityRisks) ? c.usabilityRisks.map(String) : [],
            recommendedTests: Array.isArray(c.recommendedTests) ? c.recommendedTests.map(String) : [],
          };
        }
      );

      res.json({ concepts });
    } catch (err) {
      const { status, message } = extractErrorDetails(err);
      res.status(status).json({ error: message });
    }
  });

  // 4. Validate a user-created or edited Design Concept against Customer/Tech/User context
  app.post('/api/ai/validate-concept', async (req: Request, res: Response) => {
    try {
      const { projectBrief, concept, storyContext } = req.body as {
        projectBrief?: ProjectBrief;
        concept?: {
          title: string;
          targetUseCase: string;
          interactionModel: string;
          keyFlows: string[];
          valueHypothesis: string;
        };
        storyContext?: string;
      };

      if (!projectBrief || !concept?.title) {
        res.status(400).json({ error: 'projectBrief and concept details are required.' });
        return;
      }

      const ai = getAiClient();
      const prompt = `Critically evaluate and validate this product design concept against customer needs, technical constraints, cognitive ergonomics, and market differentiation.

Product: ${projectBrief.name} (${projectBrief.domain})
Target Audience: ${projectBrief.targetAudience}
Vision: ${projectBrief.visionStatement}
${storyContext ? `\nProject Story Context:\n${storyContext}` : ''}

Design Concept to Validate:
- Title: ${concept.title}
- Target Use Case: ${concept.targetUseCase}
- Interaction Model: ${concept.interactionModel}
- Key Flows: ${concept.keyFlows.join(' -> ')}
- Value Hypothesis: ${concept.valueHypothesis}

Score rigorously (0-100). If score >= 75, mark validationStatus as "validated"; if < 75, mark as "needs_revision". Provide actionable strengths, concrete usability/adoption risks, and specific UX validation tests.`;

      const response = await withRetry(() =>
        ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
            systemInstruction:
              'You are a Principal UX Researcher and Design Systems Reviewer conducting a rigorous pre-build concept validation critique.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                validationScore: { type: Type.INTEGER },
                validationStatus: {
                  type: Type.STRING,
                  description: 'Either "validated" or "needs_revision"',
                },
                strengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                usabilityRisks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                recommendedTests: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                'validationScore',
                'validationStatus',
                'strengths',
                'usabilityRisks',
                'recommendedTests',
              ],
            },
          },
        })
      );

      const raw = JSON.parse((response.text ?? '{}').trim());
      const score = Math.max(1, Math.min(100, Math.round(Number(raw.validationScore) || 70)));
      const status =
        raw.validationStatus === 'validated' || raw.validationStatus === 'needs_revision'
          ? raw.validationStatus
          : score >= 75
            ? 'validated'
            : 'needs_revision';

      res.json({
        validationScore: score,
        validationStatus: status,
        strengths: Array.isArray(raw.strengths) ? raw.strengths.map(String) : [],
        usabilityRisks: Array.isArray(raw.usabilityRisks) ? raw.usabilityRisks.map(String) : [],
        recommendedTests: Array.isArray(raw.recommendedTests) ? raw.recommendedTests.map(String) : [],
      });
    } catch (err) {
      const { status, message } = extractErrorDetails(err);
      res.status(status).json({ error: message });
    }
  });

  // 5. Generate 5-Phase Lifecycle Deliverables tailored to the project
  app.post('/api/ai/generate-deliverables', async (req: Request, res: Response) => {
    try {
      const { projectBrief, storiesSummary } = req.body as {
        projectBrief?: ProjectBrief;
        storiesSummary?: string;
      };

      if (!projectBrief) {
        res.status(400).json({ error: 'projectBrief is required.' });
        return;
      }

      const ai = getAiClient();
      const prompt = `Generate 10 concrete lifecycle phase deliverables (2 per phase across discover, define, design, validate, deliver) mapped to the 5 stories (market, customer, technology, user, success) and stakeholder roles (product, design, engineering, business).

Product: ${projectBrief.name} (${projectBrief.domain})
Target Audience: ${projectBrief.targetAudience}
Vision: ${projectBrief.visionStatement}
${storiesSummary ? `\nStory Summaries:\n${storiesSummary}` : ''}`;

      const response = await withRetry(() =>
        ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            systemInstruction:
              'You are a Staff Technical Program Manager structuring end-to-end verification gates across Discover, Define, Design, Validate, and Deliver phases.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: {
                    type: Type.STRING,
                    description: 'One of: discover, define, design, validate, deliver',
                  },
                  storyType: {
                    type: Type.STRING,
                    description: 'One of: market, customer, technology, user, success',
                  },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  ownerRole: {
                    type: Type.STRING,
                    description: 'One of: product, design, engineering, business',
                  },
                },
                required: ['phase', 'storyType', 'title', 'description', 'ownerRole'],
              },
            },
          },
        })
      );

      const rawList = JSON.parse((response.text ?? '[]').trim());
      const now = Date.now();
      const validPhases = ['discover', 'define', 'design', 'validate', 'deliver'];
      const validStories = ['market', 'customer', 'technology', 'user', 'success'];
      const validRoles = ['product', 'design', 'engineering', 'business'];

      const deliverables = (Array.isArray(rawList) ? rawList : []).map(
        (d: Record<string, unknown>, idx: number) => {
          const phase = String(d.phase || '').toLowerCase();
          const storyType = String(d.storyType || '').toLowerCase();
          const ownerRole = String(d.ownerRole || '').toLowerCase();
          return {
            id: `del-ai-${now}-${idx + 1}`,
            phase: validPhases.includes(phase) ? phase : validPhases[idx % validPhases.length],
            storyType: validStories.includes(storyType) ? storyType : validStories[idx % validStories.length],
            title: String(d.title || `Deliverable ${idx + 1}`),
            description: String(d.description || ''),
            completed: false,
            ownerRole: validRoles.includes(ownerRole) ? ownerRole : 'product',
          };
        }
      );

      res.json({ deliverables });
    } catch (err) {
      const { status, message } = extractErrorDetails(err);
      res.status(status).json({ error: message });
    }
  });

  // 6. Enrich or draft a single Dimension (StorySection) inside StoryCanvas
  app.post('/api/ai/enrich-dimension', async (req: Request, res: Response) => {
    try {
      const { projectBrief, storyType, section, customPrompt } = req.body as {
        projectBrief?: ProjectBrief;
        storyType?: StoryType;
        section?: {
          title: string;
          description: string;
          content: string;
          keyQuestions: string[];
          deliverables: string[];
          risks: string[];
        };
        customPrompt?: string;
      };

      if (!projectBrief || !storyType || !section) {
        res.status(400).json({ error: 'projectBrief, storyType, and section are required.' });
        return;
      }

      const ai = getAiClient();
      const prompt = `Deepen and sharpen this strategic dimension for the ${STORY_DIRECTIVES[storyType]?.title || storyType} of "${projectBrief.name}" (${projectBrief.domain}).
Vision: ${projectBrief.visionStatement}
Target Audience: ${projectBrief.targetAudience}

Current Dimension:
- Title: ${section.title}
- Description: ${section.description}
- Existing Content: ${section.content}
- Existing Questions: ${section.keyQuestions.join('; ')}
- Existing Deliverables: ${section.deliverables.join('; ')}
- Existing Risks: ${section.risks.join('; ')}
${customPrompt?.trim() ? `\nUser Refinement Request: ${customPrompt.trim()}` : ''}

Produce an upgraded, specific, actionable version of this dimension.`;

      const response = await withRetry(() =>
        ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            systemInstruction:
              'You are a Principal Product & UX Strategist sharpening a single dimension inside the 5-Story E2E Product Design Framework.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                content: { type: Type.STRING },
                keyQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                deliverables: { type: Type.ARRAY, items: { type: Type.STRING } },
                risks: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['title', 'description', 'content', 'keyQuestions', 'deliverables', 'risks'],
            },
          },
        })
      );

      const raw = JSON.parse((response.text ?? '{}').trim());
      res.json({
        title: String(raw.title || section.title),
        description: String(raw.description || section.description),
        content: String(raw.content || section.content),
        keyQuestions: Array.isArray(raw.keyQuestions) ? raw.keyQuestions.map(String) : section.keyQuestions,
        deliverables: Array.isArray(raw.deliverables) ? raw.deliverables.map(String) : section.deliverables,
        risks: Array.isArray(raw.risks) ? raw.risks.map(String) : section.risks,
      });
    } catch (err) {
      const { status, message } = extractErrorDetails(err);
      res.status(status).json({ error: message });
    }
  });

  // 7. Google Search Grounding for live market, competitor, compliance, or UX research
  app.post('/api/ai/search-grounding', async (req: Request, res: Response) => {
    try {
      const { query, storyType, projectBrief } = req.body as {
        query?: string;
        storyType?: StoryType;
        projectBrief?: ProjectBrief;
      };

      if (!query || !query.trim()) {
        res.status(400).json({ error: 'Search research query is required.' });
        return;
      }

      const ai = getAiClient();
      const contextPrefix = projectBrief
        ? `Product Context: ${projectBrief.name} (${projectBrief.domain}) for ${projectBrief.targetAudience}. Vision: ${projectBrief.visionStatement}.\n${
            storyType ? `Relevant E2E Story: ${STORY_DIRECTIVES[storyType]?.title || storyType}.\n` : ''
          }`
        : '';

      const response = await withRetry(() =>
        ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: `${contextPrefix}Research Query: ${query.trim()}\n\nSynthesize current, factual findings with concrete data points, named competitors or standards where applicable, and strategic takeaways formatted cleanly in Markdown bullets.`,
          config: {
            tools: [{ googleSearch: {} }],
            systemInstruction:
              'You are a Principal Market & Product Intelligence Researcher using live Google Search data. Provide accurate, up-to-date, evidence-backed findings relevant to product strategy, customer needs, technical standards, UX benchmarks, or success metrics.',
          },
        })
      );

      const rawChunks =
        (response.candidates?.[0]?.groundingMetadata?.groundingChunks as Array<{
          web?: { uri?: string; title?: string };
        }>) ?? [];

      const seen = new Set<string>();
      const sources: Array<{ title: string; uri: string }> = [];
      for (const chunk of rawChunks) {
        const uri = chunk?.web?.uri;
        if (uri && !seen.has(uri)) {
          seen.add(uri);
          sources.push({
            title: chunk.web?.title || uri,
            uri,
          });
        }
      }

      res.json({
        summary: response.text ?? '',
        sources,
      });
    } catch (err) {
      const { status, message } = extractErrorDetails(err);
      res.status(status).json({ error: message });
    }
  });

  // 8. Multi-turn Gemini Strategy Chatbot with role personas and optional Google Search grounding
  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    try {
      const { messages, rolePersona, mode, useSearch, projectContext } = req.body as {
        messages?: Array<{ role: 'user' | 'model'; text: string }>;
        rolePersona?: 'strategist' | 'market' | 'researcher' | 'architect' | 'analytics';
        mode?: 'balanced' | 'deep' | 'fast';
        useSearch?: boolean;
        projectContext?: string;
      };

      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: 'At least one user message is required.' });
        return;
      }

      const latest = messages[messages.length - 1];
      if (!latest || latest.role !== 'user' || !latest.text?.trim()) {
        res.status(400).json({ error: 'The latest message must be a non-empty user message.' });
        return;
      }

      const personaInstructions: Record<string, string> = {
        strategist:
          'You are the Lead E2E Product Strategist specializing in John Papadami’s 5-Story End-to-End Product Design Framework (Market, Customer, Technology, User, Success). Help the team connect strategy to execution, spot cross-story misalignments, and sharpen product decisions.',
        market:
          'You are a Market & Competitive Intelligence Analyst. Investigate industry dynamics, TAM/SAM assumptions, incumbent competitors, pricing models, regulatory tailwinds, and differentiation wedges.',
        researcher:
          'You are a Staff UX Researcher & Customer Discovery Specialist. Guide JTBD interviews, buyer vs. operator segmentation, task flow ergonomics, design concept critiques, and empirical usability validation protocols.',
        architect:
          'You are a Chief Systems Architect & Technical UX Advisor. Evaluate non-functional requirements, SLAs, data pipelines, security/compliance constraints (SOC2, HIPAA, GDPR), build-vs-buy trade-offs, and perceived latency budgets.',
        analytics:
          'You are a Product Analytics & Success Outcomes Lead. Define North Star metrics, leading indicators, HEART telemetry plans, instrumentation schemas, and release verification gates.',
      };

      const basePersona =
        personaInstructions[rolePersona || 'strategist'] || personaInstructions.strategist;

      const systemInstruction = `${basePersona}
Keep responses concise, structured with clear headings/bullets when helpful, and actionable.
${projectContext ? `\nActive Workspace Context:\n${projectContext}` : ''}`;

      const selectedModel =
        useSearch || mode !== 'fast' ? 'gemini-4-hydrogen' : 'gemini-3.1-flash-lite';

      const chatConfig: Record<string, unknown> = {
        systemInstruction,
      };

      if (useSearch) {
        chatConfig.tools = [{ googleSearch: {} }];
      } else if (selectedModel === 'gemini-3.1-flash-lite') {
        chatConfig.thinkingConfig = { thinkingLevel: ThinkingLevel.MINIMAL };
      } else if (mode === 'deep') {
        chatConfig.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      } else {
        chatConfig.thinkingConfig = { thinkingLevel: ThinkingLevel.MEDIUM };
      }

      const history = messages.slice(0, -1).map((m) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

      const ai = getAiClient();
      const response = await withRetry(async () => {
        const chat = ai.chats.create({
          model: selectedModel,
          config: chatConfig,
          history,
        });
        return chat.sendMessage({ message: latest.text.trim() });
      });

      const rawChunks =
        (response.candidates?.[0]?.groundingMetadata?.groundingChunks as Array<{
          web?: { uri?: string; title?: string };
        }>) ?? [];

      const seen = new Set<string>();
      const sources: Array<{ title: string; uri: string }> = [];
      for (const chunk of rawChunks) {
        const uri = chunk?.web?.uri;
        if (uri && !seen.has(uri)) {
          seen.add(uri);
          sources.push({
            title: chunk.web?.title || uri,
            uri,
          });
        }
      }

      res.json({
        reply: response.text ?? '',
        sources,
        modelUsed: selectedModel,
      });
    } catch (err) {
      const { status, message } = extractErrorDetails(err);
      res.status(status).json({ error: message });
    }
  });

  // Vite middleware for development, static build for production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`E2E Product Design Studio server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
