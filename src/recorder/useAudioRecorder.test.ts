import { describe, expect, it } from 'vitest'
import { pickAudioMimeType } from './useAudioRecorder'

describe('pickAudioMimeType', () => {
  it('returns a string without throwing in any environment', () => {
    const result = pickAudioMimeType()
    expect(typeof result).toBe('string')
  })
})
