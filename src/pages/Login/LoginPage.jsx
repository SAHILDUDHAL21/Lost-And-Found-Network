import { useState } from 'react'
import Header from '../../components/Header'
import { loginUser } from '../../api/apiService'

function LoginPage({ user, onLogout, onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validateField = (name, value) => {
    let err = ''
    if (name === 'email') {
      const trimmed = value.trim()
      if (!trimmed) {
        err = 'Email address is required.'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        err = 'Please enter a valid email address (e.g. user@example.com).'
      }
    } else if (name === 'password') {
      if (!value) {
        err = 'Password is required.'
      } else if (value.length < 6) {
        err = 'Password must be at least 6 characters long.'
      }
    }
    return err
  }

  const validateForm = () => {
    const emailErr = validateField('email', email)
    const passwordErr = validateField('password', password)
    const errors = {}
    if (emailErr) errors.email = emailErr
    if (passwordErr) errors.password = passwordErr

    setFieldErrors(errors)
    setTouched({ email: true, password: true })

    return Object.keys(errors).length === 0
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const val = field === 'email' ? email : password
    const err = validateField(field, val)
    setFieldErrors((prev) => ({ ...prev, [field]: err }))
  }

  const handleEmailChange = (e) => {
    const val = e.target.value
    setEmail(val)
    if (touched.email) {
      setFieldErrors((prev) => ({ ...prev, email: validateField('email', val) }))
    }
  }

  const handlePasswordChange = (e) => {
    const val = e.target.value
    setPassword(val)
    if (touched.password) {
      setFieldErrors((prev) => ({ ...prev, password: validateField('password', val) }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

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

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  className={`form-input ${touched.email && fieldErrors.email ? 'has-error' : ''}`}
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => handleBlur('email')}
                />
                {touched.email && fieldErrors.email && (
                  <span className="field-error-text">{fieldErrors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  className={`form-input ${touched.password && fieldErrors.password ? 'has-error' : ''}`}
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => handleBlur('password')}
                />
                {touched.password && fieldErrors.password && (
                  <span className="field-error-text">{fieldErrors.password}</span>
                )}
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

