import { NextResponse } from "next/server";
import { getIdeaRun } from "@/lib/ideas";
import { createSignalReaction, getSignalReactions } from "@/lib/signal-reactions";
import { signalReactionInputSchema } from "@/lib/validation/signal-reactions";

export async function GET() {
  const reactions = await getSignalReactions();

  return NextResponse.json({ reactions });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signalReactionInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid signal reaction." },
      { status: 400 },
    );
  }

  const idea = await getIdeaRun(parsed.data.relatedIdeaSlug);

  if (!idea) {
    return NextResponse.json({ error: "Related idea run not found." }, { status: 404 });
  }

  try {
    const reaction = await createSignalReaction({
      ...parsed.data,
      relatedIdeaTitle: parsed.data.relatedIdeaTitle ?? idea.title,
    });

    return NextResponse.json({ reaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save signal reaction." },
      { status: 503 },
    );
  }
}
