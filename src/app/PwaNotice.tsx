import { Alert, Button, Snackbar } from '@mui/material'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useDevice } from '../features/device/device-context'

export function PwaNotice() {
  const { device } = useDevice()
  const deviceActive = ['connected', 'connecting', 'choosing', 'preparing'].includes(device.status)
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()
  function close() {
    setOfflineReady(false)
    setNeedRefresh(false)
  }
  return (
    <Snackbar
      open={needRefresh || (offlineReady && !deviceActive)}
      autoHideDuration={needRefresh ? null : 6000}
      onClose={close}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        severity="info"
        onClose={close}
        action={
          needRefresh ? (
            <Button
              color="inherit"
              size="small"
              disabled={deviceActive}
              onClick={() => {
                if (!deviceActive) void updateServiceWorker(true)
              }}
            >
              Actualizar
            </Button>
          ) : undefined
        }
      >
        {needRefresh
          ? deviceActive
            ? 'Hay una nueva versión. Desconecta tu ARMY Bomb antes de actualizar.'
            : 'Hay una nueva versión. Actualiza cuando termines tu demo.'
          : 'BoraLume y sus demos ya están disponibles sin conexión.'}
      </Alert>
    </Snackbar>
  )
}
