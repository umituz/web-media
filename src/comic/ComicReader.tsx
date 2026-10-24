import { useEffect, useState, type ReactNode } from 'react'
import type { ComicEpisode, ComicPanel, ComicViewMode, ComicWord, ComicBubble as ComicBubbleType } from './types'
import { ComicBubble } from './ComicBubble'
import { ComicSfxBadge } from './ComicSfxBadge'
import { ComicToolbar } from './ComicToolbar'
import { ComicQuiz } from './ComicQuiz'
import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from './icons'

export interface ComicReaderProps {
  episode: ComicEpisode
  initialViewMode?: ComicViewMode
  initialShowTranslation?: boolean
  initialShowRomanization?: boolean
  language?: 'english' | 'turkish' | 'both'
  onWordClick?: (word: ComicWord) => void
  onPlaySpeech?: (text: string) => void
  onEpisodeComplete?: (score?: number, total?: number) => void
  extraBubbleActions?: (bubble: ComicBubbleType) => ReactNode
  className?: string
}

export function ComicReader({
  episode,
  initialViewMode = 'page',
  initialShowTranslation = true,
  initialShowRomanization = true,
  language = 'english',
  onWordClick,
  onPlaySpeech,
  onEpisodeComplete,
  extraBubbleActions,
  className = '',
}: ComicReaderProps) {
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0)
  const [viewMode, setViewMode] = useState<ComicViewMode>(initialViewMode)
  const [showTranslation, setShowTranslation] = useState(initialShowTranslation)
  const [showRomanization, setShowRomanization] = useState(initialShowRomanization)
  const [currentLanguage, setCurrentLanguage] = useState<'english' | 'turkish' | 'both'>(language)
  const [showQuiz, setShowQuiz] = useState(false)

  const panels = episode.panels || []
  const totalPanels = panels.length
  const currentPanel: ComicPanel | undefined = panels[currentPanelIndex]

  // Keyboard navigation for page mode
  useEffect(() => {
    if (viewMode !== 'page') return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [viewMode, currentPanelIndex, totalPanels, showQuiz])

  const handleNext = () => {
    if (currentPanelIndex < totalPanels - 1) {
      setCurrentPanelIndex((prev) => prev + 1)
    } else if (episode.quiz && episode.quiz.length > 0) {
      setShowQuiz(true)
    } else {
      onEpisodeComplete?.()
    }
  }

  const handlePrev = () => {
    if (showQuiz) {
      setShowQuiz(false)
    } else if (currentPanelIndex > 0) {
      setCurrentPanelIndex((prev) => prev - 1)
    }
  }

  const renderPanelCard = (panel: ComicPanel, index: number) => {
    return (
      <div
        key={panel.id}
        className="overflow-hidden rounded-2xl border-2 border-line bg-surface shadow-md transition-all"
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-line/60 bg-surface-2/60 px-4 py-2 text-xs">
          <span className="font-semibold text-ink-2">Scene {index + 1}</span>
          {panel.narration && (
            <span className="text-ink-3 italic truncate max-w-xs">{panel.narration}</span>
          )}
        </div>

        {/* Panel Visual / Artwork */}
        <div className="relative min-h-[260px] sm:min-h-[340px] bg-gradient-to-b from-surface-2 to-surface flex flex-col items-center justify-center p-4">
          {panel.imageUrl ? (
            <img
              src={panel.imageUrl}
              alt={panel.altText || `Scene ${index + 1}`}
              className="max-h-[380px] w-full object-contain rounded-xl shadow-xs"
            />
          ) : panel.backgroundSvg ? (
            <div
              className="w-full flex items-center justify-center py-2"
              dangerouslySetInnerHTML={{ __html: panel.backgroundSvg }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-ink-3">
              <SparklesIcon size={32} className="text-primary/40 mb-2" />
              <p className="text-sm font-medium">Panel {index + 1}</p>
            </div>
          )}

          {/* SFX Badges in Artwork */}
          {panel.sfx && panel.sfx.length > 0 && (
            <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-10">
              {panel.sfx.map((s) => (
                <ComicSfxBadge key={s.id} sfx={s} />
              ))}
            </div>
          )}
        </div>

        {/* Dialogue / Speech Bubbles Section */}
        <div className="space-y-3 p-4 bg-surface border-t border-line/70">
          {panel.bubbles.map((b) => (
            <ComicBubble
              key={b.id}
              bubble={b}
              showTranslation={showTranslation}
              showRomanization={showRomanization}
              language={currentLanguage}
              onWordClick={onWordClick}
              onPlayAudio={onPlaySpeech}
              extraActions={extraBubbleActions}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top Toolbar */}
      <ComicToolbar
        currentPanelIndex={currentPanelIndex}
        totalPanels={totalPanels}
        viewMode={viewMode}
        onViewModeChange={(mode) => {
          setViewMode(mode)
          setShowQuiz(false)
        }}
        showTranslation={showTranslation}
        onToggleTranslation={() => setShowTranslation((prev) => !prev)}
        showRomanization={showRomanization}
        onToggleRomanization={() => setShowRomanization((prev) => !prev)}
        language={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        title={episode.koreanTitle ? `${episode.koreanTitle} (${episode.title})` : episode.title}
      />

      {/* Mode 1: Page-by-Page View */}
      {viewMode === 'page' && (
        <div className="space-y-4">
          {showQuiz && episode.quiz && episode.quiz.length > 0 ? (
            <ComicQuiz
              questions={episode.quiz}
              onComplete={(score, total) => {
                onEpisodeComplete?.(score, total)
              }}
              onRetry={() => {
                setCurrentPanelIndex(0)
                setShowQuiz(false)
              }}
            />
          ) : currentPanel ? (
            renderPanelCard(currentPanel, currentPanelIndex)
          ) : null}

          {/* Bottom Navigation Controls for Page Mode */}
          <div className="flex items-center justify-between gap-4 py-2">
            <button
              type="button"
              disabled={currentPanelIndex === 0 && !showQuiz}
              onClick={handlePrev}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border border-line text-xs sm:text-sm font-semibold transition-all ${
                currentPanelIndex === 0 && !showQuiz
                  ? 'opacity-40 cursor-not-allowed bg-surface-2 text-ink-3'
                  : 'bg-surface text-ink hover:bg-surface-2 cursor-pointer shadow-xs'
              }`}
            >
              <ChevronLeftIcon size={16} />
              <span>Previous</span>
            </button>

            {/* Visual Progress Bar */}
            <div className="flex-1 max-w-xs hidden sm:block">
              <div className="w-full bg-surface-2 rounded-full h-2 overflow-hidden border border-line">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{
                    width: `${Math.round(((showQuiz ? totalPanels : currentPanelIndex + 1) / totalPanels) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold shadow-sm hover:bg-primary-strong transition-all cursor-pointer"
            >
              <span>
                {currentPanelIndex < totalPanels - 1
                  ? 'Next'
                  : episode.quiz && !showQuiz
                    ? 'Start Quiz'
                    : 'Finish'}
              </span>
              <ChevronRightIcon size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Vertical Strip Webtoon View */}
      {viewMode === 'strip' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {panels.map((panel, idx) => renderPanelCard(panel, idx))}

          {/* End of Episode Quiz in Strip Mode */}
          {episode.quiz && episode.quiz.length > 0 && (
            <div className="mt-8 pt-4">
              <ComicQuiz
                questions={episode.quiz}
                onComplete={(score, total) => {
                  onEpisodeComplete?.(score, total)
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
