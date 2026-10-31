import React from 'react'
import { R_DESCRIPTIONS } from '../descriptions'

const R_KEYS = ['R1', 'R2', 'R3', 'R4']

const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄' }

function subNum(n) {
  return String(n).split('').map((d) => SUB[d] ?? d).join('')
}

export default function REditor({ values, onChange }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Параметры R</h3>
      </div>

      <div className="compact-grid">
        {R_KEYS.map((key) => (
          <div className="compact-row" key={key}>
            <span className="compact-key">
              R{subNum(key.slice(1))}
            </span>
            <input
              className="compact-input"
              type="number"
              value={values[key] ?? 0}
              onChange={(e) =>
                onChange(key, parseInt(e.target.value, 10) || 0)
              }
            />
            <span
              className="compact-desc"
              title={R_DESCRIPTIONS[key]}
            >
              {R_DESCRIPTIONS[key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}