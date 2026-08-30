import { useEffect, useState } from 'react'
import LandingPage from './pages/Landing/LandingPage'
import HomePage from './pages/Home/HomePage'
import LoginPage from './pages/Login/LoginPage'
import RegisterPage from './pages/Register/RegisterPage'

function App() {
  const [route, setRoute] = useState(() => window.location.hash.replace('#', '') || 'home')
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('demo-user-session')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = '#home'
    }

    const handleHashChange = () => {
      const current = window.location.hash.replace('#', '')
      setRoute(current || 'home')
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleLoginSuccess = (userData) => {
    const session = userData || { name: 'Demo User', email: 'user@example.com' }
    setUser(session)
    localStorage.setItem('demo-user-session', JSON.stringify(session))
    window.location.hash = '#feed'
    setRoute('feed')
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('demo-user-session')
    window.location.hash = '#home'
    setRoute('home')
  }

  if (route === 'login') {
    return <LoginPage user={user} onLogout={handleLogout} onLoginSuccess={handleLoginSuccess} />
  }

  if (route === 'register') {
    return <RegisterPage user={user} onLogout={handleLogout} onRegisterSuccess={handleLoginSuccess} />
  }

  if (route === 'feed' || route === 'items') {
    return <HomePage user={user} onLogout={handleLogout} />
  }

  // Default Landing Page (#home)
  return <LandingPage user={user} onLogout={handleLogout} />
}

export default App
