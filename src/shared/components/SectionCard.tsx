import { Box, Paper, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface SectionCardProps {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}

export function SectionCard({ title, description, action, children }: SectionCardProps) {
  return (
    <Paper
      component="section"
      variant="outlined"
      sx={{ borderRadius: 4, p: { xs: 2.5, sm: 3 }, height: '100%' }}
    >
      <div className="mb-6 flex items-start justify-between gap-3">
        <Box>
          <Typography variant="h2" sx={{ fontSize: '1.08rem' }}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {description}
            </Typography>
          )}
        </Box>
        {action}
      </div>
      {children}
    </Paper>
  )
}
