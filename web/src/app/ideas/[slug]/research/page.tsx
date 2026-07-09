import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppNav } from "@/components/ideation/AppNav";
import { Button } from "@/components/ui/button";
import { getIdeaRun } from "@/lib/ideas";

type ResearchIndexPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ResearchIndexPage({ params }: ResearchIndexPageProps) {
  const { slug } = await params;
  const idea = await getIdeaRun(slug);

  if (!idea) {
    notFound();
  }

  if (idea.researchFiles[0]) {
    redirect(`/ideas/${slug}/research/${idea.researchFiles[0].slug}`);
  }

  return (
    <div className="noise-bg min-h-screen bg-background">
      <AppNav />
      <main className="relative z-10 mx-auto max-w-5xl px-6 py-10">
        <Button asChild variant="ghost" className="mb-8 gap-2 px-0 text-muted-foreground">
          <Link href={`/ideas/${slug}`}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {idea.title}
          </Link>
        </Button>
        <div className="border border-border bg-card/70 p-8 text-muted-foreground">
          No dossier files exist for this run yet.
        </div>
      </main>
    </div>
  );
}
