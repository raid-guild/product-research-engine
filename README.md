# Product Ideation Engine

Internal workbench for turning rough product hunches into pitch cards, signal records, and research dossiers.

The repository combines:

- Guided agent skills for creating product ideation artifacts.
- Markdown templates and legacy run folders.
- A Next.js web app backed by Postgres for deployed use.
- Agent API endpoints so other surfaces can create ideas, signals, and research artifacts.

## Current Status

The initial deployable version is built around one test idea, `business-in-box`.

Postgres is the canonical data store in deployment. Markdown files in `runs/` remain useful as import/export artifacts and as a local fallback when the web app is run without a database.

## Directory Map

```text
product-ideation-engine/
  workflow.md                 Workflow phases and quality gates
  db-api-agent-plan.md         Database/API implementation notes
  package.json                Wrapper scripts for the web app
  runs/                       Local markdown idea runs
  templates/                  Pitch, signal, and research templates
  skills/                     Codex/agent skills
  web/                        Next.js app, Prisma schema, API routes
```

Important skills:

- `skills/product-idea-pitcher`: messy idea to pitch card and one-page brief.
- `skills/product-research-dossier`: signaled idea to research dossier.
- `skills/product-ideation-api-writer`: write ideas, signals, and artifacts to the deployed app API.

## Workflow

1. Messy idea to pitch
   - Output: `00-pitch-card.md`, `01-one-page-product-brief.md`
   - Goal: get the idea clear enough for internal reaction.

2. Signal gate
   - Output: raw signals in Postgres and/or `signal-notes.md`
   - Goal: decide whether to continue, clarify, or park.

3. Research dossier
   - Output: `research-plan.md` and numbered dossier reports.
   - Goal: decide whether to continue, narrow, pivot, or kill.

See [workflow.md](workflow.md) for the full workflow.

## Run Locally

Install and run the web app from this directory:

```bash
npm run dev
```

The wrapper script delegates to `web/`.

Open:

```text
http://localhost:3000
```

Without `DATABASE_URL`, the app can browse local markdown runs but cannot save signals.

## Environment

The web app reads environment variables from `web/.env`.

Minimum for deployed/database-backed use:

```text
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

Useful for agent clients:

```text
PRODUCT_IDEATION_API_BASE_URL="https://your-app.up.railway.app"
PRODUCT_IDEATION_AGENT_API_KEY="pie_live_..."
```

The deployed web app itself does not need `PRODUCT_IDEATION_AGENT_API_KEY` to validate incoming agent calls. Agent keys are stored hashed in Postgres.

## Database

Prisma lives in `web/prisma`.

Primary tables:

```text
pie_ideas
pie_idea_artifacts
pie_signals
pie_agent_api_keys
pie_signal_reactions
```

Run migrations:

```bash
npm run db:migrate
```

Generate Prisma client:

```bash
npm run db:generate
```

Import existing markdown runs into Postgres:

```bash
npm run db:import:runs
```

Create an agent API key:

```bash
npm run db:agent-key initial-agent
```

The raw key is printed once. Store it in the environment for whatever agent/client will call the API.

## Agent API

Initial agent API routes:

```text
POST /api/agent/v1/ideas
POST /api/agent/v1/ideas/[slug]/signals
PUT  /api/agent/v1/ideas/[slug]/artifacts/[artifactSlug]
GET  /api/agent/v1/ideas/[slug]/context
```

All agent routes require:

```text
Authorization: Bearer <agent-api-key>
```

API contract examples live in:

```text
skills/product-ideation-api-writer/references/
```

## Railway Deployment

Recommended setup:

1. Deploy from this directory, `product-ideation-engine`.
2. Add a fresh Railway Postgres service.
3. Add the Postgres `DATABASE_URL` reference variable to the app service.
4. Set the pre-deploy command:

```bash
npm run db:migrate
```

5. Let Railway use the package scripts:

```bash
npm run build
npm run start
```

The start script delegates to `web` and runs `next start`.

After the first successful deploy, run these once with Railway env vars injected:

```bash
railway run npm run db:import:runs
railway run npm run db:agent-key initial-agent
```

Use the printed key only in clients or agent surfaces that call the deployed API.

## Useful Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:migrate
npm run db:import:runs
npm run db:agent-key initial-agent
```

## Notes

- Use a fresh database for the current migration path when possible.
- If Railway reports Prisma P3005 on a non-empty database, either use a fresh DB or baseline migrations before deploying.
- The legacy `runs/` folder is not the deployed source of truth after import.
