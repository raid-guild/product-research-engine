import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppNav } from "@/components/ideation/AppNav";
import { SignalReactionForm } from "@/components/ideation/SignalReactionForm";
import { Button } from "@/components/ui/button";
import { getIdeaRun, getIdeaRuns } from "@/lib/ideas";

type NewSignalReactionPageProps = {
  searchParams: Promise<{ idea?: string }>;
};

export default async function NewSignalReactionPage({ searchParams }: NewSignalReactionPageProps) {
  const { idea: ideaSlug } = await searchParams;
  const ideas = await getIdeaRuns();
  const idea = ideaSlug ? await getIdeaRun(ideaSlug) : await getIdeaRun(ideas[0]?.slug ?? "");

  if (!idea) {
    notFound();
  }

  return (
    <div className="noise-bg min-h-screen bg-background">
      <AppNav />
      <main className="relative z-10 mx-auto max-w-3xl px-6 py-10">
        <Button asChild variant="ghost" className="mb-8 gap-2 px-0 text-muted-foreground">
          <Link href={`/ideas/${idea.slug}`}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {idea.title}
          </Link>
        </Button>
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
            New signal
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold">Add Reaction</h1>
        </div>
        <SignalReactionForm relatedIdeaSlug={idea.slug} relatedIdeaTitle={idea.title} />
      </main>
    </div>
  );
}
