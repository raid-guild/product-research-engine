# Product Ideation API Payload Examples

## Minimal Idea

```bash
curl -X POST "$PRODUCT_IDEATION_API_BASE_URL/api/agent/v1/ideas" \
  -H "Authorization: Bearer $PRODUCT_IDEATION_AGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Business-in-a-Box",
    "description": "A guided operating system for turning repeatable service offers into sellable packages.",
    "status": "pitch"
  }'
```

## Signal

```bash
curl -X POST "$PRODUCT_IDEATION_API_BASE_URL/api/agent/v1/ideas/business-in-box/signals" \
  -H "Authorization: Bearer $PRODUCT_IDEATION_AGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Founder pull",
    "description": "The idea keeps coming up while packaging services for small operators.",
    "sourceType": "founder_intuition",
    "strength": "medium",
    "sentiment": "interest",
    "researchQuestion": "Which niche would buy the first narrow package fastest?"
  }'
```

## Research Report

```bash
curl -X PUT "$PRODUCT_IDEATION_API_BASE_URL/api/agent/v1/ideas/business-in-box/artifacts/01-market-opportunity-memo" \
  -H "Authorization: Bearer $PRODUCT_IDEATION_AGENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "artifactType": "research_report",
    "title": "Market Opportunity Memo",
    "fileName": "01-market-opportunity-memo.md",
    "sortOrder": 1,
    "contentMarkdown": "# Market Opportunity Memo\n\n## Summary\n\n..."
  }'
```
