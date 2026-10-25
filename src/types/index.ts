export interface TranscriptSegment {
  start: number
  end: number
  text: string
  meaning: string
  turkish?: string
}

export type SubtitleTrack = 'target' | 'english' | 'turkish' | 'off'

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
