# BoraLume: working agreement

Read `docs/specs/001-foundation.md` before adding features and update the relevant specification when behavior changes.

## Architecture

- Use React + strict TypeScript. Keep domain contracts and pure functions in `src/core` free of React and browser APIs.
- Organize product behavior under `src/features/<feature>` and reusable UI/infrastructure under `src/shared`.
- Use MUI for forms, buttons, dialogs, menus, navigation and accessible controls. Use Tailwind for layout utilities, not a second set of component styles.
- Centralize app colors, typography and component defaults in `src/shared/theme/theme.ts`. Consume semantic theme tokens in features. Light output colors are domain data, not app theme colors.
- Support light, dark and system appearance. Do not introduce page-specific theme providers or independent copies of the palette.
- Reuse existing components before introducing abstractions. Do not wrap every MUI component without a shared product responsibility.
- Use React Hook Form + Zod for validated forms. Boundary data from storage and imported packages must be validated.
- Keep device, audio, storage and catalog adapters behind explicit interfaces. Never invoke Bluetooth or microphone permission prompts on mount.
- Mark demo and planned capabilities honestly. A simulated light is not a connected device.
- Respect reduced motion, keyboard navigation, accessible labels and narrow viewports.
- Do not add a mandatory backend/account for local playback. Never hot-reload a service worker during a running session.
- Preserve existing licenses. Olaf is not integrated; resolve its AGPL obligations before importing it into this GPL repository.

## Verification

- Run `npm run check` for implementation changes; run `npm run test:e2e` when changing navigation, persistence, themes or offline behavior.
- Build before E2E because it runs against production preview. Keep tests focused on behavior and failure boundaries.
- Review at least a mobile and desktop viewport in both themes after material UI changes.
- Do not commit generated build, report or dependency directories. Never push or publish without the user's request.

## Communication

Product copy is Spanish initially. Code symbols and technical documentation may use English. Keep messages friendly and clear; technical implementation details belong in documentation rather than user-facing flows.
