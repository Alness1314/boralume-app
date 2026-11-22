# SPEC-002 · Experimental ARMY Bomb Ver. 4 control

Status: implemented against documented protocol and deterministic BLE test doubles. **Not validated on physical hardware by this project.**

## Scope

One ARMY Bomb Ver. 4, browser Web Bluetooth transport, manual RGB/brightness/blackout and existing demo sequences. Recognition by microphone, other models, firmware changes and native mobile packaging are excluded.

## Connection and UI

- The connection panel gives preparation instructions before opening the browser chooser. Call `requestDevice` in the user's search handler before any asynchronous work.
- Filter on exact `BTS_V4 LS` or `BBOMB-` prefix, with only documented V4 services authorized. Never silently scan or request all nearby devices.
- Validate the `0001fe01-0000-1000-8000-00805f9800c4` service and `0001ff01-0000-1000-8000-00805f9800c4` writable characteristic. A friendly advertised name is not sufficient.
- States: idle, choosing, connecting, connected, preparing, disconnected, error. Cancellation invalidates outstanding operations. A stale chooser/connect result must never revive a canceled session.
- `connected` means a GATT connection and expected write capability, not certified device compatibility or observed LED color. Only a manual confirmation changes the visual-control confirmation, and it lasts for that session.
- Verify controls send pure red, green and blue at 100% brightness; blackout sends zero RGB. Normal palette, brightness and demos use the same adapter.
- Show browser/API errors and remain usable as a simulator. iOS Safari has no standard Web Bluetooth path; guide users to a compatible environment. Localhost is a secure context; a phone opening an HTTP LAN address is not equivalent.

## Protocol and queue

Four bytes: R, G, B, transition (currently 0 for immediate output). Scale each RGB channel by brightness and round, validate finite brightness and six-digit hexadecimal colors. Use writes with response for the color characteristic.

Serialize requests, retain the latest requested state while busy, deduplicate identical packets and limit successful write rate to at most one per 80 ms. Never replay an outdated backlog after an interruption. Timeout GATT connection at 12 seconds, discovery at 5 seconds per initial step, and writes at 4 seconds. A failure closes the link and becomes a visible error; no automatic retry loop.

## Optional blue-blinking preparation

Normal connect does not commit or touch effects. If the wand is still in the pairing animation, the user can explicitly choose `Sigue azul: preparar control`:

1. Find `0001ff13-0000-1000-8000-00805f9800c4` within the authorized V4 services and verify write-without-response support.
2. Serialize the current color write, then send activation byte `01` **once per selected session**, never per color.
3. Treat the expected link drop as preparation, not successful ongoing control. Close the old GATT link, wait 1.5 seconds and make exactly one reconnect attempt.
4. Reacquire services and characteristics; do not reuse objects invalidated by disconnect. Synchronize the current preview after reconnect.
5. If the user cancels during the wait, do not reconnect. Failure is visible; another deliberate selection/power cycle is required for a new attempt.

Only color and this documented activation characteristic are written. Do not probe other writable characteristics or firmware/effect commands. The fourth-byte interpretation and activation behavior come from community observations and must be checked on the target firmware.

## Lifecycle and privacy

The root provider owns one connection, which survives route navigation. Leaving the studio stops its demo timer; the device can hold its last color until the next command. Disconnect releases the link; it does not promise to physically turn off the LEDs. Users should press Apagar before disconnecting when that is their intention.

Unexpected loss invalidates queued writes, clears visual confirmation, pauses the demo and reports the disconnect. Stale write completions cannot mutate a newer session. Service-worker activation is disabled while choosing, connecting, preparing or connected. There is no background scanning, device-address persistence, microphone access or remote telemetry.

## Validation

- Unit tests: packet conversion, invalid input, queue coalescing, cancellation, one-shot preparation, new GATT references, unsupported API, permissions, incompatible services, stale chooser and write failures.
- E2E: an injected browser BLE test double checks click-only selection, real adapter packet output, brightness/blackout, navigation, preparation, disconnect and unsupported browsers. It is a transport simulation, not a hardware certification.
- All earlier theme, form, responsive and offline tests still apply.
- Real device gate: run `docs/hardware-v4-checklist.md`, record environment and observed results, then decide supported firmware/platform combinations.

## References

- [Web Bluetooth - Chrome Developers](https://developer.chrome.com/docs/capabilities/bluetooth)
- [ARMY Light protocol observations](https://github.com/jjanisheck/army-light/blob/main/docs/PROTOCOL.md)

The implementation is original and uses those observations as interoperability evidence. No protocol, logo or sequence source was copied from Bora Waves.
