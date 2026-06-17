import { useMemo, useState } from 'react'
import { useApp } from '../context/AppProvider'
import { useLang } from '../context/LangProvider'
import { CATEGORIES, CATEGORY_META } from '../lib/carbon'
import { computeCo2, FACTORS, factorById, factorsByCategory, QUICK_PRESETS } from '../lib/factors'
import { round1, todayISO } from '../lib/format'
import type { Category } from '../types'

export function ActivityForm() {
  const { addActivity } = useApp()
  const { t, tr } = useLang()
  const [category, setCategory] = useState<Category>('Транспорт')
  const [factorId, setFactorId] = useState<string>(factorsByCategory('Транспорт')[0].id)
  const [quantity, setQuantity] = useState<number>(factorsByCategory('Транспорт')[0].def)
  const [note, setNote] = useState('')
  const [date, setDate] = useState(todayISO())
  const [busy, setBusy] = useState(false)
  const [manual, setManual] = useState(false)
  const [manualCo2, setManualCo2] = useState('')

  const factor = useMemo(() => factorById(factorId) ?? FACTORS[0], [factorId])
  const co2 = manual ? parseFloat(manualCo2) || 0 : computeCo2(factor, quantity)
  const list = factorsByCategory(category)

  function changeCategory(c: Category) {
    setCategory(c)
    const first = factorsByCategory(c)[0]
    setFactorId(first.id)
    setQuantity(first.def)
  }

  function changeFactor(id: string) {
    setFactorId(id)
    const f = factorById(id)
    if (f) setQuantity(f.def)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (manual) {
      const val = parseFloat(manualCo2)
      if (isNaN(val)) return
      setBusy(true)
      await addActivity({ category, co2: round1(val), note: note.trim(), date: date || todayISO() })
    } else {
      if (!quantity && factor.perUnit !== 0) return
      setBusy(true)
      const label = `${factor.label}${quantity ? ` · ${round1(quantity)} ${factor.unit}` : ''}`
      await addActivity({
        category: factor.category,
        co2,
        note: note.trim() || label,
        date: date || todayISO(),
      })
    }
    setBusy(false)
    setNote('')
    setManualCo2('')
  }

  async function quickAdd(presetId: string, qty: number) {
    const f = factorById(presetId)
    if (!f) return
    await addActivity({
      category: f.category,
      co2: computeCo2(f, qty),
      note: `${f.label} · ${qty} ${f.unit}`,
      date: todayISO(),
    })
  }

  return (
    <div>
      {/* one-tap presets */}
      <div className="muted" style={{ fontSize: '0.82rem', marginBottom: '0.55rem' }}>{t('Швидке додавання', 'Quick add')}</div>
      <div className="row wrap gap" style={{ marginBottom: '1.2rem' }}>
        {QUICK_PRESETS.map((p) => {
          const f = factorById(p.factorId)!
          return (
            <button key={p.factorId} className="chip" onClick={() => quickAdd(p.factorId, p.quantity)} title={`≈ ${computeCo2(f, p.quantity)} ${t('кг CO₂', 'kg CO₂')}`}>
              {f.icon} {tr(f.label)} · {p.quantity} {tr(f.unit)}
            </button>
          )
        })}
      </div>

      <div className="row between" style={{ marginBottom: '0.55rem' }}>
        <div className="muted" style={{ fontSize: '0.82rem' }}>{t('Порахувати за активністю', 'Calculate by activity')}</div>
        <button type="button" className="btn-link" style={{ fontSize: '0.8rem' }} onClick={() => setManual((m) => !m)}>
          {manual ? t('← за активністю', '← by activity') : t('ввести кг вручну', 'enter kg manually')}
        </button>
      </div>

      <form onSubmit={submit}>
        {/* category chips */}
        <div className="row wrap gap" style={{ marginBottom: '1rem' }}>
          {CATEGORIES.map((c) => (
            <button
              type="button"
              key={c}
              className={`chip ${category === c ? 'active' : ''}`}
              onClick={() => changeCategory(c)}
            >
              {CATEGORY_META[c].icon} {tr(c)}
            </button>
          ))}
        </div>

        {manual ? (
          <div className="log-form">
            <div className="field">
              <label>{t('Категорія', 'Category')}</label>
              <select className="select" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
                {CATEGORIES.map((c) => (<option key={c} value={c}>{tr(c)}</option>))}
              </select>
            </div>
            <div className="field">
              <label>{t('CO₂ (кг)', 'CO₂ (kg)')}</label>
              <input className="input" type="number" step="0.1" placeholder={t('напр. 4.5', 'e.g. 4.5')} value={manualCo2} onChange={(e) => setManualCo2(e.target.value)} />
            </div>
            <div className="field">
              <label>{t('Нотатка', 'Note')}</label>
              <input className="input" type="text" placeholder={t("необов'язково", 'optional')} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <div className="field">
              <label>{t('Дата', 'Date')}</label>
              <input className="input" type="date" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? <span className="spinner" /> : t('Додати', 'Add')}</button>
          </div>
        ) : (
          <>
            <div className="log-form">
              <div className="field">
                <label>{t('Активність', 'Activity')}</label>
                <select className="select" value={factorId} onChange={(e) => changeFactor(e.target.value)}>
                  {list.map((f) => (<option key={f.id} value={f.id}>{f.icon} {tr(f.label)}</option>))}
                </select>
              </div>
              <div className="field">
                <label>{t('Кількість', 'Quantity')} ({tr(factor.unit)})</label>
                <input
                  className="input"
                  type="number"
                  min={0}
                  step={factor.step}
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="field">
                <label>{t('Нотатка', 'Note')}</label>
                <input className="input" type="text" placeholder={t("необов'язково", 'optional')} value={note} onChange={(e) => setNote(e.target.value)} />
              </div>
              <div className="field">
                <label>{t('Дата', 'Date')}</label>
                <input className="input" type="date" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)} />
              </div>
              <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? <span className="spinner" /> : t('Додати', 'Add')}</button>
            </div>

            {/* live preview */}
            <div className="co2-preview">
              <span>{factor.icon} {tr(factor.label)}</span>
              <span className="co2-preview-val" style={co2 < 0 ? { color: 'var(--green-light)' } : undefined}>
                ≈ {co2 < 0 ? '' : '+'}{co2} {t('кг CO₂', 'kg CO₂')}
              </span>
            </div>
          </>
        )}
      </form>
    </div>
  )
}
