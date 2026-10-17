// ============================================================
// Генерация случайных значений коэффициентов K1…K15 и R1…R4.
// Значения согласованы между собой — соблюдаются физические
// связи (пострадавшие ≤ людей, растворы ≥ площади и т.д.).
// ============================================================

import { getAllCoefficientNames } from './polynomials'

// ---------- Утилиты ----------
function randRange(min, max) {
  if (max <= min) return min
  return min + Math.random() * (max - min)
}

function randInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  if (max <= min) return min
  return Math.floor(min + Math.random() * (max - min + 1))
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function round(value, digits = 2) {
  const p = Math.pow(10, digits)
  return Math.round(value * p) / p
}

// ------------------------------------------------------------
// Модельные константы для связей
// ------------------------------------------------------------
const CONST = {
  RESCUERS_PER_MCHS: 50,
  SOLUTION_PER_KM2: 5,
  FORCES_PER_TECH: 2,
  MAX_AFFECTED_RATIO: 0.8,
  MAX_RESCUERS_RATIO: 0.2,
}

// ------------------------------------------------------------
// Главная функция — генерирует все коэффициенты согласованно
// ------------------------------------------------------------
function generateConsistentValues() {
  const v = {}

  // --- 1. Независимые «якорные» величины ---
  v.K13 = randInt(50, 3000)             // люди в зоне
  v.K3  = round(randRange(1, 25), 2)    // площадь заражения
  v.K15 = round(randRange(1, 9), 2)     // развитость МЧС
  v.K1  = round(randRange(5, 45), 2)    // время испарения
  v.K2  = round(randRange(Math.max(6, v.K1), 100), 2) // время ликвидации

  // --- 2. Пострадавшие (K7 + K8 ≤ K13) ---
  const maxAffected = Math.floor(v.K13 * CONST.MAX_AFFECTED_RATIO)
  const affectedTotal = randInt(0, maxAffected)
  const ambulatoryRatio = randRange(0.5, 0.9)
  v.K7 = Math.round(affectedTotal * ambulatoryRatio)
  v.K8 = affectedTotal - v.K7

  // --- 3. Спасатели (K14 ≤ K15 × 50) ---
  const maxRescuers = Math.floor(v.K15 * CONST.RESCUERS_PER_MCHS)
  const maxRescuersByRatio = Math.floor(v.K13 * CONST.MAX_RESCUERS_RATIO)
  const rescuerCeiling = Math.min(maxRescuers, maxRescuersByRatio)
  v.K14 = randInt(
    Math.floor(rescuerCeiling * 0.3),
    rescuerCeiling
  )

  // --- 4. Растворы (K10 ≥ K3 × 5) ---
  const minSolution = Math.ceil(v.K3 * CONST.SOLUTION_PER_KM2)
  v.K10 = randInt(minSolution, Math.max(minSolution, minSolution * 8))

  // --- 5. Техника (K9) ---
  const maxTech = Math.max(1, Math.floor(v.K3 * 4))
  v.K9 = randInt(0, maxTech)

  // --- 6. Силы (K11 ≥ K9 × 2) ---
  const minForces = Math.ceil(v.K9 * CONST.FORCES_PER_TECH + v.K3 * 2)
  v.K11 = randInt(minForces, Math.max(minForces, minForces * 5))

  // --- 7. Потери от облаков (K5, K6 ≤ K13) ---
  v.K5 = randInt(0, Math.min(150, v.K13))
  v.K6 = randInt(0, Math.min(250, v.K13))

  // --- 8. Время подхода облака (K4 ≤ K1) ---
  v.K4 = round(randRange(0.5, v.K1 * 0.7), 2)

  // --- 9. Эффективность оповещения (K12) ---
  const k12Base = v.K15 * 8
  const k12Noise = randRange(-15, 10)
  v.K12 = clamp(Math.round(k12Base + k12Noise), 5, 95)

  // --- 10. R-параметры ---
  v.R1 = round(randRange(0.2, 1.8), 2)
  v.R2 = round(randRange(0.3, 1.8), 2)
  v.R3 = round(randRange(0.1, 1.5), 2)
  v.R4 = round(randRange(0.1, 0.9), 2)

  return v
}

// ------------------------------------------------------------
// Применить знаки для каждой переменной:
// некоторые коэффициенты в полиномах идут со знаком «−»,
// но само значение по смыслу должно быть положительным.
// Здесь мы оставляем значения положительными — знак
// применяется уже в COEFFICIENTS.
// ------------------------------------------------------------
export function randomAllValues() {
  const names = getAllCoefficientNames()
  const base = generateConsistentValues()

  const result = {}
  names.forEach((key) => {
    result[key] = base[key] ?? 0
  })
  return result
}

// ------------------------------------------------------------
// Случайное значение для одного коэффициента — с учётом
// диапазона по смыслу (без связей с другими)
// ------------------------------------------------------------
const K_MAX = {
  K1: 48, K2: 120, K3: 30, K4: 12, K5: 200,
  K6: 300, K7: 500, K8: 200, K9: 100, K10: 500,
  K11: 300, K12: 100, K13: 5000, K14: 500, K15: 10,
}
const R_MAX = { R1: 2, R2: 2, R3: 2, R4: 1 }

export function randomOneValue(key) {
  const isR = key.startsWith('R')
  const max = (isR ? R_MAX[key] : K_MAX[key]) ?? 10
  return round(randRange(0, max), 2)
}