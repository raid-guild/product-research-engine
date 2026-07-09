import { NextResponse } from "next/server";
import { authenticateAgent } from "@/lib/agent-auth";
import { prisma } from "@/lib/db";
import { createAgentSignalSchema } from "@/lib/validation/agent-api";

type AgentSignalRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, { params }: AgentSignalRouteProps) {
  const auth = await authenticateAgent(request, ["signals:write"]);

  if ("response" in auth) {
    return auth.response;
  }

  if (!prisma) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const { slug } = await params;
  const body = await request.json().catch(() => null);
  const parsed = createAgentSignalSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid signal payload." },
      { status: 400 },
    );
  }

  const idea = await prisma.idea.findUnique({ where: { slug } });

  if (!idea) {
    return NextResponse.json({ error: "Idea not found." }, { status: 404 });
  }

  const input = parsed.data;
  const signal = await prisma.signal.create({
    data: {
      ideaId: idea.id,
      title: input.title,
      description: input.description,
      sourceType: input.sourceType,
      sourceUrl: input.sourceUrl,
      sourceDate: input.sourceDate ? new Date(input.sourceDate) : undefined,
      strength: input.strength,
      sentiment: input.sentiment,
      rawMarkdown: input.rawMarkdown,
      summaryMarkdown: input.summaryMarkdown,
      researchQuestion: input.researchQuestion,
      capturedByType: "agent",
      capturedBy: input.capturedBy ?? auth.agent.label,
    },
  });

  await prisma.idea.update({
    where: { id: idea.id },
    data: { status: idea.status === "draft" || idea.status === "pitch" ? "signal" : idea.status },
  });

  return NextResponse.json({ signal }, { status: 201 });
}
