import { createContext, useContext, useSyncExternalStore } from 'react'
import type { V4Connection } from './connection'

export const DeviceContext = createContext<V4Connection | null>(null)

export function useDevice() {
  const connection = useContext(DeviceContext)
  if (!connection) throw new Error('Falta el proveedor de conexión de BoraLume.')
  const device = useSyncExternalStore(
    connection.subscribe,
    connection.getSnapshot,
    connection.getSnapshot,
  )
  return { connection, device }
}
