// ============================================================
// Генерация случайных ЦЕЛЫХ, физически осмысленных
// коэффициентов f_j и R_k.
//
// f_j(x) = c₀ + c₁x + c₂x² + c₃x³:
//   • c₀ = 0            — f(0) = 0
//   • c₁ ∈ {1}          — наклон 1: f(1) = 1 (нейтрально)
//     либо {1, 1, 2}    — иногда усиление
//   • c₂ = 0            — без нелинейности (стабильно)
//   • c₃ = 0
//
// В сочетании с геометрическим средним в solver.js это даёт
// f_j(1) ≈ 1, произведение ≈ 1 независимо от числа множителей.
// Система выходит на насыщение, но не «взрывается».
// ============================================================

import { getAllCoefficientNames } from './polynomials'
import { R_MAX } from './normalization'
import { FN_COUNT } from './functions'

function randInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  if (max <= min) return min
  return Math.floor(min + Math.random() * (max - min + 1))
}

function weightedChoice(options) {
  const total = options.reduce((s, [, w]) => s + w, 0)
  let r = Math.random() * total
  for (const [value, w] of options) {
    r -= w
    if (r <= 0) return value
  }
  return options[options.length - 1][0]
}

// Коэффициенты одной f_j. Варианты подобраны так, чтобы кнопка
// «Рандом» заметно меняла картинку: f_j(1) от 0.5 до 3.
function randomFnCoefficients() {
  return weightedChoice([
    [[0, 1, 0, 0], 22],     // f = x
    [[0, 2, 0, 0], 18],     // f = 2x
    [[0, 0.5, 0, 0], 15],   // f = 0.5x
    [[0, 1, 1, 0], 15],     // f = x + x²
    [[0, 1.5, 0, 0], 12],   // f = 1.5x
    [[0, 1, 0, 1], 10],     // f = x + x³
    [[0, 0.5, 0.5, 0], 8],  // f = 0.5x + 0.5x²
  ])
}

function randomRValue(key) {
  const max = R_MAX[key] ?? 1
  switch (key) {
    case 'R1':
    case 'R2':
      return randInt(1, max)
    case 'R3':
      return randInt(0, max)
    case 'R4':
      return randInt(0, Math.min(1, max))
    default:
      return randInt(0, max)
  }
}

export function randomAllValues() {
  const names = getAllCoefficientNames()
  const result = {}

  for (let i = 1; i <= FN_COUNT; i++) {
    const [c0, c1, c2, c3] = randomFnCoefficients()
    result[`f${i}_c0`] = c0
    result[`f${i}_c1`] = c1
    result[`f${i}_c2`] = c2
    result[`f${i}_c3`] = c3
  }

  for (const name of names) {
    if (name.startsWith('R')) {
      result[name] = randomRValue(name)
    }
  }

  return result
}

// Случайные коэффициенты для одной f_j (кнопка 🎲)
export function randomFnValues(fn) {
  const [c0, c1, c2, c3] = randomFnCoefficients()
  return {
    [`f${fn}_c0`]: c0,
    [`f${fn}_c1`]: c1,
    [`f${fn}_c2`]: c2,
    [`f${fn}_c3`]: c3,
  }
}

export function randomOneValue(key) {
  if (key.startsWith('R')) {
    return randomRValue(key)
  }
  const m = key.match(/^f(\d+)_c(\d+)$/)
  if (m) {
    const deg = parseInt(m[2], 10)
    if (deg === 0) return 0
    if (deg === 1) return weightedChoice([[1, 70], [2, 30]])
    if (deg === 2) return weightedChoice([[0, 80], [1, 20]])
    if (deg === 3) return 0
  }
  return 0
}