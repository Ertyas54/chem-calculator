import { STATE_NAMES } from './solver'

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
    plus:  { label: 'Испарение продолжается', good: false },
    minus: { label: 'Испарение завершилось', good: true  },
  },
  K2: {
    plus:  { label: 'Ликвидация продолжается', good: false },
    minus: { label: 'Ликвидация завершилась', good: true  },
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
    plus:  { label: 'Оповещение усилилось', good: true  },
    minus: { label: 'Оповещение ослабло',   good: false },
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
    plus:  { label: 'Система МЧС развилась',    good: true  },
    minus: { label: 'Система МЧС деградировала', good: false },
  },
}

const SMALL  = 5
const MEDIUM = 30
const LARGE  = 100

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

  const deviation = end
  const absDeviation = Math.abs(deviation)

  let deviationLevel
  if (absDeviation < SMALL) deviationLevel = 'none'
  else if (absDeviation < MEDIUM) deviationLevel = 'small'
  else if (absDeviation < LARGE) deviationLevel = 'medium'
  else if (absDeviation < LARGE * 3) deviationLevel = 'large'
  else deviationLevel = 'huge'

  const startFmt = formatNumber(start)
  const endFmt = formatNumber(end)
  const deltaFmt = formatNumber(delta, true)

  const changeText = `${startFmt} → ${endFmt} ${unit}  (${deltaFmt})`

  let verdict       
  let verdictText    
  let verdictIcon    

  if (deviationLevel === 'none') {
    verdict = 'neutral'
    verdictText = 'Без существенных изменений'
    verdictIcon = '≈'
  } else {
    const side = deviation > 0 ? meaning.plus : meaning.minus
    if (side.good) {
      verdict = 'good'
      verdictText = 'Удовлетворительно'
      verdictIcon = '✓'
    } else {
      verdict = 'bad'
      verdictText = 'Не удовлетворительно'
      verdictIcon = '✕'
    }
  }

  let explanation

  if (deviationLevel === 'none') {
    explanation = 'Значение осталось в пределах нормы.'
  } else {
    const side = deviation > 0 ? meaning.plus : meaning.minus
    explanation = side.label + '.'
  }

  return {
    key,
    label: label.replace(/^K\d+ — /, ''),
    unit,

    start,
    end,
    delta,
    deviation,

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