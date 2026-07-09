import { NextResponse } from "next/server";
import { getIdeaRuns } from "@/lib/ideas";
import { getSignalReactionStatsByIdea } from "@/lib/signal-reactions";

export async function GET() {
  const ideas = await getIdeaRuns();
  const statsByIdea = await getSignalReactionStatsByIdea();

  return NextResponse.json({ ideas, statsByIdea });
}
