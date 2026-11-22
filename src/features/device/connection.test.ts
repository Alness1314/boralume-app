import { describe, expect, it, vi } from 'vitest'
import { V4Connection } from './connection'
import { deferred, fakeV4 } from '../../devices/army-bomb-v4/test-device'
import type { DevicePort } from '../../devices/army-bomb-v4/ports'
import { v4Profile } from '../../devices/army-bomb-v4/protocol'

describe('device session', () => {
  it('requests only V4 names on click, verifies GATT, and requires human color confirmation', async () => {
    const fake = fakeV4()
    const requestDevice = vi.fn(async () => fake.device)
    const connection = new V4Connection(() => ({ requestDevice }))
    expect(requestDevice).not.toHaveBeenCalled()
    const connecting = connection.connect()
    expect(requestDevice).toHaveBeenCalledWith({
      filters: [{ name: 'BTS_V4 LS' }, { namePrefix: 'BBOMB-' }],
      optionalServices: [...v4Profile.services],
    })
    await connecting
    expect(connection.getSnapshot()).toMatchObject({ status: 'connected', confirmed: false })
    connection.confirm()
    expect(connection.getSnapshot().confirmed).toBe(true)
    fake.drop()
    expect(connection.getSnapshot()).toMatchObject({ status: 'disconnected', confirmed: false })
    connection.disconnect()
  })
  it('reports unavailable browsers, denied permissions and incompatible GATT', async () => {
    const unavailable = new V4Connection(() => undefined)
    await unavailable.connect()
    expect(unavailable.getSnapshot().status).toBe('error')
    const denied = new V4Connection(() => ({
      requestDevice: async () => {
        throw new DOMException('Blocked', 'SecurityError')
      },
    }))
    await denied.connect()
    expect(denied.getSnapshot().message).toContain('bloqueó')
    const fake = fakeV4()
    fake.getPrimaryService.mockRejectedValueOnce(new DOMException('No V4 service', 'NotFoundError'))
    const incompatible = new V4Connection(() => ({ requestDevice: async () => fake.device }))
    await incompatible.connect()
    expect(incompatible.getSnapshot().status).toBe('error')
    expect(fake.gatt.connected).toBe(false)
    expect(fake.writes).toHaveLength(0)
  })
  it('rejects stale chooser results after cancellation without reconnecting', async () => {
    const fake = fakeV4()
    const choice = deferred<DevicePort>()
    const connection = new V4Connection(() => ({ requestDevice: () => choice.promise }))
    const pending = connection.connect()
    connection.disconnect()
    choice.resolve(fake.device)
    await pending
    expect(connection.getSnapshot().status).toBe('idle')
    expect(fake.connect).not.toHaveBeenCalled()
  })
  it('reports write failure and stops sending instead of silently simulating success', async () => {
    const fake = fakeV4()
    const connection = new V4Connection(() => ({ requestDevice: async () => fake.device }))
    await connection.connect()
    fake.onWrite.mockRejectedValueOnce(new DOMException('Dropped', 'NetworkError'))
    await connection.send({ color: '#0000FF', brightness: 100 })
    expect(connection.getSnapshot()).toMatchObject({ status: 'error', confirmed: false })
    await connection.send({ color: '#00FF00', brightness: 100 })
    expect(fake.writes).toHaveLength(1)
    expect(fake.gatt.connected).toBe(false)
  })
})
