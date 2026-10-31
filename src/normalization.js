// ============================================================
// Нормировка, максимумы.
// K_MAX увеличены, чтобы линии не прилипали к верхней
// границе нормировки (y = 1).
// ============================================================

export const K_MAX = {
  K1: 72, K2: 240, K3: 45, K4: 18, K5: 400,
  K6: 600, K7: 1000, K8: 400, K9: 200, K10: 1000,
  K11: 600, K12: 200, K13: 1000, K14: 1000, K15: 20,
}

export const R_MAX = { R1: 10, R2: 10, R3: 10, R4: 10 }

export const K_MIN = {
  K1: 0, K2: 0, K3: 0, K4: 0, K5: 0, K6: 0,
  K7: 0, K8: 0, K9: 0, K10: 0, K11: 0, K12: 0,
  K13: 0, K14: 0, K15: 0,
}

export const R_MIN = { R1: 0, R2: 0, R3: 0, R4: 0 }

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