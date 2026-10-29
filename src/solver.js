// ============================================================
// Численное решение системы ОДУ методом Рунге–Кутты 4-го порядка.
//
// Ключевые решения для осмысленной динамики:
//   • dK_i/dt масштабируется на K_MAX_i / tEnd — тогда K_i
//     проходит свой диапазон ровно за время tEnd.
//   • Произведение f_j в слагаемом заменяется геометрическим
//     средним, чтобы порядок не зависел от числа множителей.
//   • Проекция в [0, K_MAX_i] гарантирует неотрицательность.
// ============================================================

import { EQUATIONS } from './equations'
import { evalFn } from './functions'
import { K_MAX, K_INITIAL, R_MAX } from './normalization'

function fnValue(fn, x, values) {
  const coeffs = [
    values[`f${fn}_c0`] ?? 0,
    values[`f${fn}_c1`] ?? 0,
    values[`f${fn}_c2`] ?? 0,
    values[`f${fn}_c3`] ?? 0,
  ]
  return evalFn(coeffs, x)
}

function rValue(r, values) {
  const max = R_MAX[r] ?? 1
  const raw = values[r] ?? 0
  return Math.max(0, Math.min(1, raw / max))
}

// Правая часть dK/dt для текущего вектора K
function derivatives(K, values, tEnd) {
  const d = {}

  Object.entries(EQUATIONS).forEach(([key, termsList]) => {
    let sum = 0

    termsList.forEach(({ sign, terms }) => {
      let product = 1
      let count = 0

      terms.forEach((term) => {
        if (term.fn != null) {
          const argValue = K[term.arg] ?? 0
          const argMax = K_MAX[term.arg] ?? 1
          const x = argMax > 0 ? argValue / argMax : 0
          const xClamped = Math.max(0, Math.min(1, x))
          const fv = fnValue(term.fn, xClamped, values)
          // Ограничим каждую f_j снизу нулём (отрицательный
          // отклик не имеет физического смысла)
          product *= Math.max(0, fv)
          count++
        } else if (term.r) {
          const rv = rValue(term.r, values)
          product *= rv
          count++
        }
      })

      // Геометрическое среднее по числу множителей — чтобы
      // произведение 6 функций не «взрывалось» как 3^6.
      if (count > 1) {
        product = Math.pow(Math.max(0, product), 1 / count)
      }

      sum += sign * product
    })

    // Масштаб: K_MAX_i / tEnd, чтобы K_i прошла диапазон
    // ровно за tEnd при |sum| ≈ 1
    const scale = tEnd > 0 ? (K_MAX[key] ?? 1) / tEnd : 0
    d[key] = sum * scale
  })

  return d
}

function rk4Step(K, values, dt, tEnd) {
  const k1 = derivatives(K, values, tEnd)

  const K2 = {}
  Object.keys(K).forEach((key) => {
    K2[key] = K[key] + (dt / 2) * k1[key]
  })
  const k2 = derivatives(K2, values, tEnd)

  const K3 = {}
  Object.keys(K).forEach((key) => {
    K3[key] = K[key] + (dt / 2) * k2[key]
  })
  const k3 = derivatives(K3, values, tEnd)

  const K4 = {}
  Object.keys(K).forEach((key) => {
    K4[key] = K[key] + dt * k3[key]
  })
  const k4 = derivatives(K4, values, tEnd)

  const result = {}
  Object.keys(K).forEach((key) => {
    const next =
      K[key] +
      (dt / 6) * (k1[key] + 2 * k2[key] + 2 * k3[key] + k4[key])
    const max = K_MAX[key] ?? 1
    result[key] = Math.max(0, Math.min(max, next))
  })
  return result
}

export function solveODE(values, tEnd, steps = 400) {
  const dt = tEnd / steps

  const states = []
  let K = { ...K_INITIAL }
  states.push({ t: 0, K: { ...K } })

  for (let i = 1; i <= steps; i++) {
    K = rk4Step(K, values, dt, tEnd)
    states.push({ t: i * dt, K: { ...K } })
  }

  return states
}

export function interpolateState(states, t) {
  const t0 = states[0].t
  const tN = states[states.length - 1].t
  if (t <= t0) return states[0].K
  if (t >= tN) return states[states.length - 1].K

  let lo = 0
  let hi = states.length - 1
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (states[mid].t <= t) lo = mid
    else hi = mid
  }

  const a = states[lo]
  const b = states[hi]
  const ratio = (t - a.t) / (b.t - a.t || 1)

  const result = {}
  Object.keys(a.K).forEach((key) => {
    result[key] = a.K[key] + ratio * (b.K[key] - a.K[key])
  })
  return result
}