import { useState } from 'react'
import type { StoryEffect } from './types'

export interface StoryEffectBadgeProps {
  effect?: StoryEffect
  /** @deprecated alias for effect */
  sfx?: StoryEffect
  className?: string
}

export function StoryEffectBadge({ effect, sfx, className = '' }: StoryEffectBadgeProps) {
  const item = effect || sfx
  const [showTooltip, setShowTooltip] = useState(false)

  if (!item) return null

  const getVariantStyles = () => {
    switch (item.variant) {
      case 'impact':
        return 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-red-200/50'
      case 'emotion':
        return 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-pink-200/50'
      case 'motion':
        return 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-cyan-200/50'
      case 'ambient':
      default:
        return 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-amber-200/50'
    }
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip((prev) => !prev)}
        aria-label={`Sound Effect: ${item.korean} - ${item.meaning}`}
        className={`px-2 py-0.5 rounded-full text-xs font-black tracking-wider shadow-sm uppercase transform hover:scale-105 active:scale-95 transition-all cursor-help border border-white/20 select-none ${getVariantStyles()}`}
      >
        {item.korean}
      </button>

      {showTooltip && (
        <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] shadow-lg whitespace-nowrap animate-in fade-in zoom-in-95 pointer-events-none">
          <p className="font-semibold text-amber-300">{item.romanization}</p>
          <p className="text-slate-200">{item.meaning}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  )
}
