import React from 'react'
import { interpretResults } from '../interpreter'
import { K_MAX } from '../normalization'

export default function DivergingBar({ startK, endK }) {
  const items = interpretResults(startK, endK)

  // Считаем изменение в процентах от максимума самой K_i
  const enriched = items.map((it) => {
    const max = K_MAX[it.key] || 1
    const deltaPercent = (it.delta / max) * 100
    return { ...it, deltaPercent }
  })

  // Максимум по модулю — для масштабирования шкалы
  const maxAbs = Math.max(
    ...enriched.map((it) => Math.abs(it.deltaPercent)),
    1 // защита от нуля
  )

  return (
    <div className="panel">
      <h3>Диаграмма изменений</h3>
      <p className="panel-hint">
        Каждый бар — изменение K от K(0) к K(t) в процентах от максимума.
        Влево — значение уменьшилось, вправо — выросло.
        Цвет: <span className="hint-good">зелёный</span> — улучшилось,{' '}
        <span className="hint-bad">красный</span> — ухудшилось,{' '}
        <span className="hint-neutral">серый</span> — без изменений.
      </p>

      <div className="diverging-chart">
        {/* Ось */}
        <div className="dbar-row dbar-axis-row">
          <span className="dbar-label" />
          <div className="dbar-track dbar-track-axis">
            <span className="dbar-axis-label dbar-axis-min">
              −{maxAbs.toFixed(0)}%
            </span>
            <span className="dbar-axis-label dbar-axis-center">0</span>
            <span className="dbar-axis-label dbar-axis-max">
              +{maxAbs.toFixed(0)}%
            </span>
          </div>
          <span className="dbar-value" />
        </div>

        {/* Бары */}
        {enriched.map((item) => {
          const width = (Math.abs(item.deltaPercent) / maxAbs) * 45
          const isPositive = item.deltaPercent > 0
          const left = isPositive ? 50 : 50 - width
          const sign = item.deltaPercent > 0 ? '+' : ''

          return (
            <div className="dbar-row" key={item.key}>
              <span className="dbar-label">{item.key}</span>

              <div
                className="dbar-track"
                title={`${item.explanation} (${item.changeText})`}
              >
                <div className="dbar-center-line" />

                {width > 0.2 && (
                  <div
                    className={`dbar-fill dbar-fill-${item.verdict}`}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                    }}
                  />
                )}
              </div>

              <span className={`dbar-value dbar-value-${item.verdict}`}>
                {sign}
                {item.deltaPercent.toFixed(1)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}