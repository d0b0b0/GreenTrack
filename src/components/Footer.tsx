import { Link } from 'react-router-dom'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Logo />
            <p className="footer-about">
              GreenTrack допомагає відстежувати щоденні дії, розуміти їхній вплив на клімат і
              крок за кроком зменшувати свій вуглецевий слід.
            </p>
          </div>
          <div className="footer-col">
            <h4>Продукт</h4>
            <Link to="/app">Панель</Link>
            <Link to="/calculator">Калькулятор</Link>
            <Link to="/app/challenges">Челенджі</Link>
            <Link to="/app/leaderboard">Рейтинг</Link>
            <Link to="/app/library">Бібліотека</Link>
          </div>
          <div className="footer-col">
            <h4>Проєкт</h4>
            <a href="/#features">Можливості</a>
            <a href="/#howto">Як це працює</a>
            <a href="/#team">Команда</a>
            <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} GreenTrack. Студентський проєкт · НУБіП України</span>
          <span>Зроблено з 💚 для екологічного майбутнього</span>
        </div>
      </div>
    </footer>
  )
}
