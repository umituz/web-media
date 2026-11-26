import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { pickAudioMimeType, useAudioRecorder } from './useAudioRecorder'

describe('pickAudioMimeType', () => {
  it('returns a string without throwing in any environment', () => {
    const result = pickAudioMimeType()
    expect(typeof result).toBe('string')
  })
})

function StateProbe() {
  const state = useAudioRecorder()
  return createElement(
    'pre',
    null,
    JSON.stringify({ status: state.status, blob: state.blob, stream: state.stream }),
  )
}

describe('useAudioRecorder initial state', () => {
  it('exposes stream alongside status and blob, null before recording starts', () => {
    const html = renderToString(createElement(StateProbe))
    expect(html).toContain('&quot;status&quot;:&quot;idle&quot;')
    expect(html).toContain('&quot;blob&quot;:null')
    expect(html).toContain('&quot;stream&quot;:null')
  })
})
