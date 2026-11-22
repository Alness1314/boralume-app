# SPEC-001 · BoraLume foundation

Status: implemented foundation plus experimental Ver. 4 Bluetooth control (SPEC-002). Physical verification and audio recognition are still pending.

## Product intention

BoraLume is an independent fan project for ARMY: a portable space to create light sequences, use them offline and eventually synchronize a personal ARMY Bomb to known music. Its founder and creative contributors will receive visible, accurate credit. The public founder identity has not been supplied; do not invent it.

## Required technology

- React + TypeScript + Vite for the shared client.
- Material UI (MUI) + Emotion for controls, forms and component theming.
- Tailwind CSS for responsive layout helpers. No duplicated button/form system or separate Tailwind color palette.
- React Hook Form + Zod for forms, validation and clear error messages.
- React Router for routes; the server must provide SPA fallback for direct links.
- PWA service worker with versioned local assets and an explicit update prompt.
- Native mobile target: Capacitor, reusing the client and using native adapters. Not installed in this foundation.
- A backend is not required for this version. If community accounts and moderation need one later, evaluate NestJS on Node.js separately.

## Design system

The single source of truth is `src/shared/theme/theme.ts`. Primary light mode: `#7040C8`; primary dark mode: `#C5A3FF`. Light background: `#F8F7FC`; dark background: `#141019`. Pair colors with readable text and semantic foreground/background roles. Do not scatter raw brand colors across feature JSX.

Use Manrope locally bundled, comfortable whitespace, restrained violet accents and rounded surfaces. The preview's RGB colors represent light output and are independent of the interface palette.

Appearance supports light/dark/system, default system, with MUI persistence under `boralume:theme`. Every screen supports mobile (320px and up), tablet and desktop. Provide keyboard focus, a skip link, accessible names and reduced-motion support. Never rely on hue alone to communicate selection or state.

## Reusable pieces

`Brand`, `PageHeader`, `SectionCard`, `ThemeMenu` and `FormTextField` implement recurring product responsibilities. `SequenceCard` and `LightstickPreview` remain feature components until needed elsewhere. Use MUI components directly when another wrapper provides no value.

Shared domain models: `LightState`, `LightCue`, `DemoSequence`, `LightstickDriver`, `RecognitionMatch`. Feature UI must not encode BLE bytes or recognition logic. Future adapters convert domain states into platform-specific commands.

## Routes and acceptance

### Studio `/`

- Show an explicitly labeled simulator and the fact that no device is connected.
- Switch to a connected-device label only after GATT service/characteristic verification. Connection is not proof of visible color output; physical confirmation is explicit and session-only.
- Choose one of six labeled light colors; report the current RGB value.
- Set brightness, play/stop a local demo, and turn off the preview immediately.
- Load a library demo from `?sequence=<id>`; unknown IDs fall back safely.
- Respect saved initial brightness and workspace name.
- Bluetooth is requested only after the user chooses to search for a Ver. 4. See `002-army-bomb-v4.md` for lifecycle, errors and preparation.
- Recognition is displayed as forthcoming, never as a working capability.

### Library `/library`

- Present three original, audio-free demo sequences included in the bundle.
- Each demo opens in the studio through a shareable URL.
- Describe forthcoming editor/import/community content without fake interactive actions.

### Settings `/settings`

- Validate workspace name (2-40 characters), declared lightstick model, brightness (0-100) and preference for softer effects.
- Use reusable RHF/MUI form bindings and accessible validation messages.
- Save only to `boralume:preferences:v1`; survive reload and corrupted data.
- Report storage denial instead of claiming success. No remote account or publication.
- Current demos have no strobe; the saved softer-effects setting is reserved for future effects.

## Offline contract

Production builds precache HTML, JS (including lazy routes), CSS, local fonts and icons. After first successful preparation, the shell, library, settings and simulator can reopen without network. Fresh installation and new versions need network. No external fonts/CDN, streaming music or remote API are needed to use this foundation.

PWA preparation is confirmed only after service-worker readiness. Updates use a prompt, never automatic activation during a session. Browser storage can be denied or removed. Native packaging, sequence import/export and dynamic offline catalogs remain future work.

## Repository and licensing

The supplied LICENSE is GPL-3.0 and has been preserved. The earlier architecture recommended AGPL if Olaf is integrated. No Olaf code, fingerprints or music files are included. Resolve the final license and third-party requirements before integrating a recognition engine. An open-source code license does not grant rights to audio or community artwork.

## Verification and release gate

- TypeScript strict mode, no explicit `any`, ESLint and production build.
- Domain clock tests: boundaries, looping and recovery after delayed ticks.
- Storage boundary tests: invalid/corrupt records and failed saves.
- Chromium desktop/mobile journeys: simulator, saved theme, validated/persisted preferences, actual service-worker offline navigation.
- Physical hardware validation is required before any BLE driver is labeled supported. iOS/WebKit validation remains required before declaring iPhone support.

## Deferred capabilities

Physical certification of the experimental V4 adapter, other model adapters; microphone capture and recognition; sequence editor and `.armypack`; IndexedDB catalog; creator credits; Capacitor builds; native desktop; multiple devices. Implement each behind an explicit specification and real capability checks.
