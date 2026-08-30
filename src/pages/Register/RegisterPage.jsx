import { useState } from 'react'
import Header from '../../components/Header'

function RegisterPage({ user, onLogout, onRegisterSuccess }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')

  const handleSendOtp = (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please check and try again.')
      return
    }
    setError('')
    setStep(2)
  }

  const handleVerifyOtp = (e) => {
    e.preventDefault()
    if (otp.trim() === '000000') {
      setError('')
      const userData = { name: name.trim(), email: email.trim(), phone: phone.trim() }
      if (onRegisterSuccess) {
        onRegisterSuccess(userData)
      } else {
        window.location.hash = '#home'
      }
    } else {
      setError('Invalid OTP code. Use demo OTP: 000000')
    }
  }

  return (
    <div className="page-shell">
      <Header user={user} onLogout={onLogout} />

      <main style={{ padding: '60px 24px 80px', maxWidth: '560px', margin: '0 auto', width: '100%' }}>
        <div className="torn-paper-wrapper">
          <section className="torn-paper">
            <p className="eyebrow">Join the Community</p>
            <h1>{step === 1 ? 'Register Account' : 'Verify Email OTP'}</h1>

            <div className="demo-badge">
              <span>📧 Demo Email OTP:</span>
              <code>000000</code>
            </div>

            {error && <div className="error-message">{error}</div>}

            {step === 1 ? (
              <form onSubmit={handleSendOtp}>
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
                  <label htmlFor="email">Email Address (OTP will be sent here)</label>
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
                    placeholder="e.g. +1 555-0199"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
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
                  <button className="primary-button" type="submit">
                    Send Email OTP <span aria-hidden="true">-&gt;</span>
                  </button>
                  <a className="secondary-button" href="#login">
                    Login
                  </a>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <p style={{ marginBottom: '18px', color: 'var(--ink-soft)', fontSize: '0.94rem' }}>
                  An OTP code has been sent to <strong>{email}</strong> (Demo OTP: <code>000000</code>):
                </p>

                <div className="form-group">
                  <label htmlFor="otp">6-Digit Email OTP</label>
                  <input
                    id="otp"
                    className="form-input"
                    type="text"
                    maxLength="6"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    style={{ letterSpacing: '0.3em', fontSize: '1.2rem', fontWeight: '700' }}
                    required
                  />
                </div>

                <div style={{ marginTop: '28px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button className="primary-button" type="submit">
                    Verify OTP &amp; Register <span aria-hidden="true">-&gt;</span>
                  </button>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => {
                      setStep(1)
                      setError('')
                    }}
                  >
                    Edit Info
                  </button>
                </div>
              </form>
            )}

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
