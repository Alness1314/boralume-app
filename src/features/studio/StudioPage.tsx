import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Slider,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded'
import PauseRounded from '@mui/icons-material/PauseRounded'
import StopRounded from '@mui/icons-material/StopRounded'
import GraphicEqRounded from '@mui/icons-material/GraphicEqRounded'
import ArrowOutwardRounded from '@mui/icons-material/ArrowOutwardRounded'
import WbSunnyOutlined from '@mui/icons-material/WbSunnyOutlined'
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined'
import { Link, useSearchParams } from 'react-router-dom'
import { PageHeader } from '../../shared/components/PageHeader'
import { SectionCard } from '../../shared/components/SectionCard'
import { lightColors, findSequence } from '../library/sequences'
import { readStored } from '../../shared/lib/storage'
import { defaultPreferences, preferencesKey, preferencesSchema } from '../settings/preferences'
import { LightstickPreview } from './LightstickPreview'
import { useLightPreview } from './useLightPreview'
import { DevicePanel } from '../device/DevicePanel'
import { useDevice } from '../device/device-context'
import type { HexColor } from '../../core/light'

export function StudioPage() {
  const [params] = useSearchParams()
  const sequence = findSequence(params.get('sequence'))
  const [preferences] = useState(() =>
    readStored(preferencesKey, preferencesSchema, defaultPreferences),
  )
  const preview = useLightPreview(sequence, preferences.defaultBrightness)
  const { connection, device } = useDevice()
  const { color, brightness, pausePlayback } = preview
  useEffect(() => {
    if (device.status === 'connected') void connection.send({ color, brightness })
  }, [color, brightness, device.status, connection])
  useEffect(() => {
    if (device.status === 'disconnected' || device.status === 'error') pausePlayback()
  }, [device.status, pausePlayback])
  function testColor(color: HexColor) {
    preview.setBrightness(100)
    preview.selectColor(color)
  }

  return (
    <>
      <PageHeader
        eyebrow="TU PEQUEÑO UNIVERSO DE LUZ"
        title="Dale luz a lo que sientes."
        description="Un color para cada emoción. Un espacio para crear, compartir y brillar juntas."
      />
      <DevicePanel light={{ color, brightness }} onTest={testColor} onOff={preview.stop} />
      <div className="grid items-stretch gap-6 xl:grid-cols-[1.05fr_1fr]">
        <Box
          component="section"
          aria-label="Vista previa de ARMY Bomb"
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 5,
            border: 1,
            borderColor: 'divider',
            background:
              'radial-gradient(ellipse at 50% 40%, var(--mui-palette-primary-light), var(--mui-palette-background-paper) 72%)',
            p: 3,
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Typography variant="overline" color="text.secondary">
              {preferences.displayName}
            </Typography>
            <Chip
              label={device.status === 'connected' ? 'Bluetooth · Ver. 4' : 'Simulador'}
              size="small"
              variant="outlined"
              color="primary"
            />
          </div>
          <LightstickPreview color={preview.color} brightness={preview.brightness} />
          <Stack spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
            <Typography variant="h3">Tu próxima ola de luz</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              {device.status === 'connected'
                ? 'Los cambios de color se envían al dispositivo conectado.'
                : 'Vista previa en pantalla. Sin dispositivo conectado.'}
            </Typography>
          </Stack>
        </Box>
        <SectionCard
          title="Encuentra tu color"
          description="Empieza con un tono. El resto lo pones tú."
          action={<AutoAwesomeOutlined color="primary" />}
        >
          <Typography variant="overline" color="text.secondary">
            PALETA DE LUZ
          </Typography>
          <div className="mt-3 grid grid-cols-6 gap-2">
            {lightColors.map(({ label, color }) => (
              <Tooltip key={color} title={label}>
                <Box
                  component="button"
                  type="button"
                  aria-label={label}
                  aria-pressed={!preview.playing && preview.color === color}
                  onClick={() => preview.selectColor(color)}
                  sx={{
                    minWidth: 32,
                    minHeight: 48,
                    cursor: 'pointer',
                    borderRadius: 3,
                    bgcolor: color,
                    border: '3px solid',
                    borderColor:
                      !preview.playing && preview.color === color ? 'text.primary' : 'divider',
                    boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.4)',
                    transition: 'transform .18s',
                    '&:hover': { transform: 'translateY(-3px)' },
                  }}
                />
              </Tooltip>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Typography variant="caption" color="text.secondary">
              Color actual
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontFamily: 'monospace' }}
              data-testid="current-color"
            >
              {preview.color}
            </Typography>
          </div>
          <Divider sx={{ my: 3 }} />
          <div className="mb-2 flex items-center justify-between">
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <WbSunnyOutlined sx={{ fontSize: 18 }} color="action" />
              <Typography id="brightness-label" variant="body2" sx={{ fontWeight: 700 }}>
                Brillo
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {preview.brightness}%
            </Typography>
          </div>
          <Slider
            aria-labelledby="brightness-label"
            value={preview.brightness}
            onChange={(_, value) => preview.setBrightness(value as number)}
            valueLabelDisplay="auto"
          />
          <Divider sx={{ my: 3 }} />
          <div className="flex items-start justify-between gap-4">
            <div>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                {sequence.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Demo original · {sequence.durationMs / 1000} s · en bucle
              </Typography>
            </div>
            <Chip label="Sin audio" size="small" />
          </div>
          <LinearProgress
            variant="determinate"
            value={preview.progress}
            aria-label="Progreso de la secuencia"
            sx={{ my: 2, height: 5, borderRadius: 2 }}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              variant="contained"
              startIcon={preview.playing ? <PauseRounded /> : <PlayArrowRounded />}
              onClick={preview.togglePlayback}
            >
              {preview.playing ? 'Detener demo' : 'Reproducir demo'}
            </Button>
            <Button variant="outlined" startIcon={<StopRounded />} onClick={preview.stop}>
              Apagar
            </Button>
          </div>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            Las demos muestran cambios suaves de color. No están sincronizadas con una canción.
          </Typography>
        </SectionCard>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Box component="section" sx={{ bgcolor: 'primary.light', borderRadius: 4, p: 3 }}>
          <GraphicEqRounded color="primary" sx={{ mb: 2 }} />
          <Typography variant="h2">La música será el comienzo.</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 490 }}>
            Estamos preparando el reconocimiento por micrófono para que tus canciones encuentren su
            propia luz.
          </Typography>
          <Chip
            label="Reconocimiento · Próximamente"
            size="small"
            variant="outlined"
            sx={{ mt: 2 }}
          />
        </Box>
        <SectionCard
          title="Hecho para compartir"
          description="Explora tres pequeñas ideas de luz. Sin descargas ni cuentas."
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            La biblioteca empieza contigo. Cada futura creación tendrá su propia voz y su crédito.
          </Typography>
          <Button component={Link} to="/library" endIcon={<ArrowOutwardRounded />} sx={{ px: 0 }}>
            Explorar biblioteca
          </Button>
        </SectionCard>
      </div>
    </>
  )
}
