---
name: product-idea-pitcher
description: Turn a messy product idea into a crisp pitch card and one-page product brief through a short discovery conversation. Use when a user has an early product concept, trend, market hunch, or half-formed startup idea and wants something easy for an internal team to digest and react to before deeper research begins.
---

# Product Idea Pitcher

## Overview

Clarify rough product ideas enough to create internal-review pitch artifacts. Optimize for fast team feedback, not exhaustive market proof.

## Workflow

1. Capture the raw idea in the user's own words.
2. Ask only the questions needed to make the pitch legible.
3. Produce both a pitch card and a one-page brief.
4. List the biggest unknowns and suggested signal tests.
5. Stop before deep research unless the user explicitly asks to continue.

## Discovery Questions

Ask in a conversational sequence. Do not ask all questions at once unless the user requests a worksheet.

- What is the messy idea, in plain language?
- Who might urgently care about this?
- What pain, desire, or shift makes this feel timely?
- What are people using instead today?
- What would the first narrow version do?
- What reaction are we trying to get from the internal team?
- What would count as enough signal to research further?

If the user is unsure, infer a working version and mark assumptions explicitly.

## Pitch Standards

Prefer concrete buyer/user language over abstract category language.

The pitch card should be skimmable in under 30 seconds. The one-page brief should be understandable in under 3 minutes.

Avoid:

- overclaiming validation
- leading with "AI" unless AI is the buyer-visible value
- broad "for everyone" positioning
- generic TAM language
- pretending weak signal is proof

## Output Contract

Create or return these artifacts:

1. Pitch card using `templates/00-pitch-card.md`.
2. One-page brief using `templates/01-one-page-product-brief.md`.
3. Signal notes only if the user already has reactions or wants to define a gate.

When writing files in this repository, place them in a new idea run directory under `exploration/product-ideation-engine/runs/<idea-slug>/`.

## Handoff

End with a clear gate: "This is ready for internal team reaction" or "This needs one more clarification pass before sharing." If research is warranted, hand off to `product-research-dossier` with the pitch artifacts and any signal notes.
