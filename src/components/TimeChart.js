import React, { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { STATE_NAMES, evaluateAll } from '../polynomials'

export default function TimeChart({ values, tEnd, points = 60 }) {
  const data = useMemo(() => {
    const arr = []
    for (let i = 0; i <= points; i++) {
      const t = (i / points) * tEnd
      const state = evaluateAll(t, values, tEnd)
      const row = { t }
      STATE_NAMES.forEach((_, j) => {
        const key = `K${j + 1}`
        row[key] = state[key]
      })
      arr.push(row)
    }
    return arr
  }, [values, tEnd, points])

  return (
    <div className="panel">
      <h3>Изменение переменных от времени</h3>

      <ResponsiveContainer width="100%" height={460}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, bottom: 20, left: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="t"
            type="number"
            domain={[0, tEnd]}
            label={{
              value: 'Время t',
              position: 'insideBottom',
              offset: -8,
            }}
            tickFormatter={(v) => v.toFixed(1)}
            stroke="#64748b"
          />
          <YAxis
            label={{
              value: 'Значение K',
              angle: -90,
              position: 'insideLeft',
            }}
            domain={[-100, 270]}
            allowDataOverflow
            stroke="#64748b"
            tickFormatter={(v) => v.toFixed(0)}
          />
          <ReferenceLine
            y={0}
            stroke="#94a3b8"
            strokeDasharray="4 4"
          />
          <Tooltip
            shared={true}
            formatter={(v, name) => [Number(v).toFixed(2), name]}
            labelFormatter={(t) => `t = ${Number(t).toFixed(2)}`}
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
                strokeWidth={1.2}
                isAnimationActive={false}
                activeDot={{
                  r: 5,
                  fill: '#1f2937',
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
              />
            )
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}