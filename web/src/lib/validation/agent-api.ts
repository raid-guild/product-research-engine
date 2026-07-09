import { z } from "zod";

export const artifactTypeSchema = z.enum([
  "pitch_card",
  "one_page_brief",
  "signal_summary",
  "research_plan",
  "research_report",
]);

export const createAgentIdeaSchema = z.object({
  slug: z.string().trim().min(1).optional(),
  title: z.string().trim().min(1, "Title is required."),
  description: z.string().trim().optional().default(""),
  oneSentencePitch: z.string().trim().optional(),
  status: z.string().trim().optional().default("pitch"),
  createdBy: z.string().trim().optional(),
  pitchCardMarkdown: z.string().trim().optional(),
  onePageBriefMarkdown: z.string().trim().optional(),
});

export const createAgentSignalSchema = z.object({
  title: z.string().trim().min(1).default("Signal"),
  description: z.string().trim().optional().default(""),
  sourceType: z.string().trim().optional().default("agent_summary"),
  sourceUrl: z.string().trim().url().optional(),
  sourceDate: z.string().datetime().optional(),
  strength: z.enum(["weak", "medium", "strong"]).optional(),
  sentiment: z.enum(["interest", "curious", "risk", "confused", "skeptical", "pain", "question"]).optional(),
  rawMarkdown: z.string().optional(),
  summaryMarkdown: z.string().optional(),
  researchQuestion: z.string().trim().optional(),
  capturedBy: z.string().trim().optional(),
});

export const upsertAgentArtifactSchema = z.object({
  artifactType: artifactTypeSchema,
  title: z.string().trim().min(1, "Title is required."),
  fileName: z.string().trim().optional(),
  sortOrder: z.number().int().optional().default(0),
  contentMarkdown: z.string().min(1, "Markdown content is required."),
  metadata: z.record(z.unknown()).optional(),
  createdBy: z.string().trim().optional(),
});

export type CreateAgentIdeaInput = z.infer<typeof createAgentIdeaSchema>;
export type CreateAgentSignalInput = z.infer<typeof createAgentSignalSchema>;
export type UpsertAgentArtifactInput = z.infer<typeof upsertAgentArtifactSchema>;
