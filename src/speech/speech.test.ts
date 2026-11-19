import { describe, expect, it } from 'vitest'
import { getSpeechRecognitionCtor } from './useSpeechRecognition'

describe('speech recognition utilities', () => {
  it('safely handles missing browser support', () => {
    const ctor = getSpeechRecognitionCtor()
    expect(ctor === null || typeof ctor === 'function').toBe(true)
  })
})
