import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CssBaseline, GlobalStyles, LinearProgress, StyledEngineProvider } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import { theme } from '../shared/theme/theme'
import { StudioPage } from '../features/studio/StudioPage'
import { AppShell } from './AppShell'
import { ErrorBoundary } from './ErrorBoundary'
import { NotFoundPage } from './NotFoundPage'
import { PwaNotice } from './PwaNotice'
import { DeviceProvider } from '../features/device/DeviceProvider'

const LibraryPage = lazy(() =>
  import('../features/library/LibraryPage').then((module) => ({ default: module.LibraryPage })),
)
const SettingsPage = lazy(() =>
  import('../features/settings/SettingsPage').then((module) => ({ default: module.SettingsPage })),
)

export function App() {
  return (
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <InitColorSchemeScript
        attribute="class"
        defaultMode="system"
        modeStorageKey="boralume:theme"
      />
      <ThemeProvider theme={theme} defaultMode="system" modeStorageKey="boralume:theme">
        <CssBaseline />
        <ErrorBoundary>
          <DeviceProvider>
            <BrowserRouter>
              <Suspense fallback={<LinearProgress aria-label="Abriendo tu espacio" />}>
                <Routes>
                  <Route element={<AppShell />}>
                    <Route index element={<StudioPage />} />
                    <Route path="library" element={<LibraryPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
            <PwaNotice />
          </DeviceProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
