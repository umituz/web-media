export interface TranscriptSegment {
  start: number
  end: number
  text: string
  meaning: string
  secondaryMeaning?: string
}

export type SubtitleTrack = 'target' | 'meaning' | 'secondary' | 'off'

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
