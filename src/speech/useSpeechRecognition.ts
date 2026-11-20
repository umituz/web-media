import { useCallback, useEffect, useRef, useState } from 'react'

export interface SpeechRecognitionAlternative {
  transcript: string
}

export interface SpeechRecognitionResultItem {
  0: SpeechRecognitionAlternative
  isFinal: boolean
  length: number
}

export interface SpeechRecognitionEventLike {
  resultIndex: number
  results: { length: number; [index: number]: SpeechRecognitionResultItem }
}

export interface SpeechRecognitionErrorEventLike {
  error: string
}

export interface SpeechRecognitionLike {
  lang: string
  interimResults: boolean
  continuous: boolean
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
  onend: (() => void) | null
}

export type SpeechRecognitionCtor = new () => SpeechRecognitionLike

export function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const scope = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition ?? null
}

export type SpeechRecognitionError =
  | 'not-supported'
  | 'no-speech'
  | 'aborted'
  | 'network'
  | 'not-allowed'
  | 'audio-capture'

export interface SpeechRecognitionOptions {
  lang?: string
  continuous?: boolean
  interimResults?: boolean
  onFinal?: (text: string) => void
}

export interface SpeechRecognitionState {
  available: boolean
  listening: boolean
  transcript: string | null
  interim: string
  error: SpeechRecognitionError | null
  start: () => void
  stop: () => void
  reset: () => void
}

const ERROR_CODES = {
  'no-speech': 'no-speech',
  aborted: 'aborted',
  network: 'network',
  'not-allowed': 'not-allowed',
  'audio-capture': 'audio-capture',
  'service-not-allowed': 'not-allowed',
  'bad-grammar': 'aborted',
  'language-not-supported': 'not-supported',
} as const satisfies Record<string, SpeechRecognitionError>

type SpeechApiErrorCode = keyof typeof ERROR_CODES

const FATAL_ERRORS = new Set<SpeechApiErrorCode>(['not-allowed', 'audio-capture', 'service-not-allowed'])

export function useSpeechRecognition(
  options?: SpeechRecognitionOptions | string,
): SpeechRecognitionState {
  const resolvedOptions: SpeechRecognitionOptions =
    typeof options === 'string' ? { lang: options } : options ?? {}
  const lang = resolvedOptions.lang ?? 'en-US'
  const [available] = useState(() => getSpeechRecognitionCtor() !== null)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState<string | null>(null)
  const [interim, setInterim] = useState('')
  const [error, setError] = useState<SpeechRecognitionError | null>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const keepListeningRef = useRef(false)
  const optionsRef = useRef<SpeechRecognitionOptions>(resolvedOptions)
  useEffect(() => {
    optionsRef.current = resolvedOptions
  })

  useEffect(
    () => () => {
      keepListeningRef.current = false
      recognitionRef.current?.abort()
      recognitionRef.current = null
    },
    [],
  )

  const start = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) {
      setError('not-supported')
      return
    }
    recognitionRef.current?.abort()
    setTranscript(null)
    setInterim('')
    setError(null)
    const recognition = new Ctor()
    const continuous = optionsRef.current?.continuous ?? false
    recognition.lang = optionsRef.current?.lang ?? lang
    recognition.interimResults = optionsRef.current?.interimResults ?? false
    recognition.continuous = continuous
    recognition.maxAlternatives = 1
    recognition.onresult = (event) => {
      if (continuous) {
        let finalText = ''
        let interimText = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          const text = result?.[0]?.transcript ?? ''
          if (!result || !text) continue
          if (result.isFinal) finalText += text
          else interimText += text
        }
        if (finalText) {
          setTranscript((prev) => (prev ? `${prev} ${finalText}` : finalText))
          setInterim('')
          optionsRef.current?.onFinal?.(finalText)
        } else {
          setInterim(interimText)
        }
        return
      }

      const match = event.results[0]?.[0]?.transcript
      if (match) {
        setTranscript(match)
        setInterim('')
      }
    }
    recognition.onerror = (event) => {
      const code = (event.error ?? '') as SpeechApiErrorCode
      if (FATAL_ERRORS.has(code)) {
        keepListeningRef.current = false
      }
      setError(ERROR_CODES[code] ?? 'aborted')
    }
    recognition.onend = () => {
      if (continuous && keepListeningRef.current) {
        try {
          recognition.start()
          return
        } catch {
          keepListeningRef.current = false
        }
      }
      setListening(false)
    }
    try {
      recognition.start()
      recognitionRef.current = recognition
      keepListeningRef.current = continuous
      setListening(true)
    } catch {
      setError('aborted')
      setListening(false)
    }
  }, [lang])

  const stop = useCallback(() => {
    keepListeningRef.current = false
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  const reset = useCallback(() => {
    keepListeningRef.current = false
    recognitionRef.current?.abort()
    recognitionRef.current = null
    setTranscript(null)
    setInterim('')
    setError(null)
    setListening(false)
  }, [])

  return {
    available,
    listening,
    transcript,
    interim,
    error,
    start,
    stop,
    reset,
  }
}
