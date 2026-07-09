import { NextResponse } from "next/server";
import { authenticateAgent } from "@/lib/agent-auth";
import { prisma } from "@/lib/db";

type AgentContextRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, { params }: AgentContextRouteProps) {
  const auth = await authenticateAgent(request, ["ideas:read"]);

  if ("response" in auth) {
    return auth.response;
  }

  if (!prisma) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const { slug } = await params;
  const idea = await prisma.idea.findUnique({
    where: { slug },
    include: {
      artifacts: {
        orderBy: [{ artifactType: "asc" }, { sortOrder: "asc" }, { slug: "asc" }],
      },
      signals: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!idea) {
    return NextResponse.json({ error: "Idea not found." }, { status: 404 });
  }

  return NextResponse.json({ idea });
}
