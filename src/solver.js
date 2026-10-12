export const STATE_NAMES = [
  'K1 — Время испарения ХОВ',
  'K2 — Время ликвидации последствий',
  'K3 — Площадь заражения',
  'K4 — Время подхода облака',
  'K5 — Потери от первичного облака',
  'K6 — Потери от вторичного облака',
  'K7 — Амбулаторная помощь, чел.',
  'K8 — Стационар и реанимация, чел.',
  'K9 — Пораженная техника',
  'K10 — Объемы для обеззараживания',
  'K11 — Силы и средства АСР',
  'K12 — Эффективность системы оповещения',
  'K13 — Люди в зоне поражения',
  'K14 — Спасатели в зоне поражения',
  'K15 — Развитость системы МЧС',
]

export const CONTROL_NAMES = [
  'R1 — Уровень финансирования МЧС',
  'R2 — Экономическое развитие города',
  'R3 — Наличие прибыли у предприятия',
  'R4 — Доля современного оборудования',
]

function sat(x, k = 1) {
  const xa = Math.abs(x)
  return xa / (xa + k)
}

const F_COEFFS = new Array(56).fill(1)
for (let i = 1; i <= 55; i++) F_COEFFS[i] = 1 + (i % 5) * 0.3

function f(i, K) {
  return sat(K, F_COEFFS[i])
}

function R(i, t, controls) {
  const base = controls[`R${i}`] ?? 0
  return base * (1 + 0.05 * Math.sin(t / 5 + i))
}

export function derivatives(K, t, controls) {
  const [
    K1, K2, K3, K4, K5, K6, K7, K8,
    K9, K10, K11, K12, K13, K14, K15,
  ] = K

  const R1 = R(1, t, controls)
  const R2 = R(2, t, controls)
  const R3 = R(3, t, controls)
  const R4 = R(4, t, controls)

  const dK1 = -(f(1, K10) * f(2, K11) * f(3, K14))

  const dK2 =
    f(4, K3) * f(5, K7) * f(6, K8) * f(7, K9) * f(8, K13) -
    (f(9, K10) * f(10, K11) * f(11, K14) * f(12, K15) * R1 +
      R2 + R3 + R4)

  const dK3 =
    f(13, K1) - (f(14, K15) * R1 + R3 + R4)

  const dK4 = f(15, K1)

  const dK5 = f(16, K1) * R2 - R1

  const dK6 =
    R2 - (f(17, K4) * f(18, K11) * f(19, K12) * f(20, K14) * R1)

  const dK7 =
    f(21, K5) * f(22, K6) * f(23, K13) * f(24, K15) * R1 +
    R2 + R3

  const dK8 =
    f(25, K5) * f(26, K6) * f(27, K11) * f(28, K13) *
      f(29, K14) * f(30, K15) * R1 + R2 + R3

  const dK9 =
    f(31, K3) * f(32, K13) * R2 -
    (f(33, K10) * f(34, K11) * f(35, K14) * R1)

  const dK10 =
    f(36, K3) * f(37, K9) * f(38, K15) * R1 +
    R2 + R3 + R4

  const dK11 =
    f(39, K3) * f(40, K13) * f(41, K14) * R1 +
    R2 + R3 -
    (f(42, K15) * R4)

  const dK12 =
    f(43, K11) * f(44, K13) * f(45, K14) * R1 +
    R2 + R3 -
    f(46, K15)

  const dK13 = f(47, K2) * f(48, K3) * R2

  const dK14 =
    f(49, K11) * f(50, K12) * f(51, K13) * R1 + R2

  const dK15 =
    f(52, K2) * f(53, K3) * f(54, K13) * f(55, K14) * R1 + R2

  return [
    dK1, dK2, dK3, dK4, dK5, dK6, dK7, dK8,
    dK9, dK10, dK11, dK12, dK13, dK14, dK15,
  ]
}

function rk4Step(K, t, dt, controls) {
  const k1 = derivatives(K, t, controls)

  const K2 = K.map((v, i) => v + (dt / 2) * k1[i])
  const k2 = derivatives(K2, t + dt / 2, controls)

  const K3 = K.map((v, i) => v + (dt / 2) * k2[i])
  const k3 = derivatives(K3, t + dt / 2, controls)

  const K4 = K.map((v, i) => v + dt * k3[i])
  const k4 = derivatives(K4, t + dt, controls)

  return K.map(
    (v, i) =>
      v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])
  )
}

export function solveSystem({ K0, controls, tEnd = 100, steps = 500 }) {
  const dt = tEnd / steps
  let K = [...K0]
  const result = []

  result.push({ t: 0, ...vectorToObject(K) })

  for (let s = 1; s <= steps; s++) {
    const t = (s - 1) * dt
    K = rk4Step(K, t, dt, controls)
    K = K.map((v) => (Number.isFinite(v) ? v : 0))
    result.push({ t: s * dt, ...vectorToObject(K) })
  }

  return result
}

function vectorToObject(K) {
  const obj = {}
  K.forEach((v, i) => {
    obj[`K${i + 1}`] = v
  })
  return obj
}