"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Target, ChevronRight } from "lucide-react"
import { getScoreLabel } from "@/lib/scoring"
import type { Vote } from "@/lib/types"

interface PartyResultRowProps {
  party: "dem" | "rep"
  guess: number
  actual: number
  delay?: number
}

function PartyResultRow({ party, guess, actual, delay = 0 }: PartyResultRowProps) {
  const isDem = party === "dem"
  const error = Math.abs(guess - actual)
  const barColor = isDem ? "bg-blue-500" : "bg-red-500"
  const guessBarColor = isDem ? "bg-blue-400/40" : "bg-red-400/40"
  const label = isDem ? "Democrats" : "Republicans"
  const textColor = isDem ? "text-blue-400" : "text-red-400"

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-400 font-medium">{label} voted YES</span>
        <span className="text-xs text-zinc-500">
          {error === 0 ? (
            <span className="text-emerald-400 font-semibold">Perfect!</span>
          ) : (
            <span className={error <= 5 ? "text-emerald-400" : error <= 15 ? "text-yellow-400" : "text-red-400"}>
              {error > 0 ? `${error}pp off` : ""}
            </span>
          )}
        </span>
      </div>

      {/* Your guess bar */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-600 w-12 shrink-0">You</span>
          <div className="relative flex-1 h-2.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${guess}%` }}
              transition={{ delay, duration: 0.5, ease: "easeOut" }}
              className={`absolute h-full rounded-full ${guessBarColor}`}
            />
          </div>
          <span className={`text-sm font-bold tabular-nums w-10 text-right ${textColor} opacity-70`}>
            {guess}%
          </span>
        </div>

        {/* Actual bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 w-12 shrink-0">Actual</span>
          <div className="relative flex-1 h-2.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${actual}%` }}
              transition={{ delay: delay + 0.15, duration: 0.6, ease: "easeOut" }}
              className={`absolute h-full rounded-full ${barColor}`}
            />
          </div>
          <span className={`text-sm font-bold tabular-nums w-10 text-right ${textColor}`}>
            {actual}%
          </span>
        </div>
      </div>
    </motion.div>
  )
}

function useCountUp(target: number, delay: number = 0): number {
  const [count, setCount] = useState(0)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now()
      const duration = 1000

      const tick = (now: number) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.round(eased * target))
        if (progress < 1) {
          frameRef.current = requestAnimationFrame(tick)
        }
      }

      frameRef.current = requestAnimationFrame(tick)
    }, delay * 1000)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(frameRef.current)
    }
  }, [target, delay])

  return count
}

interface ScoreRevealProps {
  vote: Vote
  demGuess: number
  repGuess: number
  score: number
  percentileBeat: number
  onNext: () => void
  roundNumber: number
  totalScore: number
}

export function ScoreReveal({
  vote,
  demGuess,
  repGuess,
  score,
  percentileBeat,
  onNext,
  roundNumber,
  totalScore,
}: ScoreRevealProps) {
  const displayScore = useCountUp(score, 0.8)
  const displayTotal = useCountUp(totalScore, 1.0)
  const { label, color } = getScoreLabel(score)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Party result rows */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5 space-y-5">
        <PartyResultRow
          party="dem"
          guess={demGuess}
          actual={vote.dem.yeaPct}
          delay={0}
        />
        <div className="h-px bg-zinc-800" />
        <PartyResultRow
          party="rep"
          guess={repGuess}
          actual={vote.rep.yeaPct}
          delay={0.2}
        />
      </div>

      {/* Score card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-zinc-100 tabular-nums">
                +{displayScore.toLocaleString()}
              </span>
              <span className={`text-sm font-semibold ${color}`}>{label}</span>
            </div>
            <div className="text-xs text-zinc-500">
              Running total:{" "}
              <span className="text-zinc-300 font-medium tabular-nums">
                {displayTotal.toLocaleString()} pts
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Target className="w-5 h-5" />
            <span className="text-sm font-medium">Round {roundNumber}</span>
          </div>
        </div>

        {/* Percentile comparison */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-4 flex items-center gap-2 rounded-xl bg-zinc-950/60 border border-zinc-800/60 px-4 py-3"
        >
          <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-sm text-zinc-300">
            You guessed better than{" "}
            <span className="font-bold text-emerald-400">{percentileBeat}%</span> of players
            on this vote
          </span>
        </motion.div>
      </motion.div>

      {/* Next button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        onClick={onNext}
        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-zinc-100 hover:bg-white text-zinc-900 font-semibold py-4 text-base transition-all active:scale-98 hover:shadow-lg hover:shadow-zinc-100/5"
      >
        Next Vote
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
  )
}
