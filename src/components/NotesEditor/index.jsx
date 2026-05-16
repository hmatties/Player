import { useRef } from 'react'
import { AnnotationSection } from './AnnotationSection'

export function NotesEditor({ globalNote, onGlobalNoteChange, annotations, onAnnotationTextChange, onPillClick, focusedId }) {
  const globalRef = useRef(null)

  const handleGlobalInput = (e) => {
    const el = e.currentTarget
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
    onGlobalNoteChange(el.value)
  }

  return (
    // Outer: fixed frame with gradient mask
    <div style={{
      position: 'fixed',
      top: 96,
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 402,
      maskImage: 'linear-gradient(to bottom, transparent, black 40px, black calc(100% - 280px), rgba(0,0,0,0.75) calc(100% - 200px), rgba(0,0,0,0.15) calc(100% - 140px), transparent calc(100% - 96px))',
      WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 40px, black calc(100% - 280px), rgba(0,0,0,0.75) calc(100% - 200px), rgba(0,0,0,0.15) calc(100% - 140px), transparent calc(100% - 96px))',
      overflow: 'hidden',
    }}>
      {/* Inner: scrollable content area */}
      <div style={{
        height: '100%',
        overflowY: 'auto',
        padding: '40px 0 160px',
        boxSizing: 'border-box',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        <textarea
          ref={globalRef}
          value={globalNote}
          onChange={(e) => onGlobalNoteChange(e.target.value)}
          onInput={handleGlobalInput}
          rows={1}
          style={{
            display: 'block',
            width: '100%',
            background: 'none',
            border: 'none',
            outline: 'none',
            resize: 'none',
            overflow: 'hidden',
            color: 'rgba(255,255,255,0.88)',
            fontSize: 17,
            fontWeight: 400,
            lineHeight: 1.55,
            fontFamily: 'inherit',
            padding: 0,
            margin: 0,
            caretColor: '#F0D900',
          }}
          placeholder="Leave your notes or notate a specific section..."
        />

        {annotations.length > 0 && (
          <div style={{
            borderTop: '1px dashed rgba(255,255,255,0.15)',
            margin: '32px 0',
          }} />
        )}

        {annotations.map((annotation) => (
          <AnnotationSection
            key={annotation.id}
            annotation={annotation}
            onTextChange={onAnnotationTextChange}
            onPillClick={onPillClick}
            autoFocus={annotation.id === focusedId}
          />
        ))}
      </div>
    </div>
  )
}
