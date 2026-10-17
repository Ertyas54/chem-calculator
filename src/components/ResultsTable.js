import React from 'react'
import { interpretResults } from '../interpreter'
import { getDescription } from '../descriptions'

export default function ResultsTable({ startK, endK }) {
  const items = interpretResults(startK, endK)

  const summary = items.reduce(
    (acc, it) => {
      acc[it.verdict] = (acc[it.verdict] ?? 0) + 1
      return acc
    },
    { good: 0, bad: 0, neutral: 0 }
  )

  return (
    <div className="panel">
      <h3>Итог расчёта</h3>

      <div className="summary-bar">
        <div className="summary-item summary-good">
          <span className="summary-icon">✓</span>
          <span className="summary-count">{summary.good}</span>
          <span className="summary-label">улучшилось</span>
        </div>
        <div className="summary-item summary-bad">
          <span className="summary-icon">✕</span>
          <span className="summary-count">{summary.bad}</span>
          <span className="summary-label">ухудшилось</span>
        </div>
        <div className="summary-item summary-neutral">
          <span className="summary-icon">≈</span>
          <span className="summary-count">{summary.neutral}</span>
          <span className="summary-label">без изменений</span>
        </div>
      </div>

      <div className="results">
        {items.map((item) => (
          <ResultCard key={item.key} item={item} />
        ))}
      </div>
    </div>
  )
}

function ResultCard({ item }) {
  const {
    key,
    label,
    changeText,
    verdict,
    verdictText,
    verdictIcon,
    explanation,
  } = item

  const description = getDescription(key)

  return (
    <div className={`result-card result-${verdict}`}>
      <div className="result-header">
        <span className="result-key">{key}</span>
        <span className="result-label">{label}</span>
      </div>

      <div className="result-description">{description}</div>

      <div className="result-change">{changeText}</div>

      <div className={`result-verdict verdict-${verdict}`}>
        <span className="verdict-icon">{verdictIcon}</span>
        <span className="verdict-text">{verdictText}</span>
      </div>

      <div className="result-explanation">{explanation}</div>

    </div>
  )
}