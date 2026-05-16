import { useRef } from 'react'
import { AnnotationSection } from './AnnotationSection'

export function NotesEditor({ globalNote, onGlobalNoteChange, annotations, onAnnotationTextChange, onAnnotationRemove, onPillClick, focusedId }) {
  const globalRef = useRef(null)

  const handleGlobalInput = (e) => {
    const el = e.currentTarget
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
    onGlobalNoteChange(el.value)
  }

  return (
    // Outer: fixed-height box with gradient mask
    <div style={{
      width: 402,
      height: 600,
      flexShrink: 0,
      maskImage: 'linear-gradient(to bottom, transparent, black 36px, black calc(100% - 56px), transparent)',
      WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 36px, black calc(100% - 56px), transparent)',
      overflow: 'hidden',
    }}>
      {/* Inner: scrollable content area */}
      <div style={{
        height: '100%',
        overflowY: 'auto',
        padding: '36px 0 56px',
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
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
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
            onRemove={onAnnotationRemove}
            onPillClick={onPillClick}
            autoFocus={annotation.id === focusedId}
          />
        ))}
      </div>
    </div>
  )
}
