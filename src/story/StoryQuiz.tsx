import { useState } from 'react'
import type { StoryQuizQuestion } from './types'
import { CheckCircleIcon, SparklesIcon } from './icons'

export interface StoryQuizProps {
  questions: StoryQuizQuestion[]
  onComplete: (score: number, total: number) => void
  onRetry?: () => void
  title?: string
  subtitle?: string
  className?: string
}

export function StoryQuiz({
  questions,
  onComplete,
  onRetry,
  title = 'Story Comprehension Quiz',
  subtitle = 'Test your understanding of the dialogue and vocabulary from this story!',
  className = '',
}: StoryQuizProps) {
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
              {q.promptText && (
                <p className="kr-text text-sm font-medium text-primary-strong mb-3">
                  {q.promptText}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                {q.options.map((opt, optIdx) => {
                  let optStyle =
                    'border-line bg-surface hover:border-primary/50 text-ink hover:bg-primary/5'

                  if (selected === optIdx) {
                    optStyle = 'border-primary bg-primary/10 text-primary-strong font-semibold'
                  }

                  if (submitted) {
                    if (optIdx === q.correctIndex) {
                      optStyle = 'border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold'
                    } else if (selected === optIdx) {
                      optStyle = 'border-red-500 bg-red-500/15 text-red-800 dark:text-red-300 line-through'
                    } else {
                      optStyle = 'border-line/50 opacity-60 text-ink-3'
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      className={`text-left text-xs p-3 rounded-xl border transition-all ${optStyle}`}
                    >
                      <span className="inline-block w-5 font-mono text-ink-3">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      {opt}
                    </button>
                  )
                })}
              </div>

              {submitted && q.explanation && (
                <p className="text-xs text-ink-3 mt-3 pt-2.5 border-t border-line/60">
                  <span className="font-semibold text-ink">Explanation: </span>
                  {q.explanation}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-line flex items-center justify-between">
        {submitted ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm font-bold text-ink">
              <CheckCircleIcon size={18} className="text-emerald-500" />
              <span>
                Score: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
              </span>
            </div>
            {onRetry && (
              <button
                type="button"
                onClick={() => {
                  setAnswers({})
                  setSubmitted(false)
                  onRetry()
                }}
                className="text-xs font-semibold text-primary underline underline-offset-4 hover:text-primary-strong"
              >
                Try Again
              </button>
            )}
          </div>
        ) : (
          <div className="text-xs text-ink-3">
            {Object.keys(answers).length} / {questions.length} answered
          </div>
        )}

        {!submitted && (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={handleSubmit}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              allAnswered
                ? 'bg-primary text-white hover:bg-primary-strong active:scale-95 shadow-md shadow-primary/20'
                : 'bg-surface-2 text-ink-3 border border-line cursor-not-allowed opacity-50'
            }`}
          >
            Check Answers
          </button>
        )}
      </div>
    </div>
  )
}
