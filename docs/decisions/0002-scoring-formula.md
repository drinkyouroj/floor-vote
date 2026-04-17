# DECISION: Scoring formula — linear penalty

**Date:** 2026-04-17
**Status:** Accepted

## Context

Each round, the player sets two sliders (Dem yes %, Rep yes %) and submits. We need a score function that:

- Awards up to ~1000 points for a near-perfect guess
- Falls off smoothly and predictably as guesses drift from the actual values
- Reaches 0 at a "clearly wrong" threshold so bad guesses are visibly punished
- Is cheap to compute and easy for a player to reason about post-reveal

Error per party is `|guess − actual|` in percentage points, so combined error is `demError + repError` ∈ [0, 200].

## Options Considered

1. **Linear:** `max(0, 1000 − (demError + repError) × 7)` ✅ chosen
   - Perfect: 1000. Combined 10pp off: 930. Combined 50pp: 650. Combined ~143pp: 0.
   - Pros: simple mental model, smooth falloff, zero at ~72pp-per-party worst case
   - Cons: near-perfect guesses don't get a sharper "bonus" than good guesses

2. **Quadratic:** `max(0, 1000 − (demError² + repError²) × k)`
   - Pros: rewards precision disproportionately (feels satisfying at the high end)
   - Cons: middling guesses crater too fast; harder to tune; less intuitive

3. **Piecewise thresholds:** tiered buckets (e.g. 0–5pp = 1000, 5–10pp = 800, …)
   - Pros: easy to show labels
   - Cons: discontinuities feel unfair; slider nudges can cross tier boundaries and produce "why did I lose 200 points for 1pp?" complaints

## Decision

Use the **linear formula** `max(0, 1000 − (demError + repError) × 7)` in `src/lib/scoring.ts`. The `×7` coefficient is tuned so a combined ~143pp error floors the score — aggressive enough that truly wild guesses feel bad without being unforgiving to reasonable ones.

`getScoreLabel()` provides post-hoc qualitative bands (Uncanny / Sharp / Decent / Off / Way Off) so players get tiered feedback without tiered math.

## Consequences

- **Gets easier:** players can mentally predict their score before submitting ("I'm within ~15pp per party, probably 800-ish"). Any future UI (leaderboards, medals) can bucket cleanly.
- **Gets harder:** the formula is now load-bearing for `src/lib/simulation.ts` — the percentile simulator generates 2000 synthetic guesses and scores them with the same function. If the formula changes, percentile distributions shift and the "better than X%" line becomes a lie. **Any change to this formula requires updating `simulation.ts` and running AAP.**
- **Tuning knob:** the `× 7` coefficient and the `1000` ceiling are the only scalars to touch if difficulty feedback comes back uneven.
