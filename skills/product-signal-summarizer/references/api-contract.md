# Product Signal Summarizer API Contract

Base URL:

```text
$PRODUCT_IDEATION_API_BASE_URL
```

Authentication:

```text
Authorization: Bearer $PRODUCT_IDEATION_AGENT_API_KEY
Content-Type: application/json
```

## Fetch Idea Context

```text
GET /api/agent/v1/ideas/{slug}/context
```

The response includes:

- `idea.title`
- `idea.description`
- `idea.oneSentencePitch`
- `idea.artifacts`
- `idea.signals`

Use artifacts where:

- `artifactType = "pitch_card"` for the pitch
- `artifactType = "one_page_brief"` for the brief
- `artifactType = "signal_summary"` for any previous signal notes

Use all `signals` as raw material for the new summary.

## Upsert Signal Notes Artifact

```text
PUT /api/agent/v1/ideas/{slug}/artifacts/signal-notes
```

Body:

```json
{
  "artifactType": "signal_summary",
  "title": "Signal Notes: Working Name",
  "fileName": "signal-notes.md",
  "sortOrder": 2,
  "contentMarkdown": "# Signal Notes: Working Name\n\n## Signal Summary\n\n...",
  "metadata": {
    "source": "product-signal-summarizer"
  },
  "createdBy": "codex"
}
```

## Optional: Add Summary Signal

```text
POST /api/agent/v1/ideas/{slug}/signals
```

Body:

```json
{
  "title": "Signal summary generated",
  "description": "Phase 2 signal notes were synthesized from captured signals.",
  "sourceType": "agent_summary",
  "strength": "medium",
  "sentiment": "question",
  "summaryMarkdown": "Decision: Clarify and retest...",
  "capturedBy": "codex"
}
```
