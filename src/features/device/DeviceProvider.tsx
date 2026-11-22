import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { DeviceContext } from './device-context'
import { V4Connection } from './connection'

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [connection] = useState(
    () => new V4Connection(() => (window.isSecureContext ? navigator.bluetooth : undefined)),
  )
  useEffect(() => () => connection.disconnect(), [connection])
  return <DeviceContext.Provider value={connection}>{children}</DeviceContext.Provider>
}
