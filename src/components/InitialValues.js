import React from 'react'
import { K_DESCRIPTIONS } from '../descriptions'

const K_KEYS = Array.from({ length: 15 }, (_, i) => `K${i + 1}`)

const SUB = {
  0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄',
  5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉',
}

function subNum(n) {
  return String(n).split('').map((d) => SUB[d] ?? d).join('')
}

export default function InitialValues({
  values,
  onChange,
}) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Начальные значения K(0)</h3>
      </div>

      <div className="compact-grid">
        {K_KEYS.map((key) => (
          <div className="compact-row" key={key}>
            <span className="compact-key">
              {key.replace(/^K(\d+)$/, (_, n) => `K${subNum(n)}`)}
            </span>
            <input
              className="compact-input"
              type="number"
              value={values[key] ?? 0}
              onChange={(e) =>
                onChange(key, parseFloat(e.target.value) || 0)
              }
            />
            <span
              className="compact-desc"
              title={K_DESCRIPTIONS[key]}
            >
              {K_DESCRIPTIONS[key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}