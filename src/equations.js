// ============================================================
// Правые части системы ОДУ dK_i/dt.
// Каждое K_i — массив слагаемых. Слагаемое = { sign, terms }.
// terms — произведение: элемент либо { fn, arg } (функция
// f_fn от K_arg), либо { r: 'R1' } (R-множитель).
// ============================================================

export const EQUATIONS = {
  K1: [
    {
      sign: -1,
      terms: [
        { fn: 1, arg: 'K10' },
        { fn: 2, arg: 'K11' },
        { fn: 3, arg: 'K14' },
      ],
    },
  ],
  K2: [
    {
      sign: +1,
      terms: [
        { fn: 4, arg: 'K3' },
        { fn: 5, arg: 'K7' },
        { fn: 6, arg: 'K8' },
        { fn: 7, arg: 'K9' },
        { fn: 8, arg: 'K13' },
      ],
    },
    {
      sign: -1,
      terms: [
        { fn: 9, arg: 'K10' },
        { fn: 10, arg: 'K11' },
        { fn: 11, arg: 'K14' },
        { fn: 12, arg: 'K15' },
        { r: 'R1' },
      ],
    },
    { sign: -1, terms: [{ r: 'R2' }] },
    { sign: -1, terms: [{ r: 'R3' }] },
    { sign: -1, terms: [{ r: 'R4' }] },
  ],
  K3: [
    { sign: +1, terms: [{ fn: 13, arg: 'K1' }] },
    {
      sign: -1,
      terms: [
        { fn: 14, arg: 'K15' },
        { r: 'R1' },
      ],
    },
    { sign: -1, terms: [{ r: 'R3' }] },
    { sign: -1, terms: [{ r: 'R4' }] },
  ],
  K4: [
    { sign: +1, terms: [{ fn: 15, arg: 'K1' }] },
  ],
  K5: [
    {
      sign: +1,
      terms: [
        { fn: 16, arg: 'K1' },
        { r: 'R2' },
      ],
    },
    { sign: -1, terms: [{ r: 'R1' }] },
  ],
  K6: [
    { sign: +1, terms: [{ r: 'R2' }] },
    {
      sign: -1,
      terms: [
        { fn: 17, arg: 'K4' },
        { fn: 18, arg: 'K11' },
        { fn: 19, arg: 'K12' },
        { fn: 20, arg: 'K14' },
        { r: 'R1' },
      ],
    },
  ],
  K7: [
    {
      sign: +1,
      terms: [
        { fn: 21, arg: 'K5' },
        { fn: 22, arg: 'K6' },
        { fn: 23, arg: 'K13' },
        { fn: 24, arg: 'K15' },
        { r: 'R1' },
      ],
    },
    { sign: +1, terms: [{ r: 'R2' }] },
    { sign: +1, terms: [{ r: 'R3' }] },
  ],
  K8: [
    {
      sign: +1,
      terms: [
        { fn: 25, arg: 'K5' },
        { fn: 26, arg: 'K6' },
        { fn: 27, arg: 'K11' },
        { fn: 28, arg: 'K13' },
        { fn: 29, arg: 'K14' },
        { fn: 30, arg: 'K15' },
        { r: 'R1' },
      ],
    },
    { sign: +1, terms: [{ r: 'R2' }] },
    { sign: +1, terms: [{ r: 'R3' }] },
  ],
  K9: [
    {
      sign: +1,
      terms: [
        { fn: 31, arg: 'K3' },
        { fn: 32, arg: 'K13' },
        { r: 'R2' },
      ],
    },
    {
      sign: -1,
      terms: [
        { fn: 33, arg: 'K10' },
        { fn: 34, arg: 'K11' },
        { fn: 35, arg: 'K14' },
        { r: 'R1' },
      ],
    },
  ],
  K10: [
    {
      sign: +1,
      terms: [
        { fn: 36, arg: 'K3' },
        { fn: 37, arg: 'K9' },
        { fn: 38, arg: 'K15' },
        { r: 'R1' },
      ],
    },
    { sign: +1, terms: [{ r: 'R2' }] },
    { sign: +1, terms: [{ r: 'R3' }] },
    { sign: +1, terms: [{ r: 'R4' }] },
  ],
  K11: [
    {
      sign: +1,
      terms: [
        { fn: 39, arg: 'K3' },
        { fn: 40, arg: 'K13' },
        { fn: 41, arg: 'K14' },
        { r: 'R1' },
      ],
    },
    { sign: +1, terms: [{ r: 'R2' }] },
    { sign: +1, terms: [{ r: 'R3' }] },
    {
      sign: -1,
      terms: [
        { fn: 42, arg: 'K15' },
        { r: 'R4' },
      ],
    },
  ],
  K12: [
    {
      sign: +1,
      terms: [
        { fn: 43, arg: 'K11' },
        { fn: 44, arg: 'K13' },
        { fn: 45, arg: 'K14' },
        { r: 'R1' },
      ],
    },
    { sign: +1, terms: [{ r: 'R2' }] },
    { sign: +1, terms: [{ r: 'R3' }] },
    { sign: -1, terms: [{ fn: 46, arg: 'K15' }] },
  ],
  K13: [
    {
      sign: +1,
      terms: [
        { fn: 47, arg: 'K2' },
        { fn: 48, arg: 'K3' },
        { r: 'R2' },
      ],
    },
  ],
  K14: [
    {
      sign: +1,
      terms: [
        { fn: 49, arg: 'K11' },
        { fn: 50, arg: 'K12' },
        { fn: 51, arg: 'K13' },
        { r: 'R1' },
      ],
    },
    { sign: +1, terms: [{ r: 'R2' }] },
  ],
  K15: [
    {
      sign: +1,
      terms: [
        { fn: 52, arg: 'K2' },
        { fn: 53, arg: 'K3' },
        { fn: 54, arg: 'K13' },
        { fn: 55, arg: 'K14' },
        { r: 'R1' },
      ],
    },
    { sign: +1, terms: [{ r: 'R2' }] },
  ],
}

// Все имена f_j, встречающиеся в системе
export function getAllFnNames() {
  const set = new Set()
  Object.values(EQUATIONS).forEach((termsList) => {
    termsList.forEach(({ terms }) => {
      terms.forEach((t) => {
        if (t.fn != null) set.add(`f${t.fn}`)
      })
    })
  })
  return Array.from(set).sort((a, b) => {
    return parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10)
  })
}

// Все R-имена, встречающиеся в системе
export function getAllRNames() {
  const set = new Set()
  Object.values(EQUATIONS).forEach((termsList) => {
    termsList.forEach(({ terms }) => {
      terms.forEach((t) => {
        if (t.r) set.add(t.r)
      })
    })
  })
  return Array.from(set).sort()
}