import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'

export default function Layout({ title, children }) {
  const { username, logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="font-display text-xl font-semibold text-ink">{title}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-navy text-white flex items-center justify-center text-sm font-semibold uppercase">
                {username?.[0] ?? 'A'}
              </div>
              <span className="text-sm font-medium text-ink">{username}</span>
            </div>
            <button
              onClick={logout}
              className="text-sm font-medium text-muted hover:text-danger transition-colors px-3 py-1.5 rounded-md border border-border hover:border-danger/30"
            >
              Log out
            </button>
          </div>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
