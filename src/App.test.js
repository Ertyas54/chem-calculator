import { act } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = global.ResizeObserver || ResizeObserverStub
global.IS_REACT_ACT_ENVIRONMENT = true

test('App рендерит график, лепестковую диаграмму и таблицу по часам', () => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)

  act(() => {
    root.render(<App />)
  })

  const text = container.textContent
  expect(text).toContain('Исходная система уравнений')
  expect(text).toContain('Изменение переменных от времени')
  expect(text).toContain('Лепестковая диаграмма')
  expect(text).toContain('Таблица K_i(t)')

  // tEnd = 10 -> 11 строк по часам
  const rows = container.querySelectorAll('.results-table tbody tr')
  expect(rows).toHaveLength(11)

  // главная кнопка рандома
  expect(text).toContain('Рандом всех значений')

  // разворачиваем уравнение K1: f записаны через K, а не через x
  const headers = Array.from(
    container.querySelectorAll('.equation-header')
  )
  const k1Header = headers.find((h) => h.textContent.startsWith('K1(t)'))
  expect(k1Header).toBeTruthy()

  act(() => {
    k1Header.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  const opened = container.textContent
  expect(opened).toContain('f1(K10)')
  expect(opened).toContain('(K10/1000)')

  act(() => {
    root.unmount()
  })
  container.remove()
})
