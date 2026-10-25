import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { formatTime } from '../player/AudioPlayer'
import type { TranscriptSegment } from '../types'

export interface TranscriptPanelProps {
  segments: TranscriptSegment[]
  position: number
  onSeek: (sec: number) => void
  emptyMessage?: string
  hintMessage?: string
  activeAriaLabel?: string
  className?: string
  showSecondary?: boolean
  showTertiary?: boolean
  renderSegment?: (segment: TranscriptSegment, isActive: boolean, index: number) => ReactNode
}

export function TranscriptPanel({
  segments,
  position,
  onSeek,
  emptyMessage = 'No transcript available for this recording.',
  hintMessage = 'Click any line to jump to that moment in the audio.',
  activeAriaLabel = 'Currently playing segment',
  className = '',
  showSecondary = true,
  showTertiary = true,
  renderSegment,
}: TranscriptPanelProps) {
  const activeRef = useRef<HTMLLIElement | null>(null)

  const activeIndex = useMemo(() => {
    let found = -1
    for (let index = 0; index < segments.length; index++) {
      const seg = segments[index]
      if (seg && position >= seg.start) found = index
      else break
    }
    return found
  }, [segments, position])

  useEffect(() => {
    if (activeIndex >= 0) {
      activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [activeIndex])

  if (segments.length === 0) {
    return <p className="text-sm text-ink-3 py-4 text-center">{emptyMessage}</p>
  }

  return (
    <div className={className}>
      {hintMessage && <p className="text-xs text-ink-3 mb-3">{hintMessage}</p>}
      <ol className="space-y-1">
        {segments.map((segment, index) => {
          const active = index === activeIndex

          if (renderSegment) {
            return (
              <li key={index} ref={active ? activeRef : undefined}>
                {renderSegment(segment, active, index)}
              </li>
            )
          }

          return (
            <li key={index} ref={active ? activeRef : undefined}>
              <button
                type="button"
                onClick={() => onSeek(segment.start)}
                aria-current={active ? 'true' : undefined}
                aria-label={active ? activeAriaLabel : undefined}
                className={`flex w-full items-start gap-3 rounded-md border px-3.5 py-2.5 text-left transition-colors ${
                  active
                    ? 'border-primary/40 bg-primary-tint'
                    : 'border-transparent hover:border-line hover:bg-surface-2'
                }`}
              >
                <span className="num-display w-11 shrink-0 pt-1 text-xs text-ink-3 font-mono">
                  {formatTime(segment.start)}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`kr-text block text-[1.02rem] leading-relaxed ${
                      active ? 'font-semibold text-primary-strong' : 'text-ink'
                    }`}
                  >
                    {segment.text}
                  </span>
                  {showSecondary && segment.meaning && (
                    <span className="mt-1 block text-sm italic text-ink-3">{segment.meaning}</span>
                  )}
                  {showTertiary && segment.secondaryMeaning && (
                    <span className="mt-0.5 block text-sm text-ink-3">{segment.secondaryMeaning}</span>
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
