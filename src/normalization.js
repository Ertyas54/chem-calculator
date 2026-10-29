// ============================================================
// Нормировка, максимумы и начальные условия.
// K_MAX увеличены, чтобы линии не прилипали к верхней
// границе нормировки (y = 1).
// ============================================================

export const K_MAX = {
  K1: 72,     // было 48
  K2: 240,    // было 120
  K3: 45,     // было 30
  K4: 18,     // было 12
  K5: 400,    // было 200
  K6: 600,    // было 300
  K7: 1000,   // было 500
  K8: 400,    // было 200
  K9: 200,    // было 100
  K10: 1000,  // было 500
  K11: 600,   // было 300
  K12: 200,   // было 100
  K13: 1000,  // было 500
  K14: 1000,  // было 500
  K15: 20,    // было 10
}

export const R_MAX = { R1: 2, R2: 2, R3: 2, R4: 1 }

export const K_MIN = {
  K1: 0, K2: 0, K3: 0, K4: 0, K5: 0, K6: 0,
  K7: 0, K8: 0, K9: 0, K10: 0, K11: 0, K12: 0,
  K13: 0, K14: 0, K15: 0,
}

export const R_MIN = { R1: 0, R2: 0, R3: 0, R4: 0 }

// Начальные условия K_i(0) — нерегулярные, рядом стоящие
// близки по нормировке, без «пилы». Умножены на ~1.5
// соразмерно новым K_MAX, чтобы стартовые позиции
// в нормировке остались примерно теми же (0.1…0.85).
export const K_INITIAL = {
  K1: 32,     // 72 · 0.44
  K2: 130,    // 240 · 0.54
  K3: 22,     // 45 · 0.49
  K4: 9,      // 18 · 0.50
  K5: 236,    // 400 · 0.59
  K6: 328,    // 600 · 0.55
  K7: 570,    // 1000 · 0.57
  K8: 244,    // 400 · 0.61
  K9: 94,     // 200 · 0.47
  K10: 620,   // 1000 · 0.62
  K11: 536,   // 600 · 0.89
  K12: 82,    // 200 · 0.41
  K13: 800,   // 1000 · 0.80
  K14: 710,   // 1000 · 0.71
  K15: 8,     // 20 · 0.40
}

export function getMax(name) {
  if (name.startsWith('R')) return R_MAX[name] ?? 1
  return K_MAX[name] ?? 1
}

export function getMin(name) {
  if (name.startsWith('R')) return R_MIN[name] ?? 0
  return K_MIN[name] ?? 0
}

export function normalize(name, value) {
  const max = getMax(name)
  const min = getMin(name)
  if (max === min) return 0
  return (value - min) / (max - min)
}

export function denormalize(name, value) {
  const max = getMax(name)
  const min = getMin(name)
  return min + value * (max - min)
}

export function normalizeAll(values) {
  const result = {}
  Object.entries(values).forEach(([name, value]) => {
    result[name] = normalize(name, value)
  })
  return result
}