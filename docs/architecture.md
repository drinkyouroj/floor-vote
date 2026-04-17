# Architecture

Living document. Update in any PR that meaningfully changes system topology, data flow, or component responsibilities.

## System shape

Floor Vote is a **single-page client-only web app.** There is no backend, no API routes, no database. Everything runs in the browser. Data is bundled at build time. State lives in React + localStorage.

```
┌───────────────────────────────────────────────┐
│ Browser                                       │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │ Next.js bundle (client components)      │  │
│  │                                         │  │
│  │   page.tsx  ─── game state machine      │  │
│  │     │                                   │  │
│  │     ├─► VoteCard       (presentational) │  │
│  │     ├─► PartySlider ×2 (controlled)     │  │
│  │     └─► ScoreReveal    (animated reveal)│  │
│  │                                         │  │
│  │   lib/                                  │  │
│  │     scoring     ── pure                 │  │
│  │     simulation  ── pure, seeded PRNG    │  │
│  │     votes       ── shuffle + format     │  │
│  │     storage     ── localStorage I/O     │  │
│  │                                         │  │
│  │   data/votes.json ── static dataset     │  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  localStorage["floor-vote-session"]           │
└───────────────────────────────────────────────┘
```

## Data flow — one round

```
mount
  │
  ▼
shuffle votes (seeded by Date.now() in useRef)
  │
  ▼
set phase = "guessing"
set demGuess = 50, repGuess = 50
  │
  ▼
 VoteCard renders currentVote
 PartySlider × 2 render with guesses
  │
  ▼
 user drags sliders → setDemGuess / setRepGuess (React state)
  │
  ▼
 user clicks "Submit Guess"
  │
  ▼
 calculateScore(guesses, actuals)  ◄── src/lib/scoring.ts
 simulatePercentileBeat(vote, score) ◄── src/lib/simulation.ts (seeded PRNG)
 saveResult(result)                  ◄── src/lib/storage.ts → localStorage
  │
  ▼
 set phase = "revealed"
 ScoreReveal animates:
   bars (your guess vs actual)
   score count-up
   "better than X% of players" line
  │
  ▼
 user clicks "Next Vote"
  │
  ▼
 voteIndex += 1   (wraps via modulo for endless play)
 back to "guessing" phase
```

## Module responsibilities

| Module | Responsibility | Pure? |
|---|---|---|
| `src/app/page.tsx` | Game state machine, orchestration, localStorage wiring | No (uses hooks, effects) |
| `src/app/layout.tsx` | HTML shell, fonts, hardcoded `dark` class | No |
| `src/components/game/VoteCard.tsx` | Presentational — renders one vote | Yes |
| `src/components/game/PartySlider.tsx` | Controlled slider with per-party styling | Yes |
| `src/components/game/ScoreReveal.tsx` | Animated post-guess reveal | No (timers, count-up) |
| `src/components/game/SessionStats.tsx` | Compact header stats | Yes |
| `src/lib/scoring.ts` | `calculateScore`, `getScoreLabel` | Yes |
| `src/lib/simulation.ts` | Seeded PRNG, percentile simulator | Yes |
| `src/lib/votes.ts` | Seeded shuffle, date/category formatters | Yes |
| `src/lib/storage.ts` | localStorage read/write under `floor-vote-session` | No (side effects) |
| `src/lib/types.ts` | TypeScript types — `Vote`, `RoundResult`, `GamePhase` | — |
| `src/data/votes.json` | Static dataset (content, not code) | — |

## Key invariants

- **Scoring ↔ Simulation coupling:** the percentile simulator scores its synthetic guesses with the same `calculateScore`. If the scoring formula changes, the percentile distribution shifts. Any change to `scoring.ts` requires re-review of `simulation.ts`. See [DECISION 0002](decisions/0002-scoring-formula.md) and [DECISION 0003](decisions/0003-simulated-percentile.md).
- **Dataset shape is a schema contract:** the `Vote` type in `src/lib/types.ts` is the single source of truth for `votes.json` structure. Changes must be typed.
- **PRNG determinism:** `simulatePercentileBeat` is deterministic per `(vote.id, score)` — same input always yields same output. Useful for test stability.
- **Session seed:** `Date.now()` is captured once in a `useRef` on mount, so the shuffled vote order is stable across re-renders within a session but fresh across sessions.

## Non-obvious choices (see DECISION docs)

- [0001](decisions/0001-data-source.md) — Static JSON beat API-at-runtime
- [0002](decisions/0002-scoring-formula.md) — Linear scoring, not quadratic
- [0003](decisions/0003-simulated-percentile.md) — "X% of players" is simulated, not real
- [0004](decisions/0004-native-range-slider.md) — PartySlider is native `<input>`, not shadcn
- [0005](decisions/0005-endless-arcade-mode.md) — Endless, not daily

## Future surface area

If any of these become requirements, they are non-trivial and deserve a DECISION doc + AAP:

- **Real backend for cross-player scores** — replaces `simulatePercentileBeat` call in `page.tsx` (not the module itself; keep sim as fallback).
- **Daily mode** — additive; route to a date-seeded vote.
- **User accounts / social features** — introduces auth, profile storage, moderation surface.
- **Vote dataset expansion from Congress.gov API** — build-time script, not runtime fetch.
