import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import { useAuthModal } from '../context/AuthModalProvider'

const FEATURES = [
  { icon: '🌍', title: 'Розрахунок сліду', text: 'Вводьте дані про транспорт, харчування та побут — отримуйте точні цифри впливу на клімат.' },
  { icon: '📊', title: 'Глибока аналітика', text: 'Інтерактивні графіки показують динаміку викидів по днях, тижнях і місяцях.' },
  { icon: '🎯', title: 'Челенджі та цілі', text: 'Приймайте еко-виклики, встановлюйте місячні цілі та виробляйте корисні звички.' },
  { icon: '🏆', title: 'Рейтинг і досягнення', text: 'Здобувайте бали, відкривайте бейджі та змагайтесь у глобальному рейтингу спільноти.' },
  { icon: '💡', title: 'Персональні поради', text: 'Розумні рекомендації аналізують ваші звички й підказують конкретні кроки.' },
  { icon: '📚', title: 'Еко-бібліотека', text: 'Перевірені статті та поради про транспорт, їжу, енергію та свідоме споживання.' },
]

const STEPS = [
  { n: 1, title: 'Створіть акаунт', text: 'Реєстрація за 30 секунд. Розрахуйте базовий річний слід у калькуляторі.' },
  { n: 2, title: 'Логуйте щоденні дії', text: 'Швидке додавання активностей або готові пресети у пару кліків.' },
  { n: 3, title: 'Аналізуйте та виконуйте челенджі', text: 'Дивіться графіки, приймайте виклики й отримуйте бали за прогрес.' },
  { n: 4, title: 'Змагайтесь і надихайте інших', text: 'Підіймайтесь у рейтингу, відкривайте досягнення та зменшуйте слід разом.' },
]

const TESTIMONIALS = [
  { text: 'Нарешті зрозуміла, на що йде мій вуглецевий слід. Челенджі реально мотивують — за місяць мінус 14%.', name: 'Олена К.', role: 'Студентка', color: '#52B788' },
  { text: 'Логую поїздки щодня, графіки показують прогрес. Рейтинг із друзями — окремий кайф.', name: 'Андрій Б.', role: 'Інженер', color: '#2D6A4F' },
  { text: 'Зручно, красиво й безкоштовно. Бібліотека статей дала кілька ідей, які я одразу впровадив.', name: 'Марія Т.', role: 'Дизайнерка', color: '#F4A261' },
]

const TEAM = [
  { initials: 'ШД', name: 'Шевченко Даніл', role: 'PM / Frontend' },
  { initials: 'ВН', name: 'Вознюк Назар', role: 'UX/UI / Контент' },
]

export default function Landing() {
  const { authed } = useApp()
  const { open } = useAuthModal()
  const navigate = useNavigate()

  const startCta = () => (authed ? navigate('/app') : open('register'))

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
              <span className="pill-dot pulse" /> Для відповідального майбутнього
            </span>
            <h1 style={{ marginTop: '1.4rem' }}>
              Зменшуй свій <em>вуглецевий слід</em> крок за кроком
            </h1>
            <p>
              GreenTrack відстежує ваші щоденні дії, показує їхній вплив на довкілля та перетворює
              екологію на гру з челенджами, рівнями й рейтингом.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary lg" onClick={startCta}>
                {authed ? 'Відкрити панель →' : 'Почати безкоштовно →'}
              </button>
              <Link className="btn btn-ghost lg" to="/calculator">
                Спробувати калькулятор
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-num">2 400+</div>
                <div className="hero-stat-label">активних користувачів</div>
              </div>
              <div>
                <div className="hero-stat-num">−18%</div>
                <div className="hero-stat-label">середнє скорочення CO₂</div>
              </div>
              <div>
                <div className="hero-stat-num">50+</div>
                <div className="hero-stat-label">еко-порад і статей</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="trust container">
        <span>🚲 Транспорт</span>
        <span>🥗 Харчування</span>
        <span>💡 Енергія</span>
        <span>🛍️ Покупки</span>
        <span>♻️ Відходи</span>
      </div>

      {/* FEATURES */}
      <section className="section tint" id="features">
        <div className="container">
          <div className="section-head">
            <div className="section-tag">Можливості</div>
            <h2>Все для сталого способу життя</h2>
            <p>Від простого логування до глибокої аналітики та гейміфікації — GreenTrack супроводжує вас на кожному кроці.</p>
          </div>
          <div className="feature-grid">
            {FEATURES.map((f) => (
              <div className="card hover feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="howto">
        <div className="container">
          <div className="section-head">
            <div className="section-tag">Як це працює</div>
            <h2>Чотири кроки до зелених звичок</h2>
          </div>
          <div className="steps">
            {STEPS.map((s) => (
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

      {/* TESTIMONIALS */}
      <section className="section tint">
        <div className="container">
          <div className="section-head">
            <div className="section-tag">Відгуки</div>
            <h2>Що кажуть користувачі</h2>
          </div>
          <div className="testi-grid">
            {TESTIMONIALS.map((t) => (
              <div className="card testi-card" key={t.name}>
                <div className="stars">★★★★★</div>
                <p>“{t.text}”</p>
                <div className="testi-author">
                  <span className="avatar" style={{ background: t.color }}>
                    {t.name.split(' ').map((w) => w[0]).join('')}
                  </span>
                  <div>
                    <div className="name">{t.name}</div>
                    <div className="role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="section" id="team">
        <div className="container">
          <div className="section-head">
            <div className="section-tag">Наша команда</div>
            <h2>Хто створив GreenTrack</h2>
            <p>Студентська команда, яка вірить у силу технологій для порятунку планети.</p>
          </div>
          <div className="team-grid">
            {TEAM.map((m) => (
              <div className="card team-card" key={m.name}>
                <span className="avatar lg" style={{ margin: '0 auto 0.7rem' }}>
                  {m.initials}
                </span>
                <div className="name" style={{ fontWeight: 700 }}>{m.name}</div>
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
            <h2>Готові почати свою еко-подорож?</h2>
            <p>Реєстрація безкоштовна. Ваші дані синхронізуються та зберігаються — почніть зменшувати слід уже сьогодні.</p>
            <button className="btn btn-white lg" onClick={startCta}>
              {authed ? 'Перейти до панелі 🌿' : 'Створити акаунт 🌿'}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
