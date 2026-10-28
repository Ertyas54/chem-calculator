import React from 'react'
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

export default function RadarChart({ values, tEnd }) {
  // Начальное состояние (t = 0)
  const startState = evaluateAll(0, values, tEnd)

  // Итоговое состояние (t = tEnd)
  const endState = evaluateAll(tEnd, values, tEnd)

  // Данные для лепестковой диаграммы
  const data = STATE_NAMES.map((label, i) => {
    const key = `K${i + 1}`
    const max = K_MAX[key] || 1
    return {
      key,
      label: key,
      start: (startState[key] / max) * 100,
      end: (endState[key] / max) * 100,
      fullLabel: label,
    }
  })

  return (
    <div className="panel">
      <h3>Лепестковая диаграмма</h3>

      <ResponsiveContainer width="100%" height={500}>
        <RechartsRadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="label" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis
            domain={[-100, 100]}
            angle={90}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 10 }}
          />
          <Tooltip
            formatter={(v, name) => [
              `${Number(v).toFixed(1)}%`,
              name,
            ]}
          />
          <Legend />

          <Radar
            name={`K(t)`}
            dataKey="end"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.35}
            strokeWidth={2}
          />

          {/* Начальное состояние — красная граница без заливки */}
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