import { useState } from 'react'
import Header from '../../components/Header'
import { registerUser } from '../../api/apiService'

function RegisterPage({ user, onLogout, onRegisterSuccess }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.')
      return
    }

    setError('')
    setLoading(true)

    const userData = {
      fullName: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password
    }

    const res = await registerUser(userData)
    setLoading(false)

    if (res && res.success && res.user) {
      if (onRegisterSuccess) {
        onRegisterSuccess(res.user)
      } else {
        window.location.hash = '#feed'
      }
    } else {
      setError(res?.message || 'Registration failed. Email may already be registered.')
    }
  }

  return (
    <div className="page-shell">
      <Header user={user} onLogout={onLogout} />

      <main style={{ padding: '60px 24px 80px', maxWidth: '560px', margin: '0 auto', width: '100%' }}>
        <div className="torn-paper-wrapper">
          <section className="torn-paper">
            <p className="eyebrow">Join the Community</p>
            <h1>Register Account</h1>

            {error && <div className="error-message" style={{ marginBottom: '20px' }}>{error}</div>}

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  className="form-input"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  className="form-input"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  className="form-input"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  className="form-input"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  className="form-input"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginTop: '28px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button className="primary-button" type="submit" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Register Account ->'}
                </button>
                <a className="secondary-button" href="#login">
                  Login Instead
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

export default RegisterPage
