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

export interface PlaylistItem {
  id: string
  title: string
  subtitle?: string
  artist?: string
  src: string
  durationSec?: number
  coverUrl?: string
}

export interface MediaPlaylistProps {
  tracks: PlaylistItem[]
  initialTrackIndex?: number
  onTrackSelect?: (track: PlaylistItem, index: number) => void
  onTrackEnd?: (track: PlaylistItem, index: number) => void
  className?: string
  autoPlay?: boolean
}

export interface AudioVisualizerProps {
  stream?: MediaStream | null
  active?: boolean
  barCount?: number
  barColor?: string
  height?: number
  className?: string
}

export interface AudioRecorderPanelProps {
  onSave?: (blob: Blob) => void | Promise<void>
  onDiscard?: () => void
  maxDurationSec?: number
  title?: string
  subtitle?: string
  className?: string
}
