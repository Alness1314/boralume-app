import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
      <Box sx={{ maxWidth: 640 }}>
        <Typography variant="overline" color="primary">
          {eyebrow}
        </Typography>
        <Typography variant="h1" sx={{ mt: 0.8, mb: 1.5 }}>
          {title}
        </Typography>
        <Typography color="text.secondary">{description}</Typography>
      </Box>
      {action}
    </div>
  )
}
