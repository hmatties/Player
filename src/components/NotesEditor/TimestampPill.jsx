import { formatTime } from '../../utils/formatTime'

export function TimestampPill({ annotation, onPillClick }) {
  const label = annotation.type === 'range'
    ? `${formatTime(annotation.startTime)} - ${formatTime(annotation.endTime)}`
    : formatTime(annotation.time)

  const seekTime = annotation.type === 'range' ? annotation.startTime : annotation.time

  return (
    <div
      onClick={() => onPillClick(seekTime)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: '#F0D900',
        borderRadius: 4,
        padding: '2px 7px',
        marginBottom: 8,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <span style={{
        color: '#1a1a0a',
        fontSize: 13,
        fontWeight: 500,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '0.01em',
      }}>
        {label}
      </span>
    </div>
  )
}
