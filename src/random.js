import { K_MAX, R_MAX } from './normalization'
import { FN_COUNT } from './functions'

function randInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  if (max <= min) return min
  return Math.floor(min + Math.random() * (max - min + 1))
}

function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

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


function randomKValue(key) {
  const max = K_MAX[key] ?? 100
  const trend = K_TREND[key] ?? 'up'
  const ratio =
    trend === 'down'
      ? 0.55 + Math.random() * 0.35 
      : 0.10 + Math.random() * 0.35 
  return Math.round(ratio * max)
}

export function randomK() {
  const result = {}
  Object.keys(K_MAX).forEach((key) => {
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

  // K
  Object.assign(result, randomK())

  // R
  Object.assign(result, randomR())

  // f_j
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