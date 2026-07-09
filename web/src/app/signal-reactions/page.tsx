import { AppNav } from "@/components/ideation/AppNav";
import { SignalReactionList } from "@/components/ideation/SignalReactionList";
import { getSignalReactions } from "@/lib/signal-reactions";

export const dynamic = "force-dynamic";

export default async function SignalReactionsPage() {
  const reactions = await getSignalReactions();

  return (
    <div className="noise-bg min-h-screen bg-background">
      <AppNav />
      <main className="relative z-10 mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
            Signal inbox
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold md:text-5xl">Raw Reactions</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            Lightweight reactions captured in Postgres. These are raw inputs for later local
            synthesis into `signal-notes.md`.
          </p>
        </div>
        <SignalReactionList reactions={reactions} showIdea />
      </main>
    </div>
  );
}
