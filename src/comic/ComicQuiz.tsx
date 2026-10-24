import { useState } from 'react'
import type { ComicQuizQuestion } from './types'
import { CheckCircleIcon, SparklesIcon } from './icons'

export interface ComicQuizProps {
  questions: ComicQuizQuestion[]
  onComplete: (score: number, total: number) => void
  onRetry?: () => void
  title?: string
  subtitle?: string
  className?: string
}

export function ComicQuiz({
  questions,
  onComplete,
  onRetry,
  title = 'Episode Comprehension Quiz',
  subtitle = 'Test your understanding of the dialogue and vocabulary from this scene!',
  className = '',
}: ComicQuizProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))
  }

  const score = questions.reduce((acc, q, idx) => {
    return acc + (answers[idx] === q.correctIndex ? 1 : 0)
  }, 0)

  const handleSubmit = () => {
    setSubmitted(true)
    onComplete(score, questions.length)
  }

  const allAnswered = questions.length > 0 && Object.keys(answers).length === questions.length

  return (
    <div className={`p-6 rounded-2xl border border-line bg-surface shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-1">
        <SparklesIcon size={20} className="text-amber-500" />
        <h3 className="text-lg font-bold text-ink">{title}</h3>
      </div>
      <p className="text-xs text-ink-3 mb-6">{subtitle}</p>

      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const selected = answers[qIdx]

          return (
            <div key={q.id} className="p-4 rounded-xl border border-line/70 bg-surface-2/40">
              <p className="text-sm font-semibold text-ink mb-1">
                {qIdx + 1}. {q.prompt}
              </p>
              {q.koreanPrompt && (
                <p className="kr-text text-sm font-medium text-primary-strong mb-3">
                  {q.koreanPrompt}
                </p>
              )}

              <div className="space-y-2 mt-2">
                {q.options.map((opt, optIdx) => {
                  let optStyle = 'border-line bg-surface text-ink hover:border-primary/40'
                  if (selected === optIdx) {
                    optStyle = 'border-primary bg-primary-tint text-primary-strong font-semibold'
                  }
                  if (submitted) {
                    if (optIdx === q.correctIndex) {
                      optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold'
                    } else if (selected === optIdx) {
                      optStyle = 'border-rose-500 bg-rose-50 text-rose-800 line-through'
                    } else {
                      optStyle = 'opacity-50 border-line bg-surface text-ink-3'
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border text-left text-xs sm:text-sm transition-all ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {submitted && optIdx === q.correctIndex && (
                        <CheckCircleIcon size={16} className="text-emerald-600 shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>

              {submitted && q.explanation && (
                <p className="mt-3 text-xs text-ink-2 bg-surface p-2.5 rounded-md border border-line/60">
                  💡 <span className="font-semibold">Explanation:</span> {q.explanation}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
        {submitted ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-ink">
              Score: <span className="text-primary">{score}</span> / {questions.length}
            </span>
            {onRetry && (
              <button
                type="button"
                onClick={() => {
                  setAnswers({})
                  setSubmitted(false)
                  onRetry()
                }}
                className="px-3 py-1.5 rounded-lg border border-line text-xs font-semibold text-ink-2 hover:bg-surface-2"
              >
                Try Again
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={handleSubmit}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-sm ${
              allAnswered
                ? 'bg-primary hover:bg-primary-strong cursor-pointer'
                : 'bg-ink-3/40 cursor-not-allowed opacity-60'
            }`}
          >
            Check Answers
          </button>
        )}
      </div>
    </div>
  )
}
