import React, { useState } from 'react'
import {
  RadarChart as RechartsRadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, Legend, ResponsiveContainer, Tooltip,
} from 'recharts'
import { STATE_NAMES, evaluateAll } from '../polynomials'
import { K_DESCRIPTIONS } from '../descriptions'
import { makeDefaultConditions } from '../normalization'

const K_KEYS = Array.from({ length: 15 }, (_, i) => `K${i + 1}`)

const SUB = {
  0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄',
  5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉',
}
function subNum(n) {
  return String(n).split('').map((d) => SUB[d] ?? d).join('')
}

function clamp(v, min, max) {
  if (!Number.isFinite(v)) return min
  return Math.max(min, Math.min(max, v))
}
function fmtT(v) {
  const abs = Math.abs(v)
  return abs >= 10 ? v.toFixed(1) : v.toFixed(2)
}

export default function RadarChart({
  values,
  tEnd,
  conditions: controlledConditions,
  onConditionsChange,
}) {
  const [t, setT] = useState(0)
  const [showConditions, setShowConditions] = useState(false)
  const [internalConditions, setInternalConditions] = useState(
    makeDefaultConditions,
  )

  const isControlled = controlledConditions !== undefined
  const conditions = isControlled ? controlledConditions : internalConditions

  function emit(next) {
    if (!isControlled) setInternalConditions(next)
    onConditionsChange?.(next)
  }

  function setCondition(key, v) {
    emit({ ...conditions, [key]: clamp(v, 0, 1) })
  }

  function resetConditions() {
    emit(makeDefaultConditions())
  }

  const step = tEnd >= 20 ? 1 : tEnd >= 5 ? 0.5 : 0.25
  const current = Math.min(t, tEnd)
  const curState = evaluateAll(current, values, tEnd)

  const data = STATE_NAMES.map((label, i) => {
    const key = `K${i + 1}`
    const cond = conditions[key] ?? 0.5
    return {
      key,
      label: key,
      cond: clamp(cond * 100, 0, 100),
      cur: clamp(curState[key] * 100, 0, 100),
      fullLabel: label,
    }
  })

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Лепестковая диаграмма</h3>
        <div className="conditions-actions">
          <button
            type="button"
            className={`btn-conditions${showConditions ? ' active' : ''}`}
            onClick={() => setShowConditions((s) => !s)}
          >
            {showConditions ? 'Скрыть условия' : 'Задать условия'}
          </button>
          {showConditions && (
            <button
              type="button"
              className="btn-conditions reset"
              onClick={resetConditions}
            >
              Сбросить
            </button>
          )}
        </div>
      </div>

      {showConditions && (
        <div className="conditions-grid">
          {K_KEYS.map((key) => (
            <div className="compact-row" key={key}>
              <span className="compact-key">
                {key.replace(/^K(\d+)$/, (_, n) => `K${subNum(n)}`)}
              </span>
              <input
                className="compact-input"
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={conditions[key] ?? 0.5}
                onChange={(e) =>
                  setCondition(key, parseFloat(e.target.value))
                }
              />
              <span className="compact-desc" title={K_DESCRIPTIONS?.[key]}>
                {K_DESCRIPTIONS?.[key]}
              </span>
            </div>
          ))}
        </div>
      )}

      <div
        className="time-scrub"
        style={{ width: '100%', padding: '0px 100px', paddingTop: '10px' }}
      >
        <span>Момент времени: </span>
        <input
          type="range"
          min={0}
          max={tEnd}
          step={step}
          value={current}
          onChange={(e) => setT(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <span className="time-badge">t = {fmtT(current)} ч</span>
      </div>

      <ResponsiveContainer width="100%" height={560}>
        <RechartsRadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="label" tick={{ fontSize: 10 }} />
          <PolarRadiusAxis
            domain={[0, 100]}
            angle={90}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 9 }}
          />
          <Tooltip formatter={(v, name) => [`${Number(v).toFixed(1)}%`, name]} />
          <Legend />

          <Radar
            name={`K(t), t = ${fmtT(current)} ч`}
            dataKey="cur"
            stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.35} strokeWidth={2}
          />
          {/* Красная линия — задаваемые условия (независимы от K(0)) */}
          <Radar
            name="Условия"
            dataKey="cond"
            stroke="#dc2626" strokeWidth={2} fill="none"
            dot={{ r: 3, fill: '#dc2626' }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}