import { NextResponse } from "next/server";
import { getIdeaRun } from "@/lib/ideas";
import { getSignalReactions } from "@/lib/signal-reactions";

type IdeaSignalReactionsRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: IdeaSignalReactionsRouteProps) {
  const { slug } = await params;

  if (!(await getIdeaRun(slug))) {
    return NextResponse.json({ error: "Idea run not found." }, { status: 404 });
  }

  const reactions = await getSignalReactions(slug);

  return NextResponse.json({ reactions });
}
