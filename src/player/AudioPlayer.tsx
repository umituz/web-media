import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import type { MediaPlayerProps } from '../types'
import { PLAYBACK_RATES, useMediaElement } from './useMediaElement'
import { Back10Icon, Forward10Icon, PauseIcon, PlayIcon, VolumeIcon, VolumeXIcon } from './icons'

export interface AudioPlayerProps extends MediaPlayerProps {
  title?: string
  subtitle?: string
  actions?: ReactNode
  className?: string
}

export function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00'
  const total = Math.floor(sec)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m)
  return h > 0 ? `${h}:${mm}:${String(s).padStart(2, '0')}` : `${mm}:${String(s).padStart(2, '0')}`
}

export function AudioPlayer({
  src,
  title,
  subtitle,
  actions,
  className,
  autoPlay,
  initialPosition,
  onPositionChange,
  onPlayStateChange,
  onRateChange,
  onEnded,
}: AudioPlayerProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const player = useMediaElement<HTMLAudioElement>({ src, autoPlay, initialPosition, onPositionChange, onPlayStateChange, onRateChange, onEnded })

  const cycleRate = () => {
    const index = PLAYBACK_RATES.findIndex((r) => r === player.rate)
    const next = PLAYBACK_RATES[(index + 1) % PLAYBACK_RATES.length]
    player.setPlaybackRate(next)
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
    }
  }

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={[
        'flex w-full items-center gap-2 rounded-xl border bg-[var(--color-card,#ffffff)] border-[var(--color-border,#e2e8f0)] px-3 py-2.5 outline-none',
        'focus-visible:ring-2 focus-visible:ring-[var(--color-ring,rgba(37,99,235,0.45))]',
        className ?? '',
      ].join(' ')}
    >
      <audio ref={player.ref} src={src} preload="metadata" />
      <button
        type="button"
        onClick={player.toggle}
        aria-label={player.playing ? 'Pause' : 'Play'}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary,#2563eb)] text-[var(--color-primary-foreground,#ffffff)] transition-opacity hover:opacity-90"
      >
        {player.playing ? <PauseIcon /> : <PlayIcon />}
      </button>
      <button
        type="button"
        onClick={() => player.skip(-10)}
        aria-label="Back 10 seconds"
        className="shrink-0 p-1.5 text-[var(--color-muted-foreground,#64748b)] transition-colors hover:text-[var(--color-foreground,#0f172a)]"
      >
        <Back10Icon />
      </button>
      <div className="min-w-0 flex-1">
        {(title || subtitle) && (
          <div className="mb-1 flex items-baseline justify-between gap-2">
            {title && <span className="truncate text-sm font-medium text-[var(--color-foreground,#0f172a)]">{title}</span>}
            {subtitle && <span className="hidden shrink-0 text-xs text-[var(--color-muted-foreground,#64748b)] sm:block">{subtitle}</span>}
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-xs tabular-nums text-[var(--color-muted-foreground,#64748b)]">{formatTime(player.position)}</span>
          <input
            type="range"
            min={0}
            max={player.duration || 0}
            step={0.1}
            value={Math.min(player.position, player.duration || 0)}
            disabled={!player.ready}
            onChange={(e) => player.seek(Number(e.target.value))}
            aria-label="Seek"
            className="h-1.5 w-full min-w-0 cursor-pointer accent-[var(--color-primary,#2563eb)] disabled:opacity-50"
          />
          <span className="shrink-0 text-xs tabular-nums text-[var(--color-muted-foreground,#64748b)]">{formatTime(player.duration)}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => player.skip(10)}
        aria-label="Forward 10 seconds"
        className="shrink-0 p-1.5 text-[var(--color-muted-foreground,#64748b)] transition-colors hover:text-[var(--color-foreground,#0f172a)]"
      >
        <Forward10Icon />
      </button>
      <button
        type="button"
        onClick={cycleRate}
        aria-label="Playback speed"
        className="shrink-0 rounded-md px-1.5 py-1 text-xs font-medium tabular-nums text-[var(--color-muted-foreground,#64748b)] transition-colors hover:text-[var(--color-foreground,#0f172a)]"
      >
        {player.rate}×
      </button>
      <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
        <button
          type="button"
          onClick={player.toggleMute}
          aria-label={player.muted ? 'Unmute' : 'Mute'}
          className="p-1.5 text-[var(--color-muted-foreground,#64748b)] transition-colors hover:text-[var(--color-foreground,#0f172a)]"
        >
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
          className="h-1 w-14 cursor-pointer accent-[var(--color-primary,#2563eb)]"
        />
      </div>
      {actions}
    </div>
  )
}
