export interface TranscriptSegment {
  start: number
  end: number
  korean: string
  english: string
  turkish?: string
}

export type SubtitleTrack = 'korean' | 'english' | 'turkish' | 'off'

export interface MediaPlayerProps {
  src: string
  autoPlay?: boolean
  initialPosition?: number
  onPositionChange?: (positionSec: number, durationSec: number) => void
  onTimeUpdate?: (positionSec: number) => void
  onPlayStateChange?: (playing: boolean) => void
  onRateChange?: (rate: number) => void
  onEnded?: () => void
}
