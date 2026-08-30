import { useState } from 'react'
import Header from '../../components/Header'
import { samplePosts, scammerLeaderboard } from './homeData'
import './HomePage.css'

function HomePage({ user, onLogout }) {
  const [posts, setPosts] = useState(samplePosts)
  const [activeClaimPostId, setActiveClaimPostId] = useState(null)
  const [claimNote, setClaimNote] = useState('')
  const [claimantName, setClaimantName] = useState('')
  const [commentInputs, setCommentInputs] = useState({})

  // Authentication prompt modal state
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authActionReason, setAuthActionReason] = useState('')

  // New Post Modal State (Only FOUND items can be reported!)
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostLocation, setNewPostLocation] = useState('')
  const [newPostDesc, setNewPostDesc] = useState('')

  // Mobile Drawer State
  const [showDrawer, setShowDrawer] = useState(false)

  // Guard action for authenticated users
  const requireAuth = (reasonText, actionCallback) => {
    if (!user) {
      setAuthActionReason(reasonText)
      setShowAuthModal(true)
      return false
    }
    if (actionCallback) actionCallback()
    return true
  }

  // Handle adding a new comment
  const handleAddComment = (postId, e) => {
    e.preventDefault()
    if (!requireAuth('leave a comment')) return

    const text = commentInputs[postId]?.trim()
    if (!text) return

    const newComment = {
      id: `c-${Date.now()}`,
      user: user.name || user.email || 'Community Member',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email || 'CurrentUser')}`,
      time: 'Just now',
      text
    }

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    )

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }))
  }

  // Handle submitting ownership claim
  const handleSubmitClaim = (postId, e) => {
    e.preventDefault()
    if (!requireAuth('claim ownership')) return
    if (!claimNote.trim()) return

    const newClaim = {
      id: `claim-${Date.now()}`,
      user: claimantName.trim() || user.name || user.email || 'Claimant',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email || 'Claimant')}`,
      time: 'Just now',
      status: 'PENDING_VERIFICATION',
      note: claimNote.trim()
    }

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, claims: [newClaim, ...post.claims] }
          : post
      )
    )

    setActiveClaimPostId(null)
    setClaimNote('')
    setClaimantName('')
  }

  // Handle opening Claim Form
  const handleToggleClaimForm = (postId) => {
    if (!requireAuth('claim ownership of an item')) return
    setActiveClaimPostId(activeClaimPostId === postId ? null : postId)
  }

  // Handle opening New Post Modal
  const handleOpenNewPostModal = () => {
    if (!requireAuth('report a found item')) return
    setShowNewPostModal(true)
  }

  // Handle creating a new Found post (Only Found Items allowed!)
  const handleCreatePost = (e) => {
    e.preventDefault()
    if (!newPostTitle.trim() || !newPostDesc.trim()) return

    const newPost = {
      id: `post-${Date.now()}`,
      type: 'FOUND',
      title: newPostTitle.trim(),
      description: newPostDesc.trim(),
      location: newPostLocation.trim() || 'Local Area',
      timeAgo: 'Just now',
      finder: {
        name: user.name || user.email || 'Honest Finder',
        handle: `@${(user.name || 'finder').toLowerCase().replace(/\s+/g, '')}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email || 'Finder')}`
      },
      image: samplePosts[0].image,
      claims: [],
      comments: []
    }

    setPosts([newPost, ...posts])
    setShowNewPostModal(false)
    setNewPostTitle('')
    setNewPostLocation('')
    setNewPostDesc('')
  }

  return (
    <div className="page-shell">
      <Header user={user} onLogout={onLogout} />

      <main className="feed-container">
        <div className="feed-two-column-layout">

          {/* MAIN/LEFT COLUMN: FOUND ITEMS FEED */}
          <section className="center-feed-column">
            {/* Top Control Bar */}
            <div className="feed-header">
              <div className="filter-tabs">
                <button className="tab-button is-active">
                  🟢 Found Items ({posts.length})
                </button>
                <button
                  className="mobile-drawer-trigger-btn"
                  onClick={() => setShowDrawer(true)}
                  type="button"
                >
                  🚨 Scammer Board ({scammerLeaderboard.length})
                </button>
              </div>

              <button
                className="primary-button create-post-btn"
                onClick={handleOpenNewPostModal}
              >
                + Report Found Item <span aria-hidden="true">-&gt;</span>
              </button>
            </div>

            {/* Posts Feed */}
            <div className="posts-list">
              {posts.map((post) => (
                <article key={post.id} className="insta-card torn-paper-wrapper">
                  <div className="insta-card-inner torn-paper">
                    
                    {/* LEFT SIDE: Found Media & Info */}
                    <div className="card-left-column">
                      <header className="card-author-header">
                        <img className="author-avatar" src={post.finder.avatar} alt={post.finder.name} />
                        <div className="author-meta">
                          <div className="author-row">
                            <span className="author-name">{post.finder.name}</span>
                            <span className="post-badge badge-found">
                              FOUND
                            </span>
                          </div>
                          <span className="post-location">📍 {post.location} • {post.timeAgo}</span>
                        </div>
                      </header>

                      <div className="card-image-wrapper">
                        <img className="card-image" src={post.image} alt={post.title} />
                      </div>

                      <div className="card-body">
                        <h2 className="card-title">{post.title}</h2>
                        <p className="card-description">{post.description}</p>

                        <div className="card-actions">
                          <button
                            className="claim-action-btn"
                            onClick={() => handleToggleClaimForm(post.id)}
                          >
                            ✋ Claim Ownership / Mark as Mine
                          </button>
                        </div>

                        {/* Claim Form Dropdown */}
                        {activeClaimPostId === post.id && (
                          <form className="claim-form" onSubmit={(e) => handleSubmitClaim(post.id, e)}>
                            <h4>Submit Ownership Proof / Claim</h4>
                            <div className="form-group">
                              <input
                                className="form-input"
                                type="text"
                                placeholder="Your Name / Handle"
                                value={claimantName || (user?.name || '')}
                                onChange={(e) => setClaimantName(e.target.value)}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <textarea
                                className="form-input claim-textarea"
                                placeholder="Describe unique identifying marks, contents, serial numbers, or proof of ownership..."
                                value={claimNote}
                                onChange={(e) => setClaimNote(e.target.value)}
                                rows={3}
                                required
                              />
                            </div>
                            <div className="claim-form-actions">
                              <button className="primary-button" type="submit">
                                Submit Public Claim Proof
                              </button>
                              <button
                                className="secondary-button"
                                type="button"
                                onClick={() => setActiveClaimPostId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>

                    {/* RIGHT SIDE: Public Ownership List (Top) & Comments Feed (Bottom) */}
                    <div className="card-right-column">
                      
                      {/* SECTION 1: PUBLIC OWNERSHIP CLAIMS LIST (ABOVE COMMENTS) */}
                      <div className="ownership-claims-section">
                        <div className="section-header-row">
                          <h3>📜 Public Ownership Claims</h3>
                          <span className="claims-count-badge">{post.claims.length} Claim{post.claims.length !== 1 ? 's' : ''}</span>
                        </div>

                        {post.claims.length === 0 ? (
                          <div className="claims-empty-state">
                            <p>No ownership claims filed yet.</p>
                            <button
                              className="text-link-btn"
                              onClick={() => handleToggleClaimForm(post.id)}
                            >
                              Be the first to claim ownership &rarr;
                            </button>
                          </div>
                        ) : (
                          <div className="claims-list">
                            {post.claims.map((claim) => (
                              <div key={claim.id} className="claim-item">
                                <div className="claim-header">
                                  <img className="claim-avatar" src={claim.avatar} alt={claim.user} />
                                  <div className="claim-user-meta">
                                    <strong>{claim.user}</strong>
                                    <span className="claim-time">{claim.time}</span>
                                  </div>
                                  <span className="claim-status-tag">Claimant</span>
                                </div>
                                <p className="claim-note">{claim.note}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* SEPARATOR */}
                      <div className="column-divider" />

                      {/* SECTION 2: COMMENTS SECTION (BELOW OWNERSHIP LIST) */}
                      <div className="comments-section">
                        <div className="section-header-row">
                          <h3>💬 Community Discussion</h3>
                          <span className="comments-count">{post.comments.length} Comment{post.comments.length !== 1 ? 's' : ''}</span>
                        </div>

                        <div className="comments-list">
                          {post.comments.length === 0 ? (
                            <p className="no-comments">No comments yet. Help reconnect this item!</p>
                          ) : (
                            post.comments.map((comment) => (
                              <div key={comment.id} className="comment-item">
                                <img className="comment-avatar" src={comment.avatar} alt={comment.user} />
                                <div className="comment-content">
                                  <div className="comment-user-row">
                                    <span className="comment-username">{comment.user}</span>
                                    <span className="comment-time">{comment.time}</span>
                                  </div>
                                  <p className="comment-text">{comment.text}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* ADD COMMENT INPUT BOX */}
                        <form className="add-comment-form" onSubmit={(e) => handleAddComment(post.id, e)}>
                          <input
                            className="form-input comment-input"
                            type="text"
                            placeholder={user ? "Add a comment..." : "Login required to comment..."}
                            value={commentInputs[post.id] || ''}
                            onChange={(e) =>
                              setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                            }
                          />
                          <button className="primary-button post-comment-btn" type="submit">
                            Post
                          </button>
                        </form>
                      </div>

                    </div>

                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* RIGHT COLUMN: SCAMMER LEADERBOARD PROFILE LIST (DESKTOP) */}
          <aside className="sidebar-column scammer-sidebar-column">
            <div className="torn-paper-wrapper">
              <div className="torn-paper scammer-sidebar-card">
                <div className="scammer-header">
                  <span style={{ fontSize: '1.4rem' }}>🚨</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>Scammer Leaderboard</h3>
                    <small style={{ color: 'var(--ink-muted)' }}>Flagged Profiles &amp; Fake Claimants</small>
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', marginBottom: '16px' }}>
                  Profiles publicly flagged for submitting false ownership claims without proof:
                </p>

                <div className="scammer-profile-list">
                  {scammerLeaderboard.map((profile) => (
                    <div key={profile.id} className="scammer-profile-card">
                      <img className="scammer-profile-avatar" src={profile.avatar} alt={profile.fullName} />
                      
                      <div className="scammer-profile-info">
                        <div className="scammer-user-row">
                          <strong className="scammer-fullname">{profile.fullName}</strong>
                          <span className="badge-red">{profile.failedClaimsCount} Fake Claims</span>
                        </div>
                        <span className="scammer-username">{profile.username}</span>
                        <p className="scammer-reason">
                          <strong>Reason:</strong> {profile.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>

      {/* MOBILE SLIDE-UP LEADERBOARD DRAWER */}
      {showDrawer && (
        <div className="drawer-backdrop" onClick={() => setShowDrawer(false)}>
          <div className="drawer-sheet torn-paper" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-handle" />
            <header className="drawer-header">
              <div className="scammer-header" style={{ margin: 0 }}>
                <span style={{ fontSize: '1.4rem' }}>🚨</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Scammer Leaderboard</h3>
                  <small style={{ color: 'var(--ink-muted)' }}>Flagged Profiles &amp; Fake Claimants</small>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setShowDrawer(false)}>
                &times;
              </button>
            </header>

            <div className="scammer-profile-list" style={{ marginTop: '16px' }}>
              {scammerLeaderboard.map((profile) => (
                <div key={profile.id} className="scammer-profile-card">
                  <img className="scammer-profile-avatar" src={profile.avatar} alt={profile.fullName} />
                  <div className="scammer-profile-info">
                    <div className="scammer-user-row">
                      <strong className="scammer-fullname">{profile.fullName}</strong>
                      <span className="badge-red">{profile.failedClaimsCount} Fake Claims</span>
                    </div>
                    <span className="scammer-username">{profile.username}</span>
                    <p className="scammer-reason">
                      <strong>Reason:</strong> {profile.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AUTH REQUIRED MODAL */}
      {showAuthModal && (
        <div className="modal-backdrop" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content torn-paper" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>🔒 Login Required</h2>
              <button className="modal-close-btn" onClick={() => setShowAuthModal(false)}>
                &times;
              </button>
            </header>
            <p style={{ margin: '0 0 20px', color: 'var(--ink-soft)', fontSize: '1rem', lineHeight: '1.5' }}>
              You need to be logged in to <strong>{authActionReason}</strong>. Sign in to post comments, submit ownership claims, or list found items.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <button className="secondary-button" onClick={() => setShowAuthModal(false)}>
                Cancel
              </button>
              <a className="nav-button" href="#register" onClick={() => setShowAuthModal(false)}>
                Register
              </a>
              <a className="primary-button" href="#login" onClick={() => setShowAuthModal(false)}>
                Login Now -&gt;
              </a>
            </div>
          </div>
        </div>
      )}

      {/* CREATE FOUND ITEM POST MODAL */}
      {showNewPostModal && (
        <div className="modal-backdrop" onClick={() => setShowNewPostModal(false)}>
          <div className="modal-content torn-paper" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>Report a Found Item</h2>
              <button className="modal-close-btn" onClick={() => setShowNewPostModal(false)}>
                &times;
              </button>
            </header>

            <form onSubmit={handleCreatePost}>
              <div className="demo-badge">
                🟢 Only FOUND items can be posted on this network!
              </div>

              <div className="form-group">
                <label htmlFor="postTitle">Item Title</label>
                <input
                  id="postTitle"
                  className="form-input"
                  type="text"
                  placeholder="e.g. Found Brown Leather Bi-Fold Wallet"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="postLoc">Location Where Found</label>
                <input
                  id="postLoc"
                  className="form-input"
                  type="text"
                  placeholder="e.g. Central Park Bench near 5th Ave station"
                  value={newPostLocation}
                  onChange={(e) => setNewPostLocation(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="postDesc">Item Description &amp; Details</label>
                <textarea
                  id="postDesc"
                  className="form-input"
                  rows={4}
                  placeholder="Describe the general item appearance without giving away secret proof details..."
                  value={newPostDesc}
                  onChange={(e) => setNewPostDesc(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="secondary-button" type="button" onClick={() => setShowNewPostModal(false)}>
                  Cancel
                </button>
                <button className="primary-button" type="submit">
                  Publish Found Item -&gt;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
