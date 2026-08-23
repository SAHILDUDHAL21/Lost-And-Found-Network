import { useEffect, useState } from 'react'
import './HomePage.css'
import { highlights, steps } from './homeData'
import lostFoundItems from '../../assets/lost-found-items.png'

function HomePage() {
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
    <div className="page-shell">
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
          <a className="nav-link" href="#login">
            Login
          </a>
          <a className="nav-button" href="#register">
            Register
          </a>
        </nav>
      </header>

      <main id="home">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">A local lost and found network</p>
            <h1 className="hero-title">
              Find What’s Lost.<br />
              Return What’s Found.
            </h1>
            <p className="hero-text">
              Post what is missing or what you found. We help the right people reconnect.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#register">
                Report an Item <span aria-hidden="true">-&gt;</span>
              </a>
              <a className="secondary-button" href="#how-it-works">
                See How It Works
              </a>
            </div>
          </div>

          <figure className="hero-visual">
            <img src={lostFoundItems} alt="Illustration of keys, a wallet, a transit card, and glasses" />
          </figure>

          <div className="how-section" id="how-it-works">
            <div className="notebook-page-wrapper">
              <div className="notebook-page">
                <div className="section-heading">
                  <p className="eyebrow">How it works</p>
                  <h2>Three steps. One good return.</h2>
                </div>

                <div className="steps-grid">
                  {steps.map((step, index) => (
                    <article className="step-item" key={step}>
                      <span className="step-number">0{index + 1}</span>
                      <p>{step}</p>
                    </article>
                  ))}
                </div>

                <div className="notebook-separator" role="separator" aria-orientation="horizontal" />

                <div className="highlights-grid" aria-label="Key highlights">
                  {highlights.map((item) => (
                    <article className="highlight-item" key={item.title}>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section" id="register">
          <div>
            <p className="eyebrow">Join the network</p>
            <h2>Help something find its way back.</h2>
          </div>

          <div className="cta-actions">
            <a className="primary-button" href="#register">
              Create Account <span aria-hidden="true">-&gt;</span>
            </a>
            <a className="nav-link dark-link" href="#login">
              Already have an account? Login
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomePage
