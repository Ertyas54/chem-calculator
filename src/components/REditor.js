import React from 'react'

const R_KEYS = ['R1', 'R2', 'R3', 'R4']

export default function REditor({ values, onChange }) {
  return (
    <div className="panel">
      <h3>Параметры R</h3>
      <p className="panel-hint">
        Целые значения в пределах своего максимума.
      </p>
      <div className="equations">
        {R_KEYS.map((key) => (
          <div className="equation" key={key}>
            <div className="equation-header">
              <span className="equation-key">{key}</span>
            </div>
            <div className="equation-formula">
              <input
                className="eq-input"
                value={values[key] ?? 0}
                onChange={(e) =>
                  onChange(key, parseInt(e.target.value, 10) || 0)
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}