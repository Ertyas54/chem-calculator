import React, { useState } from 'react'
import { EQUATIONS } from '../equations'
import { STATE_NAMES } from '../polynomials'

const SUB = {
  0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄',
  5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉',
}

function subNum(n) {
  return String(n)
    .split('')
    .map((d) => SUB[d] ?? d)
    .join('')
}

function kLabel(k) {
  const m = /^K(\d+)$/.exec(k)
  if (!m) return k
  return `K${subNum(m[1])}`
}

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
    return (
      <span className="eq-fn">
        {`f${subNum(term.fn)}(${kLabel(term.arg)})`}
      </span>
    )
  }
  if (term.r) {
    const m = /^R(\d+)$/.exec(term.r)
    return (
      <span className="eq-fn">
        {m ? `R${subNum(m[1])}` : term.r}
      </span>
    )
  }
  return null
}

function FnCoefficients({ fn, values, onChange }) {
  const arg = FN_ARG[fn]
  const argLabel = kLabel(arg)

  return (
    <div className="fn-row">

      <span className="eq-fn fn-head">
        {`f${subNum(fn)}(${argLabel}) =`}
      </span>

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
                title={`${name}`}
                onChange={(e) =>
                  onChange(name, parseFloat(e.target.value) || 0)
                }
              />
              {deg === 1 && (
                <span className="fn-deg">·{argLabel}</span>
              )}
              {deg > 1 && (
                <span className="fn-deg">
                  ·{argLabel}
                  <sup>{deg}</sup>
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

  const title = STATE_NAMES.find((s) =>
    s.startsWith(kKey + ' ')
  )?.replace(/^K\d+ — /, '')

  return (
    <div className="equation">
      <div
        className="equation-header"
        style={{ cursor: 'pointer' }}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="equation-key">{kLabel(kKey)}(t)</span>
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
      <h3>
        Функции f<sub>j</sub>(K)
      </h3>

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