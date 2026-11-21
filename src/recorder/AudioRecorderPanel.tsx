import { useEffect, useRef, useState } from 'react'
import type { AudioRecorderPanelProps } from '../types'
import { useAudioRecorder } from './useAudioRecorder'
import { AudioVisualizer } from './AudioVisualizer'
import { formatTime } from '../player/AudioPlayer'
import { CheckIcon, MicIcon, SquareIcon, TrashIcon } from '../player/icons'

export function AudioRecorderPanel({
  onSave,
  onDiscard,
  maxDurationSec = 120,
  title = 'Voice Recording',
  subtitle = 'Press record to capture audio from your microphone.',
  className = '',
}: AudioRecorderPanelProps) {
  const recorder = useAudioRecorder()
  const [seconds, setSeconds] = useState(0)
  const [saving, setSaving] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (recorder.status === 'recording') {
      setSeconds(0)
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= maxDurationSec - 1) {
            recorder.stop()
            return maxDurationSec
          }
          return prev + 1
        })
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [recorder.status, maxDurationSec])

  useEffect(() => {
    if (recorder.blob) {
      const url = URL.createObjectURL(recorder.blob)
      setPreviewUrl(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    } else {
      setPreviewUrl(null)
    }
  }, [recorder.blob])

  const handleStart = async () => {
    await recorder.start()
  }

  const handleStop = () => {
    recorder.stop()
  }

  const handleDiscard = () => {
    recorder.reset()
    setSeconds(0)
    onDiscard?.()
  }

  const handleSave = async () => {
    if (!recorder.blob || saving) return
    setSaving(true)
    try {
      await onSave?.(recorder.blob)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className={`um-recorder-panel ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        padding: 20,
        borderRadius: 14,
        border: '1px solid var(--color-line, rgba(0,0,0,0.08))',
        background: 'var(--color-paper, #ffffff)',
      }}
    >
      <div>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--color-ink, #23252b)' }}>
          {title}
        </h3>
        {subtitle && (
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--color-ink-3, #6b7280)' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          padding: 16,
          borderRadius: 10,
          background: 'rgba(0,0,0,0.02)',
        }}
      >
        <AudioVisualizer active={recorder.status === 'recording'} height={40} />

        <div style={{ fontSize: 20, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: recorder.status === 'recording' ? 'var(--color-danger, #ef4444)' : 'var(--color-ink, #23252b)' }}>
          {formatTime(seconds)}
        </div>

        {recorder.status === 'recording' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-danger, #ef4444)', fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
            Recording...
          </div>
        )}
      </div>

      {previewUrl && recorder.status === 'ready' && (
        <div style={{ width: '100%' }}>
          <audio controls src={previewUrl} style={{ width: '100%', height: 36 }} />
        </div>
      )}

      {recorder.status === 'denied' && (
        <div style={{ fontSize: 12.5, color: 'var(--color-danger, #ef4444)', textAlign: 'center' }}>
          Microphone permission denied. Please allow microphone access in your browser settings.
        </div>
      )}

      {recorder.status === 'unsupported' && (
        <div style={{ fontSize: 12.5, color: 'var(--color-danger, #ef4444)', textAlign: 'center' }}>
          Audio recording is not supported in this browser.
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 4 }}>
        {recorder.status === 'idle' || recorder.status === 'denied' ? (
          <button
            type="button"
            onClick={handleStart}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 20px',
              borderRadius: 9999,
              background: 'var(--color-primary, #33406b)',
              color: '#ffffff',
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <MicIcon size={16} /> Record
          </button>
        ) : recorder.status === 'recording' ? (
          <button
            type="button"
            onClick={handleStop}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 20px',
              borderRadius: 9999,
              background: 'var(--color-danger, #ef4444)',
              color: '#ffffff',
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <SquareIcon size={16} /> Stop
          </button>
        ) : recorder.status === 'ready' ? (
          <>
            <button
              type="button"
              onClick={handleDiscard}
              disabled={saving}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 9999,
                background: 'transparent',
                color: 'var(--color-ink-3, #6b7280)',
                border: '1px solid var(--color-line, rgba(0,0,0,0.12))',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <TrashIcon size={15} /> Discard
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 20px',
                borderRadius: 9999,
                background: 'var(--color-primary, #33406b)',
                color: '#ffffff',
                border: 'none',
                fontSize: 13.5,
                fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.65 : 1,
              }}
            >
              <CheckIcon size={15} /> {saving ? 'Saving...' : 'Save Recording'}
            </button>
          </>
        ) : null}
      </div>
    </div>
  )
}
