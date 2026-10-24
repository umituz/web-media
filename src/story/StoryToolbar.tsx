import type { StoryViewMode } from './types'
import { PageViewIcon, StripViewIcon } from './icons'

export interface StoryToolbarProps {
  currentSceneIndex: number
  totalScenes: number
  viewMode: StoryViewMode
  onViewModeChange: (mode: StoryViewMode) => void
  showTranslation: boolean
  onToggleTranslation: () => void
  showRomanization: boolean
  onToggleRomanization: () => void
  language: 'english' | 'turkish' | 'both'
  onLanguageChange?: (lang: 'english' | 'turkish' | 'both') => void
  title?: string
  className?: string
}

export function StoryToolbar({
  currentSceneIndex,
  totalScenes,
  viewMode,
  onViewModeChange,
  showTranslation,
  onToggleTranslation,
  showRomanization,
  onToggleRomanization,
  language,
  onLanguageChange,
  title,
  className = '',
}: StoryToolbarProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-line bg-surface/90 backdrop-blur-md shadow-sm ${className}`}
    >
      <div className="flex items-center gap-3">
        {title && <span className="text-sm font-bold text-ink truncate max-w-xs">{title}</span>}
        <span className="text-xs font-mono text-ink-3">
          {viewMode === 'page' ? (
            <>
              Scene <span className="font-semibold text-ink">{currentSceneIndex + 1}</span> / {totalScenes}
            </>
          ) : (
            `${totalScenes} Scenes`
          )}
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs">
        {/* View Mode Toggle */}
        <div className="flex items-center rounded-lg border border-line p-0.5 bg-surface-2">
          <button
            type="button"
            onClick={() => onViewModeChange('page')}
            title="Page-by-page mode"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              viewMode === 'page'
                ? 'bg-surface text-primary font-semibold shadow-xs'
                : 'text-ink-3 hover:text-ink'
            }`}
          >
            <PageViewIcon size={14} />
            <span>Page</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('strip')}
            title="Vertical story strip mode"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              viewMode === 'strip'
                ? 'bg-surface text-primary font-semibold shadow-xs'
                : 'text-ink-3 hover:text-ink'
            }`}
          >
            <StripViewIcon size={14} />
            <span>Strip</span>
          </button>
        </div>

        {/* Translation Toggle */}
        <div className="flex items-center rounded-lg border border-line bg-surface-2 overflow-hidden">
          <button
            type="button"
            onClick={onToggleTranslation}
            className={`px-2.5 py-1 font-medium transition-colors ${
              showTranslation
                ? 'bg-primary/10 text-primary-strong font-semibold'
                : 'text-ink-3 hover:text-ink'
            }`}
          >
            Translation
          </button>
          {showTranslation && onLanguageChange && (
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as 'english' | 'turkish' | 'both')}
              className="bg-transparent border-l border-line text-[11px] font-semibold text-ink px-1.5 py-1 focus:outline-none cursor-pointer"
            >
              <option value="english">EN</option>
              <option value="turkish">TR</option>
              <option value="both">EN + TR</option>
            </select>
          )}
        </div>

        {/* Romanization Toggle */}
        <button
          type="button"
          onClick={onToggleRomanization}
          className={`px-2.5 py-1 rounded-lg border border-line font-medium transition-colors ${
            showRomanization
              ? 'bg-primary/10 text-primary-strong border-primary/30 font-semibold'
              : 'bg-surface-2 text-ink-3 hover:text-ink'
          }`}
        >
          Romaja
        </button>
      </div>
    </div>
  )
}
