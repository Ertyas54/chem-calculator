// ============================================================
// Определения 15 полиномов строго по формулам из документа.
// Каждый коэффициент — переменная K_i или R_j со знаком.
//
// Вычисление идёт с полной нормировкой:
//   - коэффициенты K_i, R_j приводятся к [0, 1]
//   - время нормируется: τ = t / tMax ∈ [0, 1]
//   - результат масштабируется под максимум САМОЙ K_i
//   - результат обрезается в [-K_i_max, +K_i_max]
// ============================================================

import { normalize, getMax } from './normalization'

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

export const COEFFICIENTS = {
  K1: [
    { name: 'K10', sign: -1, fn: 1 },
    { name: 'K11', sign: -1, fn: 2 },
    { name: 'K14', sign: -1, fn: 3 },
  ],
  K2: [
    { name: 'K3',  sign: +1, fn: 4 },
    { name: 'K7',  sign: +1, fn: 5 },
    { name: 'K8',  sign: +1, fn: 6 },
    { name: 'K9',  sign: +1, fn: 7 },
    { name: 'K13', sign: +1, fn: 8 },
    { name: 'K10', sign: -1, fn: 9 },
    { name: 'K11', sign: -1, fn: 10 },
    { name: 'K14', sign: -1, fn: 11 },
    { name: 'K15', sign: -1, fn: 12 },
    { name: 'R1',  sign: -1, fn: null },
    { name: 'R2',  sign: -1, fn: null },
    { name: 'R3',  sign: -1, fn: null },
    { name: 'R4',  sign: -1, fn: null },
  ],
  K3: [
    { name: 'K1',  sign: +1, fn: 13 },
    { name: 'K15', sign: -1, fn: 14 },
    { name: 'R1',  sign: -1, fn: null },
    { name: 'R3',  sign: -1, fn: null },
    { name: 'R4',  sign: -1, fn: null },
  ],
  K4: [
    { name: 'K1', sign: +1, fn: 15 },
  ],
  K5: [
    { name: 'K1', sign: +1, fn: 16 },
    { name: 'R2', sign: +1, fn: null },
    { name: 'R1', sign: -1, fn: null },
  ],
  K6: [
    { name: 'R2',  sign: +1, fn: null },
    { name: 'K4',  sign: -1, fn: 17 },
    { name: 'K11', sign: -1, fn: 18 },
    { name: 'K12', sign: -1, fn: 19 },
    { name: 'K14', sign: -1, fn: 20 },
    { name: 'R1',  sign: -1, fn: null },
  ],
  K7: [
    { name: 'K5',  sign: +1, fn: 21 },
    { name: 'K6',  sign: +1, fn: 22 },
    { name: 'K13', sign: +1, fn: 23 },
    { name: 'K15', sign: +1, fn: 24 },
    { name: 'R1',  sign: +1, fn: null },
    { name: 'R2',  sign: +1, fn: null },
    { name: 'R3',  sign: +1, fn: null },
  ],
  K8: [
    { name: 'K5',  sign: +1, fn: 25 },
    { name: 'K6',  sign: +1, fn: 26 },
    { name: 'K11', sign: +1, fn: 27 },
    { name: 'K13', sign: +1, fn: 28 },
    { name: 'K14', sign: +1, fn: 29 },
    { name: 'K15', sign: +1, fn: 30 },
    { name: 'R1',  sign: +1, fn: null },
    { name: 'R2',  sign: +1, fn: null },
    { name: 'R3',  sign: +1, fn: null },
  ],
  K9: [
    { name: 'K3',  sign: +1, fn: 31 },
    { name: 'K13', sign: +1, fn: 32 },
    { name: 'R2',  sign: +1, fn: null },
    { name: 'K10', sign: -1, fn: 33 },
    { name: 'K11', sign: -1, fn: 34 },
    { name: 'K14', sign: -1, fn: 35 },
    { name: 'R1',  sign: -1, fn: null },
  ],
  K10: [
    { name: 'K3',  sign: +1, fn: 36 },
    { name: 'K9',  sign: +1, fn: 37 },
    { name: 'K15', sign: +1, fn: 38 },
    { name: 'R1',  sign: +1, fn: null },
    { name: 'R2',  sign: +1, fn: null },
    { name: 'R3',  sign: +1, fn: null },
    { name: 'R4',  sign: +1, fn: null },
  ],
  K11: [
    { name: 'K3',  sign: +1, fn: 39 },
    { name: 'K13', sign: +1, fn: 40 },
    { name: 'K14', sign: +1, fn: 41 },
    { name: 'R1',  sign: +1, fn: null },
    { name: 'R2',  sign: +1, fn: null },
    { name: 'R3',  sign: +1, fn: null },
    { name: 'K15', sign: -1, fn: 42 },
    { name: 'R4',  sign: -1, fn: null },
  ],
  K12: [
    { name: 'K11', sign: +1, fn: 43 },
    { name: 'K13', sign: +1, fn: 44 },
    { name: 'K14', sign: +1, fn: 45 },
    { name: 'R1',  sign: +1, fn: null },
    { name: 'R2',  sign: +1, fn: null },
    { name: 'R3',  sign: +1, fn: null },
    { name: 'K15', sign: -1, fn: 46 },
  ],
  K13: [
    { name: 'K2', sign: +1, fn: 47 },
    { name: 'K3', sign: +1, fn: 48 },
    { name: 'R2', sign: +1, fn: null },
  ],
  K14: [
    { name: 'K11', sign: +1, fn: 49 },
    { name: 'K12', sign: +1, fn: 50 },
    { name: 'K13', sign: +1, fn: 51 },
    { name: 'R1',  sign: +1, fn: null },
    { name: 'R2',  sign: +1, fn: null },
  ],
  K15: [
    { name: 'K2',  sign: +1, fn: 52 },
    { name: 'K3',  sign: +1, fn: 53 },
    { name: 'K13', sign: +1, fn: 54 },
    { name: 'K14', sign: +1, fn: 55 },
    { name: 'R1',  sign: +1, fn: null },
    { name: 'R2',  sign: +1, fn: null },
  ],
}

// ------------------------------------------------------------
// Unicode-надстрочные цифры: 0…9
// ------------------------------------------------------------
const SUPERSCRIPTS = {
  0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴',
  5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹',
}

// ------------------------------------------------------------
// Превратить число в надстрочную строку: 12 → '¹²'
// ------------------------------------------------------------
export function toSuperscript(n) {
  return String(n)
    .split('')
    .map((d) => SUPERSCRIPTS[d] ?? d)
    .join('')
}

// ------------------------------------------------------------
// Метка степени для члена с номером power:
//   power = 0 → ''
//   power = 1 → '·t'
//   power = 2 → '·t²'
//   power = 12 → '·t¹²'
// ------------------------------------------------------------
export function powerLabel(power) {
  if (power === 0) return ''
  if (power === 1) return 't'
  return `t${toSuperscript(power)}`
}

// ------------------------------------------------------------
// Степень полинома = число коэффициентов − 1
// ------------------------------------------------------------
export function getDegree(key) {
  return (COEFFICIENTS[key]?.length ?? 0) - 1
}

// ------------------------------------------------------------
// Строковое представление (K10·t² − K11·t + K14)
// ------------------------------------------------------------
export function polynomialToString(key) {
  const coefs = COEFFICIENTS[key]
  if (!coefs) return ''

  return coefs
    .map((term, power) => {
      const sign = term.sign > 0
        ? (power === 0 ? '' : ' + ')
        : (power === 0 ? '−' : ' − ')

      return sign + term.name + powerLabel(power)
    })
    .join('')
}

// ------------------------------------------------------------
// Вычислить K_i(t):
//   1. коэффициенты → [0, 1]
//   2. τ = t / tMax ∈ [0, 1]
//   3. масштаб = K_i_max / n (n = число коэффициентов)
//   4. обрезка в [-K_i_max, +K_i_max]
// ------------------------------------------------------------
export function evaluatePolynomial(key, t, values, tMax = 10) {
  const coefs = COEFFICIENTS[key]
  if (!coefs) return 0

  const tau = tMax > 0 ? t / tMax : 0
  const n = coefs.length

  // Нормированный результат — примерно в [-n, +n]
  let normalizedResult = 0
  for (let power = 0; power < coefs.length; power++) {
    const { name, sign } = coefs[power]
    const rawValue = values[name] ?? 0
    const normValue = normalize(name, rawValue) // → [0, 1]
    normalizedResult += sign * normValue * Math.pow(tau, power)
  }

  // Масштаб — максимум самой K_i, делённый на число членов
  const limit = getMax(key)
  const scale = limit / n

  let result = normalizedResult * scale

  // Обрезка в физических пределах
  result = Math.max(-limit, Math.min(limit, result))

  return result
}

// ------------------------------------------------------------
// Вычислить все 15 полиномов в момент t
// ------------------------------------------------------------
export function evaluateAll(t, values, tMax = 10) {
  const result = {}
  STATE_NAMES.forEach((_, i) => {
    const key = `K${i + 1}`
    result[key] = evaluatePolynomial(key, t, values, tMax)
  })
  return result
}

// ------------------------------------------------------------
// Какие переменные реально используются как коэффициенты.
// ------------------------------------------------------------
export function getAllCoefficientNames() {
  const set = new Set()
  Object.values(COEFFICIENTS).forEach((coefs) => {
    coefs.forEach((term) => set.add(term.name))
  })
  return Array.from(set).sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''), 10)
    const numB = parseInt(b.replace(/\D/g, ''), 10)
    const prefixA = a[0]
    const prefixB = b[0]
    if (prefixA !== prefixB) return prefixA.localeCompare(prefixB)
    return numA - numB
  })
}