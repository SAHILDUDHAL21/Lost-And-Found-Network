import { useState } from 'react'
import Header from '../../components/Header'
import { loginUser } from '../../api/apiService'

function LoginPage({ user, onLogout, onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await loginUser({ email: email.trim(), password })
    setLoading(false)

    if (res && res.success && res.user) {
      if (onLoginSuccess) onLoginSuccess(res.user)
    } else {
      setError(res?.message || 'Invalid email or password. Please try again or register a new account.')
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

            {error && <div className="error-message" style={{ marginBottom: '20px' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  className="form-input"
                  type="email"
                  placeholder="Enter your registered email"
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginTop: '28px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button className="primary-button" type="submit" disabled={loading}>
                  {loading ? 'Authenticating...' : 'Login ->'}
                </button>
                <a className="secondary-button" href="#register">
                  Register Account
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
