import React, { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Customized,
} from 'recharts'
import { STATE_NAMES, evaluateAll } from '../polynomials'
import { K_MAX } from '../normalization'

const MIN_GAP = 14
const LABEL_OFFSET_X = 8

function spreadLabels(items, minGap, top, bottom) {
  const sorted = [...items].sort((a, b) => a.y - b.y)
  const ys = sorted.map((d) => d.y)

  for (let i = 1; i < ys.length; i++) {
    if (ys[i] - ys[i - 1] < minGap) ys[i] = ys[i - 1] + minGap
  }
  const overflow = ys[ys.length - 1] - bottom
  if (overflow > 0) {
    for (let i = ys.length - 1; i >= 0; i--) {
      ys[i] -= overflow
    }
    for (let i = ys.length - 2; i >= 0; i--) {
      if (ys[i + 1] - ys[i] < minGap) ys[i] = ys[i + 1] - minGap
    }
  }
  const under = top - ys[0]
  if (under > 0) {
    for (let i = 0; i < ys.length; i++) ys[i] += under
  }

  return sorted.map((d, i) => ({ ...d, labelY: ys[i] }))
}

export default function TimeChart({ values, tEnd, points = 60 }) {
  const data = useMemo(() => {
    const arr = []
    for (let i = 0; i <= points; i++) {
      const tau = i / points
      const t = tau * tEnd
      const state = evaluateAll(t, values, tEnd)
      const row = { tau, t }
      STATE_NAMES.forEach((_, j) => {
        const key = `K${j + 1}`
        const max = K_MAX[key] || 1
        row[key] = Math.max(0, Math.min(1, state[key] / max))
      })
      arr.push(row)
    }
    return arr
  }, [values, tEnd, points])

  return (
    <div className="panel">
      <h3>Изменение переменных от времени</h3>

      <ResponsiveContainer width="100%" height={720}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 90, bottom: 40, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="tau"
            type="number"
            domain={[0, 1]}
            ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
            label={{
              value: 'Нормированное время τ = t / tMax',
              position: 'insideBottom',
              offset: -22,
            }}
            tickFormatter={(v) => v.toFixed(1)}
            stroke="#64748b"
          />
          <YAxis
            domain={[0, 1]}
            ticks={[
              0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4,
              0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8,
              0.85, 0.9, 0.95, 1,
            ]}
            label={{
              value: 'K / K_max',
              angle: -90,
              position: 'insideLeft',
            }}
            stroke="#64748b"
            tickFormatter={(v) => v.toFixed(2)}
            tick={{ fontSize: 10 }}
          />
          <Tooltip
            shared={true}
            formatter={(v, name) => {
              const max = K_MAX[name] || 1
              const real = v * max
              return [
                `${real.toFixed(2)} (${(v * 100).toFixed(0)}%)`,
                name,
              ]
            }}
            labelFormatter={(tau, payload) => {
              const t = payload?.[0]?.payload?.t
              const tauStr = Number(tau).toFixed(2)
              const tStr = t != null ? Number(t).toFixed(2) : '—'
              return `τ = ${tauStr} (t = ${tStr})`
            }}
            itemSorter={(item) => -item.value}
            contentStyle={{
              background: '#fff',
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              fontSize: 12,
              padding: 8,
              overflowY: 'auto',
              fontFamily: 'monospace',
            }}
            cursor={{ stroke: '#1f2937', strokeWidth: 1 }}
          />

          {STATE_NAMES.map((_, i) => {
            const key = `K${i + 1}`
            return (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke="#1f2937"
                dot={false}
                strokeWidth={1}
                isAnimationActive={false}
                activeDot={{
                  r: 4,
                  fill: '#1f2937',
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
              />
            )
          })}

          <LabelOverlay data={data} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function LabelOverlay({ data }) {
  return (
    <Customized
      component={(props) => {
        const { xAxisMap, yAxisMap, offset } = props
        if (!xAxisMap || !yAxisMap || !offset) return null

        const xAxis = Object.values(xAxisMap)[0]
        const yAxis = Object.values(yAxisMap)[0]
        if (!xAxis || !yAxis || !xAxis.scale || !yAxis.scale) return null

        const last = data[data.length - 1]
        const xPos = xAxis.scale(last.tau)
        const rightX = offset.left + offset.width

        const items = STATE_NAMES.map((_, i) => {
          const key = `K${i + 1}`
          const v = last[key] ?? 0
          return { key, y: yAxis.scale(v) }
        })

        const top = offset.top + 4
        const bottom = offset.top + offset.height - 4
        const spread = spreadLabels(items, MIN_GAP, top, bottom)

        return (
          <g>
            {spread.map(({ key, y, labelY }) => (
              <g key={key}>
                <polyline
                  points={`${xPos},${y} ${rightX},${labelY} ${rightX + LABEL_OFFSET_X - 4},${labelY}`}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth={0.8}
                  strokeDasharray="2 2"
                />
                <circle cx={xPos} cy={y} r={2} fill="#1f2937" />
                <text
                  x={rightX + LABEL_OFFSET_X}
                  y={labelY}
                  dy={4}
                  fontSize={11}
                  fontFamily="monospace"
                  fill="#1f2937"
                >
                  {key}
                </text>
              </g>
            ))}
          </g>
        )
      }}
    />
  )
}