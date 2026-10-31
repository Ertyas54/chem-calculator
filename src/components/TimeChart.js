import React, { useMemo, useRef, useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { STATE_NAMES, evaluateAll } from '../polynomials'
import { K_MAX } from '../normalization'

const PALETTE = [
  '#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed',
  '#0891b2', '#db2777', '#65a30d', '#ea580c', '#4f46e5',
  '#0f766e', '#b91c1c', '#a16207', '#9333ea', '#0369a1',
]

const CHART_HEIGHT = 900
const MIN_GAP = 14
const MARGIN = { top: 20, right: 50, bottom: 40, left: 30 }
const LABEL_LIFT = 15

function spreadLabels(items, minGap, top, bottom) {
  const sorted = [...items].sort((a, b) => a.y - b.y)
  const ys = sorted.map((d) => d.y)
  for (let i = 1; i < ys.length; i++) {
    if (ys[i] - ys[i - 1] < minGap) ys[i] = ys[i - 1] + minGap
  }
  const overflow = ys[ys.length - 1] - bottom
  if (overflow > 0) {
    for (let i = ys.length - 1; i >= 0; i--) ys[i] -= overflow
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
  const wrapRef = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!wrapRef.current) return undefined
    const el = wrapRef.current
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setWidth(e.contentRect.width)
    })
    ro.observe(el)
    setWidth(el.getBoundingClientRect().width)
    return () => ro.disconnect()
  }, [])

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

  const yMax = useMemo(() => {
    let m = 0
    data.forEach((row) => {
      STATE_NAMES.forEach((_, j) => {
        const v = row[`K${j + 1}`] ?? 0
        if (v > m) m = v
      })
    })
    return Math.max(0.02, Math.min(1, m * 1.08))
  }, [data])

  const plotRight = Math.max(MARGIN.left + 50, width - MARGIN.right)
  const plotTop = MARGIN.top + 6
  const plotBottom = CHART_HEIGHT - MARGIN.bottom - 6
  const plotH = plotBottom - plotTop

  const endLabels = useMemo(() => {
    if (width === 0) return []
    const last = data[data.length - 1]
    const items = STATE_NAMES.map((_, i) => {
      const key = `K${i + 1}`
      const v = last[key] ?? 0
      const y = plotTop + (1 - v / yMax) * plotH
      return { key, color: PALETTE[i % PALETTE.length], y }
    })
    return spreadLabels(items, MIN_GAP, plotTop, plotBottom)
  }, [data, yMax, width, plotTop, plotBottom, plotH])

  const Y_TICKS = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]

  return (
    <div className="panel">
      <h3>Изменение переменных от времени</h3>

      <div ref={wrapRef} style={{ position: 'relative', width: '100%' }}>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <LineChart data={data} margin={MARGIN}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="tau"
              type="number"
              domain={[0, 1]}
              ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
              label={{
                value: 'Время t', position: 'insideBottom', offset: -22,
              }}
              tickFormatter={(v) => v.toFixed(1)}
              stroke="#64748b"
            />

            <YAxis
              domain={[0, yMax]}
              ticks={Y_TICKS.map((v) => v * yMax)}
              tickFormatter={(real) => (real / yMax).toFixed(1)}
              label={{ value: 'Значение показателей K', angle: -90, position: 'insideLeft' }}
              stroke="#64748b"
              tick={{ fontSize: 16 }}
            />

            <Tooltip
              shared={true}
              formatter={(v, name) => {
                const max = K_MAX[name] || 1
                return [
                  `${(v * max).toFixed(3)} (${(v * 100).toFixed(1)}%)`,
                  name,
                ]
              }}
              labelFormatter={(tau, payload) => {
                const t = payload?.[0]?.payload?.t
                return `τ = ${Number(tau).toFixed(2)} (t = ${
                  t != null ? Number(t).toFixed(2) : '—'
                })`
              }}
              itemSorter={(item) => -item.value}
              contentStyle={{
                background: '#fff',
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                fontSize: 12,
                padding: 8,
                maxHeight: 380,
                overflowY: 'auto',
                fontFamily: 'monospace',
              }}
              cursor={{ stroke: '#1f2937', strokeWidth: 1 }}
            />

            {STATE_NAMES.map((_, i) => {
              const key = `K${i + 1}`
              const color = PALETTE[i % PALETTE.length]
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={key}
                  stroke={color}
                  dot={false}
                  strokeWidth={1.8}
                  isAnimationActive={false}
                  activeDot={{
                    r: 4,
                    fill: color,
                    stroke: '#fff',
                    strokeWidth: 2,
                  }}
                />
              )
            })}
          </LineChart>
        </ResponsiveContainer>

        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: CHART_HEIGHT,
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          {endLabels.map(({ key, color, labelY }) => {
            const ty = labelY - LABEL_LIFT
            const labelX = plotRight + 14
            return (
              <text
                key={key}
                x={labelX}
                y={ty}
                dy={4}
                fontSize={12}
                fontFamily="monospace"
                fontWeight={700}
                fill={color}
              >
                {key}
              </text>
            )
          })}
        </svg>
      </div>
    </div>
  )
}