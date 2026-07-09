import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, MessageSquarePlus } from "lucide-react";
import { AppNav } from "@/components/ideation/AppNav";
import { MarkdownReport } from "@/components/ideation/MarkdownReport";
import { PitchCardRenderer } from "@/components/ideation/PitchCardRenderer";
import { SignalReactionForm } from "@/components/ideation/SignalReactionForm";
import { SignalReactionList } from "@/components/ideation/SignalReactionList";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getIdeaRun } from "@/lib/ideas";
import { getSignalReactions } from "@/lib/signal-reactions";

export const dynamic = "force-dynamic";

type IdeaPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function IdeaPage({ params }: IdeaPageProps) {
  const { slug } = await params;
  const idea = await getIdeaRun(slug);

  if (!idea) {
    notFound();
  }

  const reactions = await getSignalReactions(slug);
  const firstResearchFile = idea.researchFiles[0];

  return (
    <div className="noise-bg min-h-screen bg-background">
      <AppNav />
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <Button asChild variant="ghost" className="mb-8 gap-2 px-0 text-muted-foreground">
          <Link href="/ideas">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Ideas
          </Link>
        </Button>

        <header className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
            {idea.slug}
          </p>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="font-heading text-4xl font-bold md:text-5xl">{idea.title}</h1>
              {idea.oneSentencePitch && (
                <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
                  {idea.oneSentencePitch}
                </p>
              )}
            </div>
            {firstResearchFile && (
              <Button asChild className="gap-2 md:mt-2">
                <Link href={`/ideas/${idea.slug}/research/${firstResearchFile.slug}`}>
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  Open Dossier
                </Link>
              </Button>
            )}
          </div>
        </header>

        <Tabs defaultValue="pitch" className="space-y-8">
          <TabsList>
            <TabsTrigger value="pitch">Pitch</TabsTrigger>
            <TabsTrigger value="signals">Signals</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
          </TabsList>

          <TabsContent value="pitch" className="space-y-6">
            <PitchCardRenderer document={idea.pitchCard} />
          </TabsContent>

          <TabsContent value="signals" className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <section className="space-y-6">
              <div className="space-y-4">
                <h2 className="font-heading text-2xl">Signal Summary</h2>
                {idea.signalSummary ? (
                  <article className="border border-border bg-card/70 p-6">
                    <div className="mb-6 border-b border-border pb-4">
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                        {idea.signalSummary.fileName} · {idea.signalSummary.readingTime}
                      </p>
                    </div>
                    <MarkdownReport content={idea.signalSummary.content} />
                  </article>
                ) : (
                  <div className="border border-border bg-card/70 p-6 text-sm text-muted-foreground">
                    No signal summary exists yet. Use the signal summarizer skill to synthesize raw
                    reactions into `signal-notes.md`.
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquarePlus className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h2 className="font-heading text-2xl">Raw Reactions</h2>
                </div>
                <SignalReactionList reactions={reactions} />
              </div>
            </section>
            <aside className="space-y-4">
              <h2 className="font-heading text-2xl">Add Signal</h2>
              <SignalReactionForm relatedIdeaSlug={idea.slug} relatedIdeaTitle={idea.title} />
            </aside>
          </TabsContent>

          <TabsContent value="research" className="space-y-5">
            {idea.researchFiles.length > 0 ? (
              <div className="grid gap-3">
                {idea.researchFiles.map((file) => (
                  <Link
                    key={file.slug}
                    href={`/ideas/${idea.slug}/research/${file.slug}`}
                    className="border border-border bg-card/70 p-4 transition-colors hover:border-primary/50 hover:bg-primary/10"
                  >
                    <div className="font-heading text-lg">{file.title}</div>
                    <div className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {file.fileName} · {file.readingTime}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="border border-border bg-card/70 p-6 text-muted-foreground">
                No dossier files exist for this run yet.
              </div>
            )}
            <Separator />
            <p className="text-sm text-muted-foreground">
              Signal summaries are stored separately from research dossier files as `signal-notes.md`.
            </p>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
