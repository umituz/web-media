import { useEffect, useState, type ReactNode } from 'react'
import type { StoryEpisode, StoryGloss, StoryScene, StoryViewMode, StoryWord, StoryBubble as StoryBubbleType } from './types'
import type { StoryGlossLabels } from './StoryToolbar'
import { StoryBubble } from './StoryBubble'
import { StoryEffectBadge } from './StoryEffectBadge'
import { StoryToolbar } from './StoryToolbar'
import { StoryQuiz } from './StoryQuiz'
import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from './icons'

export interface StoryReaderProps {
  episode: StoryEpisode
  initialViewMode?: StoryViewMode
  initialShowTranslation?: boolean
  initialShowRomanization?: boolean
  gloss?: StoryGloss
  glossLabels?: Partial<StoryGlossLabels>
  onWordClick?: (word: StoryWord) => void
  onPlaySpeech?: (text: string) => void
  onEpisodeComplete?: (score?: number, total?: number) => void
  extraBubbleActions?: (bubble: StoryBubbleType) => ReactNode
  className?: string
}

export function StoryReader({
  episode,
  initialViewMode = 'page',
  initialShowTranslation = true,
  initialShowRomanization = true,
  gloss = 'primary',
  glossLabels,
  onWordClick,
  onPlaySpeech,
  onEpisodeComplete,
  extraBubbleActions,
  className = '',
}: StoryReaderProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [viewMode, setViewMode] = useState<StoryViewMode>(initialViewMode)
  const [showTranslation, setShowTranslation] = useState(initialShowTranslation)
  const [showRomanization, setShowRomanization] = useState(initialShowRomanization)
  const [currentGloss, setCurrentGloss] = useState<StoryGloss>(gloss)
  const [showQuiz, setShowQuiz] = useState(false)

  const scenes = episode.scenes || []
  const totalScenes = scenes.length
  const currentScene: StoryScene | undefined = scenes[currentSceneIndex]

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
  }, [viewMode, currentSceneIndex, totalScenes, showQuiz])

  const handleNext = () => {
    if (currentSceneIndex < totalScenes - 1) {
      setCurrentSceneIndex((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (episode.quiz && episode.quiz.length > 0 && !showQuiz) {
      setShowQuiz(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      onEpisodeComplete?.()
    }
  }

  const handlePrev = () => {
    if (showQuiz) {
      setShowQuiz(false)
    } else if (currentSceneIndex > 0) {
      setCurrentSceneIndex((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const renderSceneContent = (scene: StoryScene, index: number) => {
    const effects = scene.effects || []

    return (
      <div
        key={scene.id || index}
        className="relative w-full overflow-hidden rounded-2xl border border-line bg-slate-900 shadow-xl"
      >
        <div className="relative min-h-[380px] sm:min-h-[460px] md:min-h-[520px] w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {scene.imageUrl ? (
            <img
              src={scene.imageUrl}
              alt={scene.altText || `Scene ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            />
          ) : scene.backgroundSvg ? (
            <div
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
              dangerouslySetInnerHTML={{ __html: scene.backgroundSvg }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-950/80" />
          )}

          {scene.narration && (
            <div className="absolute top-4 inset-x-4 sm:inset-x-8 z-10 mx-auto max-w-xl">
              <div className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs sm:text-sm font-medium text-center shadow-lg">
                {scene.narration}
              </div>
            </div>
          )}

          {effects.length > 0 && (
            <div className="absolute top-16 right-4 sm:right-8 z-20 flex flex-col gap-2 items-end">
              {effects.map((fx) => (
                <StoryEffectBadge key={fx.id} effect={fx} />
              ))}
            </div>
          )}

          <div className="relative z-20 w-full max-w-2xl flex flex-col gap-4 items-center justify-center pt-10 pb-6">
            {scene.bubbles.map((bubble) => (
              <StoryBubble
                key={bubble.id}
                bubble={bubble}
                showTranslation={showTranslation}
                showRomanization={showRomanization}
                gloss={currentGloss}
                onWordClick={onWordClick}
                onPlayAudio={onPlaySpeech}
                extraActions={extraBubbleActions}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 max-w-3xl mx-auto ${className}`}>
      <StoryToolbar
        currentSceneIndex={currentSceneIndex}
        totalScenes={totalScenes}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showTranslation={showTranslation}
        onToggleTranslation={() => setShowTranslation((prev) => !prev)}
        showRomanization={showRomanization}
        onToggleRomanization={() => setShowRomanization((prev) => !prev)}
        gloss={currentGloss}
        onGlossChange={setCurrentGloss}
        glossLabels={glossLabels}
        title={episode.title}
      />

      {viewMode === 'page' ? (
        <div className="space-y-4">
          {showQuiz && episode.quiz ? (
            <StoryQuiz
              questions={episode.quiz}
              onComplete={(score, total) => onEpisodeComplete?.(score, total)}
              onRetry={() => setShowQuiz(false)}
            />
          ) : currentScene ? (
            renderSceneContent(currentScene, currentSceneIndex)
          ) : null}

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentSceneIndex === 0 && !showQuiz}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-line bg-surface text-ink text-xs font-semibold hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeftIcon size={16} />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] py-1">
              {scenes.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setShowQuiz(false)
                    setCurrentSceneIndex(idx)
                  }}
                  aria-label={`Go to scene ${idx + 1}`}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    !showQuiz && currentSceneIndex === idx
                      ? 'w-6 bg-primary'
                      : 'bg-line hover:bg-ink-3/40'
                  }`}
                />
              ))}
              {episode.quiz && (
                <button
                  type="button"
                  onClick={() => setShowQuiz(true)}
                  aria-label="Go to quiz"
                  className={`w-2.5 h-2.5 rounded-full transition-all flex items-center justify-center ${
                    showQuiz ? 'w-6 bg-amber-500' : 'bg-line hover:bg-amber-400'
                  }`}
                />
              )}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-strong active:scale-95 shadow-md shadow-primary/20 transition-all"
            >
              <span>
                {currentSceneIndex < totalScenes - 1
                  ? 'Next'
                  : episode.quiz && !showQuiz
                  ? 'Start Quiz'
                  : 'Finish'}
              </span>
              <ChevronRightIcon size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {scenes.map((scene, idx) => renderSceneContent(scene, idx))}

          {episode.quiz && (
            <div className="pt-6">
              <StoryQuiz
                questions={episode.quiz}
                onComplete={(score, total) => onEpisodeComplete?.(score, total)}
              />
            </div>
          )}

          <div className="flex justify-center pt-4 pb-12">
            <button
              type="button"
              onClick={() => onEpisodeComplete?.()}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white text-sm font-bold hover:bg-primary-strong active:scale-95 shadow-xl shadow-primary/30 transition-all"
            >
              <SparklesIcon size={18} />
              <span>Complete Story Episode</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
