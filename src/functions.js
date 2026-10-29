// ============================================================
// 55 функций f₁…f₅₅. Каждая — полином с возрастающей степенью:
//   f(x) = c₀ + c₁·x + c₂·x² + c₃·x³
// Коэффициенты — целые, задаются пользователем.
// Аргумент x — нормированное значение K (0…1).
// ============================================================

export const FN_COUNT = 55
export const FN_DEGREE = 3 // максимум

// Коэффициенты по умолчанию: f(x) = x → [0, 1, 0, 0]
export function defaultFnCoefficients() {
  return [0, 1, 0, 0]
}

// Вычислить f(x) по массиву коэффициентов
export function evalFn(coeffs, x) {
  let result = 0
  let p = 1
  for (let i = 0; i < coeffs.length; i++) {
    result += (coeffs[i] ?? 0) * p
    p *= x
  }
  return result
}

// Имя переменной коэффициента: f1_c0, f1_c1, …
export function coefName(fn, degree) {
  return `f${fn}_c${degree}`
}