import axios from 'axios'

// One shared axios instance for the whole app. Every API call goes through
// this, so token attachment and error handling are written ONCE here instead
// of being repeated in every component that makes a request.
const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// REQUEST interceptor: runs before every outgoing request.
// Reads the JWT we stored at login time and attaches it as
// "Authorization: Bearer <token>" so the backend's JwtAuthFilter can verify it.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// RESPONSE interceptor: runs after every response comes back.
// If the backend says 401 (Unauthorized) - meaning the token is missing,
// expired, or invalid - we clear it and send the user back to the login page,
// instead of leaving them stuck on a broken screen.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default axiosClient
