import { Box, Stack, Typography } from '@mui/material'

export function Brand() {
  return (
    <Stack direction="row" spacing={1.3} sx={{ alignItems: 'center' }}>
      <Box component="img" src="/favicon.svg" alt="" sx={{ width: 39, height: 39 }} />
      <Typography sx={{ fontWeight: 850, fontSize: '1.27rem', letterSpacing: '-.05em' }}>
        BoraLume<span style={{ color: 'var(--mui-palette-primary-main)' }}>.</span>
      </Typography>
    </Stack>
  )
}
