export type Lang = 'uk' | 'en'

/**
 * Ukrainian → English dictionary for data-driven content
 * (categories, levels, challenges, achievements, chart labels, activity types…).
 * UI chrome strings use the inline t(uk, en) helper instead.
 */
export const EN: Record<string, string> = {
  // categories
  'Транспорт': 'Transport',
  'Енергія': 'Energy',
  'Їжа': 'Food',
  'Покупки': 'Shopping',
  'Інше': 'Other',
  'Компенсація': 'Offsetting',

  // difficulty
  'Легко': 'Easy',
  'Середньо': 'Medium',
  'Складно': 'Hard',

  // levels
  'Паросток': 'Sprout',
  'Саджанець': 'Seedling',
  'Кущ': 'Shrub',
  'Деревце': 'Sapling',
  'Дуб': 'Oak',
  'Гай': 'Grove',
  'Ліс': 'Forest',

  // challenge units
  'днів': 'days',
  'записів': 'entries',
  'поїздок': 'trips',
  'страв': 'meals',
  'кг': 'kg',
  'кг збережено': 'kg saved',
  'запис': 'entry',
  'категорій': 'categories',

  // challenge titles
  'Тиждень дисципліни': 'A week of discipline',
  'Уважний спостерігач': 'Attentive observer',
  'Зелений маршрут': 'Green commute',
  'Рослинний виклик': 'Plant-based challenge',
  'Тримай нижче 300': 'Stay under 300',
  'Енергоощадність': 'Energy saver',
  'Перший крок': 'First step',
  'Повна картина': 'The full picture',

  // challenge descriptions
  'Логуйте активності 7 днів поспіль, щоб виробити звичку.': 'Log activities 7 days in a row to build a habit.',
  'Додайте 20 записів активностей будь-якої категорії.': 'Add 20 activity entries of any category.',
  'Цього тижня залогуйте 5 поїздок велосипедом, пішки або громадським транспортом (≤ 1 кг CO₂).':
    'Log 5 trips this week by bike, on foot, or public transport (≤ 1 kg CO₂).',
  'Залогуйте 7 рослинних страв (категорія «Їжа», ≤ 1.5 кг CO₂).':
    'Log 7 plant-based meals (Food category, ≤ 1.5 kg CO₂).',
  'Утримайте місячні викиди нижче 300 кг CO₂. Прогрес = скільки ще можна витратити.':
    'Keep monthly emissions under 300 kg CO₂. Progress = how much budget is left.',
  'Тримайте сумарні викиди категорії «Енергія» за тиждень нижче 30 кг.':
    'Keep total weekly Energy emissions below 30 kg.',
  'Додайте свою найпершу активність. Кожна подорож починається з кроку!':
    'Add your very first activity. Every journey starts with a step!',
  'Залогуйте активності в усіх 5 категоріях, щоб бачити цілісну картину.':
    'Log activities in all 5 categories to see the full picture.',

  // achievement titles
  'Ласкаво просимо': 'Welcome',
  'Дебют': 'Debut',
  'Аналітик': 'Analyst',
  'Архіваріус': 'Archivist',
  'У потоці': 'In the flow',
  'Залізна звичка': 'Iron habit',
  'Самопізнання': 'Self-knowledge',
  'Рослиноїд': 'Plant eater',
  'Еко-водій': 'Eco rider',
  'Чемпіон челенджів': 'Challenge champion',
  'Виріс до дерева': 'Grown into a tree',
  'Універсал': 'All-rounder',
  'Тонна під контролем': 'A tonne under control',

  // achievement descriptions
  'Створено акаунт у GreenTrack': 'Created a GreenTrack account',
  'Перша залогована активність': 'First logged activity',
  '10 записів активностей': '10 activity entries',
  '50 записів активностей': '50 activity entries',
  'Серія 3 дні поспіль': '3-day streak',
  'Серія 14 днів поспіль': '14-day streak',
  'Розраховано річний слід у калькуляторі': 'Calculated your annual footprint',
  '10 записів у категорії «Їжа»': '10 entries in the Food category',
  '10 зелених поїздок (≤ 1 кг CO₂)': '10 green trips (≤ 1 kg CO₂)',
  'Завершено 3 челенджі': 'Completed 3 challenges',
  'Досягнуто 3 рівня (300+ балів)': 'Reached level 3 (300+ points)',
  'Активності в усіх категоріях': 'Activities in all categories',
  'Відстежено понад 1000 кг CO₂': 'Tracked over 1000 kg CO₂',

  // weekday labels
  'Пн': 'Mon', 'Вт': 'Tue', 'Ср': 'Wed', 'Чт': 'Thu', 'Пт': 'Fri', 'Сб': 'Sat', 'Нд': 'Sun',
  // month labels
  'Січ': 'Jan', 'Лют': 'Feb', 'Бер': 'Mar', 'Кві': 'Apr', 'Тра': 'May', 'Чер': 'Jun',
  'Лип': 'Jul', 'Сер': 'Aug', 'Вер': 'Sep', 'Жов': 'Oct', 'Лис': 'Nov', 'Гру': 'Dec',

  // activity types (factors)
  'Авто (бензин)': 'Car (petrol)',
  'Авто (дизель)': 'Car (diesel)',
  'Авто (електро)': 'Car (electric)',
  'Таксі': 'Taxi',
  'Мотоцикл': 'Motorcycle',
  'Автобус': 'Bus',
  'Метро / трамвай': 'Metro / tram',
  'Потяг': 'Train',
  'Літак': 'Plane',
  'Велосипед / пішки': 'Bike / walking',
  'Електроенергія': 'Electricity',
  'Газ (опалення/готування)': 'Gas (heating/cooking)',
  'Гарячий душ (~10 хв)': 'Hot shower (~10 min)',
  'Прання': 'Laundry',
  'Сушильна машина': 'Tumble dryer',
  'Посудомийка': 'Dishwasher',
  'Кондиціонер': 'Air conditioner',
  'Яловичина': 'Beef',
  'Свинина': 'Pork',
  'Курка': 'Chicken',
  'Риба': 'Fish',
  'Молочне / сир': 'Dairy / cheese',
  'Вегетаріанська страва': 'Vegetarian meal',
  'Веганська страва': 'Vegan meal',
  'Кава': 'Coffee',
  'Фастфуд': 'Fast food',
  'Одяг (річ)': 'Clothing (item)',
  'Взуття (пара)': 'Shoes (pair)',
  'Електроніка': 'Electronics',
  'Книга': 'Book',
  'Доставка посилки': 'Parcel delivery',
  'Сміття без сортування': 'Unsorted waste',
  'Сортування / переробка': 'Sorting / recycling',
  'Компостування': 'Composting',
  'Посадка дерева': 'Planting a tree',

  // factor units
  'км': 'km', 'кВт·год': 'kWh', 'душ': 'shower', 'цикл': 'cycle', 'год': 'h',
  'порція': 'serving', 'чашка': 'cup', 'прийом': 'meal', 'шт': 'pcs', 'пара': 'pair', 'день': 'day',

  // calculator options
  'Громадський транспорт': 'Public transport',
  'Часті авіаперельоти': 'Frequent flights',
  "М'ясоїд": 'Meat-eater',
  'Змішане': 'Mixed',
  'Вегетаріанець': 'Vegetarian',
  'Веган': 'Vegan',
  'Газ / централізоване': 'Gas / district heating',
  'Сонячні панелі': 'Solar panels',
  'Вугілля / мазут': 'Coal / fuel oil',
}

export function translate(s: string, lang: Lang): string {
  if (lang === 'uk') return s
  return EN[s] ?? s
}
