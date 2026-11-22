import { useCallback, useEffect, useRef, useState } from 'react'

export type ScreenRecorderStatus = 'idle' | 'recording' | 'ready' | 'unsupported' | 'denied'

export function pickVideoMimeType(): string {
  const candidates = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4',
  ]
  for (const type of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) return type
  }
  return ''
}

export interface ScreenRecorderState {
  status: ScreenRecorderStatus
  blob: Blob | null
  url: string | null
  duration: number
  start: (options?: DisplayMediaStreamOptions) => Promise<boolean>
  stop: () => void
  reset: () => void
  download: (filename?: string) => void
}

export function useScreenRecorder(): ScreenRecorderState {
  const [status, setStatus] = useState<ScreenRecorderStatus>('idle')
  const [blob, setBlob] = useState<Blob | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)

  const mediaRef = useRef<MediaRecorder | null>(null)
  const startingRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const releaseStream = useCallback(() => {
    const recorder = mediaRef.current
    if (!recorder) return
    mediaRef.current = null
    recorder.onstop = null
    if (recorder.state !== 'inactive') recorder.stop()
    recorder.stream.getTracks().forEach((track) => track.stop())
  }, [])

  const stop = useCallback(() => {
    clearTimer()
    const recorder = mediaRef.current
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop()
    }
  }, [clearTimer])

  const reset = useCallback(() => {
    clearTimer()
    releaseStream()
    if (url) {
      URL.revokeObjectURL(url)
      setUrl(null)
    }
    setBlob(null)
    setDuration(0)
    setStatus('idle')
  }, [clearTimer, releaseStream, url])

  const start = useCallback(
    async (options?: DisplayMediaStreamOptions): Promise<boolean> => {
      if (mediaRef.current || startingRef.current) return false
      if (
        typeof MediaRecorder === 'undefined' ||
        !navigator.mediaDevices?.getDisplayMedia
      ) {
        setStatus('unsupported')
        return false
      }
      startingRef.current = true
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia(
          options || { video: true, audio: true }
        )
        const chunks: BlobPart[] = []
        const mimeType = pickVideoMimeType()
        const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            chunks.push(event.data)
          }
        }

        recorder.onstop = () => {
          clearTimer()
          recorder.stream.getTracks().forEach((track) => track.stop())
          const recordedBlob = new Blob(chunks, { type: recorder.mimeType || 'video/webm' })
          const objectUrl = URL.createObjectURL(recordedBlob)
          setBlob(recordedBlob)
          setUrl(objectUrl)
          setStatus('ready')
        }

        const videoTrack = stream.getVideoTracks()[0]
        if (videoTrack) {
          videoTrack.onended = () => {
            stop()
          }
        }

        recorder.start(1000)
        mediaRef.current = recorder

        if (url) {
          URL.revokeObjectURL(url)
          setUrl(null)
        }
        setBlob(null)
        setDuration(0)
        setStatus('recording')

        clearTimer()
        timerRef.current = setInterval(() => {
          setDuration((prev) => prev + 1)
        }, 1000)

        return true
      } catch {
        setStatus('denied')
        return false
      } finally {
        startingRef.current = false
      }
    },
    [clearTimer, stop, url]
  )

  const download = useCallback(
    (filename = 'screen-recording.webm') => {
      if (!blob && !url) return
      const targetUrl = url || (blob ? URL.createObjectURL(blob) : null)
      if (!targetUrl) return
      const a = document.createElement('a')
      a.href = targetUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      if (!url) URL.revokeObjectURL(targetUrl)
    },
    [blob, url]
  )

  useEffect(() => {
    return () => {
      clearTimer()
      releaseStream()
      if (url) URL.revokeObjectURL(url)
    }
  }, [clearTimer, releaseStream, url])

  return {
    status,
    blob,
    url,
    duration,
    start,
    stop,
    reset,
    download,
  }
}
