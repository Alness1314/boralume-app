// Narrow transport contracts keep native browser objects and test doubles interchangeable.
export interface CharacteristicPort {
  readonly properties: { readonly write: boolean; readonly writeWithoutResponse: boolean }
  writeValueWithResponse(value: BufferSource): Promise<void>
  writeValueWithoutResponse(value: BufferSource): Promise<void>
}
export interface ServicePort {
  getCharacteristic(uuid: string): Promise<CharacteristicPort>
}
export interface GattPort {
  readonly connected: boolean
  connect(): Promise<GattPort>
  disconnect(): void
  getPrimaryService(uuid: string): Promise<ServicePort>
}
export interface DevicePort {
  readonly name?: string
  readonly gatt?: GattPort
  addEventListener(type: 'gattserverdisconnected', callback: () => void): void
  removeEventListener(type: 'gattserverdisconnected', callback: () => void): void
}
export interface BluetoothPort {
  requestDevice(options: RequestDeviceOptions): Promise<DevicePort>
}
