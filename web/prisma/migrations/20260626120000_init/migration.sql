CREATE TABLE "pie_signal_reactions" (
  "id" TEXT NOT NULL,
  "related_idea_slug" TEXT NOT NULL,
  "related_idea_title" TEXT,
  "reaction_emoji" TEXT NOT NULL,
  "note" TEXT NOT NULL,
  "research_question" TEXT,
  "submitted_by" TEXT,
  "submitted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL,

  CONSTRAINT "pie_signal_reactions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "pie_signal_reactions_related_idea_slug_idx"
  ON "pie_signal_reactions" ("related_idea_slug");

CREATE INDEX "pie_signal_reactions_reaction_emoji_idx"
  ON "pie_signal_reactions" ("reaction_emoji");

CREATE INDEX "pie_signal_reactions_submitted_at_idx"
  ON "pie_signal_reactions" ("submitted_at");
