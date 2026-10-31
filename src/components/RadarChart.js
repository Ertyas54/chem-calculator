import React, { useState } from 'react'
import {
  RadarChart as RechartsRadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, Legend, ResponsiveContainer, Tooltip,
} from 'recharts'
import { STATE_NAMES, evaluateAll } from '../polynomials'
import { K_MAX } from '../normalization'

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)) }
function fmtT(v) {
  const abs = Math.abs(v)
  return abs >= 10 ? v.toFixed(1) : v.toFixed(2)
}

export default function RadarChart({ values, tEnd }) {
  const [t, setT] = useState(0)

  const step = tEnd >= 20 ? 1 : tEnd >= 5 ? 0.5 : 0.25
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
      </div>

      <div className="time-scrub" style={{width: '100%', padding: '0px 100px', paddingTop: '10px'}}>
        <span>Момент времени: </span>
        <input
          type="range"
          min={0}
          max={tEnd}
          step={step}
          value={current}
          onChange={(e) => setT(Number(e.target.value))}
          style={{ flex: 1}}
        />
        <span className="time-badge">
          t = {fmtT(current)} ч
        </span>
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
          <Radar
            name="K(0)"
            dataKey="start"
            stroke="#dc2626" strokeWidth={2} fill="none"
            dot={{ r: 3, fill: '#dc2626' }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}