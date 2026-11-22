import { Alert, Box, Typography } from '@mui/material'
import { PageHeader } from '../../shared/components/PageHeader'
import { demoSequences } from './sequences'
import { SequenceCard } from './SequenceCard'

export function LibraryPage() {
  return (
    <>
      <PageHeader
        eyebrow="PEQUEÑAS IDEAS, MUCHAS EMOCIONES"
        title="Tu colección de luz."
        description="Tres demos para explorar el simulador. Elige una y dale tu propio brillo."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {demoSequences.map((sequence, index) => (
          <SequenceCard key={sequence.id} sequence={sequence} index={index} />
        ))}
      </div>
      <Alert severity="info" sx={{ mt: 4 }}>
        Estas demos vienen incluidas en la app. Una vez preparada para uso sin conexión, también
        estarán disponibles sin internet.
      </Alert>
      <Box
        sx={{
          mt: 5,
          p: 4,
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="h3">Aquí también habrá un lugar para tus ideas.</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          El editor, la importación de paquetes y las contribuciones de la comunidad llegarán en
          próximas versiones.
        </Typography>
      </Box>
    </>
  )
}
