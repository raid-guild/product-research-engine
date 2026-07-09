import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");
const runsDirectory = path.resolve(
  webRoot,
  process.env.PRODUCT_IDEATION_RUNS_DIR ?? "../runs",
);

const prisma = new PrismaClient();

const headingOnePattern = /^#\s+(.+)$/m;
const headingTwoPattern = /^##\s+(.+)$/gm;
const numberedFilePattern = /^(\d+)-(.+)\.md$/;
const excludedResearchFiles = new Set([
  "00-pitch-card.md",
  "01-one-page-product-brief.md",
  "signal-notes.md",
  "research-plan.md",
]);

const stripMarkdownExtension = (fileName) => fileName.replace(/\.md$/, "");

const readMarkdown = (runDirectory, fileName) => {
  const filePath = path.join(runDirectory, fileName);

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return undefined;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(raw);
  const title = typeof data.title === "string" ? data.title : content.match(headingOnePattern)?.[1];

  return {
    fileName,
    slug: stripMarkdownExtension(fileName),
    title: title?.trim() || stripMarkdownExtension(fileName),
    content,
  };
};

const parseSections = (content) => {
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

const getOneSentencePitch = (pitchCard) =>
  parseSections(pitchCard?.content ?? "").find(
    (section) => section.title.toLowerCase() === "one-sentence pitch",
  )?.content;

const upsertArtifact = async (ideaId, artifactType, document, sortOrder) => {
  if (!document) {
    return;
  }

  await prisma.ideaArtifact.upsert({
    where: {
      ideaId_artifactType_slug: {
        ideaId,
        artifactType,
        slug: document.slug,
      },
    },
    create: {
      ideaId,
      artifactType,
      slug: document.slug,
      title: document.title,
      fileName: document.fileName,
      sortOrder,
      contentMarkdown: document.content,
      createdByType: "import",
      createdBy: "import-runs",
    },
    update: {
      title: document.title,
      fileName: document.fileName,
      sortOrder,
      contentMarkdown: document.content,
    },
  });
};

const importRun = async (slug) => {
  const runDirectory = path.join(runsDirectory, slug);
  const pitchCard = readMarkdown(runDirectory, "00-pitch-card.md");
  const onePageBrief = readMarkdown(runDirectory, "01-one-page-product-brief.md");
  const signalNotes = readMarkdown(runDirectory, "signal-notes.md");
  const researchPlan = readMarkdown(runDirectory, "research-plan.md");
  const researchFiles = fs
    .readdirSync(runDirectory)
    .filter((fileName) => numberedFilePattern.test(fileName))
    .filter((fileName) => !excludedResearchFiles.has(fileName))
    .map((fileName) => readMarkdown(runDirectory, fileName))
    .filter(Boolean)
    .sort((a, b) => a.fileName.localeCompare(b.fileName));

  const title = (pitchCard?.title ?? slug).replace(/^Pitch Card:\s*/i, "");
  const idea = await prisma.idea.upsert({
    where: { slug },
    create: {
      slug,
      title,
      description: getOneSentencePitch(pitchCard) ?? "",
      oneSentencePitch: getOneSentencePitch(pitchCard),
      status: researchFiles.length > 0 ? "research" : signalNotes ? "signal" : "pitch",
      createdByType: "import",
      createdBy: "import-runs",
    },
    update: {
      title,
      description: getOneSentencePitch(pitchCard) ?? "",
      oneSentencePitch: getOneSentencePitch(pitchCard),
      status: researchFiles.length > 0 ? "research" : signalNotes ? "signal" : "pitch",
    },
  });

  await upsertArtifact(idea.id, "pitch_card", pitchCard, 0);
  await upsertArtifact(idea.id, "one_page_brief", onePageBrief, 1);
  await upsertArtifact(idea.id, "signal_summary", signalNotes, 2);
  await upsertArtifact(idea.id, "research_plan", researchPlan, 3);

  for (const document of researchFiles) {
    const order = Number.parseInt(document.fileName.match(numberedFilePattern)?.[1] ?? "999", 10);
    await upsertArtifact(idea.id, "research_report", document, order);
  }

  return {
    slug,
    artifacts: [pitchCard, onePageBrief, signalNotes, researchPlan, ...researchFiles].filter(Boolean).length,
  };
};

const main = async () => {
  if (!fs.existsSync(runsDirectory)) {
    throw new Error(`Runs directory not found: ${runsDirectory}`);
  }

  const slugs = fs
    .readdirSync(runsDirectory)
    .filter((entry) => fs.statSync(path.join(runsDirectory, entry)).isDirectory())
    .sort((a, b) => a.localeCompare(b));

  const results = [];

  for (const slug of slugs) {
    results.push(await importRun(slug));
  }

  console.log(`Imported ${results.length} idea run(s) from ${runsDirectory}`);

  for (const result of results) {
    console.log(`- ${result.slug}: ${result.artifacts} artifact(s)`);
  }
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
