import { useState } from 'react'
import { useApp } from '../context/AppProvider'
import { useAuthModal } from '../context/AuthModalProvider'
import { useLang } from '../context/LangProvider'
import { calcAnnual, UA_AVG_ANNUAL, type CalcResult } from '../lib/carbon'

const TRANSPORT = [
  { v: 60, label: 'Авто (бензин)' },
  { v: 40, label: 'Авто (електро)' },
  { v: 15, label: 'Громадський транспорт' },
  { v: 5, label: 'Велосипед / пішки' },
  { v: 80, label: 'Часті авіаперельоти' },
]
const FOOD = [
  { v: 80, label: "М'ясоїд" },
  { v: 50, label: 'Змішане' },
  { v: 30, label: 'Вегетаріанець' },
  { v: 15, label: 'Веган' },
]
const ENERGY = [
  { v: 40, label: 'Газ / централізоване' },
  { v: 20, label: 'Електроенергія' },
  { v: 10, label: 'Сонячні панелі' },
  { v: 60, label: 'Вугілля / мазут' },
]

export function CalculatorWidget() {
  const { authed, profile, setBaseline } = useApp()
  const { open } = useAuthModal()
  const { t, tr } = useLang()
  const [transport, setTransport] = useState(60)
  const [food, setFood] = useState(50)
  const [energy, setEnergy] = useState(40)
  const [people, setPeople] = useState(2)
  const [area, setArea] = useState(60)
  const [flights, setFlights] = useState(1)
  const [result, setResult] = useState<CalcResult | null>(null)
  const [saved, setSaved] = useState(false)

  function calculate() {
    const r = calcAnnual({ transport, food, energy, people, area, flights })
    setResult(r)
    setSaved(false)
    if (authed) {
      setBaseline(r.annual)
      setSaved(true)
    }
  }

  const badge = (() => {
    if (!result) return null
    const a = result.annual
    if (a < UA_AVG_ANNUAL * 0.7) return { cls: 'good', text: t('✅ Нижче за середнє', '✅ Below average') }
    if (a < UA_AVG_ANNUAL * 1.1) return { cls: '', text: t('⚠️ На рівні середнього', '⚠️ Around average') }
    return { cls: 'bad', text: t('🔴 Вище за середнє', '🔴 Above average') }
  })()

  return (
    <div className="card calc-card">
      <div className="calc-grid">
        <div className="field">
          <label>{t('Основний транспорт', 'Main transport')}</label>
          <select className="select" value={transport} onChange={(e) => setTransport(+e.target.value)}>
            {TRANSPORT.map((o) => (<option key={o.v} value={o.v}>{tr(o.label)}</option>))}
          </select>
        </div>
        <div className="field">
          <label>{t('Тип харчування', 'Diet type')}</label>
          <select className="select" value={food} onChange={(e) => setFood(+e.target.value)}>
            {FOOD.map((o) => (<option key={o.v} value={o.v}>{tr(o.label)}</option>))}
          </select>
        </div>
        <div className="field">
          <label>{t('Опалення / енергія', 'Heating / energy')}</label>
          <select className="select" value={energy} onChange={(e) => setEnergy(+e.target.value)}>
            {ENERGY.map((o) => (<option key={o.v} value={o.v}>{tr(o.label)}</option>))}
          </select>
        </div>
        <div className="field">
          <label>{t("Людей у сім'ї", 'People in household')}</label>
          <input className="input" type="number" min={1} max={10} value={people} onChange={(e) => setPeople(+e.target.value)} />
        </div>
        <div className="field">
          <label>{t('Площа житла (м²)', 'Home area (m²)')}</label>
          <input className="input" type="number" min={10} max={500} value={area} onChange={(e) => setArea(+e.target.value)} />
        </div>
        <div className="field">
          <label>{t('Польотів на рік', 'Flights per year')}</label>
          <input className="input" type="number" min={0} max={50} value={flights} onChange={(e) => setFlights(+e.target.value)} />
        </div>
      </div>

      <div className="row" style={{ justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        <button className="btn btn-primary" onClick={calculate}>{t('Розрахувати мій слід 🌿', 'Calculate my footprint 🌿')}</button>
      </div>

      {result && badge && (
        <>
          <div className="calc-result">
            <div>
              <div className="rl">{t('Ваш річний вуглецевий слід', 'Your annual carbon footprint')}</div>
              <div className="rv">{result.annual} {t('т CO₂', 't CO₂')}</div>
            </div>
            <div className="text-center">
              <div className="rl" style={{ marginBottom: 6 }}>{t('Середнє в Україні —', 'Ukrainian average —')} {UA_AVG_ANNUAL} {t('т', 't')}</div>
              <span className={`result-badge ${badge.cls}`}>{badge.text}</span>
            </div>
          </div>

          <div className="calc-breakdown">
            <div className="calc-bd-item"><div className="v">{result.breakdown.transport}</div><div className="l">{t('Транспорт, т', 'Transport, t')}</div></div>
            <div className="calc-bd-item"><div className="v">{result.breakdown.food}</div><div className="l">{t('Їжа, т', 'Food, t')}</div></div>
            <div className="calc-bd-item"><div className="v">{result.breakdown.energy}</div><div className="l">{t('Енергія, т', 'Energy, t')}</div></div>
            <div className="calc-bd-item"><div className="v">{result.breakdown.flights}</div><div className="l">{t('Польоти, т', 'Flights, t')}</div></div>
          </div>

          <div className="mt-3">
            {authed ? (
              <div className="alert success">
                💾 {saved ? t('Збережено у ваш профіль як базовий показник.', 'Saved to your profile as the baseline.') : t('Розрахунок оновлено.', 'Calculation updated.')}
                {profile?.baseline != null && <> {t('Поточний базовий:', 'Current baseline:')} <strong>{profile.baseline} {t('т/рік', 't/year')}</strong>.</>}
              </div>
            ) : (
              <div className="alert info">
                <span>
                  🔒 {t('Зареєструйтесь, щоб зберегти результат і відстежувати прогрес.', 'Sign up to save the result and track your progress.')}{' '}
                  <button className="btn-link" onClick={() => open('register')}>{t('Створити акаунт', 'Create account')}</button>
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
