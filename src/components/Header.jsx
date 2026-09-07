import { useEffect, useState } from 'react'

const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%2330281e'/><circle cx='50' cy='40' r='20' fill='%23faf5e9'/><path d='M20,85 C20,65 35,60 50,60 C65,60 80,65 80,85 Z' fill='%23faf5e9'/></svg>"

function Header({ user, onLogout }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme-preference') || 'system')

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'system') {
      root.removeAttribute('data-theme')
    } else {
      root.dataset.theme = theme
    }

    localStorage.setItem('theme-preference', theme)
  }, [theme])

  return (
    <header className="topbar">
      <a className="brand" href={user ? "#feed" : "#home"}>
        <span className="brand-mark">LF</span>
        <span>
          Lost &amp; Found
          <small>Community Network</small>
        </span>
      </a>

      <nav className="nav-actions" aria-label="User actions">
        <div className="theme-switcher" aria-label="Choose color theme">
          <button
            className={theme === 'light' ? 'theme-button is-active' : 'theme-button'}
            type="button"
            onClick={() => setTheme('light')}
            aria-pressed={theme === 'light'}
          >
            Light
          </button>
          <button
            className={theme === 'dark' ? 'theme-button is-active' : 'theme-button'}
            type="button"
            onClick={() => setTheme('dark')}
            aria-pressed={theme === 'dark'}
          >
            Dark
          </button>
          <button
            className={theme === 'system' ? 'theme-button is-active' : 'theme-button'}
            type="button"
            onClick={() => setTheme('system')}
            aria-pressed={theme === 'system'}
          >
            Device
          </button>
        </div>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <a
              href="#profile"
              className="nav-profile-link"
              title={`View Profile (${user.fullName || user.name || user.email})`}
              style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <img
                src={user.avatar || DEFAULT_AVATAR}
                alt="User Profile"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--border)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                  cursor: 'pointer'
                }}
              />
            </a>
            <button className="secondary-button" type="button" onClick={onLogout} style={{ minHeight: '36px', padding: '6px 14px', fontSize: '0.8rem' }}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <a className="nav-link" href="#login">
              Login
            </a>
            <a className="nav-button" href="#register">
              Register
            </a>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header
