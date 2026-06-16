import type { Category } from '../types'
import { round1 } from './format'

/**
 * Emission factors so users log a real activity + quantity and we compute CO₂.
 * `perUnit` = kg CO₂e per 1 unit (approximate, реалістичні орієнтири).
 */
export interface FactorDef {
  id: string
  label: string
  icon: string
  category: Category
  unit: string // одиниця кількості (км, порція, кВт·год…)
  perUnit: number // кг CO₂ за одиницю
  def: number // типова кількість за замовчуванням
  step: number
}

export const FACTORS: FactorDef[] = [
  // ── Транспорт (на км) ──
  { id: 'car-petrol', label: 'Авто (бензин)', icon: '🚗', category: 'Транспорт', unit: 'км', perUnit: 0.21, def: 10, step: 1 },
  { id: 'car-diesel', label: 'Авто (дизель)', icon: '🚙', category: 'Транспорт', unit: 'км', perUnit: 0.17, def: 10, step: 1 },
  { id: 'car-electric', label: 'Авто (електро)', icon: '🔋', category: 'Транспорт', unit: 'км', perUnit: 0.05, def: 10, step: 1 },
  { id: 'taxi', label: 'Таксі', icon: '🚕', category: 'Транспорт', unit: 'км', perUnit: 0.21, def: 8, step: 1 },
  { id: 'motorcycle', label: 'Мотоцикл', icon: '🏍️', category: 'Транспорт', unit: 'км', perUnit: 0.11, def: 10, step: 1 },
  { id: 'bus', label: 'Автобус', icon: '🚌', category: 'Транспорт', unit: 'км', perUnit: 0.10, def: 10, step: 1 },
  { id: 'metro', label: 'Метро / трамвай', icon: '🚇', category: 'Транспорт', unit: 'км', perUnit: 0.04, def: 10, step: 1 },
  { id: 'train', label: 'Потяг', icon: '🚆', category: 'Транспорт', unit: 'км', perUnit: 0.04, def: 50, step: 5 },
  { id: 'plane', label: 'Літак', icon: '✈️', category: 'Транспорт', unit: 'км', perUnit: 0.25, def: 500, step: 50 },
  { id: 'bike', label: 'Велосипед / пішки', icon: '🚲', category: 'Транспорт', unit: 'км', perUnit: 0, def: 5, step: 1 },

  // ── Енергія ──
  { id: 'electricity', label: 'Електроенергія', icon: '💡', category: 'Енергія', unit: 'кВт·год', perUnit: 0.33, def: 5, step: 1 },
  { id: 'gas', label: 'Газ (опалення/готування)', icon: '🔥', category: 'Енергія', unit: 'кВт·год', perUnit: 0.20, def: 10, step: 1 },
  { id: 'shower', label: 'Гарячий душ (~10 хв)', icon: '🚿', category: 'Енергія', unit: 'душ', perUnit: 0.5, def: 1, step: 1 },
  { id: 'laundry', label: 'Прання', icon: '🧺', category: 'Енергія', unit: 'цикл', perUnit: 0.6, def: 1, step: 1 },
  { id: 'dryer', label: 'Сушильна машина', icon: '🌀', category: 'Енергія', unit: 'цикл', perUnit: 1.8, def: 1, step: 1 },
  { id: 'dishwasher', label: 'Посудомийка', icon: '🍽️', category: 'Енергія', unit: 'цикл', perUnit: 0.8, def: 1, step: 1 },
  { id: 'ac', label: 'Кондиціонер', icon: '❄️', category: 'Енергія', unit: 'год', perUnit: 0.5, def: 2, step: 1 },

  // ── Їжа (на порцію) ──
  { id: 'beef', label: 'Яловичина', icon: '🥩', category: 'Їжа', unit: 'порція', perUnit: 6.0, def: 1, step: 1 },
  { id: 'pork', label: 'Свинина', icon: '🍖', category: 'Їжа', unit: 'порція', perUnit: 1.5, def: 1, step: 1 },
  { id: 'chicken', label: 'Курка', icon: '🍗', category: 'Їжа', unit: 'порція', perUnit: 1.2, def: 1, step: 1 },
  { id: 'fish', label: 'Риба', icon: '🐟', category: 'Їжа', unit: 'порція', perUnit: 1.5, def: 1, step: 1 },
  { id: 'dairy', label: 'Молочне / сир', icon: '🧀', category: 'Їжа', unit: 'порція', perUnit: 0.6, def: 1, step: 1 },
  { id: 'veg', label: 'Вегетаріанська страва', icon: '🥗', category: 'Їжа', unit: 'порція', perUnit: 0.7, def: 1, step: 1 },
  { id: 'vegan', label: 'Веганська страва', icon: '🥦', category: 'Їжа', unit: 'порція', perUnit: 0.4, def: 1, step: 1 },
  { id: 'coffee', label: 'Кава', icon: '☕', category: 'Їжа', unit: 'чашка', perUnit: 0.4, def: 1, step: 1 },
  { id: 'fastfood', label: 'Фастфуд', icon: '🍔', category: 'Їжа', unit: 'прийом', perUnit: 2.5, def: 1, step: 1 },

  // ── Покупки ──
  { id: 'clothing', label: 'Одяг (річ)', icon: '👕', category: 'Покупки', unit: 'шт', perUnit: 7, def: 1, step: 1 },
  { id: 'shoes', label: 'Взуття (пара)', icon: '👟', category: 'Покупки', unit: 'пара', perUnit: 12, def: 1, step: 1 },
  { id: 'electronics', label: 'Електроніка', icon: '📱', category: 'Покупки', unit: 'шт', perUnit: 30, def: 1, step: 1 },
  { id: 'book', label: 'Книга', icon: '📕', category: 'Покупки', unit: 'шт', perUnit: 1, def: 1, step: 1 },
  { id: 'delivery', label: 'Доставка посилки', icon: '📦', category: 'Покупки', unit: 'шт', perUnit: 0.5, def: 1, step: 1 },

  // ── Інше (від'ємні = екодія) ──
  { id: 'waste', label: 'Сміття без сортування', icon: '🗑️', category: 'Інше', unit: 'день', perUnit: 1.0, def: 1, step: 1 },
  { id: 'recycle', label: 'Сортування / переробка', icon: '♻️', category: 'Інше', unit: 'день', perUnit: -0.5, def: 1, step: 1 },
  { id: 'compost', label: 'Компостування', icon: '🍂', category: 'Інше', unit: 'день', perUnit: -0.3, def: 1, step: 1 },
  { id: 'plant-tree', label: 'Посадка дерева', icon: '🌳', category: 'Інше', unit: 'шт', perUnit: -10, def: 1, step: 1 },
]

export function factorById(id: string): FactorDef | undefined {
  return FACTORS.find((f) => f.id === id)
}

export function factorsByCategory(category: Category): FactorDef[] {
  return FACTORS.filter((f) => f.category === category)
}

export function computeCo2(factor: FactorDef, quantity: number): number {
  return round1(factor.perUnit * quantity)
}

/** Popular one-tap presets (derived from factors with sensible quantities). */
export const QUICK_PRESETS: { factorId: string; quantity: number }[] = [
  { factorId: 'car-petrol', quantity: 10 },
  { factorId: 'bus', quantity: 10 },
  { factorId: 'bike', quantity: 5 },
  { factorId: 'beef', quantity: 1 },
  { factorId: 'vegan', quantity: 1 },
  { factorId: 'coffee', quantity: 1 },
  { factorId: 'electricity', quantity: 5 },
  { factorId: 'recycle', quantity: 1 },
]
