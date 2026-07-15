import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-3xl font-semibold text-white">
            Placement<span className="text-gold-light">Tracker</span>
          </p>
          <p className="text-white/50 text-sm mt-2">Admin sign in &middot; JECRC University</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface rounded-xl shadow-card p-7">
          {error && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-danger-bg text-danger text-sm">{error}</div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-ink mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm focus:border-navy transition-colors"
              placeholder="admin"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm focus:border-navy transition-colors"
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy text-white font-medium py-2.5 rounded-lg hover:bg-navy-light transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="mt-4 text-xs text-muted text-center">
            First run? Default login is <span className="font-mono">admin</span> / <span className="font-mono">Admin@123</span>
          </p>
        </form>
      </div>
    </div>
  )
}
