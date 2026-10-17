import React from 'react'
import {
  STATE_NAMES,
  COEFFICIENTS,
  powerLabel,
} from '../polynomials'

// ------------------------------------------------------------
// Исходная система уравнений (всегда видна)
// ------------------------------------------------------------
function SourceSystem() {
  return (
    <div className="source-system">
      <h4 className="source-title">📄 Исходная система уравнений</h4>

      <div className="source-equations">
        <div className="source-eq">
          <span className="source-eq-label">K1:</span>
          <span className="source-eq-body">
            dK₁/dt = −(f₁(K₁₀) · f₂(K₁₁) · f₃(K₁₄))
          </span>
        </div>

        <div className="source-eq">
          <span className="source-eq-label">K2:</span>
          <span className="source-eq-body">
            dK₂/dt = f₄(K₃)·f₅(K₇)·f₆(K₈)·f₇(K₉)·f₈(K₁₃) −
            (f₉(K₁₀)·f₁₀(K₁₁)·f₁₁(K₁₄)·f₁₂(K₁₅)·R₁ + R₂ + R₃ + R₄)
          </span>
        </div>

        <div className="source-eq">
          <span className="source-eq-label">K3:</span>
          <span className="source-eq-body">
            dK₃/dt = f₁₃(K₁) − (f₁₄(K₁₅)·R₁ + R₃ + R₄)
          </span>
        </div>

        <div className="source-eq">
          <span className="source-eq-label">K4:</span>
          <span className="source-eq-body">dK₄/dt = f₁₅(K₁)</span>
        </div>

        <div className="source-eq">
          <span className="source-eq-label">K5:</span>
          <span className="source-eq-body">
            dK₅/dt = f₁₆(K₁)·R₂ − R₁
          </span>
        </div>

        <div className="source-eq">
          <span className="source-eq-label">K6:</span>
          <span className="source-eq-body">
            dK₆/dt = R₂ − (f₁₇(K₄)·f₁₈(K₁₁)·f₁₉(K₁₂)·f₂₀(K₁₄)·R₁)
          </span>
        </div>

        <div className="source-eq">
          <span className="source-eq-label">K7:</span>
          <span className="source-eq-body">
            dK₇/dt = f₂₁(K₅)·f₂₂(K₆)·f₂₃(K₁₃)·f₂₄(K₁₅)·R₁ + R₂ + R₃
          </span>
        </div>

        <div className="source-eq">
          <span className="source-eq-label">K8:</span>
          <span className="source-eq-body">
            dK₈/dt = f₂₅(K₅)·f₂₆(K₆)·f₂₇(K₁₁)·f₂₈(K₁₃)·f₂₉(K₁₄)·f₃₀(K₁₅)·R₁
            + R₂ + R₃
          </span>
        </div>

        <div className="source-eq">
          <span className="source-eq-label">K9:</span>
          <span className="source-eq-body">
            dK₉/dt = f₃₁(K₃)·f₃₂(K₁₃)·R₂ −
            (f₃₃(K₁₀)·f₃₄(K₁₁)·f₃₅(K₁₄)·R₁)
          </span>
        </div>

        <div className="source-eq">
          <span className="source-eq-label">K10:</span>
          <span className="source-eq-body">
            dK₁₀/dt = f₃₆(K₃)·f₃₇(K₉)·f₃₈(K₁₅)·R₁ + R₂ + R₃ + R₄
          </span>
        </div>

        <div className="source-eq">
          <span className="source-eq-label">K11:</span>
          <span className="source-eq-body">
            dK₁₁/dt = f₃₉(K₃)·f₄₀(K₁₃)·f₄₁(K₁₄)·R₁ + R₂ + R₃ −
            (f₄₂(K₁₅)·R₄)
          </span>
        </div>

        <div className="source-eq">
          <span className="source-eq-label">K12:</span>
          <span className="source-eq-body">
            dK₁₂/dt = f₄₃(K₁₁)·f₄₄(K₁₃)·f₄₅(K₁₄)·R₁ + R₂ + R₃ −
            f₄₆(K₁₅)
          </span>
        </div>

        <div className="source-eq">
          <span className="source-eq-label">K13:</span>
          <span className="source-eq-body">
            dK₁₃/dt = f₄₇(K₂)·f₄₈(K₃)·R₂
          </span>
        </div>

        <div className="source-eq">
          <span className="source-eq-label">K14:</span>
          <span className="source-eq-body">
            dK₁₄/dt = f₄₉(K₁₁)·f₅₀(K₁₂)·f₅₁(K₁₃)·R₁ + R₂
          </span>
        </div>

        <div className="source-eq">
          <span className="source-eq-label">K15:</span>
          <span className="source-eq-body">
            dK₁₅/dt = f₅₂(K₂)·f₅₃(K₃)·f₅₄(K₁₃)·f₅₅(K₁₄)·R₁ + R₂
          </span>
        </div>
      </div>
    </div>
  )
}

// ------------------------------------------------------------
// Основной компонент
// ------------------------------------------------------------
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

      <SourceSystem />

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

                      <input
                        className="eq-input"
                        value={value}
                        onChange={(e) =>
                          onChange(
                            term.name,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        title={term.name}
                      />

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