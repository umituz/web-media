import { useEffect, useState } from 'react'
import type { MediaPlaylistProps } from '../types'
import { PLAYBACK_RATES, useMediaElement } from './useMediaElement'
import { formatTime } from './AudioPlayer'
import { NextIcon, PauseIcon, PlayIcon, PrevIcon } from './icons'

export function MediaPlaylist({
  tracks,
  initialTrackIndex = 0,
  onTrackSelect,
  onTrackEnd,
  className = '',
  autoPlay = false,
}: MediaPlaylistProps) {
  const [currentIndex, setCurrentIndex] = useState(initialTrackIndex)
  const currentTrack = tracks[currentIndex] ?? null

  const handleEnded = () => {
    if (currentTrack) {
      onTrackEnd?.(currentTrack, currentIndex)
    }
    if (currentIndex < tracks.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      if (tracks[nextIndex]) {
        onTrackSelect?.(tracks[nextIndex]!, nextIndex)
      }
    }
  }

  const player = useMediaElement<HTMLAudioElement>({
    src: currentTrack?.src ?? '',
    autoPlay: autoPlay && !!currentTrack,
    onEnded: handleEnded,
  })

  useEffect(() => {
    if (currentTrack) {
      player.seek(0)
    }
  }, [currentIndex, currentTrack?.src])

  const selectTrack = (index: number) => {
    if (index < 0 || index >= tracks.length) return
    setCurrentIndex(index)
    const t = tracks[index]
    if (t) {
      onTrackSelect?.(t, index)
    }
  }

  const prev = () => {
    if (currentIndex > 0) {
      selectTrack(currentIndex - 1)
    }
  }

  const next = () => {
    if (currentIndex < tracks.length - 1) {
      selectTrack(currentIndex + 1)
    }
  }

  const cycleRate = () => {
    const idx = PLAYBACK_RATES.findIndex((r) => r === player.rate)
    const nextRate = PLAYBACK_RATES[(idx + 1) % PLAYBACK_RATES.length] ?? 1
    player.setPlaybackRate(nextRate)
  }

  if (tracks.length === 0) {
    return <div className={`um-playlist-empty ${className}`.trim()}>No tracks in playlist</div>
  }

  return (
    <div className={`um-playlist ${className}`.trim()} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <audio ref={player.ref} src={currentTrack?.src ?? ''} preload="metadata" />

      <div
        className="um-playlist-player"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          padding: 16,
          borderRadius: 12,
          background: 'var(--color-paper, #ffffff)',
          border: '1px solid var(--color-line, rgba(0,0,0,0.08))',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentTrack?.title ?? 'No track'}
            </h4>
            {(currentTrack?.artist || currentTrack?.subtitle) && (
              <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--color-ink-3, #6b7280)' }}>
                {currentTrack.artist ?? currentTrack.subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={cycleRate}
            style={{
              padding: '2px 8px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              background: 'rgba(0,0,0,0.05)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {player.rate}x
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, fontVariantNumeric: 'tabular-nums', color: 'var(--color-ink-3, #6b7280)' }}>
            {formatTime(player.position)}
          </span>
          <input
            type="range"
            min={0}
            max={player.duration || 100}
            step={0.1}
            value={player.position}
            onChange={(e) => player.seek(Number(e.target.value))}
            style={{
              flex: 1,
              cursor: 'pointer',
              accentColor: 'var(--color-primary, #33406b)',
            }}
          />
          <span style={{ fontSize: 11, fontVariantNumeric: 'tabular-nums', color: 'var(--color-ink-3, #6b7280)' }}>
            {formatTime(player.duration || currentTrack?.durationSec || 0)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <button
            type="button"
            aria-label="Previous track"
            disabled={currentIndex === 0}
            onClick={prev}
            style={{ background: 'none', border: 'none', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentIndex === 0 ? 0.35 : 1 }}
          >
            <PrevIcon size={18} />
          </button>
          <button
            type="button"
            aria-label={player.playing ? 'Pause' : 'Play'}
            onClick={() => player.toggle()}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'var(--color-primary, #33406b)',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {player.playing ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
          </button>
          <button
            type="button"
            aria-label="Next track"
            disabled={currentIndex >= tracks.length - 1}
            onClick={next}
            style={{ background: 'none', border: 'none', cursor: currentIndex >= tracks.length - 1 ? 'not-allowed' : 'pointer', opacity: currentIndex >= tracks.length - 1 ? 0.35 : 1 }}
          >
            <NextIcon size={18} />
          </button>
        </div>
      </div>

      <div
        className="um-playlist-tracks"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          borderRadius: 12,
          border: '1px solid var(--color-line, rgba(0,0,0,0.08))',
          background: 'var(--color-paper, #ffffff)',
          overflow: 'hidden',
        }}
      >
        {tracks.map((t, idx) => {
          const isActive = idx === currentIndex
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => selectTrack(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                border: 'none',
                background: isActive ? 'color-mix(in srgb, var(--color-primary, #33406b) 8%, transparent)' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                borderBottom: idx < tracks.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <span
                  style={{
                    width: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    color: isActive ? 'var(--color-primary, #33406b)' : 'var(--color-ink-3, #9ca3af)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {idx + 1}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: isActive ? 700 : 500, color: 'var(--color-ink, #23252b)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.title}
                  </div>
                  {(t.artist || t.subtitle) && (
                    <div style={{ fontSize: 12, color: 'var(--color-ink-3, #6b7280)' }}>
                      {t.artist ?? t.subtitle}
                    </div>
                  )}
                </div>
              </div>
              {t.durationSec && (
                <span style={{ fontSize: 12, color: 'var(--color-ink-3, #9ca3af)', fontVariantNumeric: 'tabular-nums', marginLeft: 12 }}>
                  {formatTime(t.durationSec)}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
