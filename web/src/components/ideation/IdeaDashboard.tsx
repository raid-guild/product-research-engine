import { IdeaCard } from "@/components/ideation/IdeaCard";
import type { IdeaRunSummary } from "@/lib/ideation-runs";
import type { SignalReactionStats } from "@/lib/signal-reactions";

type IdeaDashboardProps = {
  ideas: IdeaRunSummary[];
  statsByIdea: Record<string, SignalReactionStats>;
};

export function IdeaDashboard({ ideas, statsByIdea }: IdeaDashboardProps) {
  if (ideas.length === 0) {
    return (
      <div className="border border-border bg-card/70 p-8 text-muted-foreground">
        No idea runs were found. Check `PRODUCT_IDEATION_RUNS_DIR`.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {ideas.map((idea) => (
        <IdeaCard key={idea.slug} idea={idea} stats={statsByIdea[idea.slug]} />
      ))}
    </div>
  );
}
