import React from 'react'

const K_TITLES = {
  K1:  'K1 — время испарения ХОВ',
  K2:  'K2 — время ликвидации последствий',
  K3:  'K3 — площадь заражения',
  K4:  'K4 — время подхода облака',
  K5:  'K5 — потери от первичного облака',
  K6:  'K6 — потери от вторичного облака',
  K7:  'K7 — амбулаторная помощь',
  K8:  'K8 — стационар и реанимация',
  K9:  'K9 — поражённая техника',
  K10: 'K10 — объёмы для обеззараживания',
  K11: 'K11 — силы и средства АСР',
  K12: 'K12 — эффективность оповещения',
  K13: 'K13 — люди в зоне поражения',
  K14: 'K14 — спасатели в зоне поражения',
  K15: 'K15 — развитость системы МЧС',
}

const FORMULAS = {
  K1:  'dK₁/dt = −(f₁(K₁₀) · f₂(K₁₁) · f₃(K₁₄))',
  K2:  'dK₂/dt = f₄(K₃)·f₅(K₇)·f₆(K₈)·f₇(K₉)·f₈(K₁₃) − (f₉(K₁₀)·f₁₀(K₁₁)·f₁₁(K₁₄)·f₁₂(K₁₅)·R₁ + R₂ + R₃ + R₄)',
  K3:  'dK₃/dt = f₁₃(K₁) − (f₁₄(K₁₅)·R₁ + R₃ + R₄)',
  K4:  'dK₄/dt = f₁₅(K₁)',
  K5:  'dK₅/dt = f₁₆(K₁)·R₂ − R₁',
  K6:  'dK₆/dt = R₂ − (f₁₇(K₄)·f₁₈(K₁₁)·f₁₉(K₁₂)·f₂₀(K₁₄)·R₁)',
  K7:  'dK₇/dt = f₂₁(K₅)·f₂₂(K₆)·f₂₃(K₁₃)·f₂₄(K₁₅)·R₁ + R₂ + R₃',
  K8:  'dK₈/dt = f₂₅(K₅)·f₂₆(K₆)·f₂₇(K₁₁)·f₂₈(K₁₃)·f₂₉(K₁₄)·f₃₀(K₁₅)·R₁ + R₂ + R₃',
  K9:  'dK₉/dt = f₃₁(K₃)·f₃₂(K₁₃)·R₂ − (f₃₃(K₁₀)·f₃₄(K₁₁)·f₃₅(K₁₄)·R₁)',
  K10: 'dK₁₀/dt = f₃₆(K₃)·f₃₇(K₉)·f₃₈(K₁₅)·R₁ + R₂ + R₃ + R₄',
  K11: 'dK₁₁/dt = f₃₉(K₃)·f₄₀(K₁₃)·f₄₁(K₁₄)·R₁ + R₂ + R₃ − (f₄₂(K₁₅)·R₄)',
  K12: 'dK₁₂/dt = f₄₃(K₁₁)·f₄₄(K₁₃)·f₄₅(K₁₄)·R₁ + R₂ + R₃ − f₄₆(K₁₅)',
  K13: 'dK₁₃/dt = f₄₇(K₂)·f₄₈(K₃)·R₂',
  K14: 'dK₁₄/dt = f₄₉(K₁₁)·f₅₀(K₁₂)·f₅₁(K₁₃)·R₁ + R₂',
  K15: 'dK₁₅/dt = f₅₂(K₂)·f₅₃(K₃)·f₅₄(K₁₃)·f₅₅(K₁₄)·R₁ + R₂',
}

export default function SourceSystem() {
  return (
    <div className="panel">
      <h3>Исходная система уравнений</h3>

      <div className="source-equations">
        {Object.keys(K_TITLES).map((key) => (
          <div className="source-row" key={key}>
            <span className="source-title">{K_TITLES[key]}:</span>
            <span className="source-formula">{FORMULAS[key]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}