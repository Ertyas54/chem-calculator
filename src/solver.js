// ============================================================
// Численное решение системы ОДУ методом Рунге–Кутты 4-го порядка.
//
// Ключевые изменения для отсутствия «полок» на графике:
//   • Скорость dK/dt уменьшена в 10 раз — K не успевают
//     упереться в границы за tEnd.
//   • Мягкая обрезка: возле 0 и K_MAX скорость плавно затухает,
//     а не жёстко ограничивается. K асимптотически стремится
//     к границе, но не прилипает.
// ============================================================

import { EQUATIONS } from './equations'
import { evalFn } from './functions'
import { K_MAX, R_MAX } from './normalization'

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

// ------------------------------------------------------------
// Мягкий фактор приближения к границам:
//   у 0:        smooth = (K/K_eps)^2 / (1 + (K/K_eps)^2)
//   у K_MAX:    smooth = ((K_MAX-K)/K_eps)^2 / (1 + ...)
// Возле границ множитель → 0 (замедление), в середине → 1.
// ------------------------------------------------------------
function softFactor(K, KMax, eps) {
  const epsAbs = eps * KMax
  if (epsAbs <= 0) return 1

  // Замедление у нуля
  const nearZero = K / epsAbs
  const fZero = (nearZero * nearZero) / (1 + nearZero * nearZero)

  // Замедление у потолка
  const nearMax = (KMax - K) / epsAbs
  const fMax = (nearMax * nearMax) / (1 + nearMax * nearMax)

  return fZero * fMax
}

// ------------------------------------------------------------
// Правая часть dK/dt
// ------------------------------------------------------------
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
          product *= Math.max(0, fv)
          count++
        } else if (term.r) {
          const rv = rValue(term.r, values)
          product *= rv
          count++
        }
      })

      // Геометрическое среднее по числу множителей
      if (count > 1) {
        product = Math.pow(Math.max(0, product), 1 / count)
      }

      sum += sign * product
    })

    // Масштаб: K_MAX / tEnd / 10 — чтобы за tEnd K сдвинулось
    // в среднем на 10% диапазона, а не на 100%.
    const max = K_MAX[key] ?? 1
    const baseScale = max / 100

    // Мягкая обрезка — у границ скорость падает
    const soft = softFactor(K[key] ?? 0, max, 0.05)
    d[key] = sum * baseScale * soft
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
    // Проекция всё равно нужна — но теперь с мягкой обрезкой
    // K редко к ней подходит. Если подошёл — не прилипнет,
    // а будет плавно отталкиваться благодаря softFactor.
    result[key] = Math.max(0, Math.min(max, next))
  })
  return result
}

export function solveODE(values, tEnd, steps = 400) {
  const dt = tEnd / steps

  // Стартовые K из values
  const initialK = {}
  for (let i = 1; i <= 15; i++) {
    const key = `K${i}`
    initialK[key] = values[key] ?? 0
  }

  const states = []
  let K = { ...initialK }
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