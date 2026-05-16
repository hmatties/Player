import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 800, damping: 50 })
  const springY = useSpring(y, { stiffness: 800, damping: 50 })

  const [pressed, setPressed] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const move  = (e) => { x.set(e.clientX); y.set(e.clientY); setVisible(true) }
    const down  = () => setPressed(true)
    const up    = () => setPressed(false)
    const leave = () => setVisible(false)
    const enter = () => setVisible(true)

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    document.documentElement.addEventListener('mouseleave', leave)
    document.documentElement.addEventListener('mouseenter', enter)

    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.documentElement.removeEventListener('mouseleave', leave)
      document.documentElement.removeEventListener('mouseenter', enter)
    }
  }, [x, y])

  return (
    <motion.div
      animate={{ scale: pressed ? 0.82 : 1, opacity: visible ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 600, damping: 32 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        width: 50,
        height: 50,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.35)',
        border: '1px solid rgba(255,255,255,0.2)',
        pointerEvents: 'none',
        zIndex: 99999,
      }}
    />
  )
}
