import React from 'react'
import { STATE_NAMES } from '../solver'

export default function InitialConditions({ values, onChange }) {
  return (
    <div className="panel">
      <h3>Начальные условия K(0)</h3>
      <div className="grid">
        {STATE_NAMES.map((label, idx) => {
          const key = `K${idx + 1}`
          return (
            <div key={key} className="field">
              <label title={label}>{label}</label>
              <input
                type="number"
                step={1}
                min={0}
                value={values[key] ?? 0}
                onChange={(e) =>
                  onChange(key, parseFloat(e.target.value) || 0)
                }
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}