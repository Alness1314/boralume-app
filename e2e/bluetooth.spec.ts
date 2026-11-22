import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { v4Profile } from '../src/devices/army-bomb-v4/protocol'

interface BleHarness {
  writes: number[][]
  activations: number[][]
  requested: number
  connects: number
  failWrites: boolean
  drop(): void
}
declare global {
  interface Window {
    __bleTest: BleHarness
  }
}

async function installBluetooth(page: Page) {
  await page.addInitScript((profile) => {
    let connected = false
    const harness: BleHarness = {
      writes: [],
      activations: [],
      requested: 0,
      connects: 0,
      failWrites: false,
      drop: () => {
        connected = false
        device.dispatchEvent(new Event('gattserverdisconnected'))
      },
    }
    function bytes(value: BufferSource) {
      return Array.from(
        ArrayBuffer.isView(value)
          ? new Uint8Array(value.buffer, value.byteOffset, value.byteLength)
          : new Uint8Array(value),
      )
    }
    const gatt = {
      get connected() {
        return connected
      },
      connect: async () => {
        connected = true
        harness.connects += 1
        return gatt
      },
      disconnect: () => {
        if (connected) harness.drop()
      },
      getPrimaryService: async (uuid: string) => {
        if (uuid !== profile.colorService && uuid !== profile.services[4])
          throw new DOMException('Not found', 'NotFoundError')
        return {
          getCharacteristic: async (id: string) => {
            if (uuid === profile.colorService && id === profile.colorCharacteristic)
              return {
                properties: { write: true, writeWithoutResponse: false },
                writeValueWithResponse: async (value: BufferSource) => {
                  if (harness.failWrites) throw new DOMException('Write failed', 'NetworkError')
                  harness.writes.push(bytes(value))
                },
              }
            if (uuid === profile.services[4] && id === profile.activationCharacteristic)
              return {
                properties: { write: false, writeWithoutResponse: true },
                writeValueWithoutResponse: async (value: BufferSource) => {
                  harness.activations.push(bytes(value))
                  harness.drop()
                },
              }
            throw new DOMException('Not found', 'NotFoundError')
          },
        }
      },
    }
    const device = Object.assign(new EventTarget(), { name: 'BTS_V4 LS', gatt })
    Object.defineProperty(navigator, 'bluetooth', {
      configurable: true,
      value: {
        requestDevice: async () => {
          harness.requested += 1
          return device
        },
      },
    })
    window.__bleTest = harness
  }, v4Profile)
}

async function connect(page: Page) {
  await page.getByRole('button', { name: 'Conectar Ver. 4' }).click()
  await page.getByRole('button', { name: 'Buscar ARMY Bomb' }).click()
  await expect(page.getByRole('button', { name: 'Probar rojo', exact: true })).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.__bleTest.writes.length)).toBeGreaterThan(0)
}

test('connects only after a click, sends RGB/brightness/off and preserves session across routes', async ({
  page,
}) => {
  await installBluetooth(page)
  await page.goto('/')
  expect(await page.evaluate(() => window.__bleTest.requested)).toBe(0)
  await connect(page)
  for (const [label, packet] of [
    ['rojo', [255, 0, 0, 0]],
    ['verde', [0, 255, 0, 0]],
    ['azul', [0, 0, 255, 0]],
  ] as const) {
    await page.getByRole('button', { name: `Probar ${label}`, exact: true }).click()
    await expect
      .poll(() => page.evaluate(() => window.__bleTest.writes.at(-1)))
      .toEqual([...packet])
  }
  await page.getByRole('slider', { name: 'Brillo', exact: true }).focus()
  await page.getByRole('slider', { name: 'Brillo', exact: true }).press('Home')
  await expect.poll(() => page.evaluate(() => window.__bleTest.writes.at(-1))).toEqual([0, 0, 0, 0])
  await page.getByRole('button', { name: 'Sí, los colores funcionan' }).click()
  await expect(page.getByRole('status')).toContainText('Control confirmado')
  await page
    .getByRole('navigation', { name: /Navegación (principal|móvil)/ })
    .filter({ visible: true })
    .getByRole('link', { name: 'Biblioteca' })
    .click()
  await page.getByRole('link', { name: 'Probar Daydream' }).click()
  await expect(page.getByRole('button', { name: 'Probar apagado', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Probar apagado', exact: true }).click()
  await expect.poll(() => page.evaluate(() => window.__bleTest.writes.at(-1))).toEqual([0, 0, 0, 0])
  await page.getByRole('button', { name: 'Desconectar', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Conectar Ver. 4' })).toBeVisible()
  expect(await page.evaluate(() => window.__bleTest.activations)).toEqual([])
})

test('prepares the blue-blinking session once, then reports a real disconnect', async ({
  page,
}) => {
  await installBluetooth(page)
  await page.goto('/')
  await connect(page)
  await page.getByRole('button', { name: 'Sigue azul: preparar control' }).click()
  await expect(page.getByRole('status')).toContainText('Preparando')
  await expect(page.getByRole('button', { name: 'Probar rojo', exact: true })).toBeVisible()
  expect(await page.evaluate(() => window.__bleTest.activations)).toEqual([[1]])
  expect(await page.evaluate(() => window.__bleTest.connects)).toBe(2)
  await expect(page.getByRole('button', { name: 'Sigue azul: preparar control' })).toBeDisabled()
  await page.getByRole('button', { name: 'Reproducir demo' }).click()
  await page.evaluate(() => window.__bleTest.drop())
  await expect(page.getByRole('status')).toContainText('Conexión perdida')
  await expect(page.getByRole('button', { name: 'Reproducir demo' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Probar rojo', exact: true })).toHaveCount(0)
})

test('a write failure is visible and leaves the simulator usable', async ({ page }) => {
  await installBluetooth(page)
  await page.goto('/')
  await connect(page)
  await page.evaluate(() => {
    window.__bleTest.failWrites = true
  })
  await page.getByRole('button', { name: 'Probar rojo', exact: true }).click()
  await expect(
    page.getByText(
      'No pudimos comunicarnos con la ARMY Bomb. Cierra otras apps conectadas y vuelve a intentar.',
    ),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Conectar Ver. 4' })).toBeVisible()
  await page.getByRole('button', { name: 'Rosa', exact: true }).click()
  await expect(page.getByTestId('current-color')).toHaveText('#F399CB')
})

test('unsupported browsers explain the limit without disabling the simulator', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'bluetooth', { configurable: true, value: undefined }),
  )
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Conectar Ver. 4' })).toBeDisabled()
  await expect(page.getByText(/Este navegador no ofrece Bluetooth web/)).toBeVisible()
  await page.getByRole('button', { name: 'Rosa', exact: true }).click()
  await expect(page.getByTestId('current-color')).toHaveText('#F399CB')
})
