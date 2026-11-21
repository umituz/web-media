import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { AudioVisualizer } from './AudioVisualizer'
import { AudioRecorderPanel } from './AudioRecorderPanel'

describe('AudioVisualizer', () => {
  it('renders canvas element with specified height and bars', () => {
    const html = renderToString(createElement(AudioVisualizer, { barCount: 20, height: 40 }))
    expect(html).toContain('<canvas')
    expect(html).toContain('um-audio-visualizer')
    expect(html).toContain('height="40"')
  })
})

describe('AudioRecorderPanel', () => {
  it('renders record panel with title, subtitle, timer, and record button', () => {
    const html = renderToString(
      createElement(AudioRecorderPanel, {
        title: 'Voice Sample',
        subtitle: 'Record 5 seconds of audio.',
      })
    )
    expect(html).toContain('Voice Sample')
    expect(html).toContain('Record 5 seconds of audio.')
    expect(html).toContain('0:00')
    expect(html).toContain('Record')
  })
})
