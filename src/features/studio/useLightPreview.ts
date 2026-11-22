import { useCallback, useEffect, useState } from 'react'
import type { DemoSequence, HexColor } from '../../core/light'
import { getSequenceColor } from '../../core/light'

export function useLightPreview(sequence: DemoSequence, initialBrightness = 80) {
  const [manualColor, setManualColor] = useState<HexColor>('#A77BFA')
  const [brightness, setBrightness] = useState(initialBrightness)
  const [playing, setPlaying] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(0)

  useEffect(() => {
    if (!playing) return
    const startedAt = performance.now()
    const timer = window.setInterval(() => setElapsedMs(performance.now() - startedAt), 80)
    return () => window.clearInterval(timer)
  }, [playing, sequence.id])

  function selectColor(color: HexColor) {
    setPlaying(false)
    setManualColor(color)
  }
  function togglePlayback() {
    setElapsedMs(0)
    setPlaying((value) => !value)
  }
  function stop() {
    setPlaying(false)
    setManualColor('#000000')
  }
  const pausePlayback = useCallback(() => setPlaying(false), [])

  return {
    color: playing ? getSequenceColor(sequence, elapsedMs) : manualColor,
    brightness,
    setBrightness,
    playing,
    selectColor,
    togglePlayback,
    stop,
    pausePlayback,
    progress: playing ? ((elapsedMs % sequence.durationMs) / sequence.durationMs) * 100 : 0,
  }
}
