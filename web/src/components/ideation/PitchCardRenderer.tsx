import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MarkdownDocument } from "@/lib/ideation-runs";

type PitchCardRendererProps = {
  document?: MarkdownDocument;
};

export function PitchCardRenderer({ document }: PitchCardRendererProps) {
  if (!document) {
    return (
      <div className="border border-border bg-card/70 p-6 text-sm text-muted-foreground">
        No pitch card exists for this run yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {document.sections.map((section) => (
        <Card key={section.title} className="border-border/80 bg-card/80">
          <CardHeader>
            <CardTitle className="font-heading text-lg">{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {section.content}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
