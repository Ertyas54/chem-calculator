import React, { useMemo, useState } from 'react'
import './App.css'
import DivergingBar from './components/DivergingBar'
import {
  evaluateAll,
  getAllCoefficientNames,
} from './polynomials'
import { randomAllValues } from './random'
import CoefficientInput from './components/CoefficientInput'
import ResultsTable from './components/ResultsTable'

const DEFAULT_VALUES = (() => {
  const init = {}
  getAllCoefficientNames().forEach((key) => {
    init[key] = 0
  })
  init.K1 = 10
  init.K2 = 10
  init.K3 = 5
  init.K7 = 20
  init.K8 = 5
  init.K10 = 100
  init.K13 = 100
  init.K14 = 10
  init.K15 = 5
  init.R1 = 1.0
  init.R2 = 1.0
  init.R3 = 0.8
  init.R4 = 0.5
  return init
})()

export default function App() {
  const [values, setValues] = useState(DEFAULT_VALUES)
  const [tEnd, setTEnd] = useState(10)

  const startK = useMemo(
    () => evaluateAll(0, values, tEnd),
    [values, tEnd]
  )

  // Конечное состояние (t = tEnd) — при τ = 1
  const endK = useMemo(
    () => evaluateAll(tEnd, values, tEnd),
    [tEnd, values]
  )

  // Изменение одного коэффициента
  const updateValue = (key, val) =>
    setValues((p) => ({ ...p, [key]: val }))

  // Случайно все коэффициенты
  const randomAll = () => {
    setValues(randomAllValues())
  }

  // Сброс
  const reset = () => {
    setValues(DEFAULT_VALUES)
    setTEnd(10)
  }

  return (
    <div className="app">
      <header>
        <h1>
          Калькулятор оценки ЧС
          нефтеперерабатывающего завода
        </h1>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="panel">
            <h3>Параметры расчёта</h3>
            <div className="field">
              <label>Конечное время t</label>
              <input
                type="number"
                value={tEnd}
                min={1}
                step={1}
                onChange={(e) =>
                  setTEnd(parseFloat(e.target.value) || 1)
                }
              />
            </div>
          </div>

          <CoefficientInput
            values={values}
            onChange={updateValue}
            onRandomAll={randomAll}
            onReset={reset}
          />
        </aside>

        <main className="main">
          <DivergingBar startK={startK} endK={endK} />
          <ResultsTable startK={startK} endK={endK} />
        </main>
      </div>
    </div>
  )
}