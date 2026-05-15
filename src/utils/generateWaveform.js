export function generateWaveform(n = 500) {
  const data = new Float32Array(n)

  // Higher-amplitude layers with more frequent oscillations for dramatic peaks/valleys
  const layers = [
    { freq: 1.2,  amp: 0.32, phase: 0.0 },
    { freq: 4.7,  amp: 0.28, phase: 1.1 },
    { freq: 11.3, amp: 0.22, phase: 2.4 },
    { freq: 23.1, amp: 0.16, phase: 0.7 },
    { freq: 47.0, amp: 0.10, phase: 1.9 },
  ]

  // Macro dynamics — slow random walk with large steps so it reaches near-silence
  const macro = new Float32Array(n)
  let v = 0.4
  for (let i = 0; i < n; i++) {
    v += (Math.random() - 0.5) * 0.32
    v = Math.max(0.0, Math.min(1.0, v))
    macro[i] = v
  }

  // Smooth over a wide window so sections feel like song-length dynamics
  const smoothed = new Float32Array(n)
  const w = 50
  for (let i = 0; i < n; i++) {
    let sum = 0, count = 0
    for (let j = Math.max(0, i - w); j <= Math.min(n - 1, i + w); j++) {
      sum += macro[j]; count++
    }
    // Square the result: loud stays loud, quiet drops hard
    smoothed[i] = Math.pow(sum / count, 2)
  }

  // Silence ramp: 0 at edges, full by 4% in, silence again from 96% onward
  const RAMP = 0.04

  for (let i = 0; i < n; i++) {
    const t = i / n
    let val = 0

    for (const { freq, amp, phase } of layers) {
      val += Math.abs(Math.sin(t * Math.PI * 2 * freq + phase)) * amp
    }

    val += (Math.random() * 0.35)
    if (Math.random() < 0.08) val += Math.random() * 0.5
    val *= smoothed[i] * 1.6

    // Silence envelope — ramp from 0 at track edges
    const silenceEnv = Math.min(1, t / RAMP) * Math.min(1, (1 - t) / RAMP)
    data[i] = Math.min(1.0, val) * silenceEnv
  }

  return data
}
