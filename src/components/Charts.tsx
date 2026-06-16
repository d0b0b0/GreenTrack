import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from '../context/ThemeProvider'
import { CATEGORY_META } from '../lib/carbon'
import { round1 } from '../lib/format'
import type { Category } from '../types'

function useTick() {
  const { theme } = useTheme()
  return theme === 'dark' ? '#7c9b8a' : '#7c9286'
}

const tooltipStyle = (dark: boolean) => ({
  background: dark ? '#14211a' : '#fff',
  border: `1px solid ${dark ? 'rgba(116,198,157,0.28)' : 'rgba(45,106,79,0.18)'}`,
  borderRadius: 12,
  fontSize: 13,
  color: dark ? '#e9f4ec' : '#14241b',
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
})

export function WeeklyBars({ labels, totals, todayIdx }: { labels: string[]; totals: number[]; todayIdx: number }) {
  const { theme } = useTheme()
  const tick = useTick()
  const data = labels.map((label, i) => ({ label, co2: round1(totals[i]), active: i === todayIdx }))
  return (
    <div className="chart-box sm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 6, right: 4, left: -22, bottom: 0 }}>
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: tick }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: tick }} axisLine={false} tickLine={false} width={42} />
          <Tooltip
            cursor={{ fill: 'rgba(82,183,136,0.1)' }}
            contentStyle={tooltipStyle(theme === 'dark')}
            formatter={(v: number) => [`${v} кг`, 'CO₂']}
          />
          <Bar dataKey="co2" radius={[6, 6, 0, 0]} maxBarSize={34}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.active ? '#2D6A4F' : '#74C69D'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SourceDonut({ totals }: { totals: Record<Category, number> }) {
  const { theme } = useTheme()
  const entries = (Object.entries(totals) as [Category, number][]).filter(([, v]) => v > 0)
  const sum = entries.reduce((s, [, v]) => s + v, 0)
  if (sum <= 0) {
    return <div className="empty"><span className="emoji">🥧</span>Ще немає даних для діаграми</div>
  }
  const data = entries.map(([cat, v]) => ({ name: cat, value: round1(v), color: CATEGORY_META[cat].color }))
  return (
    <div>
      <div className="chart-box sm">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="92%" paddingAngle={2} stroke="none">
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle(theme === 'dark')}
              formatter={(v: number, n: string) => [`${v} кг (${Math.round((v / sum) * 100)}%)`, n]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-legend">
        {data.map((d) => (
          <span className="legend-item" key={d.name}>
            <span className="legend-dot" style={{ background: d.color }} />
            {d.name} {Math.round((d.value / sum) * 100)}%
          </span>
        ))}
      </div>
    </div>
  )
}

export function TrendArea({ data }: { data: { label: string; total: number }[] }) {
  const { theme } = useTheme()
  const tick = useTick()
  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#52B788" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#52B788" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: tick }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: tick }} axisLine={false} tickLine={false} width={44} />
          <Tooltip
            contentStyle={tooltipStyle(theme === 'dark')}
            formatter={(v: number) => [`${v} кг`, 'CO₂']}
          />
          <Area type="monotone" dataKey="total" stroke="#2D6A4F" strokeWidth={2.5} fill="url(#grad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
