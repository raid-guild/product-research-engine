import Link from "next/link";
import { Bot, FileText, HelpCircle, MessageSquare, Search } from "lucide-react";
import { AppNav } from "@/components/ideation/AppNav";
import { Button } from "@/components/ui/button";

const flowSteps = [
  {
    title: "Shape The Idea",
    owner: "Prism agent",
    icon: Bot,
    body:
      "Start with the Product Idea Pitcher. A human chats with the agent to turn a messy hunch into a pitch card and one-page product brief, then commits the idea to the shared database.",
    output: "Idea, pitch card, one-page brief",
  },
  {
    title: "Collect Signal",
    owner: "Product ideation app",
    icon: MessageSquare,
    body:
      "Humans react inside this app with notes, concerns, curiosity, customer-pain observations, and research questions tied to the idea.",
    output: "Raw signal records",
  },
  {
    title: "Write Signal Notes",
    owner: "Prism agent",
    icon: FileText,
    body:
      "Once the idea has enough signal, a human asks the Product Signal Summarizer to fetch the idea context and signals, then write the Phase 2 signal-notes summary.",
    output: "signal-notes.md",
  },
  {
    title: "Run Research",
    owner: "Prism agent",
    icon: Search,
    body:
      "When the signal notes support continuing, a human kicks off the Product Research Dossier skill to create the research plan and decision-oriented dossier.",
    output: "Research plan and dossier reports",
  },
];

export default function HelpPage() {
  return (
    <div className="noise-bg min-h-screen bg-background">
      <AppNav />
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <header className="mb-10 max-w-3xl">
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-primary">
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            Help
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold md:text-5xl">
            Idea to Research Flow
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            The ideation process moves from a rough product hunch to human signal, then to a
            synthesized signal gate, and finally to deeper research when the signal is strong enough.
          </p>
        </header>

        <section className="grid gap-4 lg:grid-cols-4">
          {flowSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article key={step.title} className="border border-border bg-card/70 p-5">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Step {index + 1}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center border border-primary/30 bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <h2 className="font-heading text-xl font-semibold">{step.title}</h2>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-primary">
                  {step.owner}
                </p>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{step.body}</p>
                <div className="mt-5 border-t border-border pt-4">
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    Produces
                  </p>
                  <p className="mt-2 text-sm text-foreground">{step.output}</p>
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="border border-border bg-card/70 p-6">
            <h2 className="font-heading text-2xl font-semibold">Current Human Hand-Offs</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-heading text-lg">In Prism</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Create the initial idea, synthesize signal notes, and run the research dossier
                  process with the relevant product ideation skills.
                </p>
              </div>
              <div>
                <h3 className="font-heading text-lg">In This App</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Browse ideas, add human signal, inspect the signal summary, and read research
                  outputs as they are written back to the database.
                </p>
              </div>
            </div>
          </div>

          <aside className="border border-border bg-card/70 p-6">
            <h2 className="font-heading text-2xl font-semibold">Start Here</h2>
            <div className="mt-5 grid gap-3">
              <Button asChild>
                <Link href="/ideas">Open Ideas</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/signal-reactions">Review Signals</Link>
              </Button>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
