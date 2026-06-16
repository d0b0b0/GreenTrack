import { useState } from 'react'
import { useApp } from '../context/AppProvider'
import { useAuthModal } from '../context/AuthModalProvider'
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
    if (a < UA_AVG_ANNUAL * 0.7) return { cls: 'good', text: '✅ Нижче за середнє' }
    if (a < UA_AVG_ANNUAL * 1.1) return { cls: '', text: '⚠️ На рівні середнього' }
    return { cls: 'bad', text: '🔴 Вище за середнє' }
  })()

  return (
    <div className="card calc-card">
      <div className="calc-grid">
        <div className="field">
          <label>Основний транспорт</label>
          <select className="select" value={transport} onChange={(e) => setTransport(+e.target.value)}>
            {TRANSPORT.map((o) => (<option key={o.v} value={o.v}>{o.label}</option>))}
          </select>
        </div>
        <div className="field">
          <label>Тип харчування</label>
          <select className="select" value={food} onChange={(e) => setFood(+e.target.value)}>
            {FOOD.map((o) => (<option key={o.v} value={o.v}>{o.label}</option>))}
          </select>
        </div>
        <div className="field">
          <label>Опалення / енергія</label>
          <select className="select" value={energy} onChange={(e) => setEnergy(+e.target.value)}>
            {ENERGY.map((o) => (<option key={o.v} value={o.v}>{o.label}</option>))}
          </select>
        </div>
        <div className="field">
          <label>Людей у сім'ї</label>
          <input className="input" type="number" min={1} max={10} value={people} onChange={(e) => setPeople(+e.target.value)} />
        </div>
        <div className="field">
          <label>Площа житла (м²)</label>
          <input className="input" type="number" min={10} max={500} value={area} onChange={(e) => setArea(+e.target.value)} />
        </div>
        <div className="field">
          <label>Польотів на рік</label>
          <input className="input" type="number" min={0} max={50} value={flights} onChange={(e) => setFlights(+e.target.value)} />
        </div>
      </div>

      <div className="row" style={{ justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        <button className="btn btn-primary" onClick={calculate}>Розрахувати мій слід 🌿</button>
      </div>

      {result && badge && (
        <>
          <div className="calc-result">
            <div>
              <div className="rl">Ваш річний вуглецевий слід</div>
              <div className="rv">{result.annual} т CO₂</div>
            </div>
            <div className="text-center">
              <div className="rl" style={{ marginBottom: 6 }}>Середнє в Україні — {UA_AVG_ANNUAL} т</div>
              <span className={`result-badge ${badge.cls}`}>{badge.text}</span>
            </div>
          </div>

          <div className="calc-breakdown">
            <div className="calc-bd-item"><div className="v">{result.breakdown.transport}</div><div className="l">Транспорт, т</div></div>
            <div className="calc-bd-item"><div className="v">{result.breakdown.food}</div><div className="l">Їжа, т</div></div>
            <div className="calc-bd-item"><div className="v">{result.breakdown.energy}</div><div className="l">Енергія, т</div></div>
            <div className="calc-bd-item"><div className="v">{result.breakdown.flights}</div><div className="l">Польоти, т</div></div>
          </div>

          <div className="mt-3">
            {authed ? (
              <div className="alert success">
                💾 {saved ? 'Збережено у ваш профіль як базовий показник.' : 'Розрахунок оновлено.'}
                {profile?.baseline != null && <> Поточний базовий: <strong>{profile.baseline} т/рік</strong>.</>}
              </div>
            ) : (
              <div className="alert info">
                <span>
                  🔒 Зареєструйтесь, щоб зберегти результат і відстежувати прогрес.{' '}
                  <button className="btn-link" onClick={() => open('register')}>Створити акаунт</button>
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
