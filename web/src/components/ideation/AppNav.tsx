import Link from "next/link";
import { HelpCircle, Inbox, Lightbulb } from "lucide-react";

export function AppNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/ideas" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center border border-primary/40 bg-primary/10 text-primary">
            <Lightbulb className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>
            <span className="block font-heading text-sm font-semibold uppercase tracking-[0.16em]">
              Ideation Engine
            </span>
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground sm:block">
              Pitch, signals, research
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/ideas"
            className="flex h-9 items-center gap-2 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            <Lightbulb className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Ideas</span>
          </Link>
          <Link
            href="/signal-reactions"
            className="flex h-9 items-center gap-2 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            <Inbox className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Signals</span>
          </Link>
          <Link
            href="/help"
            className="flex h-9 items-center gap-2 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            aria-label="Help"
          >
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Help</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
