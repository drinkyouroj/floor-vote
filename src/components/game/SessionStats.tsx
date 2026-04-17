"use client"

import { Trophy, Zap } from "lucide-react"

interface SessionStatsProps {
  totalScore: number
  gamesPlayed: number
  highScore: number
}

export function SessionStats({ totalScore, gamesPlayed, highScore }: SessionStatsProps) {
  return (
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-1.5 text-zinc-400">
        <Zap className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-semibold text-zinc-200 tabular-nums">
          {totalScore.toLocaleString()}
        </span>
        <span className="text-xs text-zinc-500">total</span>
      </div>

      <div className="text-xs text-zinc-600 tabular-nums">
        #{gamesPlayed} played
      </div>

      <div className="flex items-center gap-1.5 text-zinc-400">
        <span className="text-xs text-zinc-500">best</span>
        <span className="text-sm font-semibold text-zinc-200 tabular-nums">
          {highScore.toLocaleString()}
        </span>
        <Trophy className="w-4 h-4 text-amber-400" />
      </div>
    </div>
  )
}
