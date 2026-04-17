# Build Log

Append-only record of sessions that made meaningful changes. Most recent on top.

---

## 2026-04-17 — Initial v0 release

### Done
- Scaffolded Next.js 16 (App Router, Turbopack) + React 19 + TypeScript + Tailwind v4 + shadcn/ui project.
- Built endless-arcade game loop: vote card → dual sliders → submit → animated reveal → next.
- Curated 25 real House roll-call votes from the 117th–119th Congress with verified party breakdowns (`src/data/votes.json`).
- Implemented scoring (`src/lib/scoring.ts`), seeded percentile simulation (`src/lib/simulation.ts`), Fisher-Yates shuffle (`src/lib/votes.ts`), and localStorage session persistence (`src/lib/storage.ts`).
- Built components: `VoteCard`, `PartySlider` (native `<input type="range">` with injected per-party styles), `ScoreReveal` (Framer Motion animated bars + count-up score + percentile line), `SessionStats`.
- Hardcoded dark mode on `<html>`.
- Added `allowedDevOrigins` to `next.config.ts` to support remote dev access.
- Pushed to https://github.com/drinkyouroj/floor-vote.
- Added CLAUDE.md via `project-md-generator` skill.

### Decisions
- [DECISION: Data source — curated static JSON](docs/decisions/0001-data-source.md)
- [DECISION: Scoring formula — linear penalty](docs/decisions/0002-scoring-formula.md)
- [DECISION: Percentile comparison — seeded simulation, no backend](docs/decisions/0003-simulated-percentile.md)
- [DECISION: PartySlider — native HTML range input over shadcn primitive](docs/decisions/0004-native-range-slider.md)
- [DECISION: Game mode — endless arcade (not daily Wordle)](docs/decisions/0005-endless-arcade-mode.md)

### Next
- Pick and wire a test framework (likely Vitest + React Testing Library) — highest-value targets are the pure-logic modules in `src/lib/`.
- Add a `scripts/fetch-votes.ts` tool using the Congress.gov API so the dataset can be expanded reproducibly.
- Draft a `Dockerfile` + `compose.yaml` so the dev env is portable.
- Consider a real backend (Vercel KV or Postgres) for cross-player percentile comparison — requires DECISION doc + AAP.
