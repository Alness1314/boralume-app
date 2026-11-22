export type HexColor = `#${string}`
export interface LightState {
  color: HexColor
  brightness: number
}
export interface LightCue {
  atMs: number
  color: HexColor
}
export interface DemoSequence {
  id: string
  title: string
  description: string
  durationMs: number
  cues: readonly LightCue[]
}

/** Pure domain function: independent of React, audio APIs, and Bluetooth. */
export function getSequenceColor(sequence: DemoSequence, elapsedMs: number): HexColor {
  const position = Math.max(0, elapsedMs) % sequence.durationMs
  let color: HexColor = '#000000'
  for (const cue of sequence.cues) {
    if (cue.atMs > position) break
    color = cue.color
  }
  return color
}

export interface LightstickDriver {
  readonly model: string
  connect(): Promise<void>
  setLight(state: LightState): Promise<void>
  disconnect(): Promise<void>
}

export interface RecognitionMatch {
  recordingId: string
  positionMs: number
  confidence: number
  capturedAtMs: number
}
