import type { ZodType } from 'zod'

export function readStored<T>(key: string, schema: ZodType<T>, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const result = schema.safeParse(JSON.parse(raw))
    return result.success ? result.data : fallback
  } catch {
    return fallback
  }
}

export function writeStored<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
