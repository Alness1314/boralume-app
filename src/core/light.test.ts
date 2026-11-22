import { describe, expect, it } from 'vitest'
import { getSequenceColor } from './light'
import { demoSequences } from '../features/library/sequences'

describe('sequence clock', () => {
  const sequence = demoSequences[0]!
  it('selects the cue at a boundary and loops at the duration', () => {
    expect(getSequenceColor(sequence, 2999)).toBe('#A77BFA')
    expect(getSequenceColor(sequence, 3000)).toBe('#D5B7FF')
    expect(getSequenceColor(sequence, 12000)).toBe('#A77BFA')
  })
  it('recovers the current color after a delayed tick instead of replaying old cues', () => {
    expect(getSequenceColor(sequence, 12000 * 4 + 6500)).toBe('#7040C8')
    expect(getSequenceColor(sequence, -500)).toBe('#A77BFA')
  })
})
