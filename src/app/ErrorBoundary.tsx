import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Alert, Box, Button, Typography } from '@mui/material'

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('BoraLume: error de interfaz', error, info.componentStack)
  }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <Box sx={{ maxWidth: 540, mx: 'auto', p: 4, mt: 8 }}>
        <Typography variant="h1" sx={{ mb: 3 }}>
          Hagamos una pequeña pausa.
        </Typography>
        <Alert severity="error">
          No pudimos mostrar esta parte de BoraLume. Recarga para volver a intentarlo.
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 3 }}>
          Volver a abrir
        </Button>
      </Box>
    )
  }
}
