import Link from "next/link";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResearchFile } from "@/lib/ideation-runs";

type DossierNavProps = {
  ideaSlug: string;
  files: ResearchFile[];
  activeFileSlug?: string;
};

export function DossierNav({ ideaSlug, files, activeFileSlug }: DossierNavProps) {
  return (
    <aside className="space-y-3">
      <div className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
        Dossier
      </div>
      <nav className="space-y-1">
        {files.map((file) => (
          <Link
            key={file.slug}
            href={`/ideas/${ideaSlug}/research/${file.slug}`}
            className={cn(
              "flex items-start gap-2 border border-transparent px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-border hover:bg-muted/30 hover:text-foreground",
              activeFileSlug === file.slug && "border-primary/40 bg-primary/10 text-foreground",
            )}
          >
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{file.title.replace(/^#\s*/, "")}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
