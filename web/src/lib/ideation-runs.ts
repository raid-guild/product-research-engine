import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const defaultRunsDirectory = path.resolve(process.cwd(), "../runs");

export type MarkdownSection = {
  title: string;
  content: string;
};

export type MarkdownDocument = {
  fileName: string;
  slug: string;
  title: string;
  content: string;
  sections: MarkdownSection[];
  readingTime: string;
};

export type ResearchFile = MarkdownDocument & {
  order: number;
};

export type IdeaRunSummary = {
  slug: string;
  title: string;
  oneSentencePitch?: string;
  hasPitchCard: boolean;
  hasOnePageBrief: boolean;
  hasResearchPlan: boolean;
  researchFileCount: number;
  markdownSignalExists: boolean;
};

export type IdeaRun = IdeaRunSummary & {
  pitchCard?: MarkdownDocument;
  onePageBrief?: MarkdownDocument;
  researchFiles: ResearchFile[];
};

export const runsDirectory = path.resolve(
  process.env.PRODUCT_IDEATION_RUNS_DIR ?? defaultRunsDirectory,
);

const markdownExtensionPattern = /\.md$/;
const headingOnePattern = /^#\s+(.+)$/m;
const headingTwoPattern = /^##\s+(.+)$/gm;
const numberedFilePattern = /^(\d+)-(.+)\.md$/;

const excludedResearchFiles = new Set([
  "00-pitch-card.md",
  "01-one-page-product-brief.md",
  "signal-notes.md",
  "research-plan.md",
]);

const stripMarkdownExtension = (fileName: string) => fileName.replace(markdownExtensionPattern, "");

const getReadingTime = (content: string) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));

  return `${minutes} min read`;
};

const getRunDirectory = (slug: string) => path.join(runsDirectory, slug);

const fileExists = (filePath: string) => fs.existsSync(filePath) && fs.statSync(filePath).isFile();

const getMarkdownTitle = (content: string, fallback: string) => {
  const match = content.match(headingOnePattern);

  return match?.[1]?.trim() || fallback;
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

const readMarkdownDocument = (runSlug: string, fileName: string): MarkdownDocument | undefined => {
  const filePath = path.join(getRunDirectory(runSlug), fileName);

  if (!fileExists(filePath)) {
    return undefined;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(raw);
  const fallbackTitle = stripMarkdownExtension(fileName);
  const frontmatterTitle = typeof data.title === "string" ? data.title : undefined;

  return {
    fileName,
    slug: stripMarkdownExtension(fileName),
    title: frontmatterTitle ?? getMarkdownTitle(content, fallbackTitle),
    content,
    sections: parseSections(content),
    readingTime: getReadingTime(content),
  };
};

const getOneSentencePitch = (pitchCard?: MarkdownDocument) =>
  pitchCard?.sections.find((section) => section.title.toLowerCase() === "one-sentence pitch")
    ?.content;

const getResearchOrder = (fileName: string) => {
  const match = fileName.match(numberedFilePattern);

  return match ? Number.parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
};

export const getIdeaSlugs = () => {
  if (!fs.existsSync(runsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(runsDirectory)
    .filter((entry) => fs.statSync(path.join(runsDirectory, entry)).isDirectory())
    .sort((a, b) => a.localeCompare(b));
};

export const getResearchFiles = (slug: string): ResearchFile[] => {
  const runDirectory = getRunDirectory(slug);

  if (!fs.existsSync(runDirectory)) {
    return [];
  }

  return fs
    .readdirSync(runDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .filter((fileName) => numberedFilePattern.test(fileName))
    .filter((fileName) => !excludedResearchFiles.has(fileName))
    .map((fileName) => readMarkdownDocument(slug, fileName))
    .filter((document): document is MarkdownDocument => Boolean(document))
    .map((document) => ({
      ...document,
      order: getResearchOrder(document.fileName),
    }))
    .sort((a, b) => a.order - b.order || a.fileName.localeCompare(b.fileName));
};

export const getResearchFile = (slug: string, fileSlug: string) =>
  getResearchFiles(slug).find((file) => file.slug === fileSlug);

export const getIdeaRun = (slug: string): IdeaRun | undefined => {
  if (!getIdeaSlugs().includes(slug)) {
    return undefined;
  }

  const pitchCard = readMarkdownDocument(slug, "00-pitch-card.md");
  const onePageBrief = readMarkdownDocument(slug, "01-one-page-product-brief.md");
  const researchFiles = getResearchFiles(slug);
  const runDirectory = getRunDirectory(slug);

  return {
    slug,
    title: pitchCard?.title.replace(/^Pitch Card:\s*/i, "") ?? slug,
    oneSentencePitch: getOneSentencePitch(pitchCard),
    hasPitchCard: Boolean(pitchCard),
    hasOnePageBrief: Boolean(onePageBrief),
    hasResearchPlan: fileExists(path.join(runDirectory, "research-plan.md")),
    researchFileCount: researchFiles.length,
    markdownSignalExists: fileExists(path.join(runDirectory, "signal-notes.md")),
    pitchCard,
    onePageBrief,
    researchFiles,
  };
};

export const getIdeaRuns = (): IdeaRunSummary[] =>
  getIdeaSlugs()
    .map(getIdeaRun)
    .filter((run): run is IdeaRun => Boolean(run))
    .map(({ pitchCard, onePageBrief, researchFiles, ...summary }) => summary);
