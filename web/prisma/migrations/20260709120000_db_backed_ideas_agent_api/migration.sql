CREATE TABLE "pie_ideas" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "one_sentence_pitch" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pitch',
  "created_by_type" TEXT,
  "created_by" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL,

  CONSTRAINT "pie_ideas_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "pie_idea_artifacts" (
  "id" TEXT NOT NULL,
  "idea_id" TEXT NOT NULL,
  "artifact_type" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "file_name" TEXT,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "content_markdown" TEXT NOT NULL,
  "metadata" JSONB,
  "created_by_type" TEXT,
  "created_by" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL,

  CONSTRAINT "pie_idea_artifacts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "pie_signals" (
  "id" TEXT NOT NULL,
  "idea_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "source_type" TEXT NOT NULL DEFAULT 'internal_reaction',
  "source_url" TEXT,
  "source_date" TIMESTAMPTZ,
  "strength" TEXT,
  "sentiment" TEXT,
  "raw_markdown" TEXT,
  "summary_markdown" TEXT,
  "research_question" TEXT,
  "captured_by_type" TEXT,
  "captured_by" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL,

  CONSTRAINT "pie_signals_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "pie_agent_api_keys" (
  "id" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "key_prefix" TEXT NOT NULL,
  "key_hash" TEXT NOT NULL,
  "scopes" TEXT[],
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "last_used_at" TIMESTAMPTZ,
  "revoked_at" TIMESTAMPTZ,

  CONSTRAINT "pie_agent_api_keys_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "pie_ideas_slug_key"
  ON "pie_ideas" ("slug");

CREATE INDEX "pie_ideas_status_idx"
  ON "pie_ideas" ("status");

CREATE INDEX "pie_ideas_created_at_idx"
  ON "pie_ideas" ("created_at");

CREATE UNIQUE INDEX "pie_idea_artifacts_idea_type_slug_key"
  ON "pie_idea_artifacts" ("idea_id", "artifact_type", "slug");

CREATE INDEX "pie_idea_artifacts_idea_type_sort_idx"
  ON "pie_idea_artifacts" ("idea_id", "artifact_type", "sort_order");

CREATE INDEX "pie_signals_idea_created_at_idx"
  ON "pie_signals" ("idea_id", "created_at");

CREATE INDEX "pie_signals_source_type_idx"
  ON "pie_signals" ("source_type");

CREATE UNIQUE INDEX "pie_agent_api_keys_key_hash_key"
  ON "pie_agent_api_keys" ("key_hash");

CREATE INDEX "pie_agent_api_keys_key_prefix_idx"
  ON "pie_agent_api_keys" ("key_prefix");

ALTER TABLE "pie_idea_artifacts"
  ADD CONSTRAINT "pie_idea_artifacts_idea_id_fkey"
  FOREIGN KEY ("idea_id") REFERENCES "pie_ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "pie_signals"
  ADD CONSTRAINT "pie_signals_idea_id_fkey"
  FOREIGN KEY ("idea_id") REFERENCES "pie_ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
