import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { TranscriptPanel } from './TranscriptPanel'

const SEGMENTS = [
  { start: 0, end: 4, text: 'first line', meaning: 'first meaning' },
  { start: 10, end: 14, text: 'second line', meaning: 'second meaning' },
]

function panel(props: Partial<Parameters<typeof TranscriptPanel>[0]> = {}) {
  return renderToString(
    createElement(TranscriptPanel, {
      segments: SEGMENTS,
      position: 0,
      onSeek: () => {},
      ...props,
    }),
  )
}

describe('TranscriptPanel', () => {
  it('renders all segments with formatted timestamps', () => {
    const html = panel()
    expect(html).toContain('first line')
    expect(html).toContain('second line')
    expect(html).toContain('0:00')
    expect(html).toContain('0:10')
  })

  it('renders the localized empty message when there are no segments', () => {
    const html = panel({ segments: [], emptyMessage: 'Metin bulunamadı' })
    expect(html).toContain('Metin bulunamadı')
  })

  it('marks the segment whose range contains the position as current', () => {
    const html = panel({ position: 11, activeAriaLabel: 'Şu an çalıyor' })
    expect(html).toContain('Şu an çalıyor')
    expect(html).toContain('aria-current="true"')
  })

  it('does not mark a segment current when the position sits in a gap', () => {
    const html = panel({ position: 7, activeAriaLabel: 'Şu an çalıyor' })
    expect(html).not.toContain('Şu an çalıyor')
    expect(html).not.toContain('aria-current="true"')
  })

  it('falls back to the last started segment when the position overshoots', () => {
    const html = panel({ position: 30, activeAriaLabel: 'Şu an çalıyor' })
    expect(html).toContain('Şu an çalıyor')
  })

  it('renders the localized active badge on the current segment only', () => {
    const active = panel({ position: 11, activeBadgeLabel: 'AKTİF' })
    expect(active).toContain('AKTİF')
    const idle = panel({ position: 7, activeBadgeLabel: 'AKTİF' })
    expect(idle).not.toContain('AKTİF')
  })

  it('hides secondary meaning lines when showSecondary is false', () => {
    const html = panel({ showSecondary: false })
    expect(html).not.toContain('first meaning')
  })
})
