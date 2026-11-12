// ============================================================
// Численное решение системы ОДУ методом Рунге–Кутты 4-го порядка.
// R — функции времени R(t) = c₀ + c₁·t + c₂·t² + c₃·t³.
// ============================================================

import { EQUATIONS } from './equations'
import { evalFn, evalR } from './functions'
import { K_MAX } from './normalization'

const R_CAP = 5

function fnValue(fn, x, values) {
  const coeffs = [
    values[`f${fn}_c0`] ?? 0,
    values[`f${fn}_c1`] ?? 0,
    values[`f${fn}_c2`] ?? 0,
    values[`f${fn}_c3`] ?? 0,
  ]
  return evalFn(coeffs, x)
}

// R_k(t) = c₀ + c₁·t + c₂·t² + c₃·t³, ограничено сверху R_CAP
function rValue(rIndex, values, t) {
  const coeffs = [
    values[`R${rIndex}_c0`] ?? 0,
    values[`R${rIndex}_c1`] ?? 0,
    values[`R${rIndex}_c2`] ?? 0,
    values[`R${rIndex}_c3`] ?? 0,
  ]
  const v = evalR(coeffs, t)
  return Math.max(0, Math.min(R_CAP, v))
}

function softFactor(K, KMax, eps) {
  const epsAbs = eps * KMax
  if (epsAbs <= 0) return 1
  const nearZero = K / epsAbs
  const fZero = (nearZero * nearZero) / (1 + nearZero * nearZero)
  const nearMax = (KMax - K) / epsAbs
  const fMax = (nearMax * nearMax) / (1 + nearMax * nearMax)
  return fZero * fMax
}

function derivatives(K, values, t) {
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
          const rIndex = parseInt(term.r.slice(1), 10)
          const rv = rValue(rIndex, values, t)
          product *= rv
          count++
        }
      })

      if (count > 1) {
        product = Math.pow(Math.max(0, product), 1 / count)
      }

      sum += sign * product
    })

    const max = K_MAX[key] ?? 1
    const baseScale = max / 250
    const soft = softFactor(K[key] ?? 0, max, 0.05)
    d[key] = sum * baseScale * soft
  })

  return d
}

function rk4Step(K, values, t, dt) {
  const k1 = derivatives(K, values, t)

  const K2 = {}
  Object.keys(K).forEach((key) => {
    K2[key] = K[key] + (dt / 2) * k1[key]
  })
  const k2 = derivatives(K2, values, t + dt / 2)

  const K3 = {}
  Object.keys(K).forEach((key) => {
    K3[key] = K[key] + (dt / 2) * k2[key]
  })
  const k3 = derivatives(K3, values, t + dt / 2)

  const K4 = {}
  Object.keys(K).forEach((key) => {
    K4[key] = K[key] + dt * k3[key]
  })
  const k4 = derivatives(K4, values, t + dt)

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

  const initialK = {}
  for (let i = 1; i <= 15; i++) {
    const key = `K${i}`
    initialK[key] = values[key] ?? 0
  }

  const states = []
  let K = { ...initialK }
  states.push({ t: 0, K: { ...K } })

  for (let i = 1; i <= steps; i++) {
    const t = (i - 1) * dt
    K = rk4Step(K, values, t, dt)
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