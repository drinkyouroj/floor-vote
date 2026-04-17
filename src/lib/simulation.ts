import { calculateScore } from "./scoring"
import type { Vote } from "./types"

// Mulberry32 seeded PRNG — fast, good quality, deterministic
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(s: string): number {
  let h = 0x12345678
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function boxMuller(rng: () => number): number {
  // Box-Muller transform: two uniform randoms → standard normal
  const u1 = Math.max(1e-10, rng())
  const u2 = rng()
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

// A vote where both parties are extreme (0% or 100%) is "easy" to guess.
// A vote with murky splits is "hard".
function getVoteDifficulty(vote: Vote): number {
  const demExtremity = Math.abs(vote.dem.yeaPct - 50) / 50 // 0 (50%) to 1 (0% or 100%)
  const repExtremity = Math.abs(vote.rep.yeaPct - 50) / 50
  const split = Math.abs(vote.dem.yeaPct - vote.rep.yeaPct) / 100 // how far apart are parties
  return 1 - (demExtremity * 0.3 + repExtremity * 0.3 + split * 0.4)
}

export function simulatePercentileBeat(vote: Vote, playerScore: number): number {
  const seed = hashString(vote.id)
  const rng = mulberry32(seed)
  const difficulty = getVoteDifficulty(vote)
  // Spread: easy votes → tight guesses, hard votes → wide spread
  const spreadDem = 8 + difficulty * 28
  const spreadRep = 8 + difficulty * 28

  let beatCount = 0
  const N = 2000

  for (let i = 0; i < N; i++) {
    const demGuess = Math.max(0, Math.min(100, vote.dem.yeaPct + boxMuller(rng) * spreadDem))
    const repGuess = Math.max(0, Math.min(100, vote.rep.yeaPct + boxMuller(rng) * spreadRep))
    const simScore = calculateScore(
      Math.round(demGuess),
      Math.round(repGuess),
      vote.dem.yeaPct,
      vote.rep.yeaPct
    )
    if (simScore < playerScore) beatCount++
  }

  return Math.round((beatCount / N) * 100)
}
