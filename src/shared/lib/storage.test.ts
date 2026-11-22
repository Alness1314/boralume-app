import { afterEach, describe, expect, it, vi } from 'vitest'
import { defaultPreferences, preferencesSchema } from '../../features/settings/preferences'
import { readStored, writeStored } from './storage'

afterEach(() => vi.unstubAllGlobals())

describe('local preferences resilience', () => {
  it('recovers from corrupted JSON and invalid saved models', () => {
    const getItem = vi
      .fn()
      .mockReturnValueOnce('{broken')
      .mockReturnValueOnce(
        JSON.stringify({ ...defaultPreferences, lightstickModel: 'unsupported-model' }),
      )
    vi.stubGlobal('localStorage', { getItem })
    expect(readStored('preferences', preferencesSchema, defaultPreferences)).toEqual(
      defaultPreferences,
    )
    expect(readStored('preferences', preferencesSchema, defaultPreferences)).toEqual(
      defaultPreferences,
    )
  })
  it('reports a denied save without crashing the application', () => {
    vi.stubGlobal('localStorage', {
      setItem: () => {
        throw new DOMException('Quota exceeded', 'QuotaExceededError')
      },
    })
    expect(writeStored('preferences', defaultPreferences)).toBe(false)
  })
})
