import type { DemoSequence, HexColor } from '../../core/light'

export const lightColors: ReadonlyArray<{ label: string; color: HexColor }> = [
  { label: 'Violeta', color: '#A77BFA' },
  { label: 'Lavanda', color: '#D5B7FF' },
  { label: 'Rosa', color: '#F399CB' },
  { label: 'Azul', color: '#80B9FA' },
  { label: 'Menta', color: '#8BDCC1' },
  { label: 'Blanco', color: '#FFFFFF' },
]

export const demoSequences: readonly DemoSequence[] = [
  {
    id: 'purple-ocean',
    title: 'Purple ocean',
    description: 'Una ola suave de violetas y lavandas.',
    durationMs: 12000,
    cues: [
      { atMs: 0, color: '#A77BFA' },
      { atMs: 3000, color: '#D5B7FF' },
      { atMs: 6000, color: '#7040C8' },
      { atMs: 9000, color: '#F399CB' },
    ],
  },
  {
    id: 'daydream',
    title: 'Daydream',
    description: 'Una pausa entre tonos pastel y cielo.',
    durationMs: 16000,
    cues: [
      { atMs: 0, color: '#80B9FA' },
      { atMs: 4000, color: '#8BDCC1' },
      { atMs: 8000, color: '#D5B7FF' },
      { atMs: 12000, color: '#F399CB' },
    ],
  },
  {
    id: 'starlight',
    title: 'Starlight',
    description: 'Pequeños destellos, a tu propio ritmo.',
    durationMs: 12000,
    cues: [
      { atMs: 0, color: '#FFFFFF' },
      { atMs: 3000, color: '#D5B7FF' },
      { atMs: 6000, color: '#80B9FA' },
      { atMs: 9000, color: '#A77BFA' },
    ],
  },
]

export function findSequence(id: string | null): DemoSequence {
  return demoSequences.find((sequence) => sequence.id === id) ?? demoSequences[0]!
}
