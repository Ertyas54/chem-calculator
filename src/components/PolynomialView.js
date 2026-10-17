import React from 'react'
import {
  STATE_NAMES,
  polynomialToString,
  getDegree,
} from '../polynomials'

export default function PolynomialView() {
  return (
    <div className="panel">
      <h3>Уравнения модели</h3>
      <p className="panel-hint">
        Каждая переменная K_i(t) — полином от t. Степень равна
        количеству функций f в исходном уравнении. Знаки сохранены.
      </p>
      <div className="polynomials">
        {STATE_NAMES.map((label, i) => {
          const key = `K${i + 1}`
          const formula = polynomialToString(key)
          const degree = getDegree(key)
          return (
            <div key={key} className="polynomial-row">
              <span className="polynomial-name">{key}(t) =</span>
              <span className="polynomial-formula">{formula}</span>
              <span className="polynomial-degree">n = {degree}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}