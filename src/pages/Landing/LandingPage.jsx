import Header from '../../components/Header'
import lostFoundItems from '../../assets/lost-found-items.png'
import { highlights, steps } from '../Home/homeData'

function LandingPage({ user, onLogout }) {
  return (
    <div className="page-shell">
      <Header user={user} onLogout={onLogout} />

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

            {/* 3 Main Action Options */}
            <div className="hero-actions">
              <div className="hero-actions-row">
                <a className="primary-button" href="#login">
                  Login <span aria-hidden="true">-&gt;</span>
                </a>
                <a className="nav-link" href="#register">
                  Register
                </a>
              </div>
              <a className="secondary-button" href="#feed">
                View Items Without Login &rarr;
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
            <a className="primary-button" href="#feed">
              Browse Items &rarr;
            </a>
            <a className="dark-link" href="#login">
              Already have an account? Login
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}

export default LandingPage

