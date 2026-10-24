import { useState, type ReactNode } from 'react'
import type { ComicBubble as ComicBubbleType, ComicWord } from './types'
import { VolumeIcon } from './icons'

export interface ComicBubbleProps {
  bubble: ComicBubbleType
  showTranslation?: boolean
  showRomanization?: boolean
  language?: 'english' | 'turkish' | 'both'
  onWordClick?: (word: ComicWord) => void
  onPlayAudio?: (text: string) => void
  className?: string
  extraActions?: (bubble: ComicBubbleType) => ReactNode
}

export function ComicBubble({
  bubble,
  showTranslation = true,
  showRomanization = true,
  language = 'english',
  onWordClick,
  onPlayAudio,
  className = '',
  extraActions,
}: ComicBubbleProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onPlayAudio) {
      setIsPlaying(true)
      onPlayAudio(bubble.korean)
      setTimeout(() => setIsPlaying(false), 1500)
    }
  }

  const renderKoreanText = () => {
    if (!bubble.vocabulary || bubble.vocabulary.length === 0) {
      return <span>{bubble.korean}</span>
    }

    const vocabMap = new Map<string, ComicWord>()
    for (const v of bubble.vocabulary) {
      vocabMap.set(v.word, v)
    }

    // Split text into tokens (keeping whitespace and punctuation)
    const tokens = bubble.korean.split(/(\s+|[.,!?'"~]+)/)
    return tokens.map((token, idx) => {
      const clean = token.trim()
      const match = vocabMap.get(clean)
      if (match) {
        return (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onWordClick?.(match)
            }}
            className="inline font-bold text-primary underline decoration-primary/50 decoration-2 underline-offset-2 transition-colors hover:text-primary-strong hover:decoration-primary cursor-pointer rounded px-0.5"
            title={`${match.meaning}${match.romanization ? ` (${match.romanization})` : ''}`}
          >
            {token}
          </button>
        )
      }
      return <span key={idx}>{token}</span>
    })
  }

  const getBubbleStyle = () => {
    switch (bubble.type) {
      case 'thought':
        return 'rounded-3xl border-2 border-dashed border-sky-300 bg-sky-50/90 text-sky-950 shadow-sm'
      case 'narration':
        return 'rounded-lg border border-amber-300 bg-amber-50/95 text-amber-950 shadow-sm font-sans'
      case 'shout':
        return 'rounded-2xl border-2 border-rose-400 bg-rose-50/95 text-rose-950 shadow-md font-bold'
      case 'dialogue':
      default:
        return 'rounded-2xl border border-line bg-surface/95 text-ink shadow-sm'
    }
  }

  return (
    <div className={`relative p-3.5 transition-all text-left ${getBubbleStyle()} ${className}`}>
      {bubble.speaker && (
        <div className="flex items-center gap-1.5 mb-1.5">
          {bubble.avatarUrl && (
            <img
              src={bubble.avatarUrl}
              alt={bubble.speaker}
              className="w-5 h-5 rounded-full object-cover border border-line"
            />
          )}
          <span className="text-xs font-semibold tracking-wide text-ink-2 uppercase">
            {bubble.speaker}
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="kr-text text-base leading-relaxed tracking-normal font-medium">
            {renderKoreanText()}
          </p>

          {showRomanization && bubble.romanization && (
            <p className="text-xs text-ink-3 italic mt-0.5 tracking-wide">
              {bubble.romanization}
            </p>
          )}

          {showTranslation && (
            <div className="mt-1 space-y-0.5 text-xs text-ink-2">
              {(language === 'english' || language === 'both') && bubble.english && (
                <p>{bubble.english}</p>
              )}
              {(language === 'turkish' || language === 'both') && bubble.turkish && (
                <p className="text-ink-3">{bubble.turkish}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onPlayAudio && (
            <button
              type="button"
              onClick={handleAudio}
              aria-label="Listen audio"
              className={`p-1.5 rounded-full transition-colors ${
                isPlaying
                  ? 'bg-primary text-white scale-110'
                  : 'text-ink-3 hover:text-primary hover:bg-surface-2'
              }`}
            >
              <VolumeIcon size={16} />
            </button>
          )}
          {extraActions?.(bubble)}
        </div>
      </div>
    </div>
  )
}
