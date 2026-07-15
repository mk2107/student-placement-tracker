import { createContext, useContext, useState } from 'react'
import axiosClient from '../api/axiosClient'

const AuthContext = createContext(null)

// This is React's way of sharing state (here: "who is logged in?") between
// components that aren't directly nested inside each other, without passing
// props down through every intermediate layer ("prop drilling").
export function AuthProvider({ children }) {
  const [username, setUsername] = useState(() => localStorage.getItem('username'))
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const login = async (loginUsername, password) => {
    const response = await axiosClient.post('/auth/login', { username: loginUsername, password })
    const { token: newToken, username: returnedUsername } = response.data.data

    localStorage.setItem('token', newToken)
    localStorage.setItem('username', returnedUsername)
    setToken(newToken)
    setUsername(returnedUsername)
  }

  const logout = async () => {
    try {
      await axiosClient.post('/auth/logout')
    } catch {
      // Even if the network call fails, we still clear local state below -
      // logout should always work from the user's point of view.
    }
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setToken(null)
    setUsername(null)
  }

  const isAuthenticated = Boolean(token)

  return (
    <AuthContext.Provider value={{ username, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook - lets any component say `const { username, logout } = useAuth()`
// instead of importing useContext + AuthContext every time.
export function useAuth() {
  return useContext(AuthContext)
}
