import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { MediaPlaylist } from './MediaPlaylist'
import { formatTime } from './AudioPlayer'

describe('formatTime', () => {
  it('formats seconds into mm:ss', () => {
    expect(formatTime(0)).toBe('0:00')
    expect(formatTime(65)).toBe('1:05')
    expect(formatTime(3665)).toBe('1:01:05')
  })
})

describe('MediaPlaylist', () => {
  it('renders empty message when no tracks are provided', () => {
    const html = renderToString(createElement(MediaPlaylist, { tracks: [] }))
    expect(html).toContain('No tracks in playlist')
  })

  it('renders track list with titles, artists, and durations', () => {
    const tracks = [
      { id: '1', title: 'Moonlight Sonata', artist: 'Beethoven', src: '/audio/sonata.mp3', durationSec: 320 },
      { id: '2', title: 'Clair de Lune', artist: 'Debussy', src: '/audio/clair.mp3', durationSec: 275 },
    ]
    const html = renderToString(createElement(MediaPlaylist, { tracks }))
    expect(html).toContain('Moonlight Sonata')
    expect(html).toContain('Beethoven')
    expect(html).toContain('Clair de Lune')
    expect(html).toContain('Debussy')
    expect(html).toContain('5:20')
    expect(html).toContain('4:35')
  })
})
