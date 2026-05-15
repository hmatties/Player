import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { generateWaveform } from '../../utils/generateWaveform'

const WAVEFORM_DATA = generateWaveform(500)
const BAR_W = 2
const BAR_GAP = 2
const BAR_STRIDE = BAR_W + BAR_GAP
const MAX_BAR_H = 28
const PLAYHEAD_FRAC = 0.5

export function Waveform({ currentTime, duration, isScrubbing, scrubTime, onScrubStart, onScrubUpdate, onScrubEnd }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [canvasWidth, setCanvasWidth] = useState(0)
  const canvasHeight = 64

  const isActiveScrubRef = useRef(false)
  const scrubStartXRef = useRef(0)
  const scrubStartTimeRef = useRef(0)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      setCanvasWidth(Math.floor(entries[0].contentRect.width))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const drawWaveform = useCallback((displayTime) => {
    const canvas = canvasRef.current
    if (!canvas || canvasWidth === 0) return

    const dpr = window.devicePixelRatio || 1
    if (canvas.width !== Math.round(canvasWidth * dpr)) {
      canvas.width = Math.round(canvasWidth * dpr)
      canvas.height = Math.round(canvasHeight * dpr)
      canvas.style.width = canvasWidth + 'px'
      canvas.style.height = canvasHeight + 'px'
    }

    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    const totalBars = WAVEFORM_DATA.length
    const playheadPx = canvasWidth * PLAYHEAD_FRAC
    const currentBarFrac = (displayTime / duration) * totalBars
    const firstBarExact = currentBarFrac - playheadPx / BAR_STRIDE
    const firstBar = Math.floor(firstBarExact)
    const subBarOffset = (firstBarExact - firstBar) * BAR_STRIDE
    const barsOnScreen = Math.ceil(canvasWidth / BAR_STRIDE) + 2
    const centerY = canvasHeight / 2

    for (let i = 0; i <= barsOnScreen; i++) {
      const barIdx = firstBar + i
      const x = Math.round(i * BAR_STRIDE - subBarOffset)
      if (x + BAR_W < 0 || x > canvasWidth) continue
      const dataIdx = Math.max(0, Math.min(totalBars - 1, barIdx))
      const amp = WAVEFORM_DATA[dataIdx]
      const h = amp * MAX_BAR_H
      if (h < 0.5) continue
      const played = barIdx < currentBarFrac

      ctx.fillStyle = played ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.22)'
      ctx.beginPath()
      ctx.roundRect(x, centerY - h / 2, BAR_W, h, 1)
      ctx.fill()
    }
  }, [canvasWidth, canvasHeight, duration])

  useEffect(() => {
    drawWaveform(isScrubbing ? scrubTime : currentTime)
  }, [currentTime, scrubTime, isScrubbing, drawWaveform])

  const handlePointerDown = useCallback((e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    isActiveScrubRef.current = true
    scrubStartXRef.current = e.clientX
    scrubStartTimeRef.current = currentTime
    onScrubStart()
  }, [currentTime, onScrubStart])

  const handlePointerMove = useCallback((e) => {
    if (!isActiveScrubRef.current) return
    const deltaX = e.clientX - scrubStartXRef.current
    const totalBars = WAVEFORM_DATA.length
    const barsOnScreen = Math.ceil(canvasWidth / BAR_STRIDE)
    const visibleDuration = (barsOnScreen / totalBars) * duration
    const newTime = scrubStartTimeRef.current - (deltaX / canvasWidth) * visibleDuration
    onScrubUpdate(newTime)
  }, [canvasWidth, duration, onScrubUpdate])

  const handlePointerUp = useCallback((e) => {
    if (!isActiveScrubRef.current) return
    isActiveScrubRef.current = false
    const deltaX = e.clientX - scrubStartXRef.current
    const totalBars = WAVEFORM_DATA.length
    const barsOnScreen = Math.ceil(canvasWidth / BAR_STRIDE)
    const visibleDuration = (barsOnScreen / totalBars) * duration
    const newTime = scrubStartTimeRef.current - (deltaX / canvasWidth) * visibleDuration
    onScrubEnd(newTime)
  }, [canvasWidth, duration, onScrubEnd])

  const playheadPx = canvasWidth * PLAYHEAD_FRAC

  return (
    <div style={{ flex: 1, position: 'relative', minWidth: 0, overflow: 'visible' }}>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          cursor: isScrubbing ? 'ew-resize' : 'grab',
          overflow: 'visible',
          maskImage: 'linear-gradient(to right, transparent, black 32px, black calc(100% - 32px), transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 32px, black calc(100% - 32px), transparent)',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ display: 'block' }}
        />
      </div>

      {/* Playhead as animated div so height springs smoothly on scrub */}
      <motion.div
        animate={{
          top: isScrubbing ? 0 : 12,
          height: isScrubbing ? canvasHeight : canvasHeight - 24,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 36 }}
        style={{
          position: 'absolute',
          left: Math.round(playheadPx) - 1,
          width: 2,
          background: '#F0D900',
          borderRadius: 1,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
