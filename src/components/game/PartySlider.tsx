"use client"

import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { motion } from "framer-motion"
import { useSfx } from "@/hooks/useSfx"

interface PartySliderProps {
  party: "dem" | "rep"
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

const PARTY_CONFIG = {
  dem: {
    label: "Democrats",
    dotColor: "bg-blue-500",
    textColor: "text-blue-400",
    trackFill: "#3b82f6",
    thumbBorder: "#93c5fd",
  },
  rep: {
    label: "Republicans",
    dotColor: "bg-red-500",
    textColor: "text-red-400",
    trackFill: "#ef4444",
    thumbBorder: "#fca5a5",
  },
}

export function PartySlider({ party, value, onChange, disabled }: PartySliderProps) {
  const config = PARTY_CONFIG[party]
  const isDem = party === "dem"
  const playTick = useSfx("sliderTick")

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
          <span className="text-sm font-semibold tracking-wide text-zinc-300">
            {config.label}
          </span>
        </div>
        <motion.span
          key={value}
          initial={{ scale: 1.15, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
          className={`text-2xl font-bold tabular-nums ${config.textColor}`}
        >
          {value}%
        </motion.span>
      </div>

      {/* Custom range input — fully controlled, styled per party */}
      <div className="relative py-1">
        <style>{`
          .party-slider-${party} {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 12px;
            border-radius: 999px;
            outline: none;
            cursor: ${disabled ? "not-allowed" : "pointer"};
            opacity: ${disabled ? "0.4" : "1"};
            background: linear-gradient(
              to right,
              ${isDem ? "#2563eb" : "#dc2626"} 0%,
              ${isDem ? "#3b82f6" : "#ef4444"} ${value}%,
              #27272a ${value}%,
              #27272a 100%
            );
          }
          .party-slider-${party}::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: ${isDem ? "#60a5fa" : "#f87171"};
            border: 2px solid ${isDem ? "#93c5fd" : "#fca5a5"};
            box-shadow: 0 0 12px ${isDem ? "rgba(59,130,246,0.5)" : "rgba(239,68,68,0.5)"};
            cursor: ${disabled ? "not-allowed" : "grab"};
            transition: transform 0.1s, box-shadow 0.15s;
          }
          .party-slider-${party}::-webkit-slider-thumb:hover {
            transform: scale(1.12);
            box-shadow: 0 0 18px ${isDem ? "rgba(59,130,246,0.7)" : "rgba(239,68,68,0.7)"};
          }
          .party-slider-${party}::-webkit-slider-thumb:active {
            transform: scale(0.95);
            cursor: grabbing;
          }
          .party-slider-${party}::-moz-range-thumb {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: ${isDem ? "#60a5fa" : "#f87171"};
            border: 2px solid ${isDem ? "#93c5fd" : "#fca5a5"};
            box-shadow: 0 0 12px ${isDem ? "rgba(59,130,246,0.5)" : "rgba(239,68,68,0.5)"};
            cursor: ${disabled ? "not-allowed" : "grab"};
          }
        `}</style>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          disabled={disabled}
          onChange={(e) => {
            const next = Number(e.target.value)
            if (next === value) return
            onChange(next)
            playTick()
            if (
              next % 5 === 0 &&
              typeof navigator !== "undefined" &&
              typeof navigator.vibrate === "function"
            ) {
              navigator.vibrate(8)
            }
          }}
          className={`party-slider-${party} block w-full`}
        />

        {/* Ratchet notches at 0/25/50/75/100% — sit on top of the track, under the thumb glow */}
        <div className="pointer-events-none absolute inset-0">
          {[0, 25, 50, 75, 100].map((pct) => (
            <div
              key={pct}
              className="absolute top-1/2 w-0.5 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30"
              style={{ left: `${pct}%` }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between text-xs text-zinc-600 select-none">
        <span>0% Yes</span>
        <span>50%</span>
        <span>100% Yes</span>
      </div>
    </div>
  )
}
