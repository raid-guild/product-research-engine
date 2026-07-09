---
name: product-ideation-api-writer
description: Create or update product ideation ideas, signals, and markdown artifacts through the deployed Product Ideation Engine agent API. Use when working from another surface that should write to the shared Postgres-backed app instead of local run folders.
---

# Product Ideation API Writer

## Purpose

Write product ideation data into the shared web app database through the agent API.

Use this skill when a human or agent has:

- a new idea to add
- a raw signal or signal summary to capture
- a pitch card or one-page brief to store
- a research plan or dossier report to upsert

Do not write directly to `runs/` unless the user explicitly asks for a local markdown export.

## Required Environment

The calling surface must provide:

```text
PRODUCT_IDEATION_API_BASE_URL=https://...
PRODUCT_IDEATION_AGENT_API_KEY=pie_live_...
```

Send the key as:

```text
Authorization: Bearer $PRODUCT_IDEATION_AGENT_API_KEY
```

## Workflow

1. Identify the target idea.
2. If the idea does not exist, create it with `POST /api/agent/v1/ideas`.
3. Capture raw signal with `POST /api/agent/v1/ideas/{slug}/signals`.
4. Store markdown pitch, brief, signal summary, research plan, or report files with `PUT /api/agent/v1/ideas/{slug}/artifacts/{artifactSlug}`.
5. Before generating research, fetch context with `GET /api/agent/v1/ideas/{slug}/context`.

## Content Standards

Keep markdown compatible with the existing templates:

- `00-pitch-card.md`
- `01-one-page-product-brief.md`
- `signal-notes.md`
- `research-plan.md`
- numbered dossier reports

Use stable slugs:

- `00-pitch-card`
- `01-one-page-product-brief`
- `signal-notes`
- `research-plan`
- `01-market-opportunity-memo`

## References

- `references/api-contract.md`
- `references/payload-examples.md`
