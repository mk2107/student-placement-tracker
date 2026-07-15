import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Wraps any page that requires login. If there's no valid session,
// it redirects to /login instead of rendering the protected page.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
