import type { RoundResult } from "./types"

const STORAGE_KEY = "floor-vote-session"

interface SessionData {
  results: RoundResult[]
  totalScore: number
  highScore: number
  gamesPlayed: number
}

function defaultSession(): SessionData {
  return { results: [], totalScore: 0, highScore: 0, gamesPlayed: 0 }
}

export function loadSession(): SessionData {
  if (typeof window === "undefined") return defaultSession()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : defaultSession()
  } catch {
    return defaultSession()
  }
}

export function saveResult(result: RoundResult): SessionData {
  const session = loadSession()
  session.results.push(result)
  session.totalScore += result.score
  session.highScore = Math.max(session.highScore, result.score)
  session.gamesPlayed += 1
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {}
  return session
}
