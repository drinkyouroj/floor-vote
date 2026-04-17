"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { BarChart3, Info, X } from "lucide-react"
import { VoteCard } from "@/components/game/VoteCard"
import { PartySlider } from "@/components/game/PartySlider"
import { ScoreReveal } from "@/components/game/ScoreReveal"
import { SessionStats } from "@/components/game/SessionStats"
import { useSfx } from "@/hooks/useSfx"
import { calculateScore } from "@/lib/scoring"
import { simulatePercentileBeat } from "@/lib/simulation"
import { allVotes, shuffleVotes } from "@/lib/votes"
import { loadSession, saveResult } from "@/lib/storage"
import type { GamePhase, RoundResult } from "@/lib/types"

function HowToPlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-4"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-zinc-100">How to Play</h2>
          <p className="text-sm text-zinc-400">
            Read each real roll-call vote from Congress — the bill name and final tally.
          </p>
        </div>
        <ol className="space-y-3">
          {[
            "Drag the sliders to guess what percentage of Democrats and Republicans voted YES.",
            "Submit your guess and see how close you were to the actual party splits.",
            "Earn up to 1,000 points per round. Closer guesses score higher.",
            "Play as many rounds as you want — votes are shuffled each session.",
          ].map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="flex-none w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <span className="text-zinc-400 leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
        <div className="rounded-xl bg-zinc-950/60 border border-zinc-800/60 p-3 text-xs text-zinc-500">
          Votes are real roll-calls from the 117th–119th Congress. Party percentages reflect
          members who voted YES (excluding abstentions).
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function FloorVotePage() {
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState<GamePhase>("guessing")
  const [voteIndex, setVoteIndex] = useState(0)
  const [demGuess, setDemGuess] = useState(50)
  const [repGuess, setRepGuess] = useState(50)
  const [currentResult, setCurrentResult] = useState<RoundResult | null>(null)
  const [session, setSession] = useState({ totalScore: 0, highScore: 0, gamesPlayed: 0 })
  const [showHowTo, setShowHowTo] = useState(false)
  const sessionSeed = useRef(Date.now())
  const playThunk = useSfx("submitThunk")

  const shuffledVotes = useMemo(
    () => shuffleVotes(allVotes, sessionSeed.current),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const currentVote = shuffledVotes[voteIndex % shuffledVotes.length]
  const roundNumber = voteIndex + 1

  useEffect(() => {
    setMounted(true)
    const s = loadSession()
    setSession({ totalScore: s.totalScore, highScore: s.highScore, gamesPlayed: s.gamesPlayed })
  }, [])

  const handleSubmit = useCallback(() => {
    playThunk()
    const score = calculateScore(
      demGuess,
      repGuess,
      currentVote.dem.yeaPct,
      currentVote.rep.yeaPct
    )
    const percentileBeat = simulatePercentileBeat(currentVote, score)

    const result: RoundResult = {
      voteId: currentVote.id,
      demGuess,
      repGuess,
      demActual: currentVote.dem.yeaPct,
      repActual: currentVote.rep.yeaPct,
      score,
      percentileBeat,
    }

    setCurrentResult(result)
    const updated = saveResult(result)
    setSession({
      totalScore: updated.totalScore,
      highScore: updated.highScore,
      gamesPlayed: updated.gamesPlayed,
    })
    setPhase("revealed")
  }, [demGuess, repGuess, currentVote, playThunk])

  const handleNext = useCallback(() => {
    setVoteIndex((i) => i + 1)
    setDemGuess(50)
    setRepGuess(50)
    setPhase("guessing")
    setCurrentResult(null)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-700 border-t-zinc-300 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-100">Floor Vote</h1>
          </div>
          <button
            onClick={() => setShowHowTo(true)}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-zinc-800"
          >
            <Info className="w-3.5 h-3.5" />
            How to play
          </button>
        </header>

        {/* Session stats */}
        <SessionStats
          totalScore={session.totalScore}
          gamesPlayed={session.gamesPlayed}
          highScore={session.highScore}
        />

        <div className="h-px bg-zinc-800" />

        {/* Vote card — always visible */}
        <AnimatePresence mode="wait">
          <VoteCard key={currentVote.id} vote={currentVote} roundNumber={roundNumber} />
        </AnimatePresence>

        {/* Game phase area */}
        <AnimatePresence mode="wait">
          {phase === "guessing" ? (
            <motion.div
              key="guessing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <BarChart3 className="w-4 h-4 shrink-0" />
                <span>
                  What percentage of each party voted{" "}
                  <span className="text-zinc-200 font-semibold">YES</span>?
                </span>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5 space-y-6">
                <PartySlider party="dem" value={demGuess} onChange={setDemGuess} />
                <div className="h-px bg-zinc-800" />
                <PartySlider party="rep" value={repGuess} onChange={setRepGuess} />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full rounded-2xl bg-zinc-100 hover:bg-white text-zinc-900 font-semibold py-4 text-base transition-all active:scale-95 hover:shadow-lg hover:shadow-zinc-100/5"
              >
                Submit Guess
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {currentResult && (
                <ScoreReveal
                  vote={currentVote}
                  demGuess={demGuess}
                  repGuess={repGuess}
                  score={currentResult.score}
                  percentileBeat={currentResult.percentileBeat}
                  onNext={handleNext}
                  roundNumber={roundNumber}
                  totalScore={session.totalScore}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showHowTo && <HowToPlay onClose={() => setShowHowTo(false)} />}
      </AnimatePresence>
    </div>
  )
}
