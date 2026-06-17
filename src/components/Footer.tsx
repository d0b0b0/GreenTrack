import { Link } from 'react-router-dom'
import { useLang } from '../context/LangProvider'
import { Logo } from './Logo'

export function Footer() {
  const { t } = useLang()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Logo />
            <p className="footer-about">
              {t(
                'GreenTrack допомагає відстежувати щоденні дії, розуміти їхній вплив на клімат і крок за кроком зменшувати свій вуглецевий слід.',
                'GreenTrack helps you track daily actions, understand their climate impact, and reduce your carbon footprint step by step.',
              )}
            </p>
          </div>
          <div className="footer-col">
            <h4>{t('Продукт', 'Product')}</h4>
            <Link to="/app">{t('Панель', 'Dashboard')}</Link>
            <a href="/#calculator">{t('Калькулятор', 'Calculator')}</a>
            <Link to="/app/community">{t('Спільнота', 'Community')}</Link>
            <Link to="/app/library">{t('Бібліотека', 'Library')}</Link>
          </div>
          <div className="footer-col">
            <h4>{t('Проєкт', 'Project')}</h4>
            <a href="/#features">{t('Можливості', 'Features')}</a>
            <a href="/#howto">{t('Як це працює', 'How it works')}</a>
            <a href="/#team">{t('Команда', 'Team')}</a>
            <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} GreenTrack. {t('Студентський проєкт · НУБіП України', 'Student project · NUBiP of Ukraine')}</span>
          <span>{t('Зроблено з 💚 для екологічного майбутнього', 'Made with 💚 for a greener future')}</span>
        </div>
      </div>
    </footer>
  )
}
