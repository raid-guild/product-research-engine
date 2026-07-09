import Link from "next/link";
import { ArrowUpRight, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IdeaStatusBadges } from "@/components/ideation/IdeaStatusBadges";
import type { IdeaRunSummary } from "@/lib/ideation-runs";
import type { SignalReactionStats } from "@/lib/signal-reactions";

type IdeaCardProps = {
  idea: IdeaRunSummary;
  stats?: SignalReactionStats;
};

const formatDate = (date?: Date) => {
  if (!date) {
    return "No DB signals yet";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export function IdeaCard({ idea, stats }: IdeaCardProps) {
  const signalCount = stats?.count ?? 0;

  return (
    <Card className="flex h-full flex-col border-border/80 bg-card/80">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="font-heading text-2xl">{idea.title}</CardTitle>
          <Button asChild size="icon" variant="ghost" className="h-8 w-8 shrink-0">
            <Link href={`/ideas/${idea.slug}`} aria-label={`Open ${idea.title}`}>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <IdeaStatusBadges idea={idea} signalCount={signalCount} />
      </CardHeader>

      <CardContent className="flex-1">
        <p className="line-clamp-4 text-sm leading-6 text-muted-foreground">
          {idea.oneSentencePitch ?? "No one-sentence pitch found yet."}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border/70 pt-4 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
        <span className="flex items-center gap-2">
          <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
          {signalCount} reactions
        </span>
        <span className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          {formatDate(stats?.latestSubmittedAt)}
        </span>
      </CardFooter>
    </Card>
  );
}
