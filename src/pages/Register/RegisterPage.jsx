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
  const [fieldErrors, setFieldErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validateField = (fieldName, currentValues) => {
    const { nameVal, emailVal, phoneVal, passwordVal, confirmPasswordVal } = currentValues
    let err = ''

    if (fieldName === 'name') {
      const trimmed = (nameVal || '').trim()
      if (!trimmed) {
        err = 'Full name is required.'
      } else if (trimmed.length < 2) {
        err = 'Full name must be at least 2 characters long.'
      }
    } else if (fieldName === 'email') {
      const trimmed = (emailVal || '').trim()
      if (!trimmed) {
        err = 'Email address is required.'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        err = 'Please enter a valid email address (e.g. user@example.com).'
      }
    } else if (fieldName === 'phone') {
      const trimmed = (phoneVal || '').trim()
      // Phone is optional: only validate format if user entered a value
      if (trimmed && !/^[0-9+\-\s()]{7,15}$/.test(trimmed)) {
        err = 'Please enter a valid phone number (7 to 15 digits).'
      }
    } else if (fieldName === 'password') {
      if (!passwordVal) {
        err = 'Password is required.'
      } else if (passwordVal.length < 6) {
        err = 'Password must be at least 6 characters long.'
      }
    } else if (fieldName === 'confirmPassword') {
      if (!confirmPasswordVal) {
        err = 'Please confirm your password.'
      } else if (confirmPasswordVal !== passwordVal) {
        err = 'Passwords do not match.'
      }
    }

    return err
  }

  const getValues = () => ({
    nameVal: name,
    emailVal: email,
    phoneVal: phone,
    passwordVal: password,
    confirmPasswordVal: confirmPassword
  })

  const validateForm = () => {
    const vals = getValues()
    const nameErr = validateField('name', vals)
    const emailErr = validateField('email', vals)
    const phoneErr = validateField('phone', vals)
    const passwordErr = validateField('password', vals)
    const confirmPasswordErr = validateField('confirmPassword', vals)

    const errors = {}
    if (nameErr) errors.name = nameErr
    if (emailErr) errors.email = emailErr
    if (phoneErr) errors.phone = phoneErr
    if (passwordErr) errors.password = passwordErr
    if (confirmPasswordErr) errors.confirmPassword = confirmPasswordErr

    setFieldErrors(errors)
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true
    })

    return Object.keys(errors).length === 0
  }

  const handleBlur = (fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }))
    const err = validateField(fieldName, getValues())
    setFieldErrors((prev) => ({ ...prev, [fieldName]: err }))
  }

  const handleNameChange = (e) => {
    const val = e.target.value
    setName(val)
    if (touched.name) {
      setFieldErrors((prev) => ({ ...prev, name: validateField('name', { ...getValues(), nameVal: val }) }))
    }
  }

  const handleEmailChange = (e) => {
    const val = e.target.value
    setEmail(val)
    if (touched.email) {
      setFieldErrors((prev) => ({ ...prev, email: validateField('email', { ...getValues(), emailVal: val }) }))
    }
  }

  const handlePhoneChange = (e) => {
    const val = e.target.value
    setPhone(val)
    if (touched.phone) {
      setFieldErrors((prev) => ({ ...prev, phone: validateField('phone', { ...getValues(), phoneVal: val }) }))
    }
  }

  const handlePasswordChange = (e) => {
    const val = e.target.value
    setPassword(val)
    const currentVals = { ...getValues(), passwordVal: val }
    if (touched.password) {
      setFieldErrors((prev) => ({ ...prev, password: validateField('password', currentVals) }))
    }
    if (touched.confirmPassword || confirmPassword) {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: validateField('confirmPassword', currentVals) }))
    }
  }

  const handleConfirmPasswordChange = (e) => {
    const val = e.target.value
    setConfirmPassword(val)
    if (touched.confirmPassword) {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: validateField('confirmPassword', { ...getValues(), confirmPasswordVal: val }) }))
    }
  }

  const getPasswordStrength = (pwd) => {
    if (!pwd) return null
    if (pwd.length < 6) return { label: 'Weak (min 6 chars)', percent: 33, color: '#dc3545' }
    const hasLetter = /[a-zA-Z]/.test(pwd)
    const hasNumber = /[0-9]/.test(pwd)
    const hasSpecial = /[^a-zA-Z0-9]/.test(pwd)
    if (pwd.length >= 8 && hasLetter && (hasNumber || hasSpecial)) {
      return { label: 'Strong', percent: 100, color: '#28a745' }
    }
    return { label: 'Medium', percent: 66, color: '#ffc107' }
  }

  const strength = getPasswordStrength(password)

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

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

            <form onSubmit={handleRegister} noValidate>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  className={`form-input ${touched.name && fieldErrors.name ? 'has-error' : ''}`}
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={handleNameChange}
                  onBlur={() => handleBlur('name')}
                />
                {touched.name && fieldErrors.name && (
                  <span className="field-error-text">{fieldErrors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  className={`form-input ${touched.email && fieldErrors.email ? 'has-error' : ''}`}
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => handleBlur('email')}
                />
                {touched.email && fieldErrors.email && (
                  <span className="field-error-text">{fieldErrors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number (Optional)</label>
                <input
                  id="phone"
                  className={`form-input ${touched.phone && fieldErrors.phone ? 'has-error' : ''}`}
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={handlePhoneChange}
                  onBlur={() => handleBlur('phone')}
                />
                {touched.phone && fieldErrors.phone && (
                  <span className="field-error-text">{fieldErrors.phone}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  className={`form-input ${touched.password && fieldErrors.password ? 'has-error' : ''}`}
                  type="password"
                  placeholder="Create a password (min. 6 characters)"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => handleBlur('password')}
                />
                {touched.password && fieldErrors.password && (
                  <span className="field-error-text">{fieldErrors.password}</span>
                )}
                {strength && (
                  <div className="password-strength">
                    <div className="password-strength-bar">
                      <div
                        className="password-strength-fill"
                        style={{ width: `${strength.percent}%`, backgroundColor: strength.color }}
                      />
                    </div>
                    <span style={{ color: strength.color, fontSize: '0.8rem' }}>{strength.label}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  className={`form-input ${touched.confirmPassword && fieldErrors.confirmPassword ? 'has-error' : ''}`}
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  onBlur={() => handleBlur('confirmPassword')}
                />
                {touched.confirmPassword && fieldErrors.confirmPassword && (
                  <span className="field-error-text">{fieldErrors.confirmPassword}</span>
                )}
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

