import { z } from 'zod'

export const preferencesSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, 'Escribe al menos 2 caracteres.')
    .max(40, 'Usa un máximo de 40 caracteres.'),
  lightstickModel: z.enum(['unknown', 'v3', 'se', 'v4']),
  defaultBrightness: z.number().int().min(0).max(100),
  reducedFlashes: z.boolean(),
})

export type Preferences = z.infer<typeof preferencesSchema>
export const preferencesKey = 'boralume:preferences:v1'
export const defaultPreferences: Preferences = {
  displayName: 'Mi espacio',
  lightstickModel: 'unknown',
  defaultBrightness: 80,
  reducedFlashes: true,
}

export const lightstickModels = [
  { value: 'unknown', label: 'Aún no lo sé' },
  { value: 'v3', label: 'ARMY Bomb Ver. 3' },
  { value: 'se', label: 'ARMY Bomb Special Edition' },
  { value: 'v4', label: 'ARMY Bomb Ver. 4' },
] as const
