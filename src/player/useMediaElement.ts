import { useCallback, useEffect, useRef, useState } from 'react'

export const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 2] as const

const POSITION_REPORT_STEP = 5

export interface UseMediaElementOptions {
  src: string
  autoPlay?: boolean
  initialPosition?: number
  onPositionChange?: (positionSec: number, durationSec: number) => void
  onPlayStateChange?: (playing: boolean) => void
  onRateChange?: (rate: number) => void
  onEnded?: () => void
}

export function useMediaElement<T extends HTMLMediaElement>(options: UseMediaElementOptions) {
  const { src } = options
  const ref = useRef<T | null>(null)
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const [rate, setRate] = useState(1)
  const [volume, setVolumeState] = useState(1)
  const [muted, setMutedState] = useState(false)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(false)
  const initialAppliedRef = useRef(false)
  const reportedRef = useRef(0)
  const optionsRef = useRef(options)
  optionsRef.current = options

  const reportPosition = useCallback(() => {
    const el = ref.current
    if (!el || !Number.isFinite(el.currentTime)) return
    reportedRef.current = el.currentTime
    const total = Number.isFinite(el.duration) ? el.duration : 0
    optionsRef.current.onPositionChange?.(el.currentTime, total)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onLoadedMetadata = () => {
      const init = optionsRef.current.initialPosition ?? 0
      const total = Number.isFinite(el.duration) ? el.duration : 0
      setDuration(total)
      if (!initialAppliedRef.current && init > 0 && init < total - 5) el.currentTime = init
      initialAppliedRef.current = true
      setReady(true)
      if (optionsRef.current.autoPlay) el.play().catch(() => {})
    }
    const onTimeUpdate = () => {
      setPosition(el.currentTime)
      if (el.currentTime - reportedRef.current >= POSITION_REPORT_STEP) reportPosition()
    }
    const onPlay = () => {
      setPlaying(true)
      optionsRef.current.onPlayStateChange?.(true)
    }
    const onPause = () => {
      setPlaying(false)
      optionsRef.current.onPlayStateChange?.(false)
      reportPosition()
    }
    const onEnded = () => {
      setPlaying(false)
      reportPosition()
      optionsRef.current.onEnded?.()
    }
    const onRateChange = () => {
      setRate(el.playbackRate)
      optionsRef.current.onRateChange?.(el.playbackRate)
    }
    const onVolumeChange = () => {
      setVolumeState(el.volume)
      setMutedState(el.muted)
    }
    const onError = () => setError(true)
    el.addEventListener('loadedmetadata', onLoadedMetadata)
    el.addEventListener('timeupdate', onTimeUpdate)
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    el.addEventListener('ended', onEnded)
    el.addEventListener('ratechange', onRateChange)
    el.addEventListener('volumechange', onVolumeChange)
    el.addEventListener('error', onError)
    window.addEventListener('pagehide', reportPosition)
    return () => {
      el.removeEventListener('loadedmetadata', onLoadedMetadata)
      el.removeEventListener('timeupdate', onTimeUpdate)
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
      el.removeEventListener('ended', onEnded)
      el.removeEventListener('ratechange', onRateChange)
      el.removeEventListener('volumechange', onVolumeChange)
      el.removeEventListener('error', onError)
      window.removeEventListener('pagehide', reportPosition)
    }
  }, [reportPosition])

  useEffect(() => {
    initialAppliedRef.current = false
    reportedRef.current = 0
    setPosition(0)
    setPlaying(false)
    setReady(false)
    setError(false)
  }, [src])

  const play = useCallback(() => {
    ref.current?.play().catch(() => {})
  }, [])

  const pause = useCallback(() => {
    ref.current?.pause()
  }, [])

  const toggle = useCallback(() => {
    const el = ref.current
    if (!el) return
    if (el.paused) el.play().catch(() => {})
    else el.pause()
  }, [])

  const seek = useCallback(
    (sec: number) => {
      const el = ref.current
      if (!el || !Number.isFinite(el.duration) || el.duration <= 0) return
      const next = Math.min(Math.max(sec, 0), el.duration)
      el.currentTime = next
      setPosition(next)
      reportPosition()
    },
    [reportPosition],
  )

  const skip = useCallback(
    (delta: number) => {
      const el = ref.current
      if (!el) return
      seek(el.currentTime + delta)
    },
    [seek],
  )

  const setPlaybackRate = useCallback((value: number) => {
    const el = ref.current
    if (el) el.playbackRate = value
  }, [])

  const setVolume = useCallback((value: number) => {
    const el = ref.current
    if (!el) return
    el.volume = Math.min(Math.max(value, 0), 1)
    if (el.volume > 0) el.muted = false
  }, [])

  const toggleMute = useCallback(() => {
    const el = ref.current
    if (el) el.muted = !el.muted
  }, [])

  return {
    ref,
    playing,
    position,
    duration,
    rate,
    volume,
    muted,
    ready,
    error,
    play,
    pause,
    toggle,
    seek,
    skip,
    setPlaybackRate,
    setVolume,
    toggleMute,
    reportPosition,
  }
}
