"use client"

import { motion } from "framer-motion"
import { Calendar, Building2 } from "lucide-react"
import type { Vote } from "@/lib/types"
import { formatDate, getCategoryColor } from "@/lib/votes"

interface VoteCardProps {
  vote: Vote
  roundNumber: number
}

export function VoteCard({ vote, roundNumber }: VoteCardProps) {
  const isPass = vote.result === "Passed"

  return (
    <motion.div
      key={vote.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-6 space-y-4"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getCategoryColor(vote.category)}`}
          >
            {vote.category}
          </span>
          <span className="text-xs text-zinc-500 font-mono">{vote.billNumber}</span>
        </div>
        <span className="text-xs text-zinc-500 font-medium shrink-0">
          Round {roundNumber}
        </span>
      </div>

      {/* Bill title */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-zinc-100 leading-snug">
          {vote.shortTitle}
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed">{vote.description}</p>
      </div>

      {/* Vote tally */}
      <div className="rounded-xl bg-zinc-950/60 border border-zinc-800/60 p-4">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-3xl font-bold text-zinc-100 tabular-nums">
              {vote.totalYea}
            </div>
            <div className="text-xs text-zinc-500 mt-0.5">Yes</div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span
              className={`text-sm font-bold px-3 py-1 rounded-full ${
                isPass
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                  : "bg-red-500/15 text-red-400 border border-red-500/20"
              }`}
            >
              {vote.result}
            </span>
            <span className="text-xs text-zinc-600">final tally</span>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-zinc-100 tabular-nums">
              {vote.totalNay}
            </div>
            <div className="text-xs text-zinc-500 mt-0.5">No</div>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5" />
          {vote.chamber} · {vote.congress}th Congress
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(vote.date)}
        </span>
      </div>
    </motion.div>
  )
}
