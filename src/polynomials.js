// ============================================================
// Обёртка над решением ОДУ.
// Экспортирует STATE_NAMES и evaluateAll(t, values, tMax).
// ============================================================

import { solveODE, interpolateState } from './solver'
import { FN_COUNT, FN_DEGREE, R_COUNT, R_DEGREE } from './functions'

export const STATE_NAMES = [
  'K1 — Время испарения ХОВ',
  'K2 — Время ликвидации последствий',
  'K3 — Площадь заражения',
  'K4 — Время подхода облака',
  'K5 — Потери от первичного облака',
  'K6 — Потери от вторичного облака',
  'K7 — Амбулаторная помощь, чел.',
  'K8 — Стационар и реанимация, чел.',
  'K9 — Пораженная техника',
  'K10 — Объемы для обеззараживания',
  'K11 — Силы и средства АСР',
  'K12 — Эффективность системы оповещения',
  'K13 — Люди в зоне поражения',
  'K14 — Спасатели в зоне поражения',
  'K15 — Развитость системы МЧС',
]

const cache = new Map()
const CACHE_LIMIT = 30

function cacheKey(values, tMax) {
  const keys = Object.keys(values).sort()
  const parts = keys.map((k) => `${k}=${values[k]}`)
  return `${tMax}|${parts.join('&')}`
}

export function evaluateAll(t, values, tMax = 10) {
  const key = cacheKey(values, tMax)
  let states = cache.get(key)
  if (!states) {
    states = solveODE(values, tMax, 400)
    cache.set(key, states)
    if (cache.size > CACHE_LIMIT) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }
  }
  return interpolateState(states, t)
}

// Все имена коэффициентов: R1_c0…R4_c3 + f1_c0…f55_c3
export function getAllCoefficientNames() {
  const names = []
  for (let r = 1; r <= R_COUNT; r++) {
    for (let d = 0; d <= R_DEGREE; d++) {
      names.push(`R${r}_c${d}`)
    }
  }
  for (let i = 1; i <= FN_COUNT; i++) {
    for (let d = 0; d <= FN_DEGREE; d++) {
      names.push(`f${i}_c${d}`)
    }
  }
  return names
}