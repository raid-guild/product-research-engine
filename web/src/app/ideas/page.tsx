import { AppNav } from "@/components/ideation/AppNav";
import { IdeaDashboard } from "@/components/ideation/IdeaDashboard";
import { getIdeaRuns } from "@/lib/ideas";
import { getSignalReactionStatsByIdea } from "@/lib/signal-reactions";

export const dynamic = "force-dynamic";

export default async function IdeasPage() {
  const ideas = await getIdeaRuns();
  const statsByIdea = await getSignalReactionStatsByIdea();

  return (
    <div className="noise-bg min-h-screen bg-background">
      <AppNav />
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
              Product ideation engine
            </p>
            <h1 className="mt-2 font-heading text-4xl font-bold md:text-5xl">
              Idea Runs
            </h1>
          </div>
        </div>

        <IdeaDashboard ideas={ideas} statsByIdea={statsByIdea} />
      </main>
    </div>
  );
}
