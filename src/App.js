import React, { useState } from 'react'
import './App.css'
import { getAllCoefficientNames } from './polynomials'
import {
  randomAllValues,
  randomFnValues,
  randomK,
  randomR,
  randomOneValue,
  randomConditions,
} from './random'
import { makeDefaultConditions } from './normalization'
import FnEditor from './components/FnEditor'
import InitialValues from './components/InitialValues'
import REditor from './components/REditor'
import SourceSystem from './components/SourceSystem'
import TimeChart from './components/TimeChart'
import RadarChart from './components/RadarChart'

const DEFAULT_K = {
  K1: 0.58, K2: 0.80, K3: 0.76, K4: 0.22, K5: 0.85,
  K6: 0.87, K7: 0.25, K8: 0.28, K9: 0.80, K10: 0.28,
  K11: 0.47, K12: 0.19, K13: 0.38, K14: 0.33, K15: 0.20,
}

//const DEFAULT_R = { R1: 1, R2: 1, R3: 1, R4: 0.5 }
const DEFAULT_R = { R1: 0.1, R2: 0.1, R3: 0.1, R4: 0.05 }

const K_KEYS = Array.from({ length: 15 }, (_, i) => `K${i + 1}`)

const INITIAL_VALUES = (() => {
  const init = {}
  getAllCoefficientNames().forEach((name) => {
    if (name.startsWith('f')) {
      const m = name.match(/^f(\d+)_c(\d+)$/)
      if (m) {
        const deg = parseInt(m[2], 10)
        init[name] = deg === 0 ? 0 : deg === 1 ? 1 : 0.2
      }
    }
  })
  Object.assign(init, DEFAULT_K, DEFAULT_R)
  return init
})()

export default function App() {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [tEnd, setTEnd] = useState(10)
  const [conditions, setConditions] = useState(makeDefaultConditions)

  const updateValue = (key, val) =>
    setValues((p) => ({ ...p, [key]: val }))

  //const randomizeAll = () => {
  //  const all = randomAllValues()          // K, R, f — одним куском
  //  const newK = {}
  //  K_KEYS.forEach((k) => { newK[k] = all[k] })
  //  setValues((p) => ({ ...p, ...all }))
  //  setConditions(randomConditions(newK))  // красная линия — от этих же K
  //}

  const randomizeAll = () => {
    const all = randomAllValues()
    const merged = { ...values, ...all }
    setValues(merged)
    setConditions(randomConditions(merged, tEnd))
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
          <button className="btn btn-primary" onClick={randomizeAll}>
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
          <RadarChart
            values={values}
            tEnd={tEnd}
            conditions={conditions}
            onConditionsChange={setConditions}
          />
        </main>
      </div>
    </div>
  )
}