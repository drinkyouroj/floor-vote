export function calculateScore(
  demGuess: number,
  repGuess: number,
  demActual: number,
  repActual: number
): number {
  const demError = Math.abs(demGuess - demActual)
  const repError = Math.abs(repGuess - repActual)
  return Math.max(0, Math.round(1000 - (demError + repError) * 7))
}

export function getScoreLabel(score: number): {
  label: string
  color: string
} {
  if (score >= 900) return { label: "Uncanny", color: "text-emerald-400" }
  if (score >= 750) return { label: "Sharp", color: "text-green-400" }
  if (score >= 500) return { label: "Decent", color: "text-yellow-400" }
  if (score >= 250) return { label: "Off", color: "text-orange-400" }
  return { label: "Way Off", color: "text-red-400" }
}
