# Floor Vote

Guess what percentage of each party voted yes on real roll-call votes from Congress — two sliders, instant scoring, endless rounds.

You see an actual House vote: the bill's short title, description, and the final tally. You drag two sliders — one for Democrats, one for Republicans — to guess what percentage of each party voted YES. Submit, and see how close you were. Score up to 1000 points per round.

## Prerequisites

- Node 20+
- npm

## Local setup

```bash
npm install
npm run dev
```

Opens at http://localhost:3000.

If you're accessing the dev server from a non-localhost origin, add that origin to `allowedDevOrigins` in `next.config.ts`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type-check only (fast) |

## How to run tests

No test framework is wired up yet — a DECISION doc will pick one (likely Vitest + React Testing Library). Until then, `npx tsc --noEmit` is the fastest correctness check.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · shadcn/ui (via `@base-ui/react`) · Framer Motion · Lucide.

All state is client-side. No backend, no database, no auth.

## Key documents

- [`CLAUDE.md`](CLAUDE.md) — conventions for AI agents working in this repo
- [`docs/architecture.md`](docs/architecture.md) — system shape and data flow
- [`docs/decisions/`](docs/decisions/) — DECISION docs for the non-obvious choices:
  - [0001 — Data source: curated static JSON](docs/decisions/0001-data-source.md)
  - [0002 — Scoring formula: linear penalty](docs/decisions/0002-scoring-formula.md)
  - [0003 — Percentile comparison: seeded simulation, no backend](docs/decisions/0003-simulated-percentile.md)
  - [0004 — PartySlider: native `<input>`, not shadcn](docs/decisions/0004-native-range-slider.md)
  - [0005 — Endless arcade mode, not daily](docs/decisions/0005-endless-arcade-mode.md)
- [`build_log.md`](build_log.md) — append-only session log
- [`CHANGELOG.md`](CHANGELOG.md) — Keep a Changelog format

## License

TBD.
