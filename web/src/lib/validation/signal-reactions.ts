import { z } from "zod";

export const reactionEmojiOptions = ["🔥", "👀", "⚠️", "❓", "🧊", "💸", "🧭"] as const;

export const signalReactionInputSchema = z.object({
  relatedIdeaSlug: z.string().trim().min(1, "Choose an idea."),
  relatedIdeaTitle: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  reactionEmoji: z.string().trim().min(1, "Choose a reaction."),
  note: z.string().trim().min(3, "Add a short note."),
  researchQuestion: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  submittedBy: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export type SignalReactionInput = z.infer<typeof signalReactionInputSchema>;
