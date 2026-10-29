// ============================================================
// Обёртка над решением ОДУ. Экспортирует STATE_NAMES и
// evaluateAll(t, values, tMax), совместимые с UI-компонентами.
// ============================================================

import { solveODE, interpolateState } from './solver'
import { FN_COUNT, FN_DEGREE } from './functions'

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

// Кэш решений
const cache = new Map()
const CACHE_LIMIT = 30

function cacheKey(values, tMax) {
  // Стабильный ключ: сортируем ключи
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

// Все имена переменных, которые задаёт пользователь
export function getAllCoefficientNames() {
  const names = ['R1', 'R2', 'R3', 'R4']
  for (let i = 1; i <= FN_COUNT; i++) {
    for (let d = 0; d <= FN_DEGREE; d++) {
      names.push(`f${i}_c${d}`)
    }
  }
  return names
}