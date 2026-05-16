import { AnimatePresence, motion } from 'framer-motion'
import { useRef } from 'react'
import { formatTime } from '../../utils/formatTime'

function DialDigit({ char, direction, clarity }) {
  const opacityFloor = clarity * 0.6
  const blurAmount = 3 * (1 - clarity * 0.85)

  return (
    <span style={{
      display: 'inline-block',
      position: 'relative',
      overflow: 'hidden',
      width: '0.6em',
      height: '1.15em',
      verticalAlign: 'middle',
      WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)',
      maskImage: 'linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)',
    }}>
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.span
          key={char}
          custom={direction}
          variants={{
            initial: (d) => ({ y: `${d * 110}%`, opacity: opacityFloor, filter: `blur(${blurAmount}px)` }),
            animate: { y: '0%', opacity: 1, filter: 'blur(0px)' },
            exit:    (d) => ({ y: `${d * -110}%`, opacity: opacityFloor, filter: `blur(${blurAmount}px)` }),
          }}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            textAlign: 'center',
          }}
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export function ScrubTimestamp({ isScrubbing, scrubTime, duration, playheadX }) {
  const prevTimeRef = useRef(scrubTime)
  const directionRef = useRef(1)
  const lastWallRef = useRef(Date.now())
  const velocityRef = useRef(0)

  if (scrubTime !== prevTimeRef.current) {
    const now = Date.now()
    const wallDelta = now - lastWallRef.current
    const scrubDelta = Math.abs(scrubTime - prevTimeRef.current)
    const instantV = wallDelta > 0 ? scrubDelta / wallDelta : 0
    // Exponential smoothing so velocity doesn't spike on single frames
    velocityRef.current = velocityRef.current * 0.55 + instantV * 0.45
    lastWallRef.current = now
    directionRef.current = scrubTime > prevTimeRef.current ? 1 : -1
    prevTimeRef.current = scrubTime
  }

  // 0 = slow/stopped, 1 = fast — drives opacity floor and blur reduction
  const clarity = Math.min(1, Math.max(0, (velocityRef.current - 0.02) / 0.13))

  const dir = directionRef.current
  const currentStr = formatTime(scrubTime)
  const durationStr = formatTime(duration)

  return (
    <AnimatePresence>
      {isScrubbing && (
        <motion.div
          initial={{ y: 52, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 52, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 480, damping: 36 }}
          style={{
            position: 'absolute',
            bottom: '100%',
            left: playheadX,
            translateX: '-50%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <div style={{
            background: '#F0D900',
            color: '#1a1a1a',
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontWeight: 500,
            fontSize: 13,
            letterSpacing: '0.02em',
            padding: '5px 11px',
            borderRadius: '8px 8px 0 0',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: 0,
          }}>
            {currentStr.split('').map((ch, i) => (
              /\d/.test(ch)
                ? <DialDigit key={i} char={ch} direction={dir} clarity={clarity} />
                : <span key={i} style={{ verticalAlign: 'middle' }}>{ch}</span>
            ))}
            <span style={{ verticalAlign: 'middle' }}>&nbsp;/&nbsp;</span>
            <span style={{ verticalAlign: 'middle' }}>{durationStr}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
