import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { PageHeader } from '../shared/components/PageHeader'

export function NotFoundPage() {
  return (
    <>
      <PageHeader
        eyebrow="404 · FUERA DE LA ÓRBITA"
        title="Esta luz aún no existe."
        description="La dirección que abriste no pertenece a una página de BoraLume."
      />
      <Button component={Link} to="/" variant="contained">
        Volver al estudio
      </Button>
    </>
  )
}
