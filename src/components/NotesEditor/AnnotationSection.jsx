import { useEffect, useRef } from 'react'
import { TimestampPill } from './TimestampPill'

export function AnnotationSection({ annotation, onTextChange, onPillClick, autoFocus }) {
  const textareaRef = useRef(null)

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocus])

  const handleInput = (e) => {
    const el = e.currentTarget
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
    onTextChange(annotation.id, el.value)
  }

  return (
    <div style={{ marginBottom: 32 }}>
      <TimestampPill annotation={annotation} onPillClick={onPillClick} />
      <textarea
        ref={textareaRef}
        value={annotation.text}
        onChange={(e) => onTextChange(annotation.id, e.target.value)}
        onInput={handleInput}
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
        placeholder="Add a note..."
      />
    </div>
  )
}
