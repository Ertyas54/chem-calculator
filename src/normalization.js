// ============================================================
// Нормировка, максимумы.
// K хранится в нормализованной шкале [0, 1]:
//   K_MAX = 1, K_MIN = 0 → normalize/denormalize тождественны.
// R по-прежнему в исходной шкале (1…10).
// ============================================================

// K уже нормирован → максимум = 1, минимум = 0.
export const K_MAX = {
  K1: 1, K2: 1, K3: 1, K4: 1, K5: 1,
  K6: 1, K7: 1, K8: 1, K9: 1, K10: 1,
  K11: 1, K12: 1, K13: 1, K14: 1, K15: 1,
}

//export const R_MAX = { R1: 10, R2: 10, R3: 10, R4: 10 }
export const R_MAX = { R1: 1, R2: 1, R3: 1, R4: 1 }

export const K_MIN = {
  K1: 0, K2: 0, K3: 0, K4: 0, K5: 0, K6: 0,
  K7: 0, K8: 0, K9: 0, K10: 0, K11: 0, K12: 0,
  K13: 0, K14: 0, K15: 0,
}

export const R_MIN = { R1: 0, R2: 0, R3: 0, R4: 0 }

// Норма в нормализованной шкале (K ∈ [0, 1]).
// Используется интерпретатором и диаграммами.
export const K_NORM = 0.5

export function getMax(name) {
  if (name.startsWith('R')) return R_MAX[name] ?? 1
  return K_MAX[name] ?? 1
}

export function getMin(name) {
  if (name.startsWith('R')) return R_MIN[name] ?? 0
  return K_MIN[name] ?? 0
}

// K уже в [0, 1]: normalize('K*', v) === v
// R нормируется в [0, 1] по R_MAX/R_MIN
export function normalize(name, value) {
  const max = getMax(name)
  const min = getMin(name)
  if (max === min) return 0
  return (value - min) / (max - min)
}

// K уже в [0, 1]: denormalize('K*', v) === v
// R переводится из [0, 1] обратно в исходную шкалу
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

export function makeDefaultConditions() {
  const result = {}
  for (let i = 1; i <= 15; i++) result[`K${i}`] = K_NORM
  return result
}