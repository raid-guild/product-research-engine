import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppNav } from "@/components/ideation/AppNav";
import { DossierNav } from "@/components/ideation/DossierNav";
import { MarkdownReport } from "@/components/ideation/MarkdownReport";
import { Button } from "@/components/ui/button";
import { getIdeaRun, getResearchFile } from "@/lib/ideas";

type ResearchFilePageProps = {
  params: Promise<{ slug: string; fileSlug: string }>;
};

export default async function ResearchFilePage({ params }: ResearchFilePageProps) {
  const { slug, fileSlug } = await params;
  const idea = await getIdeaRun(slug);
  const file = await getResearchFile(slug, fileSlug);

  if (!idea || !file) {
    notFound();
  }

  return (
    <div className="noise-bg min-h-screen bg-background">
      <AppNav />
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <Button asChild variant="ghost" className="mb-8 gap-2 px-0 text-muted-foreground">
          <Link href={`/ideas/${slug}`}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {idea.title}
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <DossierNav ideaSlug={slug} files={idea.researchFiles} activeFileSlug={file.slug} />
          <article className="min-w-0 border border-border bg-card/70 p-6 md:p-8">
            <div className="mb-8 border-b border-border pb-6">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                {file.fileName} · {file.readingTime}
              </p>
              <h1 className="mt-3 font-heading text-4xl font-bold">{file.title}</h1>
            </div>
            <MarkdownReport content={file.content} />
          </article>
        </div>
      </main>
    </div>
  );
}
