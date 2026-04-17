# DECISION: Game mode — endless arcade (not daily Wordle)

**Date:** 2026-04-17
**Status:** Accepted

## Context

Two dominant game-design patterns were on the table for how players engage:

- **Daily Wordle:** one vote per day, everyone plays the same one, shareable result, FOMO-driven retention
- **Endless arcade:** random queue, play as many as you want, session-based score accumulation

## Options Considered

1. **Daily puzzle (Wordle-style)**
   - Pros: shareable ("Floor Vote #42 — 847/1000"), viral mechanic, low daily commitment
   - Cons: requires a stable dataset large enough for a daily cadence (365+ votes); one vote per day kills exploration; post-play session is dead

2. **Endless arcade** ✅ chosen
   - Pros: user can play for 30 seconds or 30 minutes; dataset doesn't need to be huge; easier to ship v0; exploration-friendly (learn about bills while playing)
   - Cons: no built-in sharing hook; retention depends on enjoyment, not FOMO

3. **Both modes side-by-side**
   - Deferred. Daily mode can be added later on top of endless without architectural change (just route to a date-seeded vote).

## Decision

Ship **endless arcade mode** as the only mode in v0. Session seed (`Date.now()` captured in a `useRef` on mount) shuffles the vote queue per session; `voteIndex % shuffledVotes.length` cycles forever. Session stats (total score, high score, games played) persist in localStorage across sessions.

## Consequences

- **Gets easier:** dataset size requirement drops from hundreds to ~25; v0 ships fast; future daily mode is purely additive.
- **Gets harder:** retention has to come from the interaction feel, not scheduling pressure. Extra weight falls on slider tactility (DECISION 0004) and the reveal animation.
- **Follow-up:** once the dataset grows past ~100 votes, revisit adding a daily mode — probably worth a separate DECISION doc, not an AAP (no security/data surface).
