import { useCallback, useEffect, useRef, useState } from 'react'

export type AudioRecorderStatus = 'idle' | 'recording' | 'ready' | 'unsupported' | 'denied'

export function pickAudioMimeType(): string {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4']
  for (const type of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) return type
  }
  return ''
}

export interface AudioRecorderState {
  status: AudioRecorderStatus
  blob: Blob | null
  stream: MediaStream | null
  start: () => Promise<boolean>
  stop: () => void
  reset: () => void
}

export function useAudioRecorder(): AudioRecorderState {
  const [status, setStatus] = useState<AudioRecorderStatus>('idle')
  const [blob, setBlob] = useState<Blob | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const mediaRef = useRef<MediaRecorder | null>(null)
  const startingRef = useRef(false)

  const releaseStream = useCallback(() => {
    const recorder = mediaRef.current
    if (!recorder) return
    mediaRef.current = null
    recorder.onstop = null
    if (recorder.state !== 'inactive') recorder.stop()
    recorder.stream.getTracks().forEach((track) => track.stop())
    setStream(null)
  }, [])

  const start = useCallback(async (): Promise<boolean> => {
    if (mediaRef.current || startingRef.current) return false
    if (typeof MediaRecorder === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setStatus('unsupported')
      return false
    }
    startingRef.current = true
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const chunks: BlobPart[] = []
      const mimeType = pickAudioMimeType()
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)
      recorder.ondataavailable = (event) => chunks.push(event.data)
      recorder.onstop = () => {
        recorder.stream.getTracks().forEach((track) => track.stop())
        setBlob(new Blob(chunks, { type: recorder.mimeType || 'audio/webm' }))
        setStatus('ready')
      }
      recorder.start()
      mediaRef.current = recorder
      setBlob(null)
      setStream(stream)
      setStatus('recording')
      return true
    } catch {
      setStatus('denied')
      return false
    } finally {
      startingRef.current = false
    }
  }, [])

  const stop = useCallback(() => {
    const recorder = mediaRef.current
    if (!recorder) return
    mediaRef.current = null
    setStream(null)
    if (recorder.state !== 'inactive') recorder.stop()
  }, [])

  const reset = useCallback(() => {
    releaseStream()
    setBlob(null)
    setStatus('idle')
  }, [releaseStream])

  useEffect(() => () => releaseStream(), [releaseStream])

  return { status, blob, stream, start, stop, reset }
}
