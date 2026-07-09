import { prisma } from "@/lib/db";
import type { SignalReactionInput } from "@/lib/validation/signal-reactions";

export type SignalReactionView = {
  id: string;
  relatedIdeaSlug: string;
  relatedIdeaTitle?: string | null;
  reactionEmoji: string;
  note: string;
  researchQuestion?: string | null;
  submittedBy?: string | null;
  submittedAt: Date;
  updatedAt: Date;
};

export type SignalReactionStats = {
  count: number;
  latestSubmittedAt?: Date;
};

const sentimentEmojiMap: Record<string, string> = {
  interest: "🔥",
  curious: "👀",
  risk: "⚠️",
  confused: "❓",
  skeptical: "🧊",
  pain: "💸",
  question: "🧭",
};

const emojiSentimentMap: Record<string, string> = {
  "🔥": "interest",
  "👀": "curious",
  "⚠️": "risk",
  "❓": "confused",
  "🧊": "skeptical",
  "💸": "pain",
  "🧭": "question",
};

const getSignals = async (relatedIdeaSlug?: string) => {
  if (!prisma) {
    return [];
  }

  return prisma.signal.findMany({
    where: relatedIdeaSlug ? { idea: { slug: relatedIdeaSlug } } : undefined,
    include: { idea: true },
    orderBy: { createdAt: "desc" },
  });
};

type DbSignal = Awaited<ReturnType<typeof getSignals>>[number];

const signalToReactionView = (signal: DbSignal): SignalReactionView => ({
  id: signal.id,
  relatedIdeaSlug: signal.idea.slug,
  relatedIdeaTitle: signal.idea.title,
  reactionEmoji: signal.sentiment ? sentimentEmojiMap[signal.sentiment] ?? "👀" : "👀",
  note: signal.description || signal.summaryMarkdown || signal.rawMarkdown || signal.title,
  researchQuestion: signal.researchQuestion,
  submittedBy: signal.capturedBy,
  submittedAt: signal.createdAt,
  updatedAt: signal.updatedAt,
});

export const getSignalReactions = async (relatedIdeaSlug?: string): Promise<SignalReactionView[]> => {
  if (!prisma) {
    return [];
  }

  const signals = await getSignals(relatedIdeaSlug);
  const signalViews = signals.map(signalToReactionView);
  const legacyReactions = await prisma.signalReaction.findMany({
    where: relatedIdeaSlug ? { relatedIdeaSlug } : undefined,
    orderBy: { submittedAt: "desc" },
  });

  return [...signalViews, ...legacyReactions].sort(
    (a, b) => b.submittedAt.getTime() - a.submittedAt.getTime(),
  );
};

export const getSignalReactionStatsByIdea = async (): Promise<Record<string, SignalReactionStats>> => {
  if (!prisma) {
    return {};
  }

  const signalRows = await prisma.signal.groupBy({
    by: ["ideaId"],
    _count: { _all: true },
    _max: { createdAt: true },
  });
  const ideas = await prisma.idea.findMany({
    where: { id: { in: signalRows.map((row) => row.ideaId) } },
    select: { id: true, slug: true },
  });
  const slugById = new Map(ideas.map((idea) => [idea.id, idea.slug]));
  const stats = signalRows.reduce<Record<string, SignalReactionStats>>((result, row) => {
    const slug = slugById.get(row.ideaId);

    if (slug) {
      result[slug] = {
        count: row._count._all,
        latestSubmittedAt: row._max.createdAt ?? undefined,
      };
    }

    return result;
  }, {});

  const legacyRows = await prisma.signalReaction.groupBy({
    by: ["relatedIdeaSlug"],
    _count: { _all: true },
    _max: { submittedAt: true },
  });

  return legacyRows.reduce<Record<string, SignalReactionStats>>((result, row) => {
    const existing = result[row.relatedIdeaSlug];

    result[row.relatedIdeaSlug] = {
      count: (existing?.count ?? 0) + row._count._all,
      latestSubmittedAt:
        existing?.latestSubmittedAt && row._max.submittedAt
          ? new Date(Math.max(existing.latestSubmittedAt.getTime(), row._max.submittedAt.getTime()))
          : existing?.latestSubmittedAt ?? row._max.submittedAt ?? undefined,
    };

    return result;
  }, stats);
};

export const createSignalReaction = async (
  input: SignalReactionInput & { relatedIdeaTitle?: string },
) => {
  if (!prisma) {
    throw new Error("Database is not configured.");
  }

  const idea = await prisma.idea.upsert({
    where: { slug: input.relatedIdeaSlug },
    update: {
      ...(input.relatedIdeaTitle ? { title: input.relatedIdeaTitle } : {}),
      status: "signal",
    },
    create: {
      slug: input.relatedIdeaSlug,
      title: input.relatedIdeaTitle ?? input.relatedIdeaSlug,
      description: "",
      status: "signal",
      createdByType: "human",
      createdBy: input.submittedBy,
    },
  });

  return prisma.signal.create({
    data: {
      ideaId: idea.id,
      title: "Signal reaction",
      description: input.note,
      sourceType: "internal_reaction",
      sentiment: emojiSentimentMap[input.reactionEmoji] ?? "curious",
      researchQuestion: input.researchQuestion,
      capturedByType: input.submittedBy ? "human" : undefined,
      capturedBy: input.submittedBy,
    },
  });
};
