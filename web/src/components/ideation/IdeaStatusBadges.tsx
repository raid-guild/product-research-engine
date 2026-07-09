import { Badge } from "@/components/ui/badge";
import type { IdeaRunSummary } from "@/lib/ideation-runs";

type IdeaStatusBadgesProps = {
  idea: Pick<
    IdeaRunSummary,
    "hasPitchCard" | "hasOnePageBrief" | "hasResearchPlan" | "researchFileCount" | "markdownSignalExists"
  >;
  signalCount?: number;
};

export function IdeaStatusBadges({ idea, signalCount = 0 }: IdeaStatusBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {idea.hasPitchCard && <Badge variant="outline">Pitch</Badge>}
      {idea.hasOnePageBrief && <Badge variant="outline">Brief</Badge>}
      {signalCount > 0 && <Badge className="bg-primary text-primary-foreground">{signalCount} signals</Badge>}
      {idea.markdownSignalExists && <Badge variant="secondary">Local synthesis</Badge>}
      {idea.hasResearchPlan && <Badge variant="outline">Research plan</Badge>}
      {idea.researchFileCount > 0 && <Badge variant="outline">{idea.researchFileCount} dossier files</Badge>}
    </div>
  );
}
