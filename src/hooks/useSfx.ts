"use client"

import { useCallback, useRef } from "react"

const SFX_PATHS = {
  sliderTick: "/sfx/slider_tick.wav",
  submitThunk: "/sfx/submit_thunk.wav",
  revealSwoosh: "/sfx/reveal_bar_swoosh.wav",
  coinTick: "/sfx/count_up_coin.wav",
  uncannyFanfare: "/sfx/uncanny_fanfare.wav",
} as const

type SfxName = keyof typeof SFX_PATHS

export function useSfx(name: SfxName) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  return useCallback(() => {
    if (typeof window === "undefined") return
    if (!audioRef.current) {
      audioRef.current = new Audio(SFX_PATHS[name])
    }
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {})
  }, [name])
}
