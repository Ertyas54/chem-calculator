// ============================================================
// Нормировка.
// K ∈ [0, 1], норма 0.5.
// R-коэффициенты ∈ [0, 1].
// normalize/denormalize — тождественны для K.
// ============================================================

export const K_MAX = {
  K1: 1, K2: 1, K3: 1, K4: 1, K5: 1,
  K6: 1, K7: 1, K8: 1, K9: 1, K10: 1,
  K11: 1, K12: 1, K13: 1, K14: 1, K15: 1,
}

export const K_MIN = {
  K1: 0, K2: 0, K3: 0, K4: 0, K5: 0, K6: 0,
  K7: 0, K8: 0, K9: 0, K10: 0, K11: 0, K12: 0,
  K13: 0, K14: 0, K15: 0,
}

export const K_NORM = 0.5

export function getMax(name) {
  return K_MAX[name] ?? 1
}

export function getMin(name) {
  return K_MIN[name] ?? 0
}

// K уже в [0, 1] → тождественно
export function normalize(name, value) {
  return value
}

export function denormalize(name, value) {
  return value
}

export function normalizeAll(values) {
  return { ...values }
}

export function makeDefaultConditions() {
  const result = {}
  for (let i = 1; i <= 15; i++) result[`K${i}`] = K_NORM
  return result
}