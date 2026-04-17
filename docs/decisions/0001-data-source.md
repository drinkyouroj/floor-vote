# DECISION: Data source — curated static JSON dataset

**Date:** 2026-04-17
**Status:** Accepted

## Context

The game shows real Congressional roll-call votes. We need a source for vote data that includes:

- Bill short title and short description
- Total yea/nay tally and pass/fail result
- **Party-level breakdown**: yea/nay counts for Democrats and Republicans individually
- Chamber, Congress number, and date

We evaluated sources before writing any code:

- **Congress.gov API** — pre-aggregated party breakdowns, free API key, House votes from 2023+ only. Requires per-user API key.
- **ProPublica Congress API** — no longer issuing new API keys (shut down July 2024).
- **unitedstates/congress (GitHub)** — historical data back to 1990, but only individual member votes; party tallies must be aggregated.
- **Voteview** — full history since 1789, JSON downloads, but no pre-aggregated party counts.

## Options Considered

1. **Live fetch at runtime from Congress.gov API**
   - Pros: always fresh, no maintenance
   - Cons: per-user API key, rate limits, needs server env, CORS, offline breakage, vote quality uncurated (many procedural votes)

2. **Build script fetching from API → static JSON at build time**
   - Pros: fresh data periodically, no runtime API dep
   - Cons: still requires API key in CI, still yields uncurated procedural noise, adds build complexity

3. **Curated static JSON committed to repo** ✅ chosen
   - Pros: zero runtime deps, deterministic, offline-capable, hand-picked for *interestingness* (mix of party-line / bipartisan / split votes), numbers verifiable
   - Cons: dataset grows only by manual PR, size bounded by what we commit

## Decision

Ship a curated **static JSON dataset** at `src/data/votes.json` with ~25 hand-picked, publicly well-known roll-call votes from the 117th–119th Congresses. Every entry carries pre-computed party yea-percentages so the runtime never does arithmetic on tallies it doesn't trust.

A `scripts/fetch-votes.ts` helper (not yet written — see Next in `build_log.md`) will optionally expand the dataset via the Congress.gov API, but the curated JSON is the source of truth.

## Consequences

- **Gets easier:** runtime has zero external deps; game works offline; dataset quality is curatorial not stochastic.
- **Gets harder:** growing beyond ~100 votes by hand is tedious; relies on curator's accuracy (verification discipline required in PRs that add votes).
- **Coupling:** the `Vote` type in `src/lib/types.ts` is the schema contract — any JSON shape change must go through a typed migration.
