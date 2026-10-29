import React, { useState } from 'react'
import { EQUATIONS } from '../equations'
import { STATE_NAMES } from '../polynomials'

const DEG_LABELS = ['', 'x', 'x²', 'x³']

function TermView({ term }) {
  if (term.fn != null) {
    return <span className="eq-fn">{`f${term.fn}(${term.arg})`}</span>
  }
  if (term.r) {
    return <span className="eq-fn">{term.r}</span>
  }
  return null
}

function FnCoefficients({ fn, values, onChange }) {
  return (
    <div style={{ marginLeft: 16, marginTop: 6 }}>
      <span className="eq-fn" style={{ marginRight: 6 }}>
        {`f${fn}(x) =`}
      </span>
      {[0, 1, 2, 3].map((deg) => {
        const name = `f${fn}_c${deg}`
        const val = values[name] ?? 0
        const isNeg = val < 0
        return (
          <span
            key={name}
            style={{ marginRight: 6, whiteSpace: 'nowrap' }}
          >
            {deg > 0 && (
              <span
                className="eq-op"
                style={{ marginRight: 4 }}
              >
                {isNeg ? ' − ' : ' + '}
              </span>
            )}
            <input
              className="eq-input"
              value={val}
              title={name}
              onChange={(e) =>
                onChange(name, parseInt(e.target.value, 10) || 0)
              }
            />
            {deg > 0 && (
              <span
                style={{ fontSize: 12, color: '#64748b', marginLeft: 2 }}
              >
                {DEG_LABELS[deg]}
              </span>
            )}
          </span>
        )
      })}
    </div>
  )
}

function EquationCard({ kKey, termsList, values, onChange }) {
  const [open, setOpen] = useState(false)

  const fns = []
  termsList.forEach(({ terms }) => {
    terms.forEach((t) => {
      if (t.fn != null && !fns.includes(t.fn)) fns.push(t.fn)
    })
  })
  fns.sort((a, b) => a - b)

  const title = STATE_NAMES
    .find((s) => s.startsWith(kKey + ' '))
    ?.replace(/^K\d+ — /, '')

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
                  <span className="eq-op">
                    {sign > 0 ? ' + ' : ' − '}
                  </span>
                )}
                {i === 0 && sign < 0 && (
                  <span className="eq-op">−</span>
                )}
                <span
                  style={{ display: 'inline-flex', flexWrap: 'wrap' }}
                >
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
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function FnEditor({ values, onChange }) {
  return (
    <div className="panel">
      <h3>Функции f(x) = c₀ + c₁x + c₂x² + c₃x³</h3>
      <p className="panel-hint">
        Аргумент x — нормированное K (0…1). Коэффициенты — целые.
        Разверните уравнение, чтобы задать коэффициенты его f.
      </p>
      <div className="equations">
        {Object.entries(EQUATIONS).map(([kKey, termsList]) => (
          <EquationCard
            key={kKey}
            kKey={kKey}
            termsList={termsList}
            values={values}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  )
}