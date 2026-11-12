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

// K теперь задаётся в нормализованной шкале [0, 1]
function clamp01(v) {
  if (!Number.isFinite(v)) return 0
  return Math.max(0, Math.min(1, v))
}

export default function InitialValues({
  values,
  onChange,
}) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Начальные значения K(i)</h3>
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
              min={0}
              max={1}
              step={0.01}
              value={values[key] ?? 0}
              onChange={(e) =>
                onChange(key, clamp01(parseFloat(e.target.value)))
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