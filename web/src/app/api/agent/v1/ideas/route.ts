import { NextResponse } from "next/server";
import { authenticateAgent } from "@/lib/agent-auth";
import { prisma } from "@/lib/db";
import { ideaArtifactTypes } from "@/lib/ideas";
import { slugify } from "@/lib/slugify";
import { createAgentIdeaSchema } from "@/lib/validation/agent-api";

export async function POST(request: Request) {
  const auth = await authenticateAgent(request, ["ideas:write"]);

  if ("response" in auth) {
    return auth.response;
  }

  if (!prisma) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createAgentIdeaSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid idea payload." },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const slug = slugify(input.slug ?? input.title);

  if (!slug) {
    return NextResponse.json({ error: "Could not derive a valid idea slug." }, { status: 400 });
  }

  const idea = await prisma.$transaction(async (tx) => {
    const savedIdea = await tx.idea.upsert({
      where: { slug },
      create: {
        slug,
        title: input.title,
        description: input.description,
        oneSentencePitch: input.oneSentencePitch,
        status: input.status,
        createdByType: "agent",
        createdBy: input.createdBy ?? auth.agent.label,
      },
      update: {
        title: input.title,
        description: input.description,
        oneSentencePitch: input.oneSentencePitch,
        status: input.status,
      },
    });

    if (input.pitchCardMarkdown) {
      await tx.ideaArtifact.upsert({
        where: {
          ideaId_artifactType_slug: {
            ideaId: savedIdea.id,
            artifactType: ideaArtifactTypes.pitchCard,
            slug: "00-pitch-card",
          },
        },
        create: {
          ideaId: savedIdea.id,
          artifactType: ideaArtifactTypes.pitchCard,
          slug: "00-pitch-card",
          title: `Pitch Card: ${input.title}`,
          fileName: "00-pitch-card.md",
          sortOrder: 0,
          contentMarkdown: input.pitchCardMarkdown,
          createdByType: "agent",
          createdBy: input.createdBy ?? auth.agent.label,
        },
        update: {
          title: `Pitch Card: ${input.title}`,
          contentMarkdown: input.pitchCardMarkdown,
        },
      });
    }

    if (input.onePageBriefMarkdown) {
      await tx.ideaArtifact.upsert({
        where: {
          ideaId_artifactType_slug: {
            ideaId: savedIdea.id,
            artifactType: ideaArtifactTypes.onePageBrief,
            slug: "01-one-page-product-brief",
          },
        },
        create: {
          ideaId: savedIdea.id,
          artifactType: ideaArtifactTypes.onePageBrief,
          slug: "01-one-page-product-brief",
          title: `One-Page Product Brief: ${input.title}`,
          fileName: "01-one-page-product-brief.md",
          sortOrder: 1,
          contentMarkdown: input.onePageBriefMarkdown,
          createdByType: "agent",
          createdBy: input.createdBy ?? auth.agent.label,
        },
        update: {
          title: `One-Page Product Brief: ${input.title}`,
          contentMarkdown: input.onePageBriefMarkdown,
        },
      });
    }

    return tx.idea.findUniqueOrThrow({
      where: { id: savedIdea.id },
      include: { artifacts: true },
    });
  });

  return NextResponse.json({ idea }, { status: 201 });
}
