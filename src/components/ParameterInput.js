import React from 'react'

export default function ParameterInput({
  title,
  items,
  values,
  onChange,
  step = 0.1,
  min = 0,
  max = 10,
}) {
  return (
    <div className="panel">
      <h3>{title}</h3>
      <div className="grid">
        {items.map((label) => {
          const key = label.split(' ')[0].replace('—', '').trim()
          return (
            <div key={key} className="field">
              <label title={label}>{label}</label>
              <input
                type="number"
                step={step}
                min={min}
                max={max}
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