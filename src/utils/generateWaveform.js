export function generateWaveform(n = 500) {
  const data = new Float32Array(n)

  // Macro dynamics — slow random walk, floored so no section goes fully silent
  const macro = new Float32Array(n)
  let v = 0.65
  for (let i = 0; i < n; i++) {
    v += (Math.random() - 0.5) * 0.2
    v = Math.max(0.35, Math.min(1.0, v))
    macro[i] = v
  }

  // Smooth over a wide window so dynamics feel like song sections, not bar-to-bar
  const smoothMacro = new Float32Array(n)
  const w = 60
  for (let i = 0; i < n; i++) {
    let sum = 0, count = 0
    for (let j = Math.max(0, i - w); j <= Math.min(n - 1, i + w); j++) {
      sum += macro[j]; count++
    }
    smoothMacro[i] = sum / count
  }

  const layers = [
    { freq: 8.3,  amp: 0.50, phase: 0.0 },
    { freq: 19.7, amp: 0.35, phase: 1.4 },
    { freq: 37.2, amp: 0.25, phase: 2.1 },
  ]
  const totalAmp = layers.reduce((s, l) => s + l.amp, 0)

  const RAMP = 0.03
  for (let i = 0; i < n; i++) {
    const t = i / n

    let wave = 0
    for (const { freq, amp, phase } of layers) {
      wave += Math.abs(Math.sin(t * Math.PI * 2 * freq + phase)) * amp
    }
    wave /= totalAmp  // normalize to [0, 1]

    // Power curve: pushes troughs much lower while keeping peaks near 1
    wave = Math.pow(wave, 1.8)

    const noise = Math.random() * 0.18
    const spike = Math.random() < 0.05 ? Math.random() * 0.35 : 0

    let val = (wave + noise + spike) * smoothMacro[i]

    const edgeFade = Math.min(1, t / RAMP) * Math.min(1, (1 - t) / RAMP)
    data[i] = Math.min(1.0, val) * edgeFade
  }

  return data
}
