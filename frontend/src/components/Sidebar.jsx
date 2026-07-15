import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '\u25A6' },
  { to: '/students', label: 'Students', icon: '\u25A4' },
  { to: '/companies', label: 'Companies', icon: '\u25A2' },
  { to: '/applications', label: 'Applications', icon: '\u21C4' },
  { to: '/reports', label: 'Reports', icon: '\u25B7' },
]

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 bg-navy text-white flex flex-col h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-white/10">
        <p className="font-display text-xl font-semibold tracking-tight">Placement<span className="text-gold-light">Tracker</span></p>
        <p className="text-xs text-white/50 mt-1">JECRC University</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-white/10 text-xs text-white/40">
        &copy; {new Date().getFullYear()} Placement Cell
      </div>
    </aside>
  )
}
