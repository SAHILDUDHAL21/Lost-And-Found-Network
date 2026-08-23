function RegisterPage() {
  return (
    <div className="page-shell">
      <main style={{ padding: '60px 24px', maxWidth: '640px', margin: '0 auto' }}>
        <div className="torn-paper-wrapper">
          <section className="torn-paper">
            <p className="eyebrow">Join the community</p>
            <h1>Register</h1>
            <p style={{ marginTop: '12px', color: 'var(--ink-soft)' }}>
              Create an account to report lost or found items and help reconnect people with what matters.
            </p>
            <div style={{ marginTop: '28px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <a className="primary-button" href="#home">
                Back to Home <span aria-hidden="true">-&gt;</span>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default RegisterPage

