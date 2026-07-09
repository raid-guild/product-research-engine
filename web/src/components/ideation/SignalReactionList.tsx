import { MessageSquare, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { SignalReactionView } from "@/lib/signal-reactions";

type SignalReactionListProps = {
  reactions: SignalReactionView[];
  showIdea?: boolean;
};

const formatDateTime = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

export function SignalReactionList({ reactions, showIdea = false }: SignalReactionListProps) {
  if (reactions.length === 0) {
    return (
      <div className="border border-border bg-card/70 p-6 text-sm text-muted-foreground">
        No signal reactions yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reactions.map((reaction) => (
        <Card key={reaction.id} className="border-border/80 bg-card/80">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-primary/30 bg-primary/10 text-2xl">
                {reaction.reactionEmoji}
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {showIdea && <span>{reaction.relatedIdeaTitle ?? reaction.relatedIdeaSlug}</span>}
                  <span>{formatDateTime(reaction.submittedAt)}</span>
                  <span>{reaction.submittedBy ?? "Anon"}</span>
                </div>
                <p className="text-sm leading-6 text-foreground">{reaction.note}</p>
                {reaction.researchQuestion && (
                  <div className="flex gap-2 border-l border-primary/50 pl-3 text-sm text-muted-foreground">
                    <Search className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>{reaction.researchQuestion}</span>
                  </div>
                )}
              </div>
              <MessageSquare className="hidden h-4 w-4 text-muted-foreground sm:block" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
