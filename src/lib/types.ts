export interface PartyStats {
  yea: number
  nay: number
  total: number
  yeaPct: number
}

export interface Vote {
  id: string
  billNumber: string
  shortTitle: string
  description: string
  category: string
  congress: number
  chamber: "House" | "Senate"
  date: string
  result: "Passed" | "Failed"
  totalYea: number
  totalNay: number
  dem: PartyStats
  rep: PartyStats
}

export interface RoundResult {
  voteId: string
  demGuess: number
  repGuess: number
  demActual: number
  repActual: number
  score: number
  percentileBeat: number
}

export type GamePhase = "guessing" | "revealed"
