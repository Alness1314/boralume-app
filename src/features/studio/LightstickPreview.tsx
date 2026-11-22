import { useId } from 'react'
import { Box } from '@mui/material'
import type { LightState } from '../../core/light'

export function LightstickPreview({ color, brightness }: LightState) {
  const id = useId().replaceAll(':', '')
  const lit = color !== '#000000' && brightness > 0
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 330,
        mx: 'auto',
        color,
        filter: lit ? `drop-shadow(0 0 32px ${color}35)` : 'none',
      }}
    >
      <svg
        viewBox="0 0 320 350"
        role="img"
        aria-label={`Vista previa de luz ${color}, brillo ${brightness}%`}
      >
        <defs>
          <radialGradient id={`${id}-glow`}>
            <stop stopColor="currentColor" stopOpacity=".25" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-orb`} cx=".35" cy=".3">
            <stop stopColor="white" stopOpacity=".9" />
            <stop offset=".45" stopColor="currentColor" stopOpacity=".9" />
            <stop offset="1" stopColor="currentColor" stopOpacity=".45" />
          </radialGradient>
          <linearGradient id={`${id}-handle`}>
            <stop stopColor="#292334" />
            <stop offset=".5" stopColor="#494054" />
            <stop offset="1" stopColor="#241D30" />
          </linearGradient>
        </defs>
        <circle cx="160" cy="145" r="135" fill={`url(#${id}-glow)`} opacity={brightness / 100} />
        <circle
          cx="160"
          cy="145"
          r="99"
          fill="none"
          stroke="currentColor"
          strokeOpacity=".1"
          strokeDasharray="3 8"
        />
        <circle cx="160" cy="145" r="119" fill="none" stroke="currentColor" strokeOpacity=".07" />
        <ellipse cx="160" cy="324" rx="48" ry="7" fill="currentColor" opacity=".1" />
        <rect x="141" y="205" width="38" height="105" rx="12" fill={`url(#${id}-handle)`} />
        <rect x="149" y="213" width="22" height="12" rx="3" fill="#211A2E" />
        <circle cx="160" cy="247" r="4" fill={lit ? color : '#655D73'} />
        <circle
          cx="160"
          cy="145"
          r="76"
          fill={`url(#${id}-orb)`}
          opacity={lit ? 0.3 + (brightness / 100) * 0.7 : 0.1}
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="m144 124 12 5v37l-12-5zm32 0-12 5v37l12-5z" fill="#FFFFFF" opacity=".7" />
        <ellipse
          cx="138"
          cy="106"
          rx="22"
          ry="9"
          fill="white"
          opacity=".3"
          transform="rotate(-32 138 106)"
        />
        <path
          d="m251 72 3 7 7 3-7 3-3 7-3-7-7-3 7-3zm-170 138 2 5 5 2-5 2-2 5-2-5-5-2 5-2z"
          fill="currentColor"
          opacity=".6"
        />
      </svg>
    </Box>
  )
}
