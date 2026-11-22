import {
  Box,
  Chip,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined'
import GridViewOutlined from '@mui/icons-material/GridViewOutlined'
import TuneRounded from '@mui/icons-material/TuneRounded'
import FavoriteBorderRounded from '@mui/icons-material/FavoriteBorderRounded'
import WifiOffRounded from '@mui/icons-material/WifiOffRounded'
import { NavLink, Outlet } from 'react-router-dom'
import { Brand } from '../shared/components/Brand'
import { ThemeMenu } from '../shared/components/ThemeMenu'
import { useOnlineStatus } from '../shared/hooks/useOnlineStatus'
import { useDevice } from '../features/device/device-context'

const navigation = [
  { to: '/', label: 'Estudio', icon: <AutoAwesomeOutlined /> },
  { to: '/library', label: 'Biblioteca', icon: <GridViewOutlined /> },
  { to: '/settings', label: 'Ajustes', icon: <TuneRounded /> },
]

export function AppShell() {
  const online = useOnlineStatus()
  const { device } = useDevice()
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: { md: 'grid' },
        gridTemplateColumns: { md: '238px minmax(0, 1fr)' },
      }}
    >
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'fixed',
          zIndex: 1500,
          top: -100,
          left: 16,
          p: 2,
          bgcolor: 'background.paper',
          color: 'primary.main',
          '&:focus': { top: 16 },
        }}
      >
        Saltar al contenido
      </Box>
      <Box
        component="aside"
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          borderRight: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          height: '100dvh',
          position: 'sticky',
          top: 0,
          p: 3,
        }}
      >
        <Box sx={{ mb: 6, mt: 1 }}>
          <Brand />
        </Box>
        <Typography variant="overline" color="text.secondary" sx={{ px: 1.5, mb: 1 }}>
          TU ESPACIO
        </Typography>
        <List component="nav" aria-label="Navegación principal" disablePadding>
          {navigation.map(({ to, label, icon }) => (
            <ListItemButton
              key={to}
              component={NavLink}
              to={to}
              end={to === '/'}
              sx={{
                borderRadius: 2.5,
                mb: 1,
                '&.active': {
                  bgcolor: 'primary.light',
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 38 }}>{icon}</ListItemIcon>
              <ListItemText
                primary={label}
                slotProps={{ primary: { sx: { fontWeight: 750, fontSize: 13 } } }}
              />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ mt: 'auto', p: 2, bgcolor: 'primary.light', borderRadius: 3 }}>
          <FavoriteBorderRounded color="primary" sx={{ fontSize: 20, mb: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 800 }}>
            Un proyecto con corazón.
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 0.8, lineHeight: 1.7 }}
          >
            Creado para compartir luz con la comunidad ARMY.
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, px: 1 }}>
          BoraLume · primera luz v0.1
        </Typography>
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Box
          component="header"
          sx={{
            minHeight: 82,
            px: { xs: 2, sm: 4, xl: 5 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <Brand />
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: { xs: 'none', md: 'block' } }}
          >
            Tu música, tu luz<span style={{ marginLeft: 8 }}>✦</span>
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Chip
              size="small"
              icon={online ? undefined : <WifiOffRounded />}
              variant="outlined"
              label={
                device.status === 'connected'
                  ? 'ARMY Bomb Ver. 4 conectada'
                  : online
                    ? 'Versión de exploración'
                    : 'Sin conexión'
              }
              sx={{
                '& .MuiChip-label': { px: 1 },
                display: { xs: online ? 'none' : 'flex', sm: 'flex' },
              }}
            />
            <ThemeMenu />
          </Stack>
        </Box>
        <Box
          component="nav"
          aria-label="Navegación móvil"
          sx={{
            display: { xs: 'flex', md: 'none' },
            px: 2,
            py: 1,
            gap: 1,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          {navigation.map(({ to, label }) => (
            <Box
              key={to}
              component={NavLink}
              to={to}
              end={to === '/'}
              sx={{
                textDecoration: 'none',
                color: 'text.secondary',
                py: 1.5,
                px: 2,
                borderRadius: 2,
                fontSize: 13,
                fontWeight: 750,
                '&.active': { bgcolor: 'primary.light', color: 'primary.main' },
              }}
            >
              {label}
            </Box>
          ))}
        </Box>
        <Box
          component="main"
          id="main-content"
          tabIndex={-1}
          sx={{ maxWidth: 1440, mx: 'auto', p: { xs: 2, sm: 4, xl: 5 }, pt: { xs: 3, sm: 5 } }}
        >
          <Outlet />
        </Box>
        <Box
          component="footer"
          sx={{ px: { xs: 2, sm: 4, xl: 5 }, pb: 3, maxWidth: 1440, mx: 'auto' }}
        >
          <Divider sx={{ mb: 2 }} />
          <div className="flex flex-wrap justify-between gap-2">
            <Typography variant="caption" color="text.secondary">
              Hecho con cariño. Abierto a lo que podemos crear juntas.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Proyecto fan independiente · sin afiliación oficial.
            </Typography>
          </div>
        </Box>
      </Box>
    </Box>
  )
}
