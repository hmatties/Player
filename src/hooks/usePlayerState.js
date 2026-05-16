import { useCallback, useEffect, useRef, useState } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

const DURATION = 210  // 3:30
const DEG_PER_SEC = 15

export function usePlayerState() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isScrubbing, setIsScrubbing] = useState(false)
  const [scrubTime, setScrubTime] = useState(0)

  // All refs up front — must never change order
  const currentTimeRef = useRef(0)
  const isPlayingRef = useRef(false)
  const lastTimestampRef = useRef(null)
  const rafRef = useRef(null)
  const rotationRef = useRef(0)
  const scrubTimeRef = useRef(0)

  const rotationMV = useMotionValue(0)
  const rotation = useSpring(rotationMV, { stiffness: 80, damping: 20 })

  const tick = useCallback((timestamp) => {
    if (lastTimestampRef.current == null) {
      lastTimestampRef.current = timestamp
    }
    const delta = (timestamp - lastTimestampRef.current) / 1000
    lastTimestampRef.current = timestamp

    if (isPlayingRef.current) {
      const next = Math.min(currentTimeRef.current + delta, DURATION)
      currentTimeRef.current = next
      rotationRef.current += delta * DEG_PER_SEC
      rotationMV.set(rotationRef.current)
      setCurrentTime(next)
      if (next < DURATION) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setIsPlaying(false)
        isPlayingRef.current = false
      }
    }
  }, [rotationMV])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const play = useCallback(() => {
    isPlayingRef.current = true
    lastTimestampRef.current = null
    setIsPlaying(true)
    rafRef.current = requestAnimationFrame(tick)
  }, [tick])

  const pause = useCallback(() => {
    isPlayingRef.current = false
    lastTimestampRef.current = null
    setIsPlaying(false)
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const seek = useCallback((t) => {
    const clamped = Math.max(0, Math.min(t, DURATION))
    currentTimeRef.current = clamped
    setCurrentTime(clamped)
  }, [])

  const startScrub = useCallback(() => {
    scrubTimeRef.current = currentTimeRef.current
    setIsScrubbing(true)
    setScrubTime(currentTimeRef.current)
  }, [])

  const updateScrub = useCallback((t) => {
    const clamped = Math.max(0, Math.min(t, DURATION))
    const timeDelta = clamped - scrubTimeRef.current
    scrubTimeRef.current = clamped
    rotationRef.current += timeDelta * DEG_PER_SEC
    rotationMV.set(rotationRef.current)
    setScrubTime(clamped)
  }, [rotationMV])

  const endScrub = useCallback((t) => {
    setIsScrubbing(false)
    seek(t)
  }, [seek])

  const replay = useCallback(() => {
    currentTimeRef.current = 0
    setCurrentTime(0)
    isPlayingRef.current = true
    lastTimestampRef.current = null
    setIsPlaying(true)
    rafRef.current = requestAnimationFrame(tick)
  }, [tick])

  return {
    isPlaying,
    currentTime,
    currentTimeRef,
    duration: DURATION,
    isScrubbing,
    scrubTime,
    rotation,
    play,
    pause,
    seek,
    startScrub,
    updateScrub,
    endScrub,
    replay,
  }
}
