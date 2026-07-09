---
name: product-signal-summarizer
description: Fetch all captured signals for a product idea from the Product Ideation Engine agent API, synthesize the Phase 2 Signal Gate, and write or update the signal-notes markdown artifact. Use when an idea has reactions, founder intuition, social/customer/conversation signals, or research questions that need to be summarized before deciding whether to continue to research, clarify and retest, or park.
---

# Product Signal Summarizer

## Purpose

Turn raw signals for one product idea into the Phase 2 `signal-notes.md` artifact.

Use this skill after an idea has explicit signal, even if weak. The goal is not to prove the idea; it is to make the reason to continue, clarify, or park legible.

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

1. Identify the idea slug.
2. Fetch context:
   - `GET /api/agent/v1/ideas/{slug}/context`
3. Read the idea, pitch/brief artifacts, existing signal summary artifact if present, and all signals.
4. Synthesize a fresh `signal-notes.md` document using the required sections below.
5. Upsert the artifact:
   - `PUT /api/agent/v1/ideas/{slug}/artifacts/signal-notes`
   - `artifactType`: `signal_summary`
   - `fileName`: `signal-notes.md`
   - `sortOrder`: `2`
6. Optionally add a signal record with `sourceType: "agent_summary"` if the synthesis itself should appear in the raw signal timeline.

## Required Output Sections

Write markdown in this shape:

```markdown
# Signal Notes: [Working Name]

## Signal Summary

[One paragraph describing why this idea deserves more attention now.]

## Signal Sources

| Source | Date | What Happened | Strength | Notes |
|---|---:|---|---|---|

## Reaction Patterns

- [Pattern 1]

## Strongest Quote Or Paraphrase

> [Short quote or paraphrase.]

## Founder Gut Check

[What still feels alive, surprising, or worth chasing? What feels forced?]

## Research Trigger

Decision: Continue to research / Clarify and retest / Park

Reason:

[Why.]

## Research Questions To Carry Forward

- [Question 1]
```

## Judgment Rules

- Treat signal as evidence, not proof.
- Separate direct observations from inference.
- If signals conflict, preserve the tension instead of smoothing it away.
- Prefer "Clarify and retest" when signals are interesting but the pitch is unclear.
- Prefer "Continue to research" only when the idea has a concrete buyer/user pull, repeated pattern, or unusually strong founder/team pull.
- Prefer "Park" when the signal is generic, purely speculative, or does not point to a testable wedge.

## API References

Read `references/api-contract.md` when implementing calls or checking payload shape.
