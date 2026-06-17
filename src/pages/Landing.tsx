import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import { useAuthModal } from '../context/AuthModalProvider'
import { useLang } from '../context/LangProvider'
import { CalculatorWidget } from '../components/CalculatorWidget'
import { Counter } from '../components/Counter'
import { backend } from '../data/backend'
import { FACTORS } from '../lib/factors'
import { ARTICLES } from '../lib/tips'

const TEAM = [
  { initials: 'ШД', name: 'Шевченко Даніл', nameEn: 'Danil Shevchenko', role: 'PM / Frontend' },
  { initials: 'ВН', name: 'Вознюк Назар', nameEn: 'Nazar Vozniuk', role: 'UX/UI / Content' },
]

export default function Landing() {
  const { authed } = useApp()
  const { open } = useAuthModal()
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [users, setUsers] = useState<number | null>(null)

  useEffect(() => {
    let active = true
    backend.userCount().then((n) => active && setUsers(n)).catch(() => active && setUsers(0))
    return () => {
      active = false
    }
  }, [])

  const startCta = () => (authed ? navigate('/app') : open('register'))

  const features = [
    { icon: '🌍', title: t('Розрахунок сліду', 'Footprint tracking'), text: t('Вводьте дані про транспорт, харчування та побут — отримуйте точні цифри впливу на клімат.', 'Log transport, food, and home data — get accurate numbers on your climate impact.') },
    { icon: '📊', title: t('Глибока аналітика', 'Deep analytics'), text: t('Інтерактивні графіки показують динаміку викидів по днях, тижнях і місяцях.', 'Interactive charts show your emissions trend by day, week, and month.') },
    { icon: '🎯', title: t('Челенджі та цілі', 'Challenges & goals'), text: t('Приймайте еко-виклики, встановлюйте місячні цілі та виробляйте корисні звички.', 'Take eco-challenges, set monthly goals, and build healthy habits.') },
    { icon: '🏆', title: t('Рейтинг і досягнення', 'Leaderboard & badges'), text: t('Здобувайте бали, відкривайте бейджі та змагайтесь у глобальному рейтингу спільноти.', 'Earn points, unlock badges, and compete on the global community leaderboard.') },
    { icon: '💡', title: t('Персональні поради', 'Personal tips'), text: t('Розумні рекомендації аналізують ваші звички й підказують конкретні кроки.', 'Smart recommendations analyse your habits and suggest concrete steps.') },
    { icon: '📚', title: t('Еко-бібліотека', 'Eco-library'), text: t('Перевірені статті та поради про транспорт, їжу, енергію та свідоме споживання.', 'Curated articles and tips on transport, food, energy, and conscious consumption.') },
  ]

  const steps = [
    { n: 1, title: t('Створіть акаунт', 'Create an account'), text: t('Реєстрація за 30 секунд. Розрахуйте базовий річний слід у калькуляторі.', 'Sign up in 30 seconds. Calculate your baseline annual footprint.') },
    { n: 2, title: t('Логуйте щоденні дії', 'Log daily actions'), text: t('Швидке додавання активностей або готові пресети у пару кліків.', 'Quick activity logging or one-tap presets in a couple of clicks.') },
    { n: 3, title: t('Аналізуйте та виконуйте челенджі', 'Analyse & take challenges'), text: t('Дивіться графіки, приймайте виклики й отримуйте бали за прогрес.', 'Review charts, accept challenges, and earn points for progress.') },
    { n: 4, title: t('Змагайтесь і надихайте інших', 'Compete & inspire others'), text: t('Підіймайтесь у рейтингу, відкривайте досягнення та зменшуйте слід разом.', 'Climb the leaderboard, unlock achievements, and reduce your footprint together.') },
  ]

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-blob" style={{ width: 520, height: 520, top: -120, right: -120 }} />
        <div className="hero-blob" style={{ width: 300, height: 300, bottom: 40, right: 260, animationDelay: '3s' }} />
        <div className="container">
          <div className="hero-inner reveal">
            <span className="pill">
              <span className="pill-dot pulse" /> {t('Для відповідального майбутнього', 'For a responsible future')}
            </span>
            <h1 style={{ marginTop: '1.4rem' }}>
              {t('Зменшуй свій ', 'Reduce your ')}<em>{t('вуглецевий слід', 'carbon footprint')}</em>{t(' крок за кроком', ' step by step')}
            </h1>
            <p>
              {t(
                'GreenTrack відстежує ваші щоденні дії, показує їхній вплив на довкілля та перетворює екологію на гру з челенджами, рівнями й рейтингом.',
                'GreenTrack tracks your daily actions, shows their environmental impact, and turns sustainability into a game with challenges, levels, and a leaderboard.',
              )}
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary lg" onClick={startCta}>
                {authed ? t('Відкрити панель →', 'Open dashboard →') : t('Почати безкоштовно →', 'Start free →')}
              </button>
              <a className="btn btn-ghost lg" href="#calculator">
                {t('Спробувати калькулятор', 'Try the calculator')}
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-num">{users === null ? '…' : <Counter value={users} />}</div>
                <div className="hero-stat-label">{users === 1 ? t('користувач', 'user') : t('користувачів', 'users')}</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">{FACTORS.length}</div>
                <div className="hero-stat-label">{t('типів активностей', 'activity types')}</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">{ARTICLES.length}</div>
                <div className="hero-stat-label">{t('статей у бібліотеці', 'library articles')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="trust container">
        <span>🚲 {t('Транспорт', 'Transport')}</span>
        <span>🥗 {t('Харчування', 'Food')}</span>
        <span>💡 {t('Енергія', 'Energy')}</span>
        <span>🛍️ {t('Покупки', 'Shopping')}</span>
        <span>♻️ {t('Відходи', 'Waste')}</span>
      </div>

      {/* FEATURES */}
      <section className="section tint" id="features">
        <div className="container">
          <div className="section-head">
            <div className="section-tag">{t('Можливості', 'Features')}</div>
            <h2>{t('Все для сталого способу життя', 'Everything for a sustainable lifestyle')}</h2>
            <p>{t('Від простого логування до глибокої аналітики та гейміфікації — GreenTrack супроводжує вас на кожному кроці.', 'From simple logging to deep analytics and gamification — GreenTrack is with you every step of the way.')}</p>
          </div>
          <div className="feature-grid">
            {features.map((f) => (
              <div className="card hover feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="section" id="calculator">
        <div className="container">
          <div className="section-head">
            <div className="section-tag">{t('Безкоштовний калькулятор', 'Free calculator')}</div>
            <h2>{t('Розрахуйте свій річний слід за хвилину', 'Calculate your annual footprint in a minute')}</h2>
            <p>{t('Заповніть форму й дізнайтесь, скільки CO₂ ви виробляєте на рік та як це порівнюється із середнім по Україні.', 'Fill in the form to see how much CO₂ you produce per year and how it compares with the Ukrainian average.')}</p>
          </div>
          <CalculatorWidget />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="howto">
        <div className="container">
          <div className="section-head">
            <div className="section-tag">{t('Як це працює', 'How it works')}</div>
            <h2>{t('Чотири кроки до зелених звичок', 'Four steps to greener habits')}</h2>
          </div>
          <div className="steps">
            {steps.map((s) => (
              <div className="step" key={s.n}>
                <div className="step-num">{s.n}</div>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="section tint" id="team">
        <div className="container">
          <div className="section-head">
            <div className="section-tag">{t('Наша команда', 'Our team')}</div>
            <h2>{t('Хто створив GreenTrack', 'Who built GreenTrack')}</h2>
            <p>{t('Студентська команда, яка вірить у силу технологій для порятунку планети.', 'A student team that believes in the power of technology to save the planet.')}</p>
          </div>
          <div className="team-grid">
            {TEAM.map((m) => (
              <div className="card team-card" key={m.name}>
                <span className="avatar lg" style={{ margin: '0 auto 0.7rem' }}>
                  {m.initials}
                </span>
                <div className="name" style={{ fontWeight: 700 }}>{lang === 'en' ? m.nameEn : m.name}</div>
                <div className="role muted" style={{ fontSize: '0.85rem' }}>{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-band">
            <h2>{t('Готові почати свою еко-подорож?', 'Ready to start your eco-journey?')}</h2>
            <p>{t('Реєстрація безкоштовна. Ваші дані синхронізуються та зберігаються — почніть зменшувати слід уже сьогодні.', 'Registration is free. Your data is synced and saved — start reducing your footprint today.')}</p>
            <button className="btn btn-white lg" onClick={startCta}>
              {authed ? t('Перейти до панелі 🌿', 'Go to dashboard 🌿') : t('Створити акаунт 🌿', 'Create account 🌿')}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
