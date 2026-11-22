import { describe, expect, it } from 'vitest'
import { pickVideoMimeType } from './useScreenRecorder'

describe('pickVideoMimeType', () => {
  it('returns a string without throwing in node/ssr environments', () => {
    const result = pickVideoMimeType()
    expect(typeof result).toBe('string')
  })
})
