# BoraLume

**Tu música, tu luz.** Un proyecto fan abierto para explorar colores y construir una experiencia de luz para la comunidad ARMY.

## Empezar

Requiere Node.js **22.13 o superior** y npm.

```sh
npm ci
npm run dev
```

Abre la dirección local que muestra Vite. Para probar la PWA real:

```sh
npm run build
npm run preview
```

## Qué funciona hoy

- Estudio con simulador visual y control Bluetooth **experimental para Ver. 4**: paleta, brillo, demos en bucle y apagado.
- Selector de dispositivo, pruebas RGB, confirmación visual y preparación opcional si la Ver. 4 sigue parpadeando azul.
- Biblioteca de tres secuencias originales sin audio.
- Ajustes con validación y almacenamiento local.
- Apariencia morada clara, oscura o según el sistema, persistida por navegador.
- Interfaz responsive, componentes reutilizables y fuentes locales.
- PWA con recursos offline y aviso de actualización en producción.

**El control Bluetooth Ver. 4 está implementado, pero aún no ha sido validado con hardware físico por este proyecto.** Se envían comandos sólo después de que elijas conectar un dispositivo. Usa Chrome/Edge compatible en un contexto seguro (HTTPS o localhost); Safari/iPhone necesita otra vía. El reconocimiento de canciones sigue pendiente. El uso offline requiere una primera carga completa y no incluye streaming ni nuevos catálogos.

## Stack

React + TypeScript + Vite; Material UI + Emotion; Tailwind para layout; React Hook Form + Zod; React Router; vite-plugin-pwa; Vitest y Playwright. MUI controla formularios, controles y tema. Las versiones exactas se guardan en `package.json` y `package-lock.json`.

El cliente funciona sin backend. Capacitor para móvil, otros modelos BLE y reconocimiento local pertenecen a las siguientes etapas.

## Comprobaciones

```sh
npm run check
npx playwright install chromium
npm run test:e2e
```

Los E2E necesitan un build previo (`npm run build`) y arrancan el preview de producción automáticamente. Comprueban móvil/escritorio, temas, formularios, simulador, navegación realmente offline y el flujo BLE con un transporte simulado inyectado sólo por las pruebas. No certifican hardware ni Safari/iOS.

## Especificaciones y colaboración

- [Especificación inicial](docs/specs/001-foundation.md)
- [Arquitectura y decisiones](docs/architecture.md)
- [Especificación Bluetooth Ver. 4](docs/specs/002-army-bomb-v4.md)
- [Guía para la primera prueba física](docs/hardware-v4-checklist.md)
- [Guía de contribución](CONTRIBUTING.md)
- [Reglas de implementación](AGENTS.md)

La identidad pública de la fundadora está pendiente de definir con ella; cada futura secuencia tendrá autoría propia. Proyecto independiente sin afiliación oficial con BTS o HYBE.

## Licencia

Se conserva la licencia **GPL-3.0** proporcionada en el repositorio. Antes de integrar Olaf (AGPL-3.0), deberá resolverse y documentarse la compatibilidad y licencia final. Esta base no incluye Olaf ni contenido musical ajeno. Consulta [LICENSE](LICENSE).
