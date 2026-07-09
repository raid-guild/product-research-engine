import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { authenticateAgent } from "@/lib/agent-auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slugify";
import { upsertAgentArtifactSchema } from "@/lib/validation/agent-api";

type AgentArtifactRouteProps = {
  params: Promise<{ slug: string; artifactSlug: string }>;
};

export async function PUT(request: Request, { params }: AgentArtifactRouteProps) {
  const auth = await authenticateAgent(request, ["artifacts:write"]);

  if ("response" in auth) {
    return auth.response;
  }

  if (!prisma) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const { slug, artifactSlug } = await params;
  const body = await request.json().catch(() => null);
  const parsed = upsertAgentArtifactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid artifact payload." },
      { status: 400 },
    );
  }

  const idea = await prisma.idea.findUnique({ where: { slug } });

  if (!idea) {
    return NextResponse.json({ error: "Idea not found." }, { status: 404 });
  }

  const input = parsed.data;
  const normalizedArtifactSlug = slugify(artifactSlug || input.fileName || input.title);

  if (!normalizedArtifactSlug) {
    return NextResponse.json({ error: "Could not derive a valid artifact slug." }, { status: 400 });
  }

  const artifact = await prisma.ideaArtifact.upsert({
    where: {
      ideaId_artifactType_slug: {
        ideaId: idea.id,
        artifactType: input.artifactType,
        slug: normalizedArtifactSlug,
      },
    },
    create: {
      ideaId: idea.id,
      artifactType: input.artifactType,
      slug: normalizedArtifactSlug,
      title: input.title,
      fileName: input.fileName,
      sortOrder: input.sortOrder,
      contentMarkdown: input.contentMarkdown,
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
      createdByType: "agent",
      createdBy: input.createdBy ?? auth.agent.label,
    },
    update: {
      title: input.title,
      fileName: input.fileName,
      sortOrder: input.sortOrder,
      contentMarkdown: input.contentMarkdown,
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
    },
  });

  if (input.artifactType === "research_report" || input.artifactType === "research_plan") {
    await prisma.idea.update({
      where: { id: idea.id },
      data: { status: "research" },
    });
  }

  return NextResponse.json({ artifact });
}
