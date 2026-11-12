import React from 'react'
import { R_COUNT, R_DEGREE } from '../functions'
import { R_DESCRIPTIONS } from '../descriptions'

const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄' }
function subNum(n) {
  return String(n).split('').map((d) => SUB[d] ?? d).join('')
}

const POW = ['', '', '²', '³']

export default function REditor({ values, onChange, onRandom }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Возмущение R(t)</h3>
        <div className="panel-actions">
          <button className="btn btn-primary" onClick={onRandom}>
            Случайные R
          </button>
        </div>
      </div>

      <div className="equations">
        {Array.from({ length: R_COUNT }, (_, k) => {
          const rIndex = k + 1
          return (
            <div className="equation" key={rIndex}>
              <div className="equation-header">
                <span className="equation-key">
                  R{subNum(rIndex)}(t)
                </span>
                <span className="equation-label">
                  {R_DESCRIPTIONS[`R${rIndex}`]}
                </span>
              </div>

              <div className="equation-formula">
                {Array.from({ length: R_DEGREE + 1 }, (_, deg) => {
                  const name = `R${rIndex}_c${deg}`
                  const val = values[name] ?? 0
                  return (
                    <span className="eq-term" key={name}>
                      {deg > 0 && <span className="eq-op"> + </span>}
                      <input
                        className="eq-input"
                        min={0}
                        value={val}
                        onChange={(e) =>
                          onChange(
                            name,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        title={`${name}`}
                      />
                      {deg === 1 && (
                        <span className="eq-power">·t</span>
                      )}
                      {deg > 1 && (
                        <span className="eq-power">
                          ·t{POW[deg]}
                        </span>
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