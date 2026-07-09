import { NextResponse } from "next/server";
import { getIdeaRun } from "@/lib/ideas";
import { getSignalReactions } from "@/lib/signal-reactions";

type IdeaRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: IdeaRouteProps) {
  const { slug } = await params;
  const idea = await getIdeaRun(slug);

  if (!idea) {
    return NextResponse.json({ error: "Idea run not found." }, { status: 404 });
  }

  const reactions = await getSignalReactions(slug);

  return NextResponse.json({ idea, reactions });
}
