import { useLang } from '../context/LangProvider'
import { CalculatorWidget } from '../components/CalculatorWidget'

export default function Calculator() {
  const { t } = useLang()
  return (
    <div className="route-fade">
      <div style={{ marginBottom: '1.2rem' }}>
        <h1 className="greeting">{t('Калькулятор сліду 🧮', 'Footprint calculator 🧮')}</h1>
        <p className="page-sub">
          {t(
            'Оцініть свій річний вуглецевий слід і порівняйте із середнім по Україні. Результат збережеться у профіль як базовий показник.',
            'Estimate your annual carbon footprint and compare it with the Ukrainian average. The result is saved to your profile as a baseline.',
          )}
        </p>
      </div>
      <CalculatorWidget />
    </div>
  )
}
