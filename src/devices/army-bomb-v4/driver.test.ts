import { afterEach, describe, expect, it, vi } from 'vitest'
import { ArmyBombV4Driver, CancelledDeviceOperation } from './driver'
import { deferred, fakeV4 } from './test-device'
import { encodeV4Color } from './protocol'

afterEach(() => vi.useRealTimers())

describe('V4 packets', () => {
  it('encodes primary RGB, scaled brightness, and true blackout', () => {
    expect([...encodeV4Color({ color: '#FF0000', brightness: 100 })]).toEqual([255, 0, 0, 0])
    expect([...encodeV4Color({ color: '#FFFFFF', brightness: 50 })]).toEqual([128, 128, 128, 0])
    expect([...encodeV4Color({ color: '#FFFFFF', brightness: 0 })]).toEqual([0, 0, 0, 0])
    expect([...encodeV4Color({ color: '#000000', brightness: 100 })]).toEqual([0, 0, 0, 0])
  })
  it('rejects malformed or non-finite values before sending any command', () => {
    expect(() => encodeV4Color({ color: '#GGGGGG', brightness: 50 })).toThrow()
    expect(() => encodeV4Color({ color: '#FFFFFF', brightness: NaN })).toThrow()
    expect(() => encodeV4Color({ color: '#FFFFFF', brightness: 101 })).toThrow()
  })
})

describe('V4 transport lifecycle', () => {
  it('times out a pending connection and closes a late native connection result', async () => {
    vi.useFakeTimers()
    const fake = fakeV4()
    const delayed = deferred<void>()
    const nativeConnect = fake.connect.getMockImplementation()!
    fake.connect.mockImplementationOnce(async () => {
      await delayed.promise
      return nativeConnect()
    })
    const driver = new ArmyBombV4Driver(fake.device, vi.fn())
    const pending = driver.connect().catch((error: unknown) => error)
    await vi.advanceTimersByTimeAsync(12000)
    expect(await pending).toBeInstanceOf(Error)
    delayed.resolve()
    await vi.advanceTimersByTimeAsync(1)
    expect(fake.gatt.connected).toBe(false)
    expect(driver.connected).toBe(false)
    expect(fake.writes).toHaveLength(0)
  })
  it('validates the characteristic and never commits automatically on color writes', async () => {
    const fake = fakeV4()
    const driver = new ArmyBombV4Driver(fake.device, vi.fn())
    await driver.connect()
    await driver.setLight({ color: '#FF0000', brightness: 100 })
    await driver.setLight({ color: '#FF0000', brightness: 100 })
    expect(fake.writes).toEqual([[255, 0, 0, 0]])
    expect(fake.activations).toEqual([])
    await driver.disconnect()
  })
  it('serializes writes and drops obsolete colors while a write is pending', async () => {
    vi.useFakeTimers()
    const fake = fakeV4()
    const write = deferred<void>()
    fake.onWrite.mockImplementationOnce(() => write.promise)
    const driver = new ArmyBombV4Driver(fake.device, vi.fn())
    await driver.connect()
    const first = driver.setLight({ color: '#FF0000', brightness: 100 })
    const middle = driver.setLight({ color: '#00FF00', brightness: 100 })
    const latest = driver.setLight({ color: '#000000', brightness: 100 })
    expect(fake.writes).toHaveLength(1)
    write.resolve()
    await vi.advanceTimersByTimeAsync(100)
    await Promise.all([first, middle, latest])
    expect(fake.writes).toEqual([
      [255, 0, 0, 0],
      [0, 0, 0, 0],
    ])
    await driver.disconnect()
  })
  it('does not emit a delayed queued color after disconnect', async () => {
    vi.useFakeTimers()
    const fake = fakeV4()
    const driver = new ArmyBombV4Driver(fake.device, vi.fn())
    await driver.connect()
    await driver.setLight({ color: '#FF0000', brightness: 100 })
    const pending = driver
      .setLight({ color: '#0000FF', brightness: 100 })
      .catch((error: unknown) => error)
    await driver.disconnect()
    await vi.advanceTimersByTimeAsync(100)
    expect(await pending).toBeInstanceOf(CancelledDeviceOperation)
    expect(fake.writes).toHaveLength(1)
  })
  it('prepares once, accepts the expected drop and reacquires characteristics', async () => {
    vi.useFakeTimers()
    const fake = fakeV4()
    const disconnected = vi.fn()
    const driver = new ArmyBombV4Driver(fake.device, disconnected)
    await driver.connect()
    const preparation = driver.prepareControl({ color: '#00FF00', brightness: 100 })
    await vi.advanceTimersByTimeAsync(1800)
    await preparation
    await driver.setLight({ color: '#0000FF', brightness: 100 })
    expect(fake.activations).toEqual([[1]])
    expect(fake.connect).toHaveBeenCalledTimes(2)
    expect(fake.writtenThrough).toEqual([1, 2])
    expect(disconnected).not.toHaveBeenCalled()
    await expect(driver.prepareControl({ color: '#FF0000', brightness: 100 })).rejects.toThrow(
      'Ya preparamos',
    )
    expect(fake.activations).toHaveLength(1)
    fake.drop()
    expect(disconnected).toHaveBeenCalledOnce()
    await driver.disconnect()
  })
  it('cancels a preparation before its delayed reconnect', async () => {
    vi.useFakeTimers()
    const fake = fakeV4()
    const driver = new ArmyBombV4Driver(fake.device, vi.fn())
    await driver.connect()
    const preparation = driver
      .prepareControl({ color: '#00FF00', brightness: 100 })
      .catch((error: unknown) => error)
    await vi.advanceTimersByTimeAsync(100)
    await driver.disconnect()
    await vi.advanceTimersByTimeAsync(2000)
    expect(await preparation).toBeInstanceOf(CancelledDeviceOperation)
    expect(fake.connect).toHaveBeenCalledOnce()
    expect(fake.gatt.connected).toBe(false)
  })
})
