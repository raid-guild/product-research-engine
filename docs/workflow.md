# Product Ideation Engine Workflow

## Purpose

Turn rough product hunches into internal-review pitches, then convert ideas with enough signal into structured research dossiers.

This workflow intentionally separates the cheap question from the expensive one:

- Cheap: "Can the internal team understand and react to this idea?"
- Expensive: "Should we research this deeply enough to decide whether to pursue it?"

## Phase 1: Messy Idea To Pitch

Trigger: user provides a rough product idea, trend, market hunch, or half-formed startup concept.

Skill: `skills/product-idea-pitcher`

Inputs:

- raw idea
- target user guesses
- trend or timing hunch
- known constraints
- internal reaction audience

Outputs:

- `00-pitch-card.md`
- `01-one-page-product-brief.md`

Quality bar:

- An internal reviewer can understand the pitch in under 30 seconds from the card.
- An internal reviewer can give useful feedback after reading the one-page brief.
- Assumptions and unknowns are visible.
- The idea is narrow enough to test for reaction.

## Phase 2: Signal Gate

Trigger: user has some reason to continue. The signal may be weak but should be explicit.

Valid early signal:

- internal team members react strongly
- founder intuition says the idea keeps pulling attention
- social post, DM, comment, or thread reaction, if available later
- repeated pattern noticed in conversations
- early customer or operator conversation
- someone asks to hear more, try it, pay, partner, or introduce a buyer

Output:

- `signal-notes.md`

Decision:

- Continue to research
- Clarify pitch and retest
- Park idea

## Phase 3: Research Dossier

Trigger: user explicitly asks to run research after signal.

Skill: `skills/product-research-dossier`

Inputs:

- pitch card
- one-page brief
- signal notes
- constraints and desired research depth

Outputs:

- `research-plan.md`
- numbered dossier files modeled after `exploration/business-in-box`

Default dossier:

1. `00-product-intro-brief.md`
2. `01-market-opportunity-memo.md`
3. `02-segment-ranking-scorecard.md`
4. `03-competitor-pricing-matrix.md`
5. `04-customer-pain-map.md`
6. `05-recommended-icp.md`
7. `06-mvp-package-recommendation.md`
8. `07-gtm-test-plan.md`
9. `08-customer-interview-script.md`
10. `09-risk-boundary-notes.md`
11. `10-support-automation-opportunities.md`
12. `11-partner-strategy-recommendation.md`
13. `12-continue-narrow-pivot-kill-recommendation.md`

## Directory Convention

Create one directory per idea:

```text
exploration/product-ideation-engine/runs/<idea-slug>/
  00-pitch-card.md
  01-one-page-product-brief.md
  signal-notes.md
  research-plan.md
  00-product-intro-brief.md
  ...
```

For pitch-only ideas, stop after the first two files in the run directory.

## Relevant Hats To Mine

- `hats/agency-agents/sales/sales-discovery-coach.md`: messy idea discovery questions.
- `hats/agency-agents/product/product-manager.md`: opportunity assessment, non-goals, roadmap gates.
- `hats/agency-agents/product/product-trend-researcher.md`: market, trend, competitor, and timing research.
- `hats/agency-agents/product/product-feedback-synthesizer.md`: reaction and interview synthesis.
- `hats/agency-agents/specialized/business-strategist.md`: market entry, positioning, business model choices.
- `hats/agency-agents/sales/sales-offer-lead-gen-strategist.md`: offer design and first channels.
- `hats/agency-agents/project-management/project-management-experiment-tracker.md`: signal and validation gates.
- `hats/agency-agents/specialized/specialized-workflow-architect.md`: repeatable workflow design.
- `hats/agency-agents/support/support-executive-summary-generator.md`: concise executive summaries.
- `hats/agency-agents/testing/testing-reality-checker.md`: skeptical continue/narrow/pivot/kill gate.
