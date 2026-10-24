import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { MediaPlayerProps, SubtitleTrack, TranscriptSegment } from '../types'
import { PLAYBACK_RATES, useMediaElement } from './useMediaElement'
import { formatTime } from './AudioPlayer'
import { Back10Icon, Forward10Icon, MaximizeIcon, MinimizeIcon, PauseIcon, PlayIcon, VolumeIcon, VolumeXIcon } from './icons'

export interface VideoPlayerProps extends MediaPlayerProps {
  segments?: TranscriptSegment[]
  subtitle?: SubtitleTrack
  onSubtitleChange?: (track: SubtitleTrack) => void
  className?: string
}

const SUBTITLE_LABELS: Record<SubtitleTrack, string> = {
  korean: 'KR',
  english: 'EN',
  turkish: 'TR',
  off: 'CC',
}

export function VideoPlayer({
  src,
  segments,
  subtitle,
  onSubtitleChange,
  className,
  autoPlay,
  initialPosition,
  onPositionChange,
  onTimeUpdate,
  onPlayStateChange,
  onRateChange,
  onEnded,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [internalSubtitle, setInternalSubtitle] = useState<SubtitleTrack>('korean')
  const [fullscreen, setFullscreen] = useState(false)
  const player = useMediaElement<HTMLVideoElement>({ src, autoPlay, initialPosition, onPositionChange, onTimeUpdate, onPlayStateChange, onRateChange, onEnded })

  const subtitleTrack = subtitle ?? internalSubtitle
  const hasTurkish = segments?.some((s) => Boolean(s.turkish)) ?? false

  useEffect(() => {
    const onFullscreenChange = () => setFullscreen(document.fullscreenElement === containerRef.current)
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  const cycleSubtitle = () => {
    const order: SubtitleTrack[] = hasTurkish ? ['korean', 'english', 'turkish', 'off'] : ['korean', 'english', 'off']
    const index = order.indexOf(subtitleTrack)
    const next = order[(index + 1) % order.length]
    setInternalSubtitle(next)
    onSubtitleChange?.(next)
  }

  const cycleRate = () => {
    const index = PLAYBACK_RATES.findIndex((r) => r === player.rate)
    const next = PLAYBACK_RATES[(index + 1) % PLAYBACK_RATES.length]
    player.setPlaybackRate(next)
  }

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    else containerRef.current?.requestFullscreen().catch(() => {})
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === ' ' || event.key === 'k') {
      event.preventDefault()
      player.toggle()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      player.skip(-10)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      player.skip(10)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      player.setVolume(player.volume + 0.1)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      player.setVolume(player.volume - 0.1)
    } else if (event.key === 'm') {
      player.toggleMute()
    } else if (event.key === 'f') {
      toggleFullscreen()
    }
  }

  const activeSegment = segments?.find((s) => player.position >= s.start && player.position < s.end)
  const captionText =
    activeSegment && subtitleTrack !== 'off' && activeSegment[subtitleTrack] ? activeSegment[subtitleTrack] : null

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={`group relative w-full overflow-hidden rounded-xl bg-black outline-none ${className ?? ''}`}
    >
      <video
        ref={player.ref}
        src={src}
        preload="metadata"
        playsInline
        onClick={player.toggle}
        onDoubleClick={toggleFullscreen}
        className="block h-auto w-full cursor-pointer bg-black"
      />
      {captionText && (
        <div className="pointer-events-none absolute inset-x-0 bottom-16 flex justify-center px-4">
          <span className="max-w-[85%] rounded-md bg-black/70 px-3 py-1.5 text-center text-sm leading-relaxed text-white md:text-base">
            {captionText}
          </span>
        </div>
      )}
      <div
        className={`absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 bg-black/50 px-3 pb-2 pt-8 transition-opacity ${
          player.playing ? 'opacity-0 group-hover:opacity-100 focus-within:opacity-100' : 'opacity-100'
        }`}
      >
        <button
          type="button"
          onClick={player.toggle}
          aria-label={player.playing ? 'Pause' : 'Play'}
          className="p-1.5 text-white transition-opacity hover:opacity-80"
        >
          {player.playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button type="button" onClick={() => player.skip(-10)} aria-label="Back 10 seconds" className="p-1.5 text-white transition-opacity hover:opacity-80">
          <Back10Icon />
        </button>
        <span className="shrink-0 text-xs tabular-nums text-white/80">{formatTime(player.position)}</span>
        <input
          type="range"
          min={0}
          max={player.duration || 0}
          step={0.1}
          value={Math.min(player.position, player.duration || 0)}
          disabled={!player.ready}
          onChange={(e) => player.seek(Number(e.target.value))}
          aria-label="Seek"
          className="h-1.5 min-w-16 flex-1 cursor-pointer accent-[var(--color-primary,#2563eb)] disabled:opacity-50"
        />
        <span className="shrink-0 text-xs tabular-nums text-white/80">{formatTime(player.duration)}</span>
        <button type="button" onClick={() => player.skip(10)} aria-label="Forward 10 seconds" className="p-1.5 text-white transition-opacity hover:opacity-80">
          <Forward10Icon />
        </button>
        <button
          type="button"
          onClick={cycleRate}
          aria-label="Playback speed"
          className="rounded-md px-1.5 py-1 text-xs font-medium tabular-nums text-white transition-opacity hover:opacity-80"
        >
          {player.rate}×
        </button>
        {segments && segments.length > 0 && (
          <button
            type="button"
            onClick={cycleSubtitle}
            aria-label="Subtitles"
            className={`rounded-md border px-1.5 py-0.5 text-xs font-medium text-white transition-opacity hover:opacity-80 ${
              subtitleTrack === 'off' ? 'border-white/30 opacity-60' : 'border-white/70'
            }`}
          >
            {SUBTITLE_LABELS[subtitleTrack]}
          </button>
        )}
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={player.toggleMute} aria-label={player.muted ? 'Unmute' : 'Mute'} className="p-1.5 text-white transition-opacity hover:opacity-80">
            {player.muted || player.volume === 0 ? <VolumeXIcon /> : <VolumeIcon />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={player.muted ? 0 : player.volume}
            onChange={(e) => player.setVolume(Number(e.target.value))}
            aria-label="Volume"
            className="hidden h-1 w-14 cursor-pointer accent-[var(--color-primary,#2563eb)] sm:block"
          />
        </div>
        <button type="button" onClick={toggleFullscreen} aria-label="Fullscreen" className="p-1.5 text-white transition-opacity hover:opacity-80">
          {fullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
        </button>
      </div>
    </div>
  )
}
