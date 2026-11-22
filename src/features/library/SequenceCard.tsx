import { Box, Button, Chip, Paper, Typography } from '@mui/material'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import { Link } from 'react-router-dom'
import type { DemoSequence } from '../../core/light'

export function SequenceCard({ sequence, index }: { sequence: DemoSequence; index: number }) {
  return (
    <Paper component="article" variant="outlined" sx={{ p: 2.5, borderRadius: 4 }}>
      <Box
        sx={{
          height: 150,
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          mb: 3,
          background: `linear-gradient(125deg, ${sequence.cues[0]!.color}, ${sequence.cues[1]!.color})`,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 170,
            height: 170,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,.5)',
            top: -35,
            right: -20,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 170,
            height: 170,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,.5)',
            top: 15,
            right: 30,
          }}
        />
        <Typography
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 20,
            color: '#28163E',
            fontWeight: 800,
            fontSize: 42,
            opacity: 0.75,
            letterSpacing: '-.06em',
          }}
        >
          0{index + 1}
        </Typography>
      </Box>
      <Chip size="small" label="Demo original" variant="outlined" sx={{ mb: 1.5 }} />
      <Typography variant="h2">{sequence.title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ minHeight: 48, mt: 1 }}>
        {sequence.description}
      </Typography>
      <div className="my-5 flex gap-1" aria-hidden="true">
        {sequence.cues.map((cue) => (
          <Box
            key={cue.atMs}
            sx={{
              flex: 1,
              height: 7,
              borderRadius: 1,
              backgroundColor: cue.color,
              border: '1px solid',
              borderColor: 'divider',
            }}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Typography variant="caption" color="text.secondary">
          {sequence.durationMs / 1000} s · sin audio
        </Typography>
        <Button
          component={Link}
          to={`/?sequence=${sequence.id}`}
          endIcon={<ArrowForwardRounded />}
          aria-label={`Probar ${sequence.title}`}
        >
          Probar
        </Button>
      </div>
    </Paper>
  )
}
