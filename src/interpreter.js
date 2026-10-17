// ============================================================
// Интерпретатор результатов.
// Модель: K_i(t) — полином степени n_i.
// Вердикт считается по ИЗМЕНЕНИЮ delta = K(t) − K(0):
//   delta > 0 → смотрим MEANING.plus
//   delta < 0 → смотрим MEANING.minus
// ============================================================

import { STATE_NAMES } from './polynomials'
import { K_MAX } from './normalization'

export const UNITS = {
  K1: 'ч',
  K2: 'ч',
  K3: 'км²',
  K4: 'ч',
  K5: 'усл. ед.',
  K6: 'усл. ед.',
  K7: 'чел.',
  K8: 'чел.',
  K9: 'ед.',
  K10: 'усл. ед.',
  K11: 'усл. ед.',
  K12: 'отн. ед.',
  K13: 'чел.',
  K14: 'чел.',
  K15: 'отн. ед.',
}

const MEANING = {
  K1: {
    plus:  { label: 'Испарение идёт дольше нормы',          good: false },
    minus: { label: 'Испарение заканчивается быстрее нормы', good: true  },
  },
  K2: {
    plus:  { label: 'Ликвидация затягивается дольше нормы', good: false },
    minus: { label: 'Ликвидация идёт быстрее нормы',        good: true  },
  },
  K3: {
    plus:  { label: 'Зона заражения больше нормы', good: false },
    minus: { label: 'Зона заражения меньше нормы', good: true  },
  },
  K4: {
    plus:  { label: 'Облако подойдёт позже нормы',  good: true  },
    minus: { label: 'Облако подойдёт раньше нормы', good: false },
  },
  K5: {
    plus:  { label: 'Потери от первичного облака выше нормы', good: false },
    minus: { label: 'Потери от первичного облака ниже нормы', good: true  },
  },
  K6: {
    plus:  { label: 'Потери от вторичного облака выше нормы', good: false },
    minus: { label: 'Потери от вторичного облака ниже нормы', good: true  },
  },
  K7: {
    plus:  { label: 'Амбулаторных пострадавших больше нормы', good: false },
    minus: { label: 'Амбулаторных пострадавших меньше нормы', good: true  },
  },
  K8: {
    plus:  { label: 'Тяжёлых пострадавших больше нормы', good: false },
    minus: { label: 'Тяжёлых пострадавших меньше нормы', good: true  },
  },
  K9: {
    plus:  { label: 'Потерь техники больше нормы', good: false },
    minus: { label: 'Потерь техники меньше нормы', good: true  },
  },
  K10: {
    plus:  { label: 'Растворов требуется больше нормы', good: false },
    minus: { label: 'Растворов требуется меньше нормы', good: true  },
  },
  K11: {
    plus:  { label: 'Сил и средств нужно больше нормы', good: false },
    minus: { label: 'Сил и средств нужно меньше нормы', good: true  },
  },
  K12: {
    plus:  { label: 'Оповещение усилилось относительно нормы', good: true  },
    minus: { label: 'Оповещение ослабло относительно нормы',   good: false },
  },
  K13: {
    plus:  { label: 'Людей в зоне поражения больше нормы', good: false },
    minus: { label: 'Людей в зоне поражения меньше нормы', good: true  },
  },
  K14: {
    plus:  { label: 'Спасателей больше нормы', good: true  },
    minus: { label: 'Спасателей меньше нормы', good: false },
  },
  K15: {
    plus:  { label: 'Система МЧС развилась относительно нормы',    good: true  },
    minus: { label: 'Система МЧС деградировала относительно нормы', good: false },
  },
}

// ------------------------------------------------------------
// Пороги по |delta|
// ------------------------------------------------------------
const SMALL  = 0.5
const MEDIUM = 5
const LARGE  = 20

export function interpretResults(startK, endK) {
  return STATE_NAMES.map((label, i) => {
    const key = `K${i + 1}`
    const start = startK[key] ?? 0
    const end = endK[key] ?? 0
    return interpretOne(key, label, start, end)
  })
}

function interpretOne(key, label, start, end) {
  const unit = UNITS[key] ?? ''
  const meaning = MEANING[key]
  const delta = end - start

  const absDelta = Math.abs(delta)

  let changeLevel
  if (absDelta < SMALL) changeLevel = 'none'
  else if (absDelta < MEDIUM) changeLevel = 'small'
  else if (absDelta < LARGE) changeLevel = 'medium'
  else changeLevel = 'large'

  const startFmt = formatNumber(start)
  const endFmt = formatNumber(end)

  const changeText = `K(0) = ${startFmt} --> K(t) = ${endFmt} ${unit}`

  let verdict, verdictText, verdictIcon
  if (changeLevel === 'none') {
    verdict = 'neutral'
    verdictText = 'Без существенных изменений'
    verdictIcon = '≈'
  } else {
    const side = delta > 0 ? meaning.plus : meaning.minus
    if (side.good) {
      verdict = 'good'
      verdictText = 'Улучшилось'
      verdictIcon = '✓'
    } else {
      verdict = 'bad'
      verdictText = 'Ухудшилось'
      verdictIcon = '✕'
    }
  }

  let explanation
  if (changeLevel === 'none') {
    explanation = 'Значение практически не изменилось.'
  } else {
    const side = delta > 0 ? meaning.plus : meaning.minus
    explanation = side.label + '.'
  }

  // Нормированное значение — % от максимума
  const max = K_MAX[key] ?? 1
  const percent = max > 0 ? (end / max) * 100 : 0

  return {
    key,
    label: label.replace(/^K\d+ — /, ''),
    unit,
    start,
    end,
    delta,
    percent,
    changeText,
    verdict,
    verdictText,
    verdictIcon,
    explanation,
  }
}

function formatNumber(v, signed = false) {
  if (!Number.isFinite(v)) return '—'
  const abs = Math.abs(v)
  const digits = abs >= 100 ? 1 : abs >= 1 ? 2 : 3
  const str = v.toFixed(digits)
  if (signed && v > 0) return `+${str}`
  return str
}