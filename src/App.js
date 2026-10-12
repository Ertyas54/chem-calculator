import React, { useMemo, useState } from 'react'
import './App.css'
import {
  STATE_NAMES,
  CONTROL_NAMES,
  solveSystem,
} from './solver'
import { randomAll } from './random'
import ParameterInput from './components/ParameterInput'
import InitialConditions from './components/InitialConditions'
import ResultsTable from './components/ResultsTable'

const DEFAULT_K0 = Object.fromEntries(
  STATE_NAMES.map((_, i) => [`K${i + 1}`, 10])
)

DEFAULT_K0.K13 = 100
DEFAULT_K0.K7 = 20
DEFAULT_K0.K8 = 5
DEFAULT_K0.K14 = 10
DEFAULT_K0.K15 = 5
DEFAULT_K0.K10 = 100

const DEFAULT_R = {
  R1: 1.0,
  R2: 1.0,
  R3: 0.8,
  R4: 0.5,
}

export default function App() {
  const [K0, setK0] = useState(DEFAULT_K0)
  const [controls, setControls] = useState(DEFAULT_R)
  const [tEnd, setTEnd] = useState(100)
  const [steps, setSteps] = useState(500)

  const data = useMemo(() => {
    const K0vec = STATE_NAMES.map((_, i) => K0[`K${i + 1}`] ?? 0)
    return solveSystem({ K0: K0vec, controls, tEnd, steps })
  }, [K0, controls, tEnd, steps])

  const endK = useMemo(() => {
    if (!data || data.length === 0) return {}
    return data[data.length - 1]
  }, [data])

  const updateK0 = (key, val) => setK0((p) => ({ ...p, [key]: val }))
  const updateR = (key, val) => setControls((p) => ({ ...p, [key]: val }))

  const reset = () => {
    setK0(DEFAULT_K0)
    setControls(DEFAULT_R)
    setTEnd(100)
    setSteps(500)
  }

  const randomizeAll = () => {
    const { K0: newK0, controls: newR } = randomAll()
    setK0(newK0)
    setControls(newR)
  }

  return (
    <div className="app">
      <header>
        <h1>
          Калькулятор системы ДУ для оценки ЧС
          нефтеперерабатывающего завода
        </h1>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="panel">
            <h3>Действия</h3>
            <div className="actions">
              <button className="btn btn-primary" onClick={randomizeAll}>
                Случайные параметры
              </button>
              <button className="btn btn-danger" onClick={reset}>
                Сбросить
              </button>
            </div>
          </div>

          <div className="panel">
            <h3>Параметры интегрирования</h3>
            <div className="field">
              <label>Конечное время t</label>
              <input
                type="number"
                value={tEnd}
                min={1}
                step={1}
                onChange={(e) => setTEnd(parseFloat(e.target.value) || 1)}
              />
            </div>
          </div>

          <InitialConditions values={K0} onChange={updateK0} />

          <ParameterInput
            title="Управляющие воздействия R(t)"
            items={CONTROL_NAMES}
            values={controls}
            onChange={updateR}
            step={0.1}
            min={0}
            max={5}
          />
        </aside>

        <main className="main">
          <ResultsTable startK={K0} endK={endK} />
        </main>
      </div>
    </div>
  )
}