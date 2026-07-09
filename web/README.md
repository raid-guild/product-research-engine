# Product Idea Pitcher Web

Next.js workbench for browsing product ideation ideas, reading markdown research dossiers, and collecting lightweight signal reactions.

Postgres is the canonical store for deployed use. Local markdown runs remain available as an import source and a no-database browsing fallback.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Without `DATABASE_URL`, markdown browsing works and signal writes return a database configuration error.

## Environment

```bash
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
PRODUCT_IDEATION_RUNS_DIR="../runs"
PRODUCT_IDEATION_API_BASE_URL="http://localhost:3000"
PRODUCT_IDEATION_AGENT_API_KEY="pie_live_replace_me"
```

`PRODUCT_IDEATION_RUNS_DIR` defaults to `../runs`, which works when commands run from this `web/` directory.

## Database

The app uses Prisma and writes to namespaced tables:

```text
pie_ideas
pie_idea_artifacts
pie_signals
pie_agent_api_keys
pie_signal_reactions
```

Run production migrations with:

```bash
npm run db:migrate
```

For local migration development:

```bash
npm run db:dev
```

## Import Existing Test Idea

After migrations run against Postgres, import the current markdown run:

```bash
npm run db:import:runs
```

This imports `../runs/business-in-box` into `pie_ideas` and `pie_idea_artifacts`.

Create the first agent API key with:

```bash
npm run db:agent-key initial-agent
```

The raw key is printed once. Store it as `PRODUCT_IDEATION_AGENT_API_KEY` wherever agents need to write to the app.

## Agent API

Agent routes live under:

```text
/api/agent/v1
```

Available initial routes:

```text
POST /api/agent/v1/ideas
POST /api/agent/v1/ideas/[slug]/signals
PUT  /api/agent/v1/ideas/[slug]/artifacts/[artifactSlug]
GET  /api/agent/v1/ideas/[slug]/context
```

All agent routes require:

```text
Authorization: Bearer $PRODUCT_IDEATION_AGENT_API_KEY
```

## Railway

Recommended Railway setup:

1. Deploy from the `exploration/product-ideation-engine` package root.
2. Add a Railway Postgres service.
3. Add the Postgres `DATABASE_URL` reference variable to the Next.js service.
4. Set the pre-deploy command to:

```bash
npm run db:migrate
```

5. After the first successful deploy, run these once in the Railway environment:

```bash
npm run db:import:runs
npm run db:agent-key initial-agent
```

The app uses Next.js standalone output for Railway-friendly self-hosting.
