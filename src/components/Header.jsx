import { useEffect, useState } from 'react'

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
      <a className="brand" href="#home">
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-h)' }}>
              👤 {user.name || user.email}
            </span>
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
