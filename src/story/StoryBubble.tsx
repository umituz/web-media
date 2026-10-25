import { useState, type ReactNode } from 'react'
import type { StoryBubble as StoryBubbleType, StoryWord } from './types'
import { VolumeIcon } from './icons'

export interface StoryBubbleProps {
  bubble: StoryBubbleType
  showTranslation?: boolean
  showRomanization?: boolean
  language?: 'english' | 'turkish' | 'both'
  onWordClick?: (word: StoryWord) => void
  onPlayAudio?: (text: string) => void
  className?: string
  extraActions?: (bubble: StoryBubbleType) => ReactNode
}

export function StoryBubble({
  bubble,
  showTranslation = true,
  showRomanization = true,
  language = 'english',
  onWordClick,
  onPlayAudio,
  className = '',
  extraActions,
}: StoryBubbleProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onPlayAudio) {
      setIsPlaying(true)
      onPlayAudio(bubble.text)
      setTimeout(() => setIsPlaying(false), 1500)
    }
  }

  const renderKoreanText = () => {
    if (!bubble.vocabulary || bubble.vocabulary.length === 0) {
      return <span>{bubble.text}</span>
    }

    const vocabMap = new Map<string, StoryWord>()
    for (const v of bubble.vocabulary) {
      vocabMap.set(v.word, v)
    }

    // Split text into tokens (keeping whitespace and punctuation)
    const tokens = bubble.text.split(/(\s+|[.,!?'"~]+)/)
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
            title={`${match.meaning}${match.romanization ? ` (${match.romanization})` : ''}`}
            className="inline-block px-1 py-0.5 mx-0.5 font-bold text-primary-strong bg-primary/10 hover:bg-primary/20 active:scale-95 rounded transition-all underline decoration-primary/40 underline-offset-4 cursor-pointer"
          >
            {token}
          </button>
        )
      }
      return <span key={idx}>{token}</span>
    })
  }

  const getBubbleShapeClasses = () => {
    switch (bubble.type) {
      case 'thought':
        return 'rounded-3xl border-dashed border-2 border-sky-300 bg-sky-50/90 text-slate-900 shadow-md'
      case 'narration':
        return 'rounded-xl border border-amber-300 bg-amber-50/95 text-slate-800 shadow-sm font-sans'
      case 'shout':
        return 'rounded-2xl border-2 border-red-500 bg-white text-slate-900 shadow-xl font-bold ring-4 ring-red-100'
      case 'dialogue':
      default:
        return 'rounded-2xl border border-line bg-white text-slate-900 shadow-lg'
    }
  }

  const renderTranslation = () => {
    if (!showTranslation) return null
    if (language === 'english' && bubble.meaning) {
      return <p className="text-xs text-slate-600 mt-1 italic">{bubble.meaning}</p>
    }
    if (language === 'turkish' && (bubble.turkish || bubble.meaning)) {
      return <p className="text-xs text-slate-600 mt-1 italic">{bubble.turkish || bubble.meaning}</p>
    }
    if (language === 'both') {
      return (
        <div className="mt-1 space-y-0.5 text-xs text-slate-600 italic">
          {bubble.meaning && <p className="text-slate-700">{bubble.meaning}</p>}
          {bubble.turkish && <p className="text-slate-500 text-[11px]">{bubble.turkish}</p>}
        </div>
      )
    }
    return null
  }

  return (
    <div className={`relative max-w-sm sm:max-w-md p-3.5 transition-all ${getBubbleShapeClasses()} ${className}`}>
      {/* Speaker header */}
      {bubble.speaker && (
        <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-black/5">
          {bubble.avatarUrl ? (
            <img src={bubble.avatarUrl} alt={bubble.speaker} className="w-5 h-5 rounded-full object-cover" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-primary" />
          )}
          <span className="text-xs font-bold text-slate-700 tracking-wide">{bubble.speaker}</span>
        </div>
      )}

      {/* Main Korean text with clickable words */}
      <div className="kr-text text-base sm:text-lg font-medium leading-relaxed tracking-wide text-slate-900">
        {renderKoreanText()}
      </div>

      {/* Romanization */}
      {showRomanization && bubble.romanization && (
        <p className="text-xs font-mono text-slate-500 mt-1 tracking-tight">{bubble.romanization}</p>
      )}

      {/* Translations */}
      {renderTranslation()}

      {/* Audio & Extra Actions */}
      <div className="flex items-center justify-end gap-1.5 mt-2 pt-1 border-t border-black/5">
        {extraActions && extraActions(bubble)}
        {onPlayAudio && (
          <button
            type="button"
            onClick={handleAudio}
            aria-label="Listen audio"
            className={`p-1.5 rounded-full text-slate-500 hover:text-primary hover:bg-slate-100 active:scale-95 transition-all ${
              isPlaying ? 'text-primary animate-pulse bg-primary/10' : ''
            }`}
          >
            <VolumeIcon size={15} />
          </button>
        )}
      </div>
    </div>
  )
}
