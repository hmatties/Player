import { motion, AnimatePresence } from 'framer-motion'
import { usePlayerState } from '../../hooks/usePlayerState'
import { PlayPauseButton } from './PlayPauseButton'
import { Waveform } from './Waveform'
import { NotationButton } from './NotationButton'
import { ScrubTimestamp } from './ScrubTimestamp'

export function MusicPlayer({ onNotate }) {
  const {
    isPlaying,
    currentTime,
    duration,
    isScrubbing,
    scrubTime,
    rotation,
    play,
    pause,
    replay,
    startScrub,
    updateScrub,
    endScrub,
  } = usePlayerState()

  const isEnded = currentTime >= duration

  return (
    <div style={{
      position: 'fixed',
      bottom: 96,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 402,
      zIndex: 100,
      overflow: 'visible',
    }}>
      {/* Tooltip peeks from behind the top edge of the pill */}
      <ScrubTimestamp
        isScrubbing={isScrubbing}
        scrubTime={scrubTime}
        duration={duration}
        playheadX={201}
      />
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(24px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 9999,
        boxSizing: 'border-box',
        padding: 6,
        height: 64,
        boxShadow: '0 -1px 18.8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.04)',
        overflow: 'visible',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Scrub brightness overlay */}
        <AnimatePresence>
          {isScrubbing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 9999,
                background: 'rgba(255,255,255,0.05)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
          )}
        </AnimatePresence>
        <PlayPauseButton
          isPlaying={isPlaying}
          isEnded={isEnded}
          rotation={rotation}
          onToggle={isEnded ? replay : isPlaying ? pause : play}
        />

        <div style={{ flex: 1, minWidth: 0, padding: '0 8px', overflow: 'visible', position: 'relative' }}>
          <Waveform
            currentTime={currentTime}
            duration={duration}
            isScrubbing={isScrubbing}
            scrubTime={scrubTime}
            onScrubStart={startScrub}
            onScrubUpdate={updateScrub}
            onScrubEnd={endScrub}
          />
        </div>

        <NotationButton onNotate={onNotate ?? (() => {})} />
      </div>
    </div>
  )
}
