import { motion, AnimatePresence } from 'framer-motion'
import { PlayPauseButton } from './PlayPauseButton'
import { Waveform } from './Waveform'
import { NotationButton } from './NotationButton'
import { ScrubTimestamp } from './ScrubTimestamp'

export function MusicPlayer({
  isPlaying, currentTime, duration, isScrubbing, scrubTime, rotation,
  play, pause, replay, seek, startScrub, updateScrub, endScrub,
  onNotateStart, onNotateEnd,
}) {
  const isEnded = currentTime >= duration

  return (
    <div style={{
      width: 402,
      flexShrink: 0,
      position: 'relative',
      zIndex: 2,
      overflow: 'visible',
    }}>
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

        <NotationButton onNotateStart={onNotateStart} onNotateEnd={onNotateEnd} />
      </div>
    </div>
  )
}
