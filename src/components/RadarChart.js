import React, { useEffect, useState } from 'react'
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { STATE_NAMES, evaluateAll } from '../polynomials'
import { K_MAX } from '../normalization'

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

function fmtT(v) {
  const abs = Math.abs(v)
  return abs >= 10 ? v.toFixed(1) : v.toFixed(2)
}

// ------------------------------------------------------------
// Лепестковая диаграмма с прокруткой по времени.
// Слайдер идёт по часам 0…tEnd, кнопка ▶ листает сама.
// Серый контур — t = 0, синий — выбранный момент.
// ------------------------------------------------------------
export default function RadarChart({ values, tEnd }) {
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(false)

  const step = tEnd >= 20 ? 1 : tEnd >= 5 ? 0.5 : 0.25

  useEffect(() => {
    if (!playing) return undefined
    const id = setInterval(() => {
      setT((prev) => {
        const next = prev + step
        return next > tEnd + 1e-9 ? 0 : next
      })
    }, 450)
    return () => clearInterval(id)
  }, [playing, step, tEnd])

  const current = Math.min(t, tEnd)

  const startState = evaluateAll(0, values, tEnd)
  const curState = evaluateAll(current, values, tEnd)

  const data = STATE_NAMES.map((label, i) => {
    const key = `K${i + 1}`
    const max = K_MAX[key] || 1
    return {
      key,
      label: key,
      start: clamp((startState[key] / max) * 100, 0, 100),
      cur: clamp((curState[key] / max) * 100, 0, 100),
      fullLabel: label,
    }
  })

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Лепестковая диаграмма</h3>
        <span className="panel-hint" style={{ margin: 0 }}>
          % от K<sub>max</sub> по каждой оси
        </span>
      </div>

      <div className="time-scrub">
        <button
          type="button"
          className="btn btn-mini"
          onClick={() => setPlaying((p) => !p)}
          title={playing ? 'Пауза' : 'Пролистать по времени'}
        >
          {playing ? '❚❚ пауза' : '▶ по часам'}
        </button>

        <input
          type="range"
          min={0}
          max={tEnd}
          step={step}
          value={current}
          onChange={(e) => {
            setPlaying(false)
            setT(Number(e.target.value))
          }}
        />

        <span className="time-badge">
          t = {fmtT(current)} ч · τ = {fmtT(tEnd > 0 ? current / tEnd : 0)}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <RechartsRadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="label" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis
            domain={[0, 100]}
            angle={90}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 10 }}
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
            name="K(0)"
            dataKey="start"
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
