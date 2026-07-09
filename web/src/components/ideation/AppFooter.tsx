import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="relative z-10 border-t border-border/80 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.14em]">
          P.I.E. · Product Ideation Engine
        </p>
        <Link
          href="https://raidguild.ai/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm transition-colors hover:text-primary"
        >
          Forged by RaidGuild
        </Link>
      </div>
    </footer>
  );
}
