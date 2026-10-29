import React, { useState } from 'react'
import './App.css'
import { getAllCoefficientNames } from './polynomials'
import { randomAllValues } from './random'
import { FN_COUNT } from './functions'
import FnEditor from './components/FnEditor'
import REditor from './components/REditor'
import SourceSystem from './components/SourceSystem'
import TimeChart from './components/TimeChart'
import RadarChart from './components/RadarChart'

const DEFAULT_VALUES = (() => {
  const init = {}
  getAllCoefficientNames().forEach((k) => {
    init[k] = 0
  })
  // f_j(x) = x по умолчанию
  for (let i = 1; i <= FN_COUNT; i++) {
    init[`f${i}_c0`] = 0
    init[`f${i}_c1`] = 1
    init[`f${i}_c2`] = 0
    init[`f${i}_c3`] = 0
  }
  init.R1 = 1
  init.R2 = 1
  init.R3 = 1
  init.R4 = 0
  return init
})()

export default function App() {
  const [values, setValues] = useState(DEFAULT_VALUES)
  const [tEnd, setTEnd] = useState(10)

  const updateValue = (key, val) =>
    setValues((p) => ({ ...p, [key]: val }))

  const randomAll = () => setValues(randomAllValues())

  const reset = () => {
    setValues(DEFAULT_VALUES)
    setTEnd(10)
  }

  return (
    <div className="app">
      <header>
        <h1>
          Калькулятор полиномиальной модели оценки ЧС
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
            <div className="panel-actions" style={{ marginTop: 12 }}>
              <button className="btn btn-primary" onClick={randomAll}>
                Заполнить случайно
              </button>
              <button className="btn btn-danger" onClick={reset}>
                Сбросить
              </button>
            </div>
          </div>

          <REditor values={values} onChange={updateValue} />
          <FnEditor values={values} onChange={updateValue} />
        </aside>

        <main className="main">
          <SourceSystem />
          <TimeChart values={values} tEnd={tEnd} points={30} />
          <RadarChart values={values} tEnd={tEnd} />
        </main>
      </div>
    </div>
  )
}