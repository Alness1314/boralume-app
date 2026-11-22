import type { LightState } from '../../core/light'

const base = '-0000-1000-8000-00805f9800c4'
export const v4Profile = {
  colorService: `0001fe01${base}`,
  colorCharacteristic: `0001ff01${base}`,
  activationCharacteristic: `0001ff13${base}`,
  services: ['0001fe01', '0001fe02', '0001fe03', '0001fe04', '0001fe06'].map(
    (id) => `${id}${base}`,
  ),
} as const

/** Observed V4 format: RGB + transition in 10 ms units. No checksum. */
export function encodeV4Color({ color, brightness }: LightState): Uint8Array<ArrayBuffer> {
  if (!/^#[0-9a-f]{6}$/i.test(color))
    throw new Error('El color debe ser RGB hexadecimal de 6 dígitos.')
  if (!Number.isFinite(brightness) || brightness < 0 || brightness > 100) {
    throw new Error('El brillo debe estar entre 0 y 100.')
  }
  return new Uint8Array([
    ...[1, 3, 5].map((offset) =>
      Math.round((parseInt(color.slice(offset, offset + 2), 16) * brightness) / 100),
    ),
    0, // Immediate transition; effects are driven by our timeline, not unknown firmware commands.
  ])
}
