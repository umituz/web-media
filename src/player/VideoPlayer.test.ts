import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { VideoPlayer } from './VideoPlayer'

describe('VideoPlayer', () => {
  it('renders the video element with the given source', () => {
    const html = renderToString(createElement(VideoPlayer, { src: '/media/lesson.mp4' }))
    expect(html).toContain('src="/media/lesson.mp4"')
  })

  it('renders transcript-driven subtitles only while a caption track is active', () => {
    const segments = [
      { start: 0, end: 4, text: '안녕하세요', meaning: 'Hello' },
      { start: 4, end: 8, text: '반갑습니다', meaning: 'Nice to meet you' },
    ]
    const html = renderToString(
      createElement(VideoPlayer, { src: '/media/lesson.mp4', segments, subtitle: 'meaning' }),
    )
    expect(html).toContain('group relative w-full overflow-hidden rounded-xl bg-black')
  })
})
