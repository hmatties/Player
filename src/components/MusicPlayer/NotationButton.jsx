import { motion } from 'framer-motion'
import { PencilNotationIcon } from '../../assets/icons/SFSymbol'

export function NotationButton({ onNotateStart, onNotateEnd }) {
  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      onPointerDown={(e) => { e.preventDefault(); onNotateStart?.() }}
      onPointerUp={() => onNotateEnd?.()}
      style={{
        width: 52,
        height: 52,
        borderRadius: '50%',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2,
        padding: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0 }}>
        <PencilNotationIcon size={32} />
      </div>
    </motion.button>
  )
}
