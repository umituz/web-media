import { describe, expect, it } from 'vitest'
import { getEmbedVideoUrl, isDirectVideoUrl } from './embed'

describe('getEmbedVideoUrl', () => {
  it('converts youtube watch urls to embed urls', () => {
    expect(getEmbedVideoUrl('https://www.youtube.com/watch?v=abc123')).toBe(
      'https://www.youtube.com/embed/abc123',
    )
  })

  it('passes through youtube embed urls', () => {
    expect(getEmbedVideoUrl('https://www.youtube.com/embed/abc123')).toBe(
      'https://www.youtube.com/embed/abc123',
    )
  })

  it('converts youtu.be short urls', () => {
    expect(getEmbedVideoUrl('https://youtu.be/xyz789')).toBe(
      'https://www.youtube.com/embed/xyz789',
    )
  })

  it('converts numeric vimeo paths to player urls', () => {
    expect(getEmbedVideoUrl('https://vimeo.com/123456789')).toBe(
      'https://player.vimeo.com/video/123456789',
    )
  })

  it('ignores non-numeric vimeo paths', () => {
    expect(getEmbedVideoUrl('https://vimeo.com/channels/staffpicks')).toBeNull()
  })

  it('returns null for non-video hosts and invalid input', () => {
    expect(getEmbedVideoUrl('https://example.com/video.mp4')).toBeNull()
    expect(getEmbedVideoUrl('not a url')).toBeNull()
    expect(getEmbedVideoUrl('')).toBeNull()
  })
})

describe('isDirectVideoUrl', () => {
  it('detects direct video extensions', () => {
    expect(isDirectVideoUrl('https://cdn.example.com/a.mp4')).toBe(true)
    expect(isDirectVideoUrl('https://cdn.example.com/a.WEBM')).toBe(true)
    expect(isDirectVideoUrl('https://cdn.example.com/a.ogg?token=1')).toBe(true)
  })

  it('rejects pages and embeddable platforms', () => {
    expect(isDirectVideoUrl('https://www.youtube.com/watch?v=abc')).toBe(false)
    expect(isDirectVideoUrl('https://example.com/a.mp4.html')).toBe(false)
    expect(isDirectVideoUrl('')).toBe(false)
  })
})
