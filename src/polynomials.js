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

// ------------------------------------------------------------
// Коэффициенты каждого полинома.
// Порядок: степень t от 0 до n (свободный член → старший).
// ------------------------------------------------------------
export const COEFFICIENTS = {
  K1: [
    { name: 'K10', sign: +1 },
    { name: 'K11', sign: -1 },
    { name: 'K14', sign: -1 },
  ],
  K2: [
    { name: 'K3',  sign: +1 },
    { name: 'K7',  sign: +1 },
    { name: 'K8',  sign: +1 },
    { name: 'K9',  sign: +1 },
    { name: 'K13', sign: +1 },
    { name: 'K10', sign: -1 },
    { name: 'K11', sign: -1 },
    { name: 'K14', sign: -1 },
    { name: 'K15', sign: -1 },
    { name: 'R1',  sign: -1 },
    { name: 'R2',  sign: -1 },
    { name: 'R3',  sign: -1 },
    { name: 'R4',  sign: -1 },
  ],
  K3: [
    { name: 'K1',  sign: +1 },
    { name: 'K15', sign: -1 },
    { name: 'R1',  sign: -1 },
    { name: 'R3',  sign: -1 },
    { name: 'R4',  sign: -1 },
  ],
  K4: [{ name: 'K1', sign: +1 }],
  K5: [
    { name: 'K1', sign: +1 },
    { name: 'R2', sign: +1 },
    { name: 'R1', sign: -1 },
  ],
  K6: [
    { name: 'R2',  sign: +1 },
    { name: 'K4',  sign: -1 },
    { name: 'K11', sign: -1 },
    { name: 'K12', sign: -1 },
    { name: 'K14', sign: -1 },
    { name: 'R1',  sign: -1 },
  ],
  K7: [
    { name: 'K5',  sign: +1 },
    { name: 'K6',  sign: +1 },
    { name: 'K13', sign: +1 },
    { name: 'K15', sign: +1 },
    { name: 'R1',  sign: +1 },
    { name: 'R2',  sign: +1 },
    { name: 'R3',  sign: +1 },
  ],
  K8: [
    { name: 'K5',  sign: +1 },
    { name: 'K6',  sign: +1 },
    { name: 'K11', sign: +1 },
    { name: 'K13', sign: +1 },
    { name: 'K14', sign: +1 },
    { name: 'K15', sign: +1 },
    { name: 'R1',  sign: +1 },
    { name: 'R2',  sign: +1 },
    { name: 'R3',  sign: +1 },
  ],
  K9: [
    { name: 'K3',  sign: +1 },
    { name: 'K13', sign: +1 },
    { name: 'R2',  sign: +1 },
    { name: 'K10', sign: -1 },
    { name: 'K11', sign: -1 },
    { name: 'K14', sign: -1 },
    { name: 'R1',  sign: -1 },
  ],
  K10: [
    { name: 'K3',  sign: +1 },
    { name: 'K9',  sign: +1 },
    { name: 'K15', sign: +1 },
    { name: 'R1',  sign: +1 },
    { name: 'R2',  sign: +1 },
    { name: 'R3',  sign: +1 },
    { name: 'R4',  sign: +1 },
  ],
  K11: [
    { name: 'K3',  sign: +1 },
    { name: 'K13', sign: +1 },
    { name: 'K14', sign: +1 },
    { name: 'R1',  sign: +1 },
    { name: 'R2',  sign: +1 },
    { name: 'R3',  sign: +1 },
    { name: 'K15', sign: -1 },
    { name: 'R4',  sign: -1 },
  ],
  K12: [
    { name: 'K11', sign: +1 },
    { name: 'K13', sign: +1 },
    { name: 'K14', sign: +1 },
    { name: 'R1',  sign: +1 },
    { name: 'R2',  sign: +1 },
    { name: 'R3',  sign: +1 },
    { name: 'K15', sign: -1 },
  ],
  K13: [
    { name: 'K2', sign: +1 },
    { name: 'K3', sign: +1 },
    { name: 'R2', sign: +1 },
  ],
  K14: [
    { name: 'K11', sign: +1 },
    { name: 'K12', sign: +1 },
    { name: 'K13', sign: +1 },
    { name: 'R1',  sign: +1 },
    { name: 'R2',  sign: +1 },
  ],
  K15: [
    { name: 'K2',  sign: +1 },
    { name: 'K3',  sign: +1 },
    { name: 'K13', sign: +1 },
    { name: 'K14', sign: +1 },
    { name: 'R1',  sign: +1 },
    { name: 'R2',  sign: +1 },
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