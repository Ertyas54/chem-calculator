import React, { useMemo } from 'react'
import { STATE_NAMES, evaluateAll } from '../polynomials'
import { K_MAX } from '../normalization'

function fmt(v) {
  if (!Number.isFinite(v)) return '—'
  const a = Math.abs(v)
  if (a >= 100) return v.toFixed(0)
  if (a >= 10) return v.toFixed(1)
  return v.toFixed(2)
}

// ------------------------------------------------------------
// Таблица K_i(t) по часам: t = 0, 1, …, tEnd
// ------------------------------------------------------------
export default function ResultsTable({ values, tEnd }) {
  const rows = useMemo(() => {
    const hours = Math.max(1, Math.round(tEnd))
    const dt = tEnd / hours
    const out = []

    for (let i = 0; i <= hours; i++) {
      const t = i * dt
      out.push({ t, state: evaluateAll(t, values, tEnd) })
    }

    return out
  }, [values, tEnd])

  const keys = STATE_NAMES.map((_, i) => `K${i + 1}`)

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Таблица K_i(t)</h3>
        <span className="panel-hint" style={{ margin: 0 }}>
          реальные значения, шаг 1 ч
        </span>
      </div>

      <div className="table-wrap">
        <table className="results-table">
          <thead>
            <tr>
              <th>t, ч</th>
              {keys.map((k) => (
                <th key={k} title={`K_max = ${K_MAX[k]}`}>
                  {k}
                  <span className="th-max">/{K_MAX[k]}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.t}
                className={i === rows.length - 1 ? 'row-final' : ''}
              >
                <td className="col-t">{fmt(row.t)}</td>
                {keys.map((k) => (
                  <td key={k}>{fmt(row.state[k])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
