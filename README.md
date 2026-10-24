# @umituz/web-media

Audio and video player components with transcript-synced subtitles, built for language learning apps.

## Components

- **`AudioPlayer`** — podcast-style bar player: play/pause, seek, ±10s skip, playback speed (0.75×–2×), volume, keyboard shortcuts, throttled position reporting.
- **`VideoPlayer`** — course-style player with custom controls: everything above plus fullscreen and transcript-synced subtitles (KR / EN / TR / off) rendered from timed segments.
- **`useMediaElement`** — the shared media element hook both players use. Reports position every 5 seconds of playback plus on pause, seek, end, and `pagehide`. Persistence stays in the host app.
- **`TranscriptPanel`** — synchronized, searchable auto-scrolling transcript panel with timed segments, sentence click-to-seek, and bilingual display.
- **`StoryReader`** — interactive visual story reader with speech bubbles, vocabulary click-to-lookup, situational effects, and comprehension quizzes. Supports both page-by-page and continuous vertical strip modes.

## Install

The package ships TypeScript source and Tailwind classes; a Tailwind v4 host compiles it directly.

```css
@import "tailwindcss";
@import "@umituz/web-media/source.css";
```

Colors bind to `--color-*` custom properties (`--color-card`, `--color-primary`, `--color-foreground`, `--color-muted-foreground`, `--color-border`, `--color-ring`, `--color-primary-foreground`) with sensible fallbacks, so any palette works.

## Usage

```tsx
import { AudioPlayer, VideoPlayer, type TranscriptSegment } from '@umituz/web-media'

<AudioPlayer
  src="/api/media/audio/ep-001"
  title="Episode 1"
  initialPosition={resumeAt}
  onPositionChange={(position, duration) => persist(position, duration)}
/>

const segments: TranscriptSegment[] = [
  { start: 0, end: 4.2, korean: '안녕하세요', english: 'Hello', turkish: 'Merhaba' },
]

<VideoPlayer
  src="/api/media/video/lec-001"
  segments={segments}
  onPositionChange={(position, duration) => persist(position, duration)}
  onEnded={() => markComplete()}
/>
```

## Position reporting

`onPositionChange` fires at most every 5 seconds of playback advancement, and immediately on pause, seek, ended, and `pagehide` — safe to wire into a debounced store sync without flooding it.
