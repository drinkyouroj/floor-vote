# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] — 2026-04-17

### Added
- Endless arcade game loop: vote card → dual party sliders → submit → animated reveal → next vote.
- Curated dataset of 25 real US House roll-call votes spanning the 117th–119th Congress (`src/data/votes.json`).
- Scoring engine: `max(0, 1000 − (demError + repError) × 7)` with qualitative bands (Uncanny / Sharp / Decent / Off / Way Off).
- "Better than X% of players" percentile line, computed via deterministic seeded Mulberry32 simulation (2000 synthetic guesses per vote, spread tuned by vote difficulty).
- Session persistence in localStorage: total score, high score, games played.
- Per-party styled native range sliders (blue Democrat, red Republican) with gradient tracks and glow thumbs.
- Framer Motion entrance/exit animations for vote cards, result bars, score count-up, and percentile reveal.
- "How to Play" modal.
- Dark mode (hardcoded — no light mode).
- `allowedDevOrigins` config for remote dev access.
- `CLAUDE.md`, `docs/decisions/` (5 initial decisions), `docs/architecture.md`, `build_log.md`.
