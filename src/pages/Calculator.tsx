import { CalculatorWidget } from '../components/CalculatorWidget'

export default function Calculator() {
  return (
    <div className="route-fade">
      <div style={{ marginBottom: '1.2rem' }}>
        <h1 className="greeting">Калькулятор сліду 🧮</h1>
        <p className="page-sub">
          Оцініть свій річний вуглецевий слід і порівняйте із середнім по Україні. Результат
          збережеться у профіль як базовий показник.
        </p>
      </div>
      <CalculatorWidget />
    </div>
  )
}
