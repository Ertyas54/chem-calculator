import React, { useState, useEffect } from 'react'
import {
  RadarChart as RechartsRadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, Legend, ResponsiveContainer, Tooltip,
} from 'recharts'
import { STATE_NAMES, evaluateAll } from '../polynomials'
import { K_DESCRIPTIONS } from '../descriptions'

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

// ------------------------------------------------------------
// Сглаженные условия: «купол» над K(0).
// ------------------------------------------------------------
const MIN_MARGIN = 0.06
const BASE_MARGIN = 0.12
const SMOOTH_PASSES = 3

function smoothConditions(values, baseMargin = BASE_MARGIN) {
  const raw = K_KEYS.map((k) => (values[k] ?? 0) + baseMargin)

  let arr = [...raw]
  for (let pass = 0; pass < SMOOTH_PASSES; pass++) {
    const next = arr.map((v, i) => {
      const prev = arr[(i - 1 + arr.length) % arr.length]
      const nextV = arr[(i + 1) % arr.length]
      return (prev + 2 * v + nextV) / 4
    })
    arr = next
  }

  const result = {}
  K_KEYS.forEach((k, i) => {
    const k0 = values[k] ?? 0
    let cond = Math.max(arr[i], k0 + MIN_MARGIN)
    if (cond > 1) cond = 1
    result[k] = Math.round(cond * 100) / 100
  })

  return result
}

function defaultConditions(values) {
  return smoothConditions(values, BASE_MARGIN)
}

function generateConditions(values) {
  const baseMargin = 0.10 + Math.random() * 0.10
  return smoothConditions(values, baseMargin)
}

export default function RadarChart({
  values,
  tEnd,
  conditions: controlledConditions,
  onConditionsChange,
}) {
  const [t, setT] = useState(0)
  const [showConditions, setShowConditions] = useState(false)
  const [internalConditions, setInternalConditions] = useState(() =>
    defaultConditions(values),
  )

  const isControlled = controlledConditions !== undefined
  const conditions = isControlled ? controlledConditions : internalConditions

  useEffect(() => {
    if (isControlled) return
    setInternalConditions(defaultConditions(values))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values)])

  function emit(next) {
    if (!isControlled) setInternalConditions(next)
    onConditionsChange?.(next)
  }

  function setCondition(key, v) {
    const k0 = values[key] ?? 0
    const minAllowed = k0 + 0.01
    const clamped = clamp(v, minAllowed, 1)
    emit({ ...conditions, [key]: clamped })
  }

  function resetConditions() {
    emit(defaultConditions(values))
  }

  function randomizeConditions() {
    emit(generateConditions(values))
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
            <>
              <button
                type="button"
                className="btn-conditions"
                onClick={randomizeConditions}
              >
                Сгенерировать
              </button>
            </>
          )}
        </div>
      </div>

      {showConditions && (
        <div className="conditions-grid">
          {K_KEYS.map((key) => {
            const k0 = values[key] ?? 0
            const minAllowed = Math.round((k0 + 0.01) * 100) / 100
            return (
              <div className="compact-row" key={key}>
                <span className="compact-key">
                  {key.replace(/^K(\d+)$/, (_, n) => `K${subNum(n)}`)}
                </span>
                <input
                  className="compact-input"
                  type="number"
                  min={minAllowed}
                  max={1}
                  step={0.01}
                  value={conditions[key] ?? 0.5}
                  onChange={(e) =>
                    setCondition(key, parseFloat(e.target.value))
                  }
                  title={`K(0) = ${k0.toFixed(2)}, порог ≥ ${minAllowed}`}
                />
                <span
                  className="compact-desc"
                  title={K_DESCRIPTIONS?.[key]}
                >
                  {K_DESCRIPTIONS?.[key]}
                </span>
              </div>
            )
          })}
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
          <Tooltip
            formatter={(v, name) => [`${Number(v).toFixed(1)}%`, name]}
          />
          <Legend />

          <Radar
            name={`K(t), t = ${fmtT(current)} ч`}
            dataKey="cur"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.35}
            strokeWidth={2}
          />

          <Radar
            name="Условия"
            dataKey="cond"
            stroke="#dc2626"
            strokeWidth={2}
            fill="none"
            dot={{ r: 3, fill: '#dc2626' }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}