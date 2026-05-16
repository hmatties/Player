import { useCallback, useRef, useState } from 'react'
import { MusicPlayer } from './components/MusicPlayer'
import { NotesEditor } from './components/NotesEditor'
import { Cursor } from './components/Cursor'
import { usePlayerState } from './hooks/usePlayerState'
import './App.css'

function App() {
  const playerState = usePlayerState()
  const { currentTimeRef, seek } = playerState

  const [globalNote, setGlobalNote] = useState('')
  const [annotations, setAnnotations] = useState([])
  const [focusedId, setFocusedId] = useState(null)

  const holdStartWallRef = useRef(null)
  const holdStartTrackRef = useRef(0)

  const handleNotateStart = useCallback(() => {
    holdStartWallRef.current = performance.now()
    holdStartTrackRef.current = currentTimeRef.current
  }, [currentTimeRef])

  const handleNotateEnd = useCallback(() => {
    if (holdStartWallRef.current == null) return
    const wallDuration = performance.now() - holdStartWallRef.current
    holdStartWallRef.current = null

    const startTime = holdStartTrackRef.current
    const endTime = currentTimeRef.current
    const HOLD_MS = 400

    const id = String(Date.now())
    const annotation = wallDuration < HOLD_MS
      ? { id, type: 'point', time: startTime, text: '' }
      : { id, type: 'range', startTime, endTime, text: '' }

    setAnnotations(prev => {
      const next = [...prev, annotation]
      next.sort((a, b) => {
        const at = a.type === 'point' ? a.time : a.startTime
        const bt = b.type === 'point' ? b.time : b.startTime
        return at - bt
      })
      return next
    })
    setFocusedId(id)
  }, [currentTimeRef])

  const handleAnnotationTextChange = useCallback((id, text) => {
    setAnnotations(prev => prev.map(a => a.id === id ? { ...a, text } : a))
  }, [])

  return (
    <div className="app">
      <Cursor />
      <NotesEditor
        globalNote={globalNote}
        onGlobalNoteChange={setGlobalNote}
        annotations={annotations}
        onAnnotationTextChange={handleAnnotationTextChange}
        onPillClick={seek}
        focusedId={focusedId}
      />
      <MusicPlayer
        {...playerState}
        onNotateStart={handleNotateStart}
        onNotateEnd={handleNotateEnd}
      />
    </div>
  )
}

export default App
