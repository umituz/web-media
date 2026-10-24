import type { ComicViewMode } from './types'
import { PageViewIcon, StripViewIcon } from './icons'

export interface ComicToolbarProps {
  currentPanelIndex: number
  totalPanels: number
  viewMode: ComicViewMode
  onViewModeChange: (mode: ComicViewMode) => void
  showTranslation: boolean
  onToggleTranslation: () => void
  showRomanization: boolean
  onToggleRomanization: () => void
  language: 'english' | 'turkish' | 'both'
  onLanguageChange?: (lang: 'english' | 'turkish' | 'both') => void
  title?: string
  className?: string
}

export function ComicToolbar({
  currentPanelIndex,
  totalPanels,
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
}: ComicToolbarProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-line bg-surface/90 backdrop-blur-md shadow-sm ${className}`}
    >
      <div className="flex items-center gap-3">
        {title && <span className="text-sm font-bold text-ink truncate max-w-xs">{title}</span>}
        <span className="text-xs font-mono text-ink-3">
          {viewMode === 'page' ? (
            <>
              Panel <span className="font-semibold text-ink">{currentPanelIndex + 1}</span> / {totalPanels}
            </>
          ) : (
            `${totalPanels} Panels`
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
            <span className="hidden sm:inline">Page</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('strip')}
            title="Vertical webtoon strip mode"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              viewMode === 'strip'
                ? 'bg-surface text-primary font-semibold shadow-xs'
                : 'text-ink-3 hover:text-ink'
            }`}
          >
            <StripViewIcon size={14} />
            <span className="hidden sm:inline">Strip</span>
          </button>
        </div>

        {/* Translation Toggle */}
        <button
          type="button"
          onClick={onToggleTranslation}
          className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
            showTranslation
              ? 'border-primary/40 bg-primary-tint text-primary-strong'
              : 'border-line bg-surface text-ink-3 hover:text-ink'
          }`}
        >
          Translation
        </button>

        {/* Language selector if translations active */}
        {showTranslation && onLanguageChange && (
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as 'english' | 'turkish' | 'both')}
            className="rounded-md border border-line bg-surface px-2 py-1 text-xs text-ink focus:outline-none"
          >
            <option value="english">EN</option>
            <option value="turkish">TR</option>
            <option value="both">EN + TR</option>
          </select>
        )}

        {/* Romanization Toggle */}
        <button
          type="button"
          onClick={onToggleRomanization}
          className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
            showRomanization
              ? 'border-celadon/40 bg-celadon/10 text-celadon'
              : 'border-line bg-surface text-ink-3 hover:text-ink'
          }`}
        >
          Romaja
        </button>
      </div>
    </div>
  )
}
