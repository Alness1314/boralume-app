import { useState } from 'react'
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import LightModeOutlined from '@mui/icons-material/LightModeOutlined'
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined'
import SettingsBrightnessOutlined from '@mui/icons-material/SettingsBrightnessOutlined'
import CheckRounded from '@mui/icons-material/CheckRounded'

const options = [
  { value: 'light', label: 'Claro', icon: <LightModeOutlined fontSize="small" /> },
  { value: 'dark', label: 'Oscuro', icon: <DarkModeOutlined fontSize="small" /> },
  {
    value: 'system',
    label: 'Según el sistema',
    icon: <SettingsBrightnessOutlined fontSize="small" />,
  },
] as const

export function ThemeMenu() {
  const { mode, setMode } = useColorScheme()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  return (
    <>
      <Tooltip title="Cambiar apariencia">
        <IconButton
          aria-label="Cambiar apariencia"
          aria-haspopup="menu"
          aria-expanded={Boolean(anchor)}
          aria-controls={anchor ? 'theme-menu' : undefined}
          onClick={(e) => setAnchor(e.currentTarget)}
        >
          {mode === 'dark' ? <DarkModeOutlined /> : <LightModeOutlined />}
        </IconButton>
      </Tooltip>
      <Menu
        id="theme-menu"
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
      >
        {options.map(({ value, label, icon }) => (
          <MenuItem
            key={value}
            selected={mode === value}
            onClick={() => {
              setMode(value)
              setAnchor(null)
            }}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText sx={{ mr: 2 }}>{label}</ListItemText>
            {mode === value && <CheckRounded fontSize="small" color="primary" />}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
