# Architecture

```
app/                          Composition, providers, routes, shell, errors, PWA updates
features/studio/              Interactive local light preview
features/library/             Original demo data and sequence cards
features/settings/            Validated preferences and persistence schema
shared/components/            Reusable product UI, accessible MUI form bindings
shared/theme/                 Semantic palette, modes, typography, MUI defaults
shared/hooks/                 Reusable browser subscriptions
shared/lib/                   Safe storage boundary
core/                         Framework-independent domain contracts and time logic
devices/army-bomb-v4/          Experimental V4 protocol and serialized GATT adapter
features/device/              Observable connection lifecycle, provider and reusable panel
```

Dependency direction: `app -> features -> shared/core`. Shared components must not import feature behavior. Core never imports UI. Tests may use fixtures from features.

## Current decisions

1. **Feature organization over a large monorepo.** One runnable web app is enough now. Move packages when native consumers actually need them.
2. **MUI owns the visual system.** Its CSS variables and color schemes define both modes. Tailwind is limited to layout and spacing. `GlobalStyles` must declare layer order as the first child of `StyledEngineProvider`; declaring it only in the external stylesheet allows Emotion's global styles to register `mui` before Tailwind's reset. Use `sx` for MUI 9 system styling.
3. **Small state scope.** Preview state belongs to the studio and stops on unmount. There is no global state library without a shared-state requirement. Preferences are validated on read and saved explicitly.
4. **Absolute demo clock.** Position derives from elapsed monotonic time rather than advancing one cue per timer callback. Delayed renders catch up to the current cue. It can drive the experimental V4 adapter but is not an audio scheduler.
5. **Offline assets, no remote dependency.** The PWA precaches lazy routes and local fonts. `clientsClaim` takes control after initial activation; `skipWaiting` is not automatic. New builds prompt for activation. A production server must use SPA fallback and HTTPS (localhost is allowed for development).
6. **Experimental V4 adapter.** Root-owned `V4Connection` exposes an immutable snapshot via `useSyncExternalStore`; the adapter serializes BLE writes and invalidates stale operations on disconnect. Protocol data is separate from React and browser transport interfaces. Real hardware validation is still required. Test doubles are injected only by tests, never enabled as a pretend device in production.
7. **Build dependency exception.** Workbox 7.4.1 depends on a deprecated `glob` 11 range with known denial-of-service advisories. Override only Workbox's `glob` to 14.0.2; verify generation with the production build and real offline E2E. Remove this override when Workbox updates its supported range.

## Evolution

First physically validate the experimental V4 driver and then the microphone pipeline. Extend the existing device/session orchestration with local catalog storage and import/export. For recognition, evaluate Olaf WASM and dynamic reference loading behind a `RecognitionEngine` contract after resolving licensing. Capacitor will supply native BLE and audio adapters where browser APIs are insufficient. Add a server only for features that actually require shared data.
