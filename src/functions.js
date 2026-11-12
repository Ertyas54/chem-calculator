export const FN_COUNT = 55
export const FN_DEGREE = 3

export const R_COUNT = 4
export const R_DEGREE = 3

export function defaultFnCoefficients() {
  return [0, 1, 0, 0]
}

export function evalFn(coeffs, x) {
  let result = 0
  let p = 1
  for (let i = 0; i < coeffs.length; i++) {
    result += (coeffs[i] ?? 0) * p
    p *= x
  }
  return result
}

export function evalR(coeffs, t) {
  return evalFn(coeffs, t)
}

export function coefName(fn, degree) {
  return `f${fn}_c${degree}`
}

export function rCoefName(rIndex, degree) {
  return `R${rIndex}_c${degree}`
}

export function randomRCoefficients() {
  const out = []
  for (let i = 0; i <= R_DEGREE; i++) {
    out.push(Math.round(Math.random() * 100) / 100) // [0, 1] шаг 0.01
  }
  return out
}