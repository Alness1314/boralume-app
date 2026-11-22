import { useState } from 'react'
import {
  Alert,
  Button,
  FormControlLabel,
  MenuItem,
  Slider,
  Stack,
  Switch,
  Typography,
} from '@mui/material'
import SaveOutlined from '@mui/icons-material/SaveOutlined'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageHeader } from '../../shared/components/PageHeader'
import { SectionCard } from '../../shared/components/SectionCard'
import { FormTextField } from '../../shared/components/FormTextField'
import { readStored, writeStored } from '../../shared/lib/storage'
import {
  defaultPreferences,
  lightstickModels,
  preferencesKey,
  preferencesSchema,
} from './preferences'
import type { Preferences } from './preferences'

export function SettingsPage() {
  const [notice, setNotice] = useState<'saved' | 'failed' | null>(null)
  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<Preferences>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: readStored(preferencesKey, preferencesSchema, defaultPreferences),
    mode: 'onBlur',
  })

  function save(values: Preferences) {
    setNotice(writeStored(preferencesKey, values) ? 'saved' : 'failed')
  }

  return (
    <>
      <PageHeader
        eyebrow="A TU MANERA"
        title="Tu espacio, tus reglas."
        description="Pequeños detalles para sentir BoraLume un poco más tuyo."
      />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <SectionCard
          title="Preferencias"
          description="Se guardan en este navegador. No necesitas una cuenta."
        >
          <Stack
            component="form"
            noValidate
            spacing={3}
            onSubmit={handleSubmit(save)}
            onChange={() => setNotice(null)}
          >
            <FormTextField
              name="displayName"
              control={control}
              label="Nombre de tu espacio"
              helperText="Un nombre para tu sesión. No se publica ni se comparte."
            />
            <FormTextField
              name="lightstickModel"
              control={control}
              label="Tu ARMY Bomb"
              select
              helperText="Esta preferencia no conecta ni confirma compatibilidad con tu dispositivo."
            >
              {lightstickModels.map((model) => (
                <MenuItem key={model.value} value={model.value}>
                  {model.label}
                </MenuItem>
              ))}
            </FormTextField>
            <Controller
              name="defaultBrightness"
              control={control}
              render={({ field }) => (
                <div>
                  <Typography
                    id="default-brightness-label"
                    variant="body2"
                    sx={{ fontWeight: 700 }}
                  >
                    Brillo inicial · {field.value}%
                  </Typography>
                  <Slider
                    {...field}
                    aria-labelledby="default-brightness-label"
                    valueLabelDisplay="auto"
                    onChange={(_, value) => {
                      field.onChange(value)
                      setNotice(null)
                    }}
                  />
                </div>
              )}
            />
            <Controller
              name="reducedFlashes"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  sx={{ alignItems: 'flex-start' }}
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(_, checked) => {
                        field.onChange(checked)
                        setNotice(null)
                      }}
                    />
                  }
                  label={
                    <>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        Preferir luces suaves
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Guardamos tu preferencia para futuros efectos. Las demos actuales no usan
                        estrobos.
                      </Typography>
                    </>
                  }
                />
              )}
            />
            {notice && (
              <Alert severity={notice === 'saved' ? 'success' : 'warning'} role="status">
                {notice === 'saved'
                  ? 'Tus preferencias se guardaron en este dispositivo.'
                  : 'El navegador no permitió guardar los cambios. Revisa los permisos de almacenamiento.'}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveOutlined />}
              sx={{ alignSelf: 'flex-start' }}
            >
              Guardar preferencias
            </Button>
            {isDirty && !notice && (
              <Typography variant="caption" color="text.secondary">
                Tienes cambios por guardar.
              </Typography>
            )}
          </Stack>
        </SectionCard>
        <Stack spacing={3}>
          <SectionCard title="Tu privacidad importa">
            <Typography variant="body2" color="text.secondary">
              El micrófono todavía no se utiliza. Bluetooth sólo se solicita cuando eliges conectar
              tu Ver. 4. Tus preferencias no se envían a un servidor y el simulador sigue disponible
              sin dispositivo.
            </Typography>
          </SectionCard>
          <SectionCard title="Claro, oscuro o como tú">
            <Typography variant="body2" color="text.secondary">
              Elige la apariencia desde el botón de la barra superior. También puedes seguir el tema
              de tu sistema. La preferencia se conserva en este navegador.
            </Typography>
          </SectionCard>
        </Stack>
      </div>
    </>
  )
}
