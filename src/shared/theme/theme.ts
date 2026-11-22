import { createTheme } from '@mui/material/styles'

// Brand colors live here. Features consume semantic palette tokens, not hex values.
export const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#7040C8', light: '#EDE3FC', dark: '#50279D', contrastText: '#FFFFFF' },
        secondary: { main: '#9B3675' },
        background: { default: '#F8F7FC', paper: '#FFFFFF' },
        text: { primary: '#282039', secondary: '#6C647A' },
        divider: '#E9E3F1',
        success: { main: '#287759' },
      },
    },
    dark: {
      palette: {
        primary: { main: '#C5A3FF', light: '#342345', dark: '#A97CEB', contrastText: '#251334' },
        secondary: { main: '#E9A1CD' },
        background: { default: '#141019', paper: '#1E1826' },
        text: { primary: '#F3EDF9', secondary: '#B9AFC7' },
        divider: '#382D44',
        success: { main: '#86D6B0' },
      },
    },
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: '"Manrope Variable", system-ui, sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      letterSpacing: '-.055em',
      lineHeight: 1.15,
    },
    h2: { fontWeight: 800, fontSize: '1.45rem', letterSpacing: '-.035em' },
    h3: { fontWeight: 800, fontSize: '1.08rem', letterSpacing: '-.02em' },
    button: { textTransform: 'none', fontWeight: 750 },
    body1: { fontSize: '.95rem', lineHeight: 1.75 },
    body2: { fontSize: '.84rem', lineHeight: 1.7 },
    overline: { fontSize: '.65rem', fontWeight: 800, letterSpacing: '.15em' },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 12, minHeight: 44, paddingInline: 20 } },
    },
    MuiIconButton: { styleOverrides: { root: { minWidth: 44, minHeight: 44 } } },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 12 } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 700, fontSize: '.7rem' } } },
    MuiTooltip: { defaultProps: { arrow: true } },
    MuiFormHelperText: { styleOverrides: { root: { marginLeft: 0 } } },
  },
})
