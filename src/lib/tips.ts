import type { Activity, Category } from '../types'
import { monthlyTotal, sourceTotals } from './carbon'
import { translate, type Lang } from './i18n'

/** Personalised tips derived from the user's data (lightweight "AI"). */
export function personalTips(log: Activity[], goal: number, lang: Lang = 'uk'): { icon: string; text: string }[] {
  const p = (uk: string, en: string) => (lang === 'en' ? en : uk)
  if (log.length === 0) {
    return [
      { icon: '🌿', text: p('Додайте першу активність, щоб отримати персональні поради.', 'Add your first activity to get personalised tips.') },
      { icon: '🚲', text: p('Спробуйте замінити коротку поїздку авто на велосипед чи пішу прогулянку.', 'Try swapping a short car trip for a bike ride or a walk.') },
      { icon: '🧮', text: p('Скористайтесь калькулятором, щоб дізнатися свій річний слід.', 'Use the calculator to find out your annual footprint.') },
    ]
  }
  const totals = sourceTotals(log)
  const top = (Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Інше') as Category
  const byCat: Record<Category, { icon: string; text: string }> = {
    'Транспорт': { icon: '🚗', text: p('Транспорт — ваше головне джерело викидів. Об’єднуйте поїздки, пересідайте на громадський транспорт або велосипед.', 'Transport is your biggest emissions source. Combine trips, switch to public transport or a bike.') },
    'Енергія': { icon: '💡', text: p('Багато викидів від енергії. Знижуйте температуру на 1°C, переходьте на LED та вимикайте прилади з режиму очікування.', 'Lots of emissions from energy. Lower the temperature by 1°C, switch to LED, and turn off standby devices.') },
    'Їжа': { icon: '🥗', text: p('Харчування дає помітний слід. Додайте 2–3 рослинні дні на тиждень і плануйте покупки, щоб менше викидати їжу.', 'Food has a noticeable footprint. Add 2–3 plant-based days a week and plan shopping to waste less food.') },
    'Покупки': { icon: '🛍️', text: p('Покупки накопичують слід. Обирайте довговічні речі, секондхенд та об’єднуйте доставки.', 'Shopping adds up. Choose durable items, second-hand, and combine deliveries.') },
    'Інше': { icon: '♻️', text: p('Сортуйте відходи та зменшуйте одноразовий пластик — це швидкі перемоги.', 'Sort waste and cut single-use plastic — these are quick wins.') },
  }
  const tips = [byCat[top]]
  const monthly = monthlyTotal(log)
  const topName = translate(top, lang)
  if (monthly > goal) {
    tips.push({ icon: '🎯', text: p(`Ви перевищили місячну ціль (${goal} кг). Сфокусуйтесь на «${topName}» наступного тижня.`, `You exceeded your monthly goal (${goal} kg). Focus on "${topName}" next week.`) })
  } else {
    tips.push({ icon: '✅', text: p(`Чудово — ви в межах місячної цілі. Залишилось ${Math.round(goal - monthly)} кг бюджету.`, `Great — you're within your monthly goal. ${Math.round(goal - monthly)} kg of budget left.`) })
  }
  tips.push({ icon: '🔥', text: p('Логуйте щодня — навіть дрібниці. Регулярність важливіша за ідеальність.', 'Log every day — even small things. Consistency beats perfection.') })
  return tips
}

/** Static knowledge base — eco articles for the Library. */
export interface Article {
  id: string
  emoji: string
  cover: string // background gradient
  category: string
  title: string
  excerpt: string
  readMins: number
  body: string[]
}

export const ARTICLES: Article[] = [
  {
    id: 'transport-basics',
    emoji: '🚗',
    cover: 'linear-gradient(135deg,#2D6A4F,#52B788)',
    category: 'Транспорт',
    title: 'Як зменшити викиди від пересування',
    excerpt: 'Транспорт — до 40% особистого сліду. Розбираємо, що реально працює.',
    readMins: 4,
    body: [
      'Особистий автомобіль із ДВЗ — один із найбільших джерел викидів пересічної людини. Перехід на громадський транспорт усього для половини поїздок може скоротити транспортний слід на 25–35%.',
      'Короткі поїздки (до 3 км) найбільш «брудні» на кілометр через холодний двигун. Саме їх найлегше замінити велосипедом або ходьбою — і це ще й корисно для здоров’я.',
      'Якщо плануєте заміну авто — електромобіль на українському електроміксі все одно виграє у бензинового вже за 2–3 роки експлуатації.',
      'Авіапереліт на 1 годину додає ~90 кг CO₂ на пасажира. Для близьких відстаней потяг у рази екологічніший.',
    ],
  },
  {
    id: 'plant-diet',
    emoji: '🥦',
    cover: 'linear-gradient(135deg,#40916C,#74C69D)',
    category: 'Їжа',
    title: 'Рослинні дні: маленька зміна — великий ефект',
    excerpt: 'Не обов’язково ставати веганом. Навіть 2 дні на тиждень дають результат.',
    readMins: 3,
    body: [
      'Виробництво яловичини дає у ~10–20 разів більше викидів на кілограм, ніж бобові чи овочі, через метан і витрати землі.',
      'Заміна м’яса на рослинні білки лише двічі на тиждень знижує харчовий слід приблизно на 15%.',
      'Сезонні та локальні продукти зменшують «транспортний» слід їжі. Заморожені овоча часто екологічніші за «свіжі» з-за кордону.',
      'Чверть усієї виробленої їжі викидається. Планування меню та правильне зберігання — найдешевший спосіб зменшити слід.',
    ],
  },
  {
    id: 'home-energy',
    emoji: '🏠',
    cover: 'linear-gradient(135deg,#1B4332,#40916C)',
    category: 'Енергія',
    title: 'Енергоефективний дім без ремонту',
    excerpt: 'Прості кроки, що знижують рахунки і викиди вже цього тижня.',
    readMins: 5,
    body: [
      'Зниження температури опалення на 1°C економить близько 6–7% енергії на опалення за сезон.',
      'LED-лампи споживають у ~5 разів менше за лампи розжарювання та служать роками.',
      'Прилади в режимі очікування («фантомне» споживання) можуть давати до 10% рахунку за електрику. Подовжувач із вимикачем вирішує проблему.',
      'Прання у холодній воді та сушка на повітрі замість машини помітно зменшують слід прання.',
    ],
  },
  {
    id: 'fast-fashion',
    emoji: '👕',
    cover: 'linear-gradient(135deg,#F4A261,#E9C46A)',
    category: 'Покупки',
    title: 'Свідоме споживання та fast fashion',
    excerpt: 'Текстиль — близько 8% світових викидів. Як купувати розумніше.',
    readMins: 4,
    body: [
      'Виробництво однієї бавовняної футболки потребує тисяч літрів води та дає кілька кілограмів CO₂.',
      'Принцип «купуй менше, але якісніше» працює: річ, що служить удвічі довше, удвічі зменшує слід на рік носіння.',
      'Секондхенд і ресейл подовжують життя речей і уникають викидів нового виробництва.',
      'Догляд теж важливий: прання при нижчій температурі та рідша сушка зберігають одяг довше.',
    ],
  },
  {
    id: 'recycling',
    emoji: '♻️',
    cover: 'linear-gradient(135deg,#52B788,#74C69D)',
    category: 'Інше',
    title: 'Сортування, що має сенс',
    excerpt: 'Не все, що здається переробним, переробляється. Розставляємо пріоритети.',
    readMins: 3,
    body: [
      'Ієрархія відходів: спершу зменшити (reduce), потім повторно використати (reuse), і лише потім переробити (recycle).',
      'Найбільший ефект дає відмова від одноразового пластику — багаторазова пляшка та сумка окупаються за тижні.',
      'Органіку можна компостувати навіть у місті — це зменшує метан зі звалищ.',
      'Чистота сировини критична: брудна упаковка часто псує цілу партію переробки.',
    ],
  },
  {
    id: 'offset',
    emoji: '🌳',
    cover: 'linear-gradient(135deg,#2D6A4F,#1B4332)',
    category: 'Компенсація',
    title: 'Компенсація викидів: коли і як',
    excerpt: 'Offset — не індульгенція, а доповнення до реальних скорочень.',
    readMins: 4,
    body: [
      'Спершу скорочуйте, потім компенсуйте те, що скоротити неможливо. Компенсація без скорочень неефективна.',
      'Висаджування дерев працює на довгій дистанції: одне дерево поглинає десятки кг CO₂ на рік, але лише з часом.',
      'Обирайте сертифіковані проєкти (Gold Standard, VCS), щоб компенсація була реальною та перевіреною.',
      'Локальні ініціативи озеленення — гарний спосіб поєднати компенсацію з користю для своєї громади.',
    ],
  },
]

export function articleById(id: string): Article | undefined {
  return ARTICLES.find((a) => a.id === id)
}
