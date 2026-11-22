import { useEffect, useState } from 'react'
import type { ScreenRecorderPanelProps } from '../types'
import { useScreenRecorder } from './useScreenRecorder'
import { formatTime } from '../player/AudioPlayer'
import { CheckIcon, DownloadIcon, ScreenIcon, SquareIcon, TrashIcon } from '../player/icons'

export function ScreenRecorderPanel({
  onSave,
  onDiscard,
  maxDurationSec = 300,
  title = 'Screen Recording',
  subtitle = 'Capture your screen and audio for walkthroughs, bug reports, and demos.',
  className = '',
  downloadFilename = 'screen-recording.webm',
}: ScreenRecorderPanelProps) {
  const recorder = useScreenRecorder()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (recorder.status === 'recording' && recorder.duration >= maxDurationSec) {
      recorder.stop()
    }
  }, [recorder, maxDurationSec])

  const handleStart = async () => {
    await recorder.start()
  }

  const handleStop = () => {
    recorder.stop()
  }

  const handleDiscard = () => {
    recorder.reset()
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

  const handleDownload = () => {
    recorder.download(downloadFilename)
  }

  return (
    <div
      className={`um-screen-recorder-panel ${className}`.trim()}
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
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            fontVariantNumeric: 'tabular-nums',
            color: recorder.status === 'recording' ? 'var(--color-danger, #ef4444)' : 'var(--color-ink, #23252b)',
          }}
        >
          {formatTime(recorder.duration)}
        </div>

        {recorder.status === 'recording' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-danger, #ef4444)', fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
            Recording Screen...
          </div>
        )}
      </div>

      {recorder.url && recorder.status === 'ready' && (
        <div style={{ width: '100%', borderRadius: 8, overflow: 'hidden', background: '#000000' }}>
          <video
            controls
            src={recorder.url}
            style={{ width: '100%', maxHeight: 280, display: 'block' }}
          />
        </div>
      )}

      {recorder.status === 'denied' && (
        <div style={{ fontSize: 12.5, color: 'var(--color-danger, #ef4444)', textAlign: 'center' }}>
          Screen recording permission was denied or cancelled. Please select a screen or window to record.
        </div>
      )}

      {recorder.status === 'unsupported' && (
        <div style={{ fontSize: 12.5, color: 'var(--color-danger, #ef4444)', textAlign: 'center' }}>
          Screen recording is not supported in this browser.
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 4 }}>
        {recorder.status === 'idle' || recorder.status === 'denied' ? (
          <button
            type="button"
            onClick={handleStart}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 10,
              border: 'none',
              background: 'var(--color-accent, #2563eb)',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <ScreenIcon size={16} />
            Record Screen
          </button>
        ) : recorder.status === 'recording' ? (
          <button
            type="button"
            onClick={handleStop}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 10,
              border: 'none',
              background: 'var(--color-danger, #ef4444)',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <SquareIcon size={14} />
            Stop Recording
          </button>
        ) : recorder.status === 'ready' ? (
          <>
            <button
              type="button"
              onClick={handleDiscard}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 8,
                border: '1px solid var(--color-line, rgba(0,0,0,0.12))',
                background: 'transparent',
                color: 'var(--color-ink-3, #6b7280)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <TrashIcon size={14} />
              Discard
            </button>
            <button
              type="button"
              onClick={handleDownload}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 8,
                border: '1px solid var(--color-line, rgba(0,0,0,0.12))',
                background: 'transparent',
                color: 'var(--color-ink, #23252b)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <DownloadIcon size={14} />
              Download
            </button>
            {onSave && (
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'var(--color-accent, #2563eb)',
                  color: '#ffffff',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                <CheckIcon size={14} />
                {saving ? 'Saving...' : 'Save Recording'}
              </button>
            )}
          </>
        ) : null}
      </div>
    </div>
  )
}
