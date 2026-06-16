import { useState, type ReactNode } from 'react'

export interface TabDef {
  id: string
  label: ReactNode
  render: () => ReactNode
}

export function Tabs({ tabs, initial }: { tabs: TabDef[]; initial?: string }) {
  const [active, setActive] = useState(initial ?? tabs[0]?.id)
  const current = tabs.find((t) => t.id === active) ?? tabs[0]

  return (
    <>
      <div className="segmented" style={{ marginBottom: '1.4rem' }}>
        {tabs.map((t) => (
          <button key={t.id} className={active === t.id ? 'active' : ''} onClick={() => setActive(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="tab-fade" key={active}>
        {current?.render()}
      </div>
    </>
  )
}
