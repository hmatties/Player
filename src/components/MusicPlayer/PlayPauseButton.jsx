import { motion, AnimatePresence } from 'framer-motion'
import { PlayFillIcon, PauseIcon } from './SFSymbol'

export function PlayPauseButton({ isPlaying, rotation, onToggle }) {
  return (
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: '50%',
        flexShrink: 0,
        cursor: 'pointer',
        position: 'relative',
        zIndex: 2,
      }}
      onClick={onToggle}
    >
      {/* Rotating CD disc */}
      <motion.div
        style={{
          rotate: rotation,
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #6b7fa3 0%, #3d4f72 40%, #252d45 100%)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)',
        }}
      />
      {/* Dark overlay + icon — does NOT rotate */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.28)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isPlaying ? 'pause' : 'play'}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.12 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0 }}
          >
            {isPlaying
              ? <PauseIcon size={18} />
              : <div style={{ transform: 'translateX(1.5px)' }}><PlayFillIcon size={18} /></div>
            }
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
