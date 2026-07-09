import type { Idea, IdeaArtifact } from "@prisma/client";
import {
  getIdeaRun as getMarkdownIdeaRun,
  getIdeaRuns as getMarkdownIdeaRuns,
  getResearchFile as getMarkdownResearchFile,
  type IdeaRun,
  type IdeaRunSummary,
  type MarkdownDocument,
  type MarkdownSection,
  type ResearchFile,
} from "@/lib/ideation-runs";
import { prisma } from "@/lib/db";

export const ideaArtifactTypes = {
  pitchCard: "pitch_card",
  onePageBrief: "one_page_brief",
  signalSummary: "signal_summary",
  researchPlan: "research_plan",
  researchReport: "research_report",
} as const;

const headingTwoPattern = /^##\s+(.+)$/gm;

const stripMarkdownExtension = (fileName: string) => fileName.replace(/\.md$/, "");

const getReadingTime = (content: string) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));

  return `${minutes} min read`;
};

const parseSections = (content: string): MarkdownSection[] => {
  const matches = Array.from(content.matchAll(headingTwoPattern));

  return matches.map((match, index) => {
    const title = match[1].trim();
    const start = (match.index ?? 0) + match[0].length;
    const end = matches[index + 1]?.index ?? content.length;

    return {
      title,
      content: content.slice(start, end).trim(),
    };
  });
};

const artifactToDocument = (artifact: IdeaArtifact): MarkdownDocument => {
  const fileName = artifact.fileName ?? `${artifact.slug}.md`;

  return {
    fileName,
    slug: stripMarkdownExtension(artifact.slug),
    title: artifact.title,
    content: artifact.contentMarkdown,
    sections: parseSections(artifact.contentMarkdown),
    readingTime: getReadingTime(artifact.contentMarkdown),
  };
};

const getArtifact = (artifacts: IdeaArtifact[], artifactType: string, slug?: string) =>
  artifacts.find(
    (artifact) => artifact.artifactType === artifactType && (!slug || artifact.slug === slug),
  );

const getResearchArtifacts = (artifacts: IdeaArtifact[]) =>
  artifacts
    .filter((artifact) => artifact.artifactType === ideaArtifactTypes.researchReport)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.slug.localeCompare(b.slug));

const rowToIdeaRun = (idea: Idea & { artifacts: IdeaArtifact[] }): IdeaRun => {
  const pitchCard = getArtifact(idea.artifacts, ideaArtifactTypes.pitchCard);
  const onePageBrief = getArtifact(idea.artifacts, ideaArtifactTypes.onePageBrief);
  const researchPlan = getArtifact(idea.artifacts, ideaArtifactTypes.researchPlan);
  const signalSummary = getArtifact(idea.artifacts, ideaArtifactTypes.signalSummary);
  const researchFiles: ResearchFile[] = getResearchArtifacts(idea.artifacts).map((artifact) => ({
    ...artifactToDocument(artifact),
    order: artifact.sortOrder,
  }));

  const pitchCardDocument = pitchCard ? artifactToDocument(pitchCard) : undefined;

  return {
    slug: idea.slug,
    title: idea.title,
    oneSentencePitch:
      idea.oneSentencePitch ??
      pitchCardDocument?.sections.find((section) => section.title.toLowerCase() === "one-sentence pitch")
        ?.content,
    hasPitchCard: Boolean(pitchCard),
    hasOnePageBrief: Boolean(onePageBrief),
    hasResearchPlan: Boolean(researchPlan),
    researchFileCount: researchFiles.length,
    markdownSignalExists: Boolean(signalSummary),
    pitchCard: pitchCardDocument,
    onePageBrief: onePageBrief ? artifactToDocument(onePageBrief) : undefined,
    signalSummary: signalSummary ? artifactToDocument(signalSummary) : undefined,
    researchFiles,
  };
};

const getDbIdeaRuns = async () => {
  if (!prisma) {
    return undefined;
  }

  const ideas = await prisma.idea.findMany({
    include: { artifacts: true },
    orderBy: { updatedAt: "desc" },
  });

  if (ideas.length === 0) {
    return undefined;
  }

  return ideas.map(rowToIdeaRun);
};

export const getIdeaRuns = async (): Promise<IdeaRunSummary[]> => {
  try {
    const dbRuns = await getDbIdeaRuns();

    if (dbRuns) {
      return dbRuns.map(({ pitchCard, onePageBrief, signalSummary, researchFiles, ...summary }) => summary);
    }
  } catch (error) {
    console.error("Could not read DB-backed ideas; falling back to markdown runs.", error);
  }

  return getMarkdownIdeaRuns();
};

export const getIdeaRun = async (slug: string): Promise<IdeaRun | undefined> => {
  if (!slug) {
    return undefined;
  }

  if (prisma) {
    try {
      const idea = await prisma.idea.findUnique({
        where: { slug },
        include: { artifacts: true },
      });

      if (idea) {
        return rowToIdeaRun(idea);
      }
    } catch (error) {
      console.error("Could not read DB-backed idea; falling back to markdown run.", error);
    }
  }

  return getMarkdownIdeaRun(slug);
};

export const getResearchFile = async (slug: string, fileSlug: string) => {
  if (prisma) {
    try {
      const idea = await prisma.idea.findUnique({
        where: { slug },
        include: {
          artifacts: {
            where: {
              artifactType: ideaArtifactTypes.researchReport,
              slug: fileSlug,
            },
          },
        },
      });

      const artifact = idea?.artifacts[0];

      if (artifact) {
        return {
          ...artifactToDocument(artifact),
          order: artifact.sortOrder,
        };
      }
    } catch (error) {
      console.error("Could not read DB-backed research file; falling back to markdown run.", error);
    }
  }

  return getMarkdownResearchFile(slug, fileSlug);
};
