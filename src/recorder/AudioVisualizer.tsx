import { useEffect, useRef } from 'react'
import type { AudioVisualizerProps } from '../types'

export function AudioVisualizer({
  stream = null,
  active = false,
  barCount = 28,
  barColor = 'var(--color-primary, #33406b)',
  height = 48,
  className = '',
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let audioCtx: AudioContext | null = null
    let analyser: AnalyserNode | null = null
    let source: MediaStreamAudioSourceNode | null = null

    if (stream && active && typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        audioCtx = new AudioContextClass()
        analyser = audioCtx.createAnalyser()
        analyser.fftSize = 64
        source = audioCtx.createMediaStreamSource(stream)
        source.connect(analyser)
      } catch {
        audioCtx = null
        analyser = null
      }
    }

    const dataArray = analyser ? new Uint8Array(analyser.frequencyBinCount) : null

    const draw = (time: number) => {
      const width = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, width, h)

      const totalBars = barCount
      const gap = 3
      const barWidth = Math.max(2, (width - (totalBars - 1) * gap) / totalBars)

      if (analyser && dataArray && active) {
        analyser.getByteFrequencyData(dataArray)
      }

      ctx.fillStyle = barColor

      for (let i = 0; i < totalBars; i++) {
        let barHeight = 4
        if (active) {
          if (dataArray && analyser) {
            const index = Math.floor((i / totalBars) * dataArray.length)
            const val = dataArray[index] ?? 0
            barHeight = Math.max(4, (val / 255) * h)
          } else {
            const wave = Math.sin((time / 150) + (i * 0.4)) * 0.5 + 0.5
            barHeight = Math.max(4, wave * (h * 0.75))
          }
        }
        const x = i * (barWidth + gap)
        const y = (h - barHeight) / 2
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x, y, barWidth, barHeight, 2)
        } else {
          ctx.rect(x, y, barWidth, barHeight)
        }
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      if (source) source.disconnect()
      if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close().catch(() => {})
      }
    }
  }, [stream, active, barCount, barColor, height])

  return (
    <canvas
      ref={canvasRef}
      className={`um-audio-visualizer ${className}`.trim()}
      width={barCount * 8}
      height={height}
      style={{ display: 'block', width: '100%', height, maxHeight: height }}
    />
  )
}
