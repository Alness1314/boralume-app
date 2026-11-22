import type { LightState } from '../../core/light'
import { ArmyBombV4Driver, CancelledDeviceOperation } from '../../devices/army-bomb-v4/driver'
import type { BluetoothPort } from '../../devices/army-bomb-v4/ports'
import { v4Profile } from '../../devices/army-bomb-v4/protocol'

export type DeviceStatus =
  'idle' | 'choosing' | 'connecting' | 'connected' | 'preparing' | 'disconnected' | 'error'
export interface DeviceSnapshot {
  status: DeviceStatus
  name: string
  message: string | null
  confirmed: boolean
  canPrepare: boolean
}

function errorMessage(error: unknown): string {
  if (error instanceof DOMException) {
    if (error.name === 'SecurityError' || error.name === 'NotAllowedError')
      return 'El navegador bloqueó Bluetooth. Abre BoraLume en una pestaña de Chrome o Edge y permite la conexión.'
    if (error.name === 'NotFoundError')
      return 'No se completó la selección o no encontramos el servicio Ver. 4. Comprueba el modo Bluetooth y vuelve a intentar.'
    if (error.name === 'NetworkError')
      return 'No pudimos comunicarnos con la ARMY Bomb. Cierra otras apps conectadas y vuelve a intentar.'
  }
  return error instanceof Error && error.message
    ? error.message
    : 'No pudimos conectar tu ARMY Bomb. Vuelve a intentar.'
}

export class V4Connection {
  private snapshot: DeviceSnapshot = {
    status: 'idle',
    name: '',
    message: null,
    confirmed: false,
    canPrepare: true,
  }
  private listeners = new Set<() => void>()
  private driver?: ArmyBombV4Driver
  private generation = 0
  private busy = false

  constructor(private readonly getBluetooth: () => BluetoothPort | undefined) {}
  getSnapshot = () => this.snapshot
  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
  private update(patch: Partial<DeviceSnapshot>) {
    this.snapshot = { ...this.snapshot, ...patch }
    this.listeners.forEach((listener) => listener())
  }

  async connect(): Promise<void> {
    if (this.busy || this.snapshot.status === 'connected') return
    const bluetooth = this.getBluetooth()
    if (!bluetooth) {
      this.update({
        status: 'error',
        message: 'Bluetooth no está disponible. Usa Chrome o Edge en un equipo compatible.',
      })
      return
    }
    this.busy = true
    const generation = ++this.generation
    this.update({ status: 'choosing', message: null, confirmed: false, name: '' })
    let driver: ArmyBombV4Driver | undefined
    try {
      // Must stay before any await: requestDevice requires the user's click gesture.
      const device = await bluetooth.requestDevice({
        filters: [{ name: 'BTS_V4 LS' }, { namePrefix: 'BBOMB-' }],
        optionalServices: [...v4Profile.services],
      })
      if (generation !== this.generation) {
        device.gatt?.disconnect()
        return
      }
      driver = new ArmyBombV4Driver(device, () => {
        if (this.driver !== driver) return
        this.update({
          status: 'disconnected',
          confirmed: false,
          message: 'Se desconectó tu ARMY Bomb. La vista previa sigue disponible.',
        })
      })
      this.driver = driver
      this.update({ status: 'connecting', name: driver.name, canPrepare: true })
      await driver.connect()
      if (generation !== this.generation) {
        void driver.disconnect()
        return
      }
      this.update({ status: 'connected', message: null })
    } catch (error) {
      if (generation !== this.generation) return
      void driver?.disconnect()
      this.driver = undefined
      this.update({ status: 'error', message: errorMessage(error) })
    } finally {
      this.busy = false
    }
  }

  async send(state: LightState): Promise<void> {
    const driver = this.driver
    if (!driver || this.snapshot.status !== 'connected') return
    try {
      await driver.setLight(state)
    } catch (error) {
      if (
        error instanceof CancelledDeviceOperation ||
        this.driver !== driver ||
        this.snapshot.status !== 'connected'
      )
        return
      void driver.disconnect()
      this.update({ status: 'error', confirmed: false, message: errorMessage(error) })
    }
  }

  async prepare(state: LightState): Promise<void> {
    const driver = this.driver
    if (!driver || this.busy || this.snapshot.status !== 'connected') return
    this.busy = true
    const generation = this.generation
    this.update({ status: 'preparing', confirmed: false, message: null })
    try {
      await driver.prepareControl(state)
      if (this.generation !== generation) return
      this.update({
        status: 'connected',
        canPrepare: driver.canPrepare,
        message: 'Sesión preparada. Prueba los colores otra vez.',
      })
    } catch (error) {
      if (this.generation !== generation) return
      void driver.disconnect()
      this.update({
        status: 'error',
        canPrepare: driver.canPrepare,
        confirmed: false,
        message: errorMessage(error),
      })
    } finally {
      this.busy = false
    }
  }

  confirm() {
    if (this.snapshot.status === 'connected')
      this.update({ confirmed: true, message: 'Control confirmado por ti en esta sesión.' })
  }
  disconnect = () => {
    this.generation += 1
    void this.driver?.disconnect()
    this.driver = undefined
    this.update({ status: 'idle', name: '', confirmed: false, canPrepare: true, message: null })
  }
}
