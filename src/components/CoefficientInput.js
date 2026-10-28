import React from 'react'
import {
  STATE_NAMES,
  COEFFICIENTS,
  powerLabel,
} from '../polynomials'

// ------------------------------------------------------------
// Подстрочные цифры: 1 → ₁, 12 → ₁₂
// ------------------------------------------------------------
const SUBSCRIPTS = {
  0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄',
  5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉',
}

function toSubscript(n) {
  return String(n)
    .split('')
    .map((d) => SUBSCRIPTS[d] ?? d)
    .join('')
}

function fLabel(fn) {
  if (fn == null) return null
  return `f${toSubscript(fn)}`
}

export default function CoefficientInput({
  values,
  onChange,
  onRandomAll,
  onReset,
}) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Уравнения модели</h3>
        <div className="panel-actions">
          <button className="btn btn-primary" onClick={onRandomAll}>
            Заполнить случайно
          </button>
          <button className="btn btn-danger" onClick={onReset}>
            Сбросить
          </button>
        </div>
      </div>

      <div className="equations">
        {STATE_NAMES.map((label, i) => {
          const key = `K${i + 1}`
          const coefs = COEFFICIENTS[key] ?? []

          return (
            <div key={key} className="equation">
              <div className="equation-header">
                <span className="equation-key">{key}(t)</span>
                <span className="equation-label">
                  {label.replace(/^K\d+ — /, '')}
                </span>
              </div>

              <div className="equation-formula">
                {coefs.map((term, power) => {
                  const value = values[term.name] ?? 0
                  const isNegative = term.sign < 0
                  const showSeparator = power > 0
                  const showLeadingSign = power === 0
                  const pLabel = powerLabel(power)
                  const f = fLabel(term.fn)

                  return (
                    <span key={`${key}-${power}`} className="eq-term">
                      {showSeparator && (
                        <span className="eq-op">
                          {isNegative ? ' − ' : ' + '}
                        </span>
                      )}
                      {showLeadingSign && isNegative && (
                        <span className="eq-op">−</span>
                      )}

                      {f && <span className="eq-fn">{f}(</span>}

                      <input
                        className="eq-input"
                        value={value}
                        onChange={(e) =>
                          onChange(
                            term.name,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        title={`${term.name}${f ? ` (${f})` : ''}`}
                      />

                      {f && <span className="eq-fn">)</span>}

                      {pLabel && (
                        <span className="eq-power">{pLabel}</span>
                      )}
                    </span>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}