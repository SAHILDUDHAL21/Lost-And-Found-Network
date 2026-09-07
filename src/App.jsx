import { useEffect, useState } from 'react'
import LandingPage from './pages/Landing/LandingPage'
import HomePage from './pages/Home/HomePage'
import LoginPage from './pages/Login/LoginPage'
import RegisterPage from './pages/Register/RegisterPage'
import ProfilePage from './pages/Profile/ProfilePage'
import { verifyToken } from './api/apiService'

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user-session')
    return saved ? JSON.parse(saved) : null
  })

  const [route, setRoute] = useState(() => {
    const hash = window.location.hash.replace('#', '')
    const loggedIn = Boolean(user || localStorage.getItem('jwt-token'))
    if (loggedIn && (hash === 'home' || !hash)) return 'feed'
    return hash || 'home'
  })

  // Restore authenticated session from PostgreSQL via JWT token verification on mount
  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem('jwt-token')
      if (token) {
        const res = await verifyToken(token)
        if (res && res.success && res.user) {
          setUser(res.user)
          localStorage.setItem('user-session', JSON.stringify(res.user))
        }
      }
    }
    restoreSession()
  }, [])

  useEffect(() => {
    // If logged in and attempting to access landing page (#home), automatically route to #feed
    if (user && (window.location.hash === '#home' || !window.location.hash)) {
      window.location.hash = '#feed'
      setRoute('feed')
    } else if (!window.location.hash) {
      window.location.hash = '#home'
    }

    const handleHashChange = () => {
      const current = window.location.hash.replace('#', '')
      if (user && current === 'home') {
        window.location.hash = '#feed'
        setRoute('feed')
      } else {
        setRoute(current || (user ? 'feed' : 'home'))
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [user])

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    localStorage.setItem('user-session', JSON.stringify(userData))
    window.location.hash = '#feed'
    setRoute('feed')
  }

  const handleUpdateUser = (updatedUserData) => {
    setUser(updatedUserData)
    localStorage.setItem('user-session', JSON.stringify(updatedUserData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user-session')
    localStorage.removeItem('jwt-token')
    window.location.hash = '#home'
    setRoute('home')
  }

  if (route === 'login') {
    return <LoginPage user={user} onLogout={handleLogout} onLoginSuccess={handleLoginSuccess} />
  }

  if (route === 'register') {
    return <RegisterPage user={user} onLogout={handleLogout} onRegisterSuccess={handleLoginSuccess} />
  }

  if (route === 'profile') {
    return <ProfilePage user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
  }

  if (user || route === 'feed' || route === 'items') {
    return <HomePage user={user} onLogout={handleLogout} />
  }

  // Default Landing Page (#home) - Only for logged-out visitors
  return <LandingPage user={user} onLogout={handleLogout} />
}

export default App
