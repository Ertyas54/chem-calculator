import React, { useState } from 'react'
import { EQUATIONS } from '../equations'
import { STATE_NAMES } from '../polynomials'
import { K_MAX } from '../normalization'

const POW = ['', '', '²', '³']

// Какая переменная K является аргументом каждой f_j
const FN_ARG = (() => {
  const map = {}
  Object.values(EQUATIONS).forEach((termsList) => {
    termsList.forEach(({ terms }) => {
      terms.forEach((t) => {
        if (t.fn != null) map[t.fn] = t.arg
      })
    })
  })
  return map
})()

function TermView({ term }) {
  if (term.fn != null) {
    return <span className="eq-fn">{`f${term.fn}(${term.arg})`}</span>
  }
  if (term.r) {
    return <span className="eq-fn">{term.r}</span>
  }
  return null
}

// ------------------------------------------------------------
// f_j записывается через свой K, а не через абстрактный x:
//   f₁₂(K₁₅) = c₀ + c₁·(K₁₅/20) + c₂·(K₁₅/20)² + c₃·(K₁₅/20)³
// Скобка (K/K_max) — это и есть нормировка в [0, 1].
// ------------------------------------------------------------
function FnCoefficients({ fn, values, onChange, onRandomFn }) {
  const arg = FN_ARG[fn]
  const max = K_MAX[arg] ?? 1
  const xLabel = `(${arg}/${max})`

  return (
    <div className="fn-row">
      <button
        type="button"
        className="fn-dice"
        title={`Случайные коэффициенты f${fn}`}
        onClick={() => onRandomFn(fn)}
      >
        🎲
      </button>

      <span className="eq-fn fn-head">{`f${fn}(${arg}) =`}</span>

      <span className="fn-coeffs">
        {[0, 1, 2, 3].map((deg) => {
          const name = `f${fn}_c${deg}`
          const val = values[name] ?? 0
          const isNeg = val < 0
          return (
            <span key={name} className="fn-coef">
              {deg > 0 && (
                <span className="eq-op">{isNeg ? ' − ' : ' + '}</span>
              )}
              <input
                className="eq-input"
                value={val}
                title={`${name} — коэффициент при (${arg}/${max})${POW[deg]}`}
                onChange={(e) =>
                  onChange(name, parseFloat(e.target.value) || 0)
                }
              />
              {deg > 0 && (
                <span className="fn-deg">
                  ·{xLabel}
                  {POW[deg]}
                </span>
              )}
            </span>
          )
        })}
      </span>
    </div>
  )
}

function EquationCard({ kKey, termsList, values, onChange, onRandomFn }) {
  const [open, setOpen] = useState(false)

  const fns = []
  termsList.forEach(({ terms }) => {
    terms.forEach((t) => {
      if (t.fn != null && !fns.includes(t.fn)) fns.push(t.fn)
    })
  })
  fns.sort((a, b) => a - b)

  const title = STATE_NAMES.find((s) => s.startsWith(kKey + ' '))?.replace(
    /^K\d+ — /,
    ''
  )

  return (
    <div className="equation">
      <div
        className="equation-header"
        style={{ cursor: 'pointer' }}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="equation-key">{kKey}(t)</span>
        <span className="equation-label">{title}</span>
        <span className="equation-degree">
          {open ? '▾' : '▸'} {fns.length} f
        </span>
      </div>

      {open && (
        <div style={{ marginTop: 8 }}>
          <div className="equation-formula" style={{ marginBottom: 8 }}>
            {termsList.map(({ sign, terms }, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <span className="eq-op">{sign > 0 ? ' + ' : ' − '}</span>
                )}
                {i === 0 && sign < 0 && <span className="eq-op">−</span>}
                <span style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
                  {terms.map((t, j) => (
                    <React.Fragment key={j}>
                      {j > 0 && <span className="eq-op">·</span>}
                      <TermView term={t} />
                    </React.Fragment>
                  ))}
                </span>
              </React.Fragment>
            ))}
          </div>

          {fns.map((fn) => (
            <FnCoefficients
              key={fn}
              fn={fn}
              values={values}
              onChange={onChange}
              onRandomFn={onRandomFn}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function FnEditor({ values, onChange, onRandomFn }) {
  return (
    <div className="panel">
      <h3>Функции f<sub>j</sub>(K) = c₀ + c₁·(K/K_max) + c₂·(K/K_max)² + c₃·(K/K_max)³</h3>
      <p className="panel-hint">
        Каждая f<sub>j</sub> записана через свой коэффициент K из уравнения.
        Скобка (K/K<sub>max</sub>) переводит его в безразмерный вид 0…1 —
        именно она подставляется в полином. 🎲 — случайные коэффициенты только
        этой функции. Разверните уравнение, чтобы задать коэффициенты.
      </p>
      <div className="equations">
        {Object.entries(EQUATIONS).map(([kKey, termsList]) => (
          <EquationCard
            key={kKey}
            kKey={kKey}
            termsList={termsList}
            values={values}
            onChange={onChange}
            onRandomFn={onRandomFn}
          />
        ))}
      </div>
    </div>
  )
}
