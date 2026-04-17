# DECISION: Percentile comparison — seeded simulation, no backend

**Date:** 2026-04-17
**Status:** Accepted

## Context

After the player submits, we want to show **"You guessed better than X% of players on this vote."** That line is the emotional payoff of the round — it converts a number into social meaning.

Doing this for real requires: storing every player's score per vote, querying on submit, and computing a percentile. That demands a backend (DB + API + auth or anonymous session IDs + rate limiting), which is a significant expansion of scope for a v0.

## Options Considered

1. **Real backend (Vercel KV / Postgres / Upstash)**
   - Pros: the line is literally true; future leaderboards come for free
   - Cons: auth/anon session handling, rate limits, cold starts, operational burden, deployment complexity, cost, fraud surface (people spamming bad scores to inflate their percentile) — all for a v0 where we don't even have users yet

2. **Static "difficulty score" per vote** (no player comparison at all)
   - Pros: trivial to implement
   - Cons: loses the social framing; less motivating

3. **Seeded deterministic simulation of 2000 synthetic "players" per vote** ✅ chosen
   - Pros: zero infra, deterministic (same score on same vote → same percentile, every time, every user), feels real, tunable per-vote difficulty
   - Cons: the "X% of players" framing is technically fiction; if it ever leaks to users we lose credibility

## Decision

Implement `src/lib/simulation.ts` using a **Mulberry32 PRNG seeded by `vote.id`**. For each submit:

1. Compute vote difficulty via `getVoteDifficulty()` — extreme party-line votes (e.g. 100%/0%) get a low difficulty score; bipartisan votes (e.g. 78%/68%) get a high one.
2. Generate 2000 synthetic guesses using Box-Muller Gaussian noise, with standard deviation scaled by difficulty (8–36pp).
3. Score each synthetic guess with the same `calculateScore` used for the real player.
4. Return the percentage of synthetic scores strictly below the player's score.

Copy in the UI says "better than X% of players" without qualification. We accept this minor fiction as a v0 tradeoff.

## Consequences

- **Gets easier:** ship today, no backend, no auth, works offline, percentile is deterministic and reproducible (useful for testing).
- **Gets harder:** if we ever add a real backend, we need to decide whether to replace or blend. The replacement point is `handleSubmit` in `src/app/page.tsx` — keep the simulation module intact as a cold-start fallback.
- **Coupling:** the simulation's score distribution is a function of `calculateScore`. Changes to `scoring.ts` invalidate the distribution shape — see DECISION 0002. The difficulty tuning (spread 8 + difficulty × 28) is a second tuning knob; expect to revisit it once real score data is collected.
- **Risk:** the "X%" framing is a soft promise. If a player ever inspects the bundle and realizes it's synthetic, it's a credibility hit. Acceptable for v0; reconsider before any press or launch campaign.

## Follow-ups

- **Before adding real cross-player scores**, open a new DECISION doc (supersedes this one) and run AAP.
- Consider softening UI copy to "better than X% of simulated players" if credibility becomes a concern before a real backend ships.
