import type { LightState, LightstickDriver } from '../../core/light'
import type { CharacteristicPort, DevicePort } from './ports'
import { encodeV4Color, v4Profile } from './protocol'

export class CancelledDeviceOperation extends Error {}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

async function timed<T>(operation: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      operation,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () =>
            reject(
              new Error(
                'La ARMY Bomb tardó demasiado en responder. Desconecta y vuelve a intentar.',
              ),
            ),
          ms,
        )
      }),
    ])
  } finally {
    clearTimeout(timer)
  }
}

/** Experimental profile: never writes firmware/effect characteristics or retries indefinitely. */
export class ArmyBombV4Driver implements LightstickDriver {
  readonly model = 'ARMY Bomb Ver. 4'
  private characteristic?: CharacteristicPort
  private generation = 0
  private pending?: Uint8Array<ArrayBuffer>
  private pump?: Promise<void>
  private lastPacket = ''
  private lastWriteAt = Number.NEGATIVE_INFINITY
  private expectedDrop = false
  private activationAttempted = false

  constructor(
    private readonly device: DevicePort,
    private readonly onDisconnected: () => void,
  ) {}

  get name() {
    return this.device.name || this.model
  }
  get connected() {
    return Boolean(this.characteristic && this.device.gatt?.connected)
  }
  get canPrepare() {
    return !this.activationAttempted
  }

  private readonly handleDisconnect = () => {
    if (this.expectedDrop) return
    this.invalidate()
    this.onDisconnected()
  }

  private assertCurrent(generation: number) {
    if (this.generation !== generation) throw new CancelledDeviceOperation()
  }

  async connect(): Promise<void> {
    const generation = ++this.generation
    const gatt = this.device.gatt
    if (!gatt) throw new Error('El dispositivo no permite una conexión Bluetooth LE.')
    this.device.removeEventListener('gattserverdisconnected', this.handleDisconnect)
    this.device.addEventListener('gattserverdisconnected', this.handleDisconnect)
    try {
      const server = await timed(
        gatt.connect().then((server) => {
          if (this.generation !== generation) {
            server.disconnect()
            throw new CancelledDeviceOperation()
          }
          return server
        }),
        12000,
      )
      this.assertCurrent(generation)
      const service = await timed(server.getPrimaryService(v4Profile.colorService), 5000)
      this.assertCurrent(generation)
      const characteristic = await timed(
        service.getCharacteristic(v4Profile.colorCharacteristic),
        5000,
      )
      this.assertCurrent(generation)
      if (!characteristic.properties.write)
        throw new Error('Esta unidad no ofrece el control de color esperado para Ver. 4.')
      this.characteristic = characteristic
      this.lastPacket = ''
      this.lastWriteAt = Number.NEGATIVE_INFINITY
      if (!gatt.connected)
        throw new Error('Se perdió la conexión durante la preparación del dispositivo.')
    } catch (error) {
      if (this.generation === generation) this.disconnect()
      throw error
    }
  }

  setLight(state: LightState): Promise<void> {
    const packet = encodeV4Color(state)
    if (!this.connected) return Promise.reject(new Error('La ARMY Bomb está desconectada.'))
    // Only the newest requested state is retained behind the current write.
    this.pending = packet
    if (!this.pump) {
      const pump = this.flush(this.generation).finally(() => {
        if (this.pump === pump) this.pump = undefined
      })
      this.pump = pump
    }
    return this.pump
  }

  private async flush(generation: number): Promise<void> {
    try {
      while (this.pending) {
        const delay = Math.max(0, 80 - (performance.now() - this.lastWriteAt))
        if (delay > 0) await wait(delay)
        this.assertCurrent(generation)
        const packet = this.pending
        this.pending = undefined
        if (!packet || String(packet) === this.lastPacket) continue
        const characteristic = this.characteristic
        if (!characteristic || !this.connected)
          throw new Error('Se perdió la conexión con tu ARMY Bomb.')
        await timed(characteristic.writeValueWithResponse(packet), 4000)
        this.assertCurrent(generation)
        this.lastPacket = String(packet)
        this.lastWriteAt = performance.now()
      }
    } catch (error) {
      if (this.generation === generation) this.pending = undefined
      throw error
    }
  }

  /** Explicit, one-shot pairing-animation escape. Never a per-color commit. */
  async prepareControl(state: LightState): Promise<void> {
    if (!this.canPrepare)
      throw new Error(
        'Ya preparamos esta sesión. Si sigue sin responder, apaga la ARMY Bomb y conecta de nuevo.',
      )
    if (!this.connected) throw new Error('Conecta tu ARMY Bomb antes de prepararla.')
    const generation = this.generation
    let activation: CharacteristicPort | undefined
    for (const uuid of v4Profile.services) {
      this.assertCurrent(generation)
      try {
        const service = await timed(this.device.gatt!.getPrimaryService(uuid), 4000)
        this.assertCurrent(generation)
        activation = await timed(
          service.getCharacteristic(v4Profile.activationCharacteristic),
          4000,
        )
        break
      } catch (error) {
        if (!(error instanceof DOMException) || error.name !== 'NotFoundError') throw error
      }
    }
    this.assertCurrent(generation)
    if (!activation?.properties.writeWithoutResponse)
      throw new Error(
        'No encontramos la preparación de sesión esperada en esta unidad. Prueba apagarla y conectarla de nuevo.',
      )
    await this.setLight(state)
    this.assertCurrent(generation)
    this.activationAttempted = true
    this.expectedDrop = true
    try {
      try {
        await timed(activation.writeValueWithoutResponse(new Uint8Array([1])), 4000)
      } catch (error) {
        if (this.device.gatt?.connected) throw error
      }
      this.assertCurrent(generation)
      this.characteristic = undefined
      this.lastPacket = ''
      this.device.gatt?.disconnect()
      await wait(1500)
      this.assertCurrent(generation)
      await this.connect() // Fresh service/characteristic references after the restart.
    } finally {
      this.expectedDrop = false
    }
  }

  private invalidate() {
    this.generation += 1
    this.characteristic = undefined
    this.pending = undefined
    this.lastPacket = ''
    this.pump = undefined
  }

  disconnect(): Promise<void> {
    this.invalidate()
    this.device.removeEventListener('gattserverdisconnected', this.handleDisconnect)
    this.device.gatt?.disconnect()
    return Promise.resolve()
  }
}
