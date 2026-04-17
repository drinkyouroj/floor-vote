import votesData from "@/data/votes.json"
import type { Vote } from "./types"

export const allVotes = votesData as Vote[]

// Fisher-Yates shuffle seeded by a value (session-level randomization)
export function shuffleVotes(votes: Vote[], seed: number): Vote[] {
  const arr = [...votes]
  let s = seed
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 4294967296
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

export function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    Economy: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    Infrastructure: "bg-orange-500/15 text-orange-400 border-orange-500/20",
    "Social Policy": "bg-purple-500/15 text-purple-400 border-purple-500/20",
    Elections: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    Technology: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
    Budget: "bg-rose-500/15 text-rose-400 border-rose-500/20",
    "Civil Rights": "bg-violet-500/15 text-violet-400 border-violet-500/20",
    Labor: "bg-green-500/15 text-green-400 border-green-500/20",
    Defense: "bg-slate-400/15 text-slate-300 border-slate-400/20",
    "Gun Policy": "bg-red-500/15 text-red-400 border-red-500/20",
    "Foreign Policy": "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
    Veterans: "bg-teal-500/15 text-teal-400 border-teal-500/20",
    Immigration: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  }
  return map[category] ?? "bg-zinc-500/15 text-zinc-400 border-zinc-500/20"
}
