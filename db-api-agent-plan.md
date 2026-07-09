# Product Ideation Database, API, And Agent Plan

Date: 2026-07-09

## Implementation Status

Initial deployable slice implemented:

- Added Prisma models and migration for `pie_ideas`, `pie_idea_artifacts`, `pie_signals`, and `pie_agent_api_keys`.
- Kept `pie_signal_reactions` for compatibility while new signal writes go to `pie_signals`.
- Added DB-backed idea reads with markdown fallback.
- Added agent-authenticated routes under `/api/agent/v1`.
- Added scripts to import existing `runs/` markdown and create an agent API key.
- Added `skills/product-ideation-api-writer` for other surfaces.
- Configured Next.js standalone output for Railway.

Remaining deployment actions:

- Provision Railway Postgres and set `DATABASE_URL`.
- Run `npm run db:migrate` as the Railway pre-deploy command.
- Run `npm run db:import:runs` once to load the existing `business-in-box` idea.
- Run `npm run db:agent-key initial-agent` once and store the printed key.

## Review Summary

The app is currently a hybrid:

- Ideas, pitch cards, one-page briefs, and research dossier files are read from markdown run folders through `web/src/lib/ideation-runs.ts`.
- Signal reactions are stored in Postgres through Prisma as `pie_signal_reactions`.
- API routes exist for browsing markdown-backed ideas and creating signal reactions.
- The existing boundary is clean enough to migrate without redesigning the whole UI: keep the current view types stable, then replace filesystem reads with a DB-backed repository.

The main limitation is that database signal records only store `relatedIdeaSlug`, not a real foreign key. Agents can write signal reactions only for ideas that already exist as folders. Future human and agent flows need ideas, signals, and research artifacts to share one canonical store.

## Recommendation

Yes: use Postgres as the canonical store for all idea and signal elements.

Keep markdown as the content format, but store it in `TEXT` columns instead of treating files as the source of truth. This gives agents and humans the same write path while preserving the current skill-generated artifact style.

Recommended stance:

- Postgres is canonical for the web app.
- Markdown files become import/export artifacts, not primary storage.
- Each signal must belong to an idea through a non-null `ideaId` foreign key.
- Pitch cards, one-page briefs, signal summaries, research plans, and dossier reports are stored as typed markdown artifacts.
- Parsed sections can be derived on read at first; add structured JSON later only where it improves filtering or automation.

## Proposed Data Model

Use table prefixes for now, matching the current `pie_signal_reactions` pattern.

### `pie_ideas`

Core idea record.

Fields:

- `id` primary key
- `slug` unique stable external identifier
- `title` short display title
- `description` short text description
- `one_sentence_pitch` optional summary for dashboard cards
- `status` enum-like string: `draft`, `pitch`, `signal`, `research`, `parked`, `killed`, `continue`, `narrow`, `pivot`
- `created_by_type` nullable string: `human`, `agent`, `import`
- `created_by` nullable string
- `created_at`, `updated_at`

### `pie_idea_artifacts`

Markdown documents tied to an idea.

Fields:

- `id` primary key
- `idea_id` foreign key to `pie_ideas`
- `artifact_type` string: `pitch_card`, `one_page_brief`, `signal_summary`, `research_plan`, `research_report`
- `slug` stable document slug, such as `00-pitch-card` or `03-competitor-pricing-matrix`
- `title` display title
- `file_name` optional legacy/export filename
- `sort_order` integer for dossier navigation
- `content_markdown` text
- `metadata` JSONB for optional extracted sections, sources, model info, or skill provenance
- `created_by_type`, `created_by`
- `created_at`, `updated_at`

Constraints:

- Unique `(idea_id, artifact_type, slug)`
- Index `(idea_id, artifact_type, sort_order)`

### `pie_signals`

Raw or synthesized signal records tied to one idea.

Fields:

- `id` primary key
- `idea_id` required foreign key to `pie_ideas`
- `title` short signal title
- `description` text summary
- `source_type` string: `internal_reaction`, `founder_intuition`, `conversation`, `social`, `customer`, `agent_summary`, `research_note`
- `source_url` nullable text
- `source_date` nullable timestamp
- `strength` nullable string: `weak`, `medium`, `strong`
- `sentiment` nullable string: `interest`, `curious`, `risk`, `confused`, `skeptical`, `pain`, `question`
- `raw_markdown` text for source notes
- `summary_markdown` text for agent or human synthesis
- `research_question` nullable text
- `captured_by_type`, `captured_by`
- `created_at`, `updated_at`

Constraints:

- `idea_id` is non-null.
- Index `(idea_id, created_at)`.
- Index `(source_type)`.
- Optional full-text index later over title, description, raw markdown, and summary markdown.

### `pie_agent_api_keys`

Agent write credentials.

Fields:

- `id` primary key
- `label`
- `key_prefix` public prefix for logs
- `key_hash` hashed secret value
- `scopes` string array or JSONB: `ideas:write`, `signals:write`, `artifacts:write`, `reports:write`
- `created_at`
- `last_used_at`
- `revoked_at`

Behavior:

- Raw keys are shown once at creation.
- API routes accept `Authorization: Bearer <key>`.
- Store only a hash of the key.
- Start with one internal key, then move to per-surface keys as flows multiply.

## API Shape

Use separate human/UI routes and agent routes. The payloads can share validation schemas, but the auth and error language should be explicit.

### Human/UI Routes

- `GET /api/ideas`
  - List DB-backed ideas with signal counts and artifact availability.
- `POST /api/ideas`
  - Create an idea from title, description, optional pitch markdown, optional brief markdown.
- `GET /api/ideas/[slug]`
  - Return idea, artifacts, and signal summary.
- `PATCH /api/ideas/[slug]`
  - Update title, description, status, or one-sentence pitch.
- `GET /api/ideas/[slug]/signals`
  - List signals for one idea.
- `POST /api/ideas/[slug]/signals`
  - Create a human signal tied to that idea.
- `GET /api/ideas/[slug]/artifacts`
  - List pitch, brief, signal summary, research plan, and report artifacts.
- `PUT /api/ideas/[slug]/artifacts/[artifactSlug]`
  - Upsert one markdown artifact.

### Agent Routes

Prefix with `/api/agent/v1`.

- `POST /api/agent/v1/ideas`
  - Create an idea plus initial pitch/brief artifacts.
- `POST /api/agent/v1/ideas/[slug]/signals`
  - Add a signal record. Reject if the idea does not exist unless `createIfMissing` is explicitly true.
- `PUT /api/agent/v1/ideas/[slug]/artifacts/[artifactSlug]`
  - Upsert pitch, signal summary, research plan, or research report markdown.
- `POST /api/agent/v1/ideas/[slug]/research-reports`
  - Batch upsert dossier reports.
- `GET /api/agent/v1/ideas/[slug]/context`
  - Fetch idea, pitch, brief, signals, and existing research artifacts for a report-generating agent.

Agent route rules:

- Require bearer key.
- Validate every body with Zod.
- Include `createdByType: "agent"` and `createdBy` from the key label or request body.
- Return stable IDs and slugs so other surfaces can link back to the web app.

## Agent Skill Files

Create one API-facing skill package, then keep the existing local file-writing skills for direct repo workflows.

Suggested new skill:

```text
skills/product-ideation-api-writer/
  SKILL.md
  agents/openai.yaml
  references/
    api-contract.md
    payload-examples.md
```

Skill responsibilities:

- Ask for or infer the target idea.
- Create an idea through the agent API when one does not exist.
- Submit raw signals and signal summaries through the agent API.
- Upsert pitch cards, one-page briefs, research plans, and dossier reports as markdown artifacts.
- Never write directly to `runs/` unless the user explicitly asks for a local export.

Required environment for other surfaces:

```text
PRODUCT_IDEATION_API_BASE_URL=https://...
PRODUCT_IDEATION_AGENT_API_KEY=pie_live_...
```

## Migration Plan

1. Add DB models and migrations.
   - Add `Idea`, `IdeaArtifact`, `Signal`, and `AgentApiKey`.
   - Keep `SignalReaction` temporarily.

2. Add import script.
   - Read existing `runs/<slug>` markdown.
   - Create one `pie_ideas` row per folder.
   - Create `pie_idea_artifacts` rows for pitch, brief, signal notes, research plan, and dossier files.
   - Optionally convert existing `pie_signal_reactions` into `pie_signals`.

3. Add DB repository layer.
   - Introduce `web/src/lib/ideas.ts` returning the same view shape that pages currently consume.
   - Keep `ideation-runs.ts` as import/export support.

4. Add agent auth.
   - Create key generation helper or admin-only script.
   - Add bearer-token middleware/helper for `/api/agent/v1/*`.

5. Add agent endpoints.
   - Start with idea creation, signal creation, and artifact upsert.
   - Add context and batch research report routes after the first two flows work.

6. Update UI to DB-backed reads.
   - Dashboard reads `pie_ideas`.
   - Idea detail reads artifacts and signals.
   - Research pages read `pie_idea_artifacts` where `artifact_type = research_report`.

7. Create `product-ideation-api-writer` skill files.
   - Point other surfaces at the agent API.
   - Keep payload examples close to the skill.

## Open Decisions

- Whether to preserve the current `pie_signal_reactions` table as-is or migrate it into `pie_signals`.
- Whether signal reactions remain a lightweight subtype of signal or become UI sugar over `pie_signals`.
- Whether artifact markdown should be versioned in a separate `pie_idea_artifact_versions` table now or after collaboration becomes real.
- Whether to support `createIfMissing` for agent signals. Safer default: reject missing ideas.

## Recommended First Implementation Slice

Implement the smallest useful database-backed agent flow:

1. Add `pie_ideas`, `pie_idea_artifacts`, `pie_signals`, and `pie_agent_api_keys`.
2. Add `POST /api/agent/v1/ideas`.
3. Add `POST /api/agent/v1/ideas/[slug]/signals`.
4. Add `PUT /api/agent/v1/ideas/[slug]/artifacts/[artifactSlug]`.
5. Add a one-time import script for existing runs.
6. Add the API writer skill after the endpoints are working locally.

This gets humans and agents writing into one durable model without forcing the whole UI migration in the same step.
