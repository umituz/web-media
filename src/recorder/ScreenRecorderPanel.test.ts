import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { ScreenRecorderPanel } from './ScreenRecorderPanel'

describe('ScreenRecorderPanel', () => {
  it('renders record panel with title, subtitle, timer, and record button', () => {
    const html = renderToString(
      createElement(ScreenRecorderPanel, {
        title: 'Screen Demo',
        subtitle: 'Record your walkthrough.',
      })
    )
    expect(html).toContain('Screen Demo')
    expect(html).toContain('Record your walkthrough.')
    expect(html).toContain('0:00')
    expect(html).toContain('Record Screen')
  })
})
