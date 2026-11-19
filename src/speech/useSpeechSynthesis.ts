import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export interface SpeakOptions {
  rate?: number
  pitch?: number
  volume?: number
  lang?: string
  onEnd?: () => void
}

export interface SpeechSynthesisInstance {
  available: boolean
  speaking: boolean
  speak: (text: string, options?: SpeakOptions | (() => void)) => void
  stop: () => void
}

const DEFAULT_RATE = 0.9
const DEFAULT_SPEECH_LOCALE = 'en-US'
const SAME_TEXT_WINDOW_MS = 400

const PREMIUM_NAME = /google|premium|enhanced|natural|neural/i

function localePrefix(locale: string): string {
  return (locale.split('-')[0] ?? locale).toLowerCase()
}

function scoreVoice(voice: SpeechSynthesisVoice, prefix: string): number {
  let score = 0
  if (PREMIUM_NAME.test(voice.name)) score += 4
  if (!voice.localService) score += 2
  const normalized = voice.lang.replace('_', '-').toLowerCase()
  if (normalized.startsWith(prefix)) score += 2
  return score
}

function pickBestVoice(voices: SpeechSynthesisVoice[], prefix: string): SpeechSynthesisVoice | null {
  const matches = voices.filter((entry) =>
    entry.lang.replace('_', '-').toLowerCase().startsWith(prefix),
  )
  if (matches.length === 0) return null
  return matches.reduce((best, current) =>
    scoreVoice(current, prefix) > scoreVoice(best, prefix) ? current : best,
  )
}

let sharedVoices = new Map<string, SpeechSynthesisVoice | null>()
let voiceRevision = 0

function refreshVoiceCache(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const available = window.speechSynthesis.getVoices()
  if (available.length === 0) return
  const next = new Map<string, SpeechSynthesisVoice | null>()
  for (const voice of available) {
    const prefix = localePrefix(voice.lang)
    if (!next.has(prefix)) {
      next.set(prefix, pickBestVoice(available, prefix))
    }
  }
  sharedVoices = next
  voiceRevision++
}

export function useSpeechSynthesis(defaultLocale: string = DEFAULT_SPEECH_LOCALE): SpeechSynthesisInstance {
  const [speaking, setSpeaking] = useState(false)
  const [revision, setRevision] = useState(voiceRevision)
  const lastSpokenRef = useRef<{ text: string; time: number }>({ text: '', time: 0 })
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const available = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => {
    if (!available) return
    refreshVoiceCache()
    const handleVoicesChanged = () => {
      refreshVoiceCache()
      setRevision(voiceRevision)
    }
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged)
    }
  }, [available])

  const voice = useMemo(() => {
    if (!available) return null
    void revision
    const prefix = localePrefix(defaultLocale)
    if (sharedVoices.has(prefix)) return sharedVoices.get(prefix) ?? null
    const voices = window.speechSynthesis.getVoices()
    const chosen = pickBestVoice(voices, prefix)
    sharedVoices.set(prefix, chosen)
    return chosen
  }, [available, defaultLocale, revision])

  const stop = useCallback(() => {
    if (!available) return
    window.speechSynthesis.cancel()
    activeUtteranceRef.current = null
    setSpeaking(false)
  }, [available])

  const speak = useCallback(
    (text: string, options?: SpeakOptions | (() => void)) => {
      if (!available) return
      const trimmed = text.trim()
      if (!trimmed) return

      const now = Date.now()
      if (
        lastSpokenRef.current.text === trimmed &&
        now - lastSpokenRef.current.time < SAME_TEXT_WINDOW_MS
      ) {
        return
      }
      lastSpokenRef.current = { text: trimmed, time: now }

      const opts: SpeakOptions = typeof options === 'function' ? { onEnd: options } : options ?? {}
      const targetLang = opts.lang ?? defaultLocale
      const targetRate = opts.rate ?? DEFAULT_RATE
      const targetPitch = opts.pitch ?? 1
      const targetVolume = opts.volume ?? 1

      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(trimmed)
      utterance.rate = targetRate
      utterance.pitch = targetPitch
      utterance.volume = targetVolume
      utterance.lang = targetLang

      const targetVoice =
        targetLang === defaultLocale
          ? voice
          : pickBestVoice(window.speechSynthesis.getVoices(), localePrefix(targetLang))
      if (targetVoice) utterance.voice = targetVoice

      utterance.onstart = () => setSpeaking(true)
      utterance.onend = () => {
        setSpeaking(false)
        activeUtteranceRef.current = null
        opts.onEnd?.()
      }
      utterance.onerror = () => {
        setSpeaking(false)
        activeUtteranceRef.current = null
      }

      activeUtteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    [available, defaultLocale, voice],
  )

  useEffect(() => () => stop(), [stop])

  return {
    available,
    speaking,
    speak,
    stop,
  }
}
