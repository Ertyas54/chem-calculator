import { R_MAX } from './normalization'
import { FN_COUNT } from './functions'
import { evaluateAll } from './polynomials'

function randInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  if (max <= min) return min
  return Math.floor(min + Math.random() * (max - min + 1))
}

function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

const K_KEYS = Array.from({ length: 15 }, (_, i) => `K${i + 1}`)

const K_TREND = {
  K1:  'down',
  K2:  'down',
  K3:  'down',
  K4:  'up',
  K5:  'down',
  K6:  'down',
  K7:  'up',
  K8:  'up',
  K9:  'down',
  K10: 'up',
  K11: 'up',
  K12: 'up',
  K13: 'up',
  K14: 'up',
  K15: 'up',
}

// K теперь в нормализованной шкале [0, 1], норма = 0.5.
// "down" → стартуем выше нормы (0.55…0.90), чтобы было куда улучшаться;
// "up"   → стартуем ниже нормы (0.10…0.45).
function randomKValue(key) {
  const trend = K_TREND[key] ?? 'up'
  const ratio =
    trend === 'down'
      ? 0.55 + Math.random() * 0.35
      : 0.10 + Math.random() * 0.35
  // округляем до сотых, чтобы ввод/вывод был предсказуемым
  return Math.round(ratio * 100) / 100
}

export function randomK() {
  const result = {}
  K_KEYS.forEach((key) => {
    result[key] = randomKValue(key)
  })
  return result
}

function randomFnCoefficients() {
  return [
    choice([0, 0, 0.5, 1]),
    choice([1, 1.5, 2, 2.5, 3]),
    choice([0.2, 0.5, 0.8, 1, 1.5]),
    choice([0.1, 0.2, 0.5, 0.8]),
  ]
}

//function randomRValue(key) {
//  const max = R_MAX[key] ?? 1
//  switch (key) {
//    case 'R1':
//    case 'R2':
//      return randInt(1, max)
//    case 'R3':
//      return randInt(0, max)
//    case 'R4':
//      return randInt(0, Math.min(1, max))
//    default:
//      return randInt(0, max)
//  }
//}


function randomRValue(key) {
  const max = R_MAX[key] ?? 1
  return Math.round(Math.random() * max * 100) / 100
}

export function randomFnValues(fn) {
  const [c0, c1, c2, c3] = randomFnCoefficients()
  return {
    [`f${fn}_c0`]: c0,
    [`f${fn}_c1`]: c1,
    [`f${fn}_c2`]: c2,
    [`f${fn}_c3`]: c3,
  }
}

export function randomR() {
  return {
    R1: randomRValue('R1'),
    R2: randomRValue('R2'),
    R3: randomRValue('R3'),
    R4: randomRValue('R4'),
  }
}

export function randomAllValues() {
  const result = {}
  Object.assign(result, randomK())
  Object.assign(result, randomR())

  for (let i = 1; i <= FN_COUNT; i++) {
    Object.assign(result, randomFnValues(i))
  }

  return result
}

export function randomOneValue(key) {
  if (key.startsWith('R')) return randomRValue(key)
  if (key.startsWith('K')) return randomKValue(key)

  const m = key.match(/^f(\d+)_c(\d+)$/)
  if (m) {
    const deg = parseInt(m[2], 10)
    if (deg === 0) return choice([0, 0, 0.5, 1])
    if (deg === 1) return choice([1, 1.5, 2, 2.5, 3])
    if (deg === 2) return choice([0.2, 0.5, 0.8, 1, 1.5])
    if (deg === 3) return choice([0.1, 0.2, 0.5, 0.8])
  }
  return 0
}

//export function randomConditions(kValues = {}) {
//  const result = {}
//  K_KEYS.forEach((key) => {
//    const k = Number.isFinite(kValues[key]) ? kValues[key] : 0.5
//    const sub = k <= 0.3
//      ? 0.05
//      : 0.1 + Math.random() * 0.1          // 0.1 … 0.2
//    let v = Math.round((k - sub) * 100) / 100
//    v = Math.max(0, Math.min(0.5, v))
//    result[key] = v
//  })
//  return result
//}



export function randomConditions(values, tEnd = 10) {
  const result = {}
  if (!values) {
    K_KEYS.forEach((k) => { result[k] = 0.5 })
    return result
  }

  // 1) Сэмплируем K(t) на [0, tEnd], берём max по каждому ключу
  const SAMPLE = 40
  const maxK = {}
  K_KEYS.forEach((k) => { maxK[k] = 0 })

  for (let i = 0; i <= SAMPLE; i++) {
    const t = (i / SAMPLE) * tEnd
    let state
    try {
      state = evaluateAll(t, values, tEnd)
    } catch {
      continue
    }
    if (!state) continue
    K_KEYS.forEach((k) => {
      const v = Number(state[k])
      if (Number.isFinite(v) && v > maxK[k]) maxK[k] = v
    })
  }

  // 2) Условие = max + margin
  //    margin бимодальный: иногда «впритык», иногда «с запасом»,
  //    чтобы красная линия не выглядела ровным кругом
  K_KEYS.forEach((k) => {
    const m = maxK[k]
    const margin = Math.random() < 0.5
      ? 0.02 + Math.random() * 0.05   // 0.02…0.07 — впритык
      : 0.10 + Math.random() * 0.10   // 0.10…0.20 — с запасом
    let cond = m + margin
    if (cond > 1) cond = 1
    if (cond < 0) cond = 0
    result[k] = Math.round(cond * 100) / 100
  })

  return result
}