# Product Ideation Agent API Contract

Base URL:

```text
$PRODUCT_IDEATION_API_BASE_URL
```

Authentication:

```text
Authorization: Bearer $PRODUCT_IDEATION_AGENT_API_KEY
Content-Type: application/json
```

## Create Idea

```text
POST /api/agent/v1/ideas
```

Body:

```json
{
  "slug": "business-in-box",
  "title": "Business-in-a-Box",
  "description": "A concise idea description.",
  "oneSentencePitch": "For target users, this helps...",
  "status": "pitch",
  "createdBy": "codex",
  "pitchCardMarkdown": "# Pitch Card: ...",
  "onePageBriefMarkdown": "# One-Page Product Brief: ..."
}
```

## Add Signal

```text
POST /api/agent/v1/ideas/{slug}/signals
```

Body:

```json
{
  "title": "Internal reviewer reaction",
  "description": "The team was curious about the first wedge.",
  "sourceType": "internal_reaction",
  "strength": "medium",
  "sentiment": "curious",
  "rawMarkdown": "## Notes\n\n- ...",
  "researchQuestion": "Which buyer segment feels this most urgently?",
  "capturedBy": "codex"
}
```

## Upsert Artifact

```text
PUT /api/agent/v1/ideas/{slug}/artifacts/{artifactSlug}
```

Body:

```json
{
  "artifactType": "research_report",
  "title": "Market Opportunity Memo",
  "fileName": "01-market-opportunity-memo.md",
  "sortOrder": 1,
  "contentMarkdown": "# Market Opportunity Memo\n\n...",
  "metadata": {
    "source": "product-research-dossier"
  },
  "createdBy": "codex"
}
```

Artifact types:

- `pitch_card`
- `one_page_brief`
- `signal_summary`
- `research_plan`
- `research_report`

Signal notes are stored as:

```text
PUT /api/agent/v1/ideas/{slug}/artifacts/signal-notes
```

with:

```json
{
  "artifactType": "signal_summary",
  "title": "Signal Notes: Working Name",
  "fileName": "signal-notes.md",
  "sortOrder": 2,
  "contentMarkdown": "# Signal Notes: Working Name\n\n..."
}
```

## Fetch Context

```text
GET /api/agent/v1/ideas/{slug}/context
```

Returns the idea, artifacts, and signals needed for follow-on synthesis or research.
