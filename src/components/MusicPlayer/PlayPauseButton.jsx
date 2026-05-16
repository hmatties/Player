import { motion, AnimatePresence } from 'framer-motion'
import { PlayFillIcon, PauseIcon, ReplayIcon } from '../../assets/icons/SFSymbol'
import albumArt from '../../assets/preview.jpg'

export function PlayPauseButton({ isPlaying, isEnded, rotation, onToggle }) {
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
          backgroundImage: `url(${albumArt})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
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
            key={isEnded ? 'replay' : isPlaying ? 'pause' : 'play'}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.12 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0 }}
          >
            {isEnded
              ? <ReplayIcon size={20} />
              : isPlaying
                ? <PauseIcon size={16} />
                : <div style={{ transform: 'translateX(1.5px)' }}><PlayFillIcon size={16} /></div>
            }
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
