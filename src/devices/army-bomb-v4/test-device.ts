import { vi } from 'vitest'
import type { CharacteristicPort, DevicePort, GattPort } from './ports'
import { v4Profile } from './protocol'

export function packetBytes(value: BufferSource): number[] {
  return Array.from(
    ArrayBuffer.isView(value)
      ? new Uint8Array(value.buffer, value.byteOffset, value.byteLength)
      : new Uint8Array(value),
  )
}

export function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}

export function fakeV4() {
  const listeners = new Set<() => void>()
  let connected = false
  const writes: number[][] = []
  const activations: number[][] = []
  const writtenThrough: number[] = []
  let characteristics = 0
  const onWrite = vi.fn<(value: BufferSource) => Promise<void>>().mockResolvedValue(undefined)
  function drop() {
    connected = false
    listeners.forEach((listener) => listener())
  }
  const connect = vi.fn(async (): Promise<GattPort> => {
    connected = true
    return gatt
  })
  const getPrimaryService = vi.fn(async (uuid: string) => {
    if (!connected) throw new DOMException('Disconnected', 'NetworkError')
    if (uuid !== v4Profile.colorService && uuid !== v4Profile.services[4])
      throw new DOMException('Not found', 'NotFoundError')
    return {
      getCharacteristic: async (characteristicId: string): Promise<CharacteristicPort> => {
        if (uuid === v4Profile.colorService && characteristicId === v4Profile.colorCharacteristic) {
          const connectionNumber = ++characteristics
          return {
            properties: { write: true, writeWithoutResponse: false },
            writeValueWithResponse: async (value) => {
              writes.push(packetBytes(value))
              writtenThrough.push(connectionNumber)
              await onWrite(value)
            },
            writeValueWithoutResponse: async () => {
              throw new Error('Color writes require a response')
            },
          }
        }
        if (
          uuid === v4Profile.services[4] &&
          characteristicId === v4Profile.activationCharacteristic
        ) {
          return {
            properties: { write: false, writeWithoutResponse: true },
            writeValueWithResponse: async () => {
              throw new Error('Wrong activation write mode')
            },
            writeValueWithoutResponse: async (value) => {
              activations.push(packetBytes(value))
              drop()
            },
          }
        }
        throw new DOMException('Not found', 'NotFoundError')
      },
    }
  })
  const gatt: GattPort = {
    get connected() {
      return connected
    },
    connect,
    disconnect: () => {
      if (connected) drop()
    },
    getPrimaryService,
  }
  const device: DevicePort = {
    name: 'BTS_V4 LS',
    gatt,
    addEventListener: (_, listener) => {
      listeners.add(listener)
    },
    removeEventListener: (_, listener) => {
      listeners.delete(listener)
    },
  }
  return {
    device,
    gatt,
    connect,
    getPrimaryService,
    writes,
    activations,
    writtenThrough,
    onWrite,
    drop,
  }
}
