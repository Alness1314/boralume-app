import { useState } from 'react'
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import BluetoothRounded from '@mui/icons-material/BluetoothRounded'
import CheckCircleOutlineRounded from '@mui/icons-material/CheckCircleOutlineRounded'
import { SectionCard } from '../../shared/components/SectionCard'
import type { HexColor, LightState } from '../../core/light'
import { useDevice } from './device-context'

const testColors: ReadonlyArray<{ label: string; color: HexColor }> = [
  { label: 'rojo', color: '#FF0000' },
  { label: 'verde', color: '#00FF00' },
  { label: 'azul', color: '#0000FF' },
]

export function DevicePanel({
  light,
  onTest,
  onOff,
}: {
  light: LightState
  onTest: (color: HexColor) => void
  onOff: () => void
}) {
  const { connection, device } = useDevice()
  const [instructionsOpen, setInstructionsOpen] = useState(false)
  const available = window.isSecureContext && Boolean(navigator.bluetooth)
  const connected = device.status === 'connected'
  const busy = ['choosing', 'connecting', 'preparing'].includes(device.status)
  const statusText =
    device.status === 'choosing'
      ? 'Elige tu dispositivo en el navegador…'
      : device.status === 'connecting'
        ? 'Conectando con tu ARMY Bomb…'
        : device.status === 'preparing'
          ? 'Preparando la sesión y reconectando…'
          : connected
            ? device.confirmed
              ? 'Control confirmado'
              : 'Conectada · prueba los colores'
            : device.status === 'disconnected'
              ? 'Conexión perdida'
              : 'Sin dispositivo conectado'

  return (
    <div className="mb-6">
      <SectionCard
        title="Tu ARMY Bomb Ver. 4"
        description="Conecta, prueba los colores y crea tu propia ola de luz."
        action={<Chip size="small" label="Experimental" variant="outlined" />}
      >
        <Stack spacing={2}>
          <Typography
            variant="body2"
            role="status"
            color={connected ? 'success.main' : 'text.secondary'}
          >
            {statusText}
            {connected && device.name ? ` · ${device.name}` : ''}
          </Typography>
          {busy && <LinearProgress aria-label={statusText} />}
          {!available && (
            <Alert severity="info">
              Este navegador no ofrece Bluetooth web. Abre esta misma dirección en Chrome o Edge en
              Windows, macOS o Android. En iPhone hará falta la futura app nativa o un navegador BLE
              compatible. Para una dirección remota se necesita HTTPS.
            </Alert>
          )}
          {device.message && (
            <Alert
              severity={
                device.status === 'error' || device.status === 'disconnected' ? 'warning' : 'info'
              }
            >
              {device.message}
            </Alert>
          )}
          <div className="flex flex-wrap items-center gap-3">
            {!connected && !busy && (
              <Button
                variant="contained"
                startIcon={<BluetoothRounded />}
                disabled={!available}
                onClick={() => setInstructionsOpen(true)}
              >
                Conectar Ver. 4
              </Button>
            )}
            {(connected || busy) && (
              <Button variant="outlined" onClick={connection.disconnect}>
                {busy ? 'Cancelar conexión' : 'Desconectar'}
              </Button>
            )}
            {connected &&
              testColors.map(({ label, color }) => (
                <Button key={color} variant="outlined" onClick={() => onTest(color)}>
                  Probar {label}
                </Button>
              ))}
            {connected && (
              <Button variant="outlined" onClick={onOff}>
                Probar apagado
              </Button>
            )}
          </div>
          {connected && (
            <>
              <Typography variant="body2" color="text.secondary">
                La paleta, el brillo y las demos ahora se envían a tu ARMY Bomb. Las pruebas RGB
                usan brillo completo. Comprueba los colores en la luz; el navegador no puede
                verificar lo que ves.
              </Typography>
              {!device.confirmed && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    startIcon={<CheckCircleOutlineRounded />}
                    onClick={() => connection.confirm()}
                  >
                    Sí, los colores funcionan
                  </Button>
                  <Button
                    disabled={!device.canPrepare}
                    onClick={() => void connection.prepare(light)}
                  >
                    Sigue azul: preparar control
                  </Button>
                </div>
              )}
              {!device.confirmed && (
                <Typography variant="caption" color="text.secondary">
                  Si sigue parpadeando azul, la preparación reinicia el enlace una sola vez. Si
                  falla, apaga la ARMY Bomb y vuelve a conectarla. Desconectar no garantiza apagar
                  la luz: usa primero Apagar.
                </Typography>
              )}
            </>
          )}
          {!connected && !busy && (
            <Typography variant="caption" color="text.secondary">
              El simulador funciona sin Bluetooth. El control Ver. 4 está listo para probar, todavía
              sin validación física en este proyecto.
            </Typography>
          )}
        </Stack>
      </SectionCard>
      <Dialog
        open={instructionsOpen}
        onClose={() => setInstructionsOpen(false)}
        aria-labelledby="v4-pairing-title"
      >
        <DialogTitle id="v4-pairing-title">Vamos a conectar tu Ver. 4</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="body2">
              1. Activa Bluetooth en tu teléfono o computadora.
            </Typography>
            <Typography variant="body2">
              2. Con la ARMY Bomb apagada, mantén ambos botones presionados unos 2 segundos, hasta
              que parpadee azul.
            </Typography>
            <Typography variant="body2">
              3. Cierra Weverse, la app oficial y otras pestañas que estén conectadas a la ARMY
              Bomb.
            </Typography>
            <Typography variant="body2">
              4. Pulsa Buscar y selecciona BTS_V4 LS o el dispositivo que empieza con BBOMB-.
            </Typography>
            <Alert severity="info">
              Después de conectar, prueba rojo, verde, azul y apagado. Este perfil es sólo para Ver.
              4.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInstructionsOpen(false)}>Ahora no</Button>
          <Button
            variant="contained"
            startIcon={<BluetoothRounded />}
            onClick={() => {
              setInstructionsOpen(false)
              void connection.connect()
            }}
          >
            Buscar ARMY Bomb
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
