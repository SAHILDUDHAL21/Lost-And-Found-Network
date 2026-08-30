import { useState } from 'react'
import Header from '../../components/Header'

function LoginPage({ user, onLogout, onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email.trim() && password.trim() === 'pass1') {
      setError('')
      const userData = { name: email.split('@')[0], email: email.trim() }
      if (onLoginSuccess) {
        onLoginSuccess(userData)
      } else {
        window.location.hash = '#home'
      }
    } else {
      setError('Invalid credentials. Demo password is: pass1')
    }
  }

  return (
    <div className="page-shell">
      <Header user={user} onLogout={onLogout} />

      <main style={{ padding: '60px 24px 80px', maxWidth: '560px', margin: '0 auto', width: '100%' }}>
        <div className="torn-paper-wrapper">
          <section className="torn-paper">
            <p className="eyebrow">Account Access</p>
            <h1>Login</h1>

            <div className="demo-badge">
              <span>💡 Demo Login:</span>
              <span>Any Email / Password: <code>pass1</code></span>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  className="form-input"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  className="form-input"
                  type="password"
                  placeholder="Enter password (pass1)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginTop: '28px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button className="primary-button" type="submit">
                  Login <span aria-hidden="true">-&gt;</span>
                </button>
                <a className="secondary-button" href="#register">
                  Register
                </a>
              </div>
            </form>

            <div style={{ marginTop: '28px', paddingTop: '16px', borderTop: '1px dotted var(--notebook-rule)' }}>
              <a href="#home" style={{ color: 'var(--ink-muted)', fontSize: '0.9rem', fontWeight: '700', textDecoration: 'none' }}>
                &larr; Back to Home
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default LoginPage
