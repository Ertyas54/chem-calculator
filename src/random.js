import { STATE_NAMES, CONTROL_NAMES } from './solver'

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

export function randomK0() {
  const K = {}

  const scale = Math.random() 
  const s = 0.5 * (scale + Math.pow(scale, 0.7))

  K.K13 = randInt(10 + s * s * 4990, 20 + s * s * 5000)

  K.K3 = round(0.5 + s * 29.5 + randRange(-1, 1), 2)
  K.K3 = clamp(K.K3, 0.3, 35)

  K.K15 = round(1 + s * 9, 2)

  K.K1 = round(2 + s * 46, 2)

  K.K2 = round(K.K1 + 5 + s * 100, 2)

  const affectedRatio = randRange(0.2, 0.8)
  const affectedTotal = Math.round(K.K13 * affectedRatio)

  const ambulatoryRatio = randRange(0.6, 0.9)
  K.K7 = Math.round(affectedTotal * ambulatoryRatio)
  K.K8 = affectedTotal - K.K7

  const maxRescuersByMchs = Math.floor(K.K15 * 50)
  const maxRescuersByRatio = Math.floor(K.K13 * 0.2)
  const maxRescuers = Math.min(maxRescuersByMchs, maxRescuersByRatio)

  const minRescuers = Math.max(1, Math.floor(maxRescuers * 0.3))
  K.K14 = randInt(minRescuers, maxRescuers)

  const solutionPerKm2 = randRange(5, 15)
  K.K10 = Math.round(K.K3 * solutionPerKm2)

  const techPerKm2 = randRange(0, 3)
  K.K9 = Math.round(K.K3 * techPerKm2)

  const forcesPerKm2 = randRange(2, 5)
  const minForces = K.K9 * 2 + K.K3 * 2
  K.K11 = Math.round(minForces + K.K3 * forcesPerKm2)

  K.K5 = Math.round(K.K13 * randRange(0, 0.15))
  // Вторичное облако: 0–25% от людей в зоне
  K.K6 = Math.round(K.K13 * randRange(0, 0.25))

  K.K4 = round(K.K1 * randRange(0.1, 0.5), 2)

  const k12Base = K.K15 * 9
  const k12Noise = randRange(-10, 5)
  K.K12 = clamp(Math.round(k12Base + k12Noise), 5, 95)

  K.K7 = clamp(K.K7, 0, K.K13)
  K.K8 = clamp(K.K8, 0, K.K13 - K.K7)
  K.K14 = clamp(K.K14, 0, K.K13)
  K.K14 = clamp(K.K14, 0, Math.floor(K.K15 * 50))
  K.K10 = Math.max(K.K10, Math.ceil(K.K3 * 5))
  K.K11 = Math.max(K.K11, Math.ceil(K.K9 * 2))
  K.K4 = Math.min(K.K4, K.K1)
  K.K12 = clamp(K.K12, 0, 100)

  ;['K7', 'K8', 'K9', 'K10', 'K11', 'K12', 'K13', 'K14'].forEach(
    (k) => (K[k] = Math.round(K[k]))
  )

  const ordered = {}
  STATE_NAMES.forEach((_, i) => {
    const key = `K${i + 1}`
    ordered[key] = K[key] ?? 0
  })
  return ordered
}

const R_RANGES = {
  R1: [0.2, 1.5],
  R2: [0.3, 1.5],
  R3: [0.1, 1.2],
  R4: [0.1, 0.9],
}

export function randomControls() {
  const result = {}
  CONTROL_NAMES.forEach((_, i) => {
    const key = `R${i + 1}`
    const [min, max] = R_RANGES[key]
    result[key] = round(randRange(min, max), 2)
  })
  return result
}

export function randomAll() {
  return {
    K0: randomK0(),
    controls: randomControls(),
  }
}

export function validateConstraints(K) {
  const errors = []

  if ((K.K7 ?? 0) + (K.K8 ?? 0) > (K.K13 ?? 0)) {
    errors.push(
      `K7 + K8 = ${(K.K7 ?? 0) + (K.K8 ?? 0)} > K13 = ${K.K13 ?? 0}. ` +
        `Пострадавших не может быть больше, чем людей в зоне.`
    )
  }

  const maxRescuers = (K.K15 ?? 0) * 50
  if ((K.K14 ?? 0) > maxRescuers) {
    errors.push(
      `K14 = ${K.K14} > K15 × 50 = ${maxRescuers}. ` +
        `Спасателей не может быть больше, чем позволяет развитость МЧС.`
    )
  }

  if ((K.K4 ?? 0) > (K.K1 ?? 0)) {
    errors.push(
      `K4 = ${K.K4} > K1 = ${K.K1}. ` +
        `Облако не может дойти позже, чем испарится источник.`
    )
  }

  const minSolution = Math.ceil((K.K3 ?? 0) * 5)
  if ((K.K10 ?? 0) < minSolution) {
    errors.push(
      `K10 = ${K.K10} < K3 × 5 = ${minSolution}. ` +
        `Растворов не хватит на обеззараживание площади.`
    )
  }

  const minForces = Math.ceil((K.K9 ?? 0) * 2)
  if ((K.K11 ?? 0) < minForces) {
    errors.push(
      `K11 = ${K.K11} < K9 × 2 = ${minForces}. ` +
        `Сил не хватит на ликвидацию техники.`
    )
  }

  if ((K.K12 ?? 0) < 0 || (K.K12 ?? 0) > 100) {
    errors.push(`K12 = ${K.K12} — должен быть в диапазоне 0…100.`)
  }

  if ((K.K1 ?? 0) <= 0) errors.push(`K1 должно быть > 0.`)
  if ((K.K2 ?? 0) <= 0) errors.push(`K2 должно быть > 0.`)

  return errors
}