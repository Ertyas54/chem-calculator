import React, { useState } from 'react'
import './App.css'
import { getAllCoefficientNames } from './polynomials'
import {
  randomAllValues,
  randomFnValues,
  randomK,
  randomR,
  randomOneValue,
} from './random'
import FnEditor from './components/FnEditor'
import InitialValues from './components/InitialValues'
import REditor from './components/REditor'
import SourceSystem from './components/SourceSystem'
import TimeChart from './components/TimeChart'
import RadarChart from './components/RadarChart'

const DEFAULT_K = {
  K1: 0.7, K2: 0.7, K3: 0.7, K4: 0.3, K5: 0.7,
  K6: 0.7, K7: 0.3, K8: 0.3, K9: 0.7, K10: 0.3,
  K11: 0.3, K12: 0.3, K13: 0.3, K14: 0.3, K15: 0.3,
}

// R-коэффициенты по умолчанию
const DEFAULT_R = {
  R1_c0: 0.1, R1_c1: 0.1, R1_c2: 0.05, R1_c3: 0.02,
  R2_c0: 0.1, R2_c1: 0.1, R2_c2: 0.05, R2_c3: 0.02,
  R3_c0: 0.1, R3_c1: 0.1, R3_c2: 0.05, R3_c3: 0.02,
  R4_c0: 0.1, R4_c1: 0.1, R4_c2: 0.05, R4_c3: 0.02,
}

const INITIAL_VALUES = (() => {
  const init = {}
  getAllCoefficientNames().forEach((name) => {
    if (name.startsWith('f')) {
      const m = name.match(/^f(\d+)_c(\d+)$/)
      if (m) {
        const deg = parseInt(m[2], 10)
        init[name] = deg === 0 ? 0 : deg === 1 ? 1 : 0.2
      }
    } else if (name.startsWith('R')) {
      init[name] = 0.1
    }
  })
  Object.assign(init, DEFAULT_K)
  Object.assign(init, DEFAULT_R)
  return init
})()

export default function App() {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [tEnd, setTEnd] = useState(10)

  const updateValue = (key, val) =>
    setValues((p) => ({ ...p, [key]: val }))

  const randomizeAll = () => {
    setValues((p) => ({ ...p, ...randomAllValues() }))
  }

  const randomizeFn = (fn) => {
    setValues((p) => ({ ...p, ...randomFnValues(fn) }))
  }

  const randomizeOneValue = (key) => {
    setValues((p) => ({ ...p, [key]: randomOneValue(key) }))
  }

  const randomizeR = () => {
    setValues((p) => ({ ...p, ...randomR() }))
  }

  const randomizeK = () => {
    setValues((p) => ({ ...p, ...randomK() }))
  }

  const resetK = () => {
    setValues((p) => ({ ...p, ...DEFAULT_K }))
  }

  return (
    <div className="app">
      <header>
        <h1>
          Калькулятор системы уравнений оценки ЧС
          нефтеперерабатывающего завода
        </h1>
        <div style={{ textAlign: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={randomizeAll}
          >
            Сгенерировать значения
          </button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="panel">
            <h3>Параметры интегрирования</h3>
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

          <InitialValues
            values={values}
            onChange={updateValue}
            onReset={resetK}
            onRandom={randomizeK}
          />

          <REditor
            values={values}
            onChange={updateValue}
            onRandom={randomizeR}
          />

          <FnEditor
            values={values}
            onChange={updateValue}
            onRandomFn={randomizeFn}
            onRandomOne={randomizeOneValue}
          />
        </aside>

        <main className="main">
          <SourceSystem />
          <TimeChart values={values} tEnd={tEnd} points={60} />
          <RadarChart values={values} tEnd={tEnd} />
        </main>
      </div>
    </div>
  )
}