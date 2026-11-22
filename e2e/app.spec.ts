import { expect, test } from '@playwright/test'

test('the simulator changes colors, plays a sequence and turns off', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dale luz a lo que sientes.')
  // Catch MUI/Tailwind layer regressions that behavioral checks alone miss.
  expect(
    await page
      .getByRole('heading', { level: 1 })
      .evaluate((element) => parseFloat(getComputedStyle(element).fontSize)),
  ).toBeGreaterThanOrEqual(32)
  await page.getByRole('button', { name: 'Rosa', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Rosa', exact: true })).toHaveCSS(
    'background-color',
    'rgb(243, 153, 203)',
  )
  await expect(page.getByTestId('current-color')).toHaveText('#F399CB')
  await page.getByRole('button', { name: 'Reproducir demo' }).click()
  await expect(page.getByRole('button', { name: 'Detener demo' })).toBeVisible()
  await page.getByRole('button', { name: 'Apagar', exact: true }).click()
  await expect(page.getByTestId('current-color')).toHaveText('#000000')
  await page.getByRole('button', { name: 'Conectar Ver. 4' }).click()
  await expect(page.getByRole('dialog')).toContainText('Vamos a conectar tu Ver. 4')
})

test('theme preference survives reload', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Cambiar apariencia' }).click()
  await page.getByRole('menuitem', { name: 'Oscuro' }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.getByRole('button', { name: 'Cambiar apariencia' }).click()
  await page.getByRole('menuitem', { name: 'Claro', exact: true }).click()
  await expect(page.locator('html')).toHaveClass(/light/)
})

test('settings validate and survive reload; saved brightness reaches the studio', async ({
  page,
}) => {
  await page.goto('/settings')
  await page.getByLabel('Nombre de tu espacio').fill('A')
  await page.getByRole('button', { name: 'Guardar preferencias' }).click()
  await expect(page.getByText('Escribe al menos 2 caracteres.')).toBeVisible()
  await page.getByLabel('Nombre de tu espacio').fill('El universo de Luna')
  const brightness = page.getByRole('slider', { name: /Brillo inicial/ })
  await brightness.focus()
  await brightness.press('Home')
  await brightness.press('ArrowRight')
  await page.getByRole('button', { name: 'Guardar preferencias' }).click()
  await expect(page.getByText('Tus preferencias se guardaron en este dispositivo.')).toBeVisible()
  await page.reload()
  await expect(page.getByLabel('Nombre de tu espacio')).toHaveValue('El universo de Luna')
  await page.goto('/')
  await expect(page.getByRole('slider', { name: 'Brillo', exact: true })).toHaveValue('1')
  await expect(page.getByText('El universo de Luna')).toBeVisible()
})

test('the prepared PWA opens and navigates without a network', async ({ page, context }) => {
  await page.goto('/')
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
    if (!navigator.serviceWorker.controller) {
      await new Promise<void>((resolve) =>
        navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), {
          once: true,
        }),
      )
    }
  })
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dale luz a lo que sientes.')
  await page
    .getByRole('navigation', { name: /Navegación (principal|móvil)/ })
    .filter({ visible: true })
    .getByRole('link', { name: 'Biblioteca' })
    .click()
  await expect(page.getByRole('heading', { name: 'Tu colección de luz.' })).toBeVisible()
  await page.getByRole('link', { name: 'Probar Daydream' }).click()
  await expect(page.getByText('Daydream', { exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})
