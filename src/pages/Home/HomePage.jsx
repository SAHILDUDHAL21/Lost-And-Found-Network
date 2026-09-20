import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import {
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
  submitClaim,
  updateClaimStatus,
  deleteClaim,
  postComment,
  deleteComment,
  fetchScammers,
  createScammer
} from '../../api/apiService'
import './HomePage.css'

const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%2330281e'/><circle cx='50' cy='40' r='20' fill='%23faf5e9'/><path d='M20,85 C20,65 35,60 50,60 C65,60 80,65 80,85 Z' fill='%23faf5e9'/></svg>"
const DEFAULT_ITEM_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23f1eadb'/><rect x='40' y='40' width='320' height='220' rx='16' fill='%23faf5e9' stroke='%2317120d' stroke-width='4'/><path d='M100 180 L160 120 L220 170 L280 110 L340 180 Z' fill='%23574b3c'/><circle cx='130' cy='90' r='25' fill='%23f1eadb'/></svg>"

function HomePage({ user, onLogout }) {
  // Pure Database State (Initializes empty, populated 100% from PostgreSQL database)
  const [posts, setPosts] = useState([])
  const [scammers, setScammers] = useState([])
  const [loading, setLoading] = useState(true)

  // Active claim form & comment inputs
  const [activeClaimPostId, setActiveClaimPostId] = useState(null)
  const [claimNote, setClaimNote] = useState('')
  const [claimantName, setClaimantName] = useState('')
  const [commentInputs, setCommentInputs] = useState({})

  // Authentication prompt modal state
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authActionReason, setAuthActionReason] = useState('')

  // New Post Modal State
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostLocation, setNewPostLocation] = useState('')
  const [newPostDesc, setNewPostDesc] = useState('')
  const [newPostImage, setNewPostImage] = useState('')

  // Edit Item Modal State
  const [editingPost, setEditingPost] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editImage, setEditImage] = useState('')

  // Flag Scammer Modal State
  const [showScammerModal, setShowScammerModal] = useState(false)
  const [scammerName, setScammerName] = useState('')
  const [scammerHandle, setScammerHandle] = useState('')
  const [scammerReason, setScammerReason] = useState('')
  const [scammerCount, setScammerCount] = useState(1)

  // Mobile Drawer State
  const [showDrawer, setShowDrawer] = useState(false)

  // Helper to check if current logged-in user is the author of a post, claim, or comment
  const isOwner = (authorNameOrHandle) => {
    if (!user || !authorNameOrHandle) return false
    const uName = (user.fullName || user.name || user.email || '').toLowerCase().trim()
    const target = authorNameOrHandle.toLowerCase().trim()
    return target === uName || target.includes(uName) || uName.includes(target)
  }

  // Handle local image file upload for Found Item (converts to base64 Data URL to store in PostgreSQL)
  const handleItemImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewPostImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditItemImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Refresh items from Spring Boot REST API
  const refreshItemsFromApi = async () => {
    const apiItems = await fetchItems()
    if (apiItems && Array.isArray(apiItems)) {
      setPosts(apiItems)
    }
  }

  // Refresh scammers from Spring Boot REST API
  const refreshScammersFromApi = async () => {
    const apiScammers = await fetchScammers()
    if (apiScammers && Array.isArray(apiScammers)) {
      setScammers(apiScammers)
    }
  }

  // Load 100% dynamic data from PostgreSQL database on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      await refreshItemsFromApi()
      await refreshScammersFromApi()
      setLoading(false)
    }
    loadData()
  }, [])

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

  // ==========================================
  // ITEM DATABASE CRUD HANDLERS
  // ==========================================

  // CREATE FOUND ITEM (POST /api/items -> PostgreSQL)
  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!newPostTitle.trim() || !newPostDesc.trim()) return

    const newItemData = {
      type: 'FOUND',
      title: newPostTitle.trim(),
      description: newPostDesc.trim(),
      location: newPostLocation.trim() || 'Local Area',
      timeAgo: 'Just now',
      finderName: user?.fullName || user?.name || user?.email || 'Honest Finder',
      finderHandle: `@${(user?.fullName || user?.name || 'finder').toLowerCase().replace(/\s+/g, '')}`,
      finderAvatar: user?.avatar || DEFAULT_AVATAR,
      image: newPostImage || DEFAULT_ITEM_IMAGE
    }

    const saved = await createItem(newItemData)
    if (saved && (saved.id || saved.title)) {
      await refreshItemsFromApi()
      setShowNewPostModal(false)
      setNewPostTitle('')
      setNewPostLocation('')
      setNewPostDesc('')
      setNewPostImage('')
    } else {
      alert('Failed to save found item listing into PostgreSQL database. Please make sure the Spring Boot server is running on port 8080.')
    }
  }

  // OPEN EDIT ITEM MODAL
  const handleOpenEditModal = (post) => {
    if (!isOwner(post.finderName || post.finderHandle)) {
      alert('Only the person who posted this found item can edit it.')
      return
    }
    setEditingPost(post)
    setEditTitle(post.title || '')
    setEditLocation(post.location || '')
    setEditDesc(post.description || '')
    setEditImage(post.image || '')
  }

  // UPDATE ITEM (PUT /api/items/{id} -> PostgreSQL)
  const handleUpdateItemSubmit = async (e) => {
    e.preventDefault()
    if (!editingPost) return

    const updatedData = {
      title: editTitle.trim(),
      description: editDesc.trim(),
      location: editLocation.trim(),
      image: editImage || editingPost.image
    }

    await updateItem(editingPost.id, updatedData)
    await refreshItemsFromApi()
    setEditingPost(null)
  }

  // DELETE ITEM (DELETE /api/items/{id} -> PostgreSQL)
  const handleDeleteItem = async (post) => {
    if (!requireAuth('delete a post')) return
    if (!isOwner(post.finderName || post.finderHandle)) {
      alert('Only the person who posted this found item can delete it.')
      return
    }
    if (!window.confirm('Are you sure you want to delete your found item listing from the database?')) return

    await deleteItem(post.id)
    await refreshItemsFromApi()
  }

  // ==========================================
  // CLAIM DATABASE CRUD HANDLERS
  // ==========================================

  // CREATE CLAIM (POST /api/claims -> PostgreSQL)
  const handleSubmitClaim = async (postId, e) => {
    e.preventDefault()
    if (!requireAuth('claim ownership')) return
    if (!claimNote.trim()) return

    const numItemId = (!isNaN(postId) && Number(postId) > 0) ? Number(postId) : postId

    const claimData = {
      itemId: numItemId,
      user: claimantName.trim() || user?.fullName || user?.name || user?.email || 'Claimant',
      avatar: user?.avatar || DEFAULT_AVATAR,
      time: 'Just now',
      status: 'PENDING_VERIFICATION',
      note: claimNote.trim()
    }

    await submitClaim(claimData)
    await refreshItemsFromApi()

    setActiveClaimPostId(null)
    setClaimNote('')
    setClaimantName('')
  }

  // UPDATE CLAIM STATUS (PUT /api/claims/{id}/status -> PostgreSQL)
  // Finder/Owner accepts or rejects claims (Rejections auto-flag user to Scammer Leaderboard)
  const handleUpdateClaimStatus = async (postFinder, claimId, newStatus) => {
    if (!requireAuth('update claim status')) return
    if (!isOwner(postFinder)) {
      alert('Only the person who posted this found item can select the original owner.')
      return
    }
    await updateClaimStatus(claimId, newStatus)
    await refreshItemsFromApi()
    if (newStatus === 'REJECTED') {
      await refreshScammersFromApi()
    }
  }

  // DELETE CLAIM (DELETE /api/claims/{id} -> PostgreSQL)
  const handleDeleteClaim = async (claimUser, claimId) => {
    if (!requireAuth('delete a claim')) return
    if (!isOwner(claimUser)) {
      alert('Only the person who submitted this claim can delete it.')
      return
    }
    await deleteClaim(claimId)
    await refreshItemsFromApi()
  }

  // ==========================================
  // COMMENT DATABASE CRUD HANDLERS
  // ==========================================

  // CREATE COMMENT (POST /api/comments -> PostgreSQL)
  const handleAddComment = async (postId, e) => {
    e.preventDefault()
    if (!requireAuth('leave a comment')) return

    const text = commentInputs[postId]?.trim()
    if (!text) return

    const numItemId = (!isNaN(postId) && Number(postId) > 0) ? Number(postId) : postId

    const commentData = {
      itemId: numItemId,
      user: user?.fullName || user?.name || user?.email || 'Community Member',
      avatar: user?.avatar || DEFAULT_AVATAR,
      time: 'Just now',
      text
    }

    await postComment(commentData)
    await refreshItemsFromApi()

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }))
  }

  // DELETE COMMENT (DELETE /api/comments/{id} -> PostgreSQL)
  const handleDeleteComment = async (commentUser, commentId) => {
    if (!requireAuth('delete a comment')) return
    if (!isOwner(commentUser)) {
      alert('Only the person who posted this comment can delete it.')
      return
    }
    await deleteComment(commentId)
    await refreshItemsFromApi()
  }

  // ==========================================
  // SCAMMER LEADERBOARD DATABASE CRUD HANDLERS
  // ==========================================

  // CREATE SCAMMER PROFILE (POST /api/scammers -> PostgreSQL)
  const handleCreateScammer = async (e) => {
    e.preventDefault()
    if (!scammerName.trim() || !scammerReason.trim()) return

    const scammerData = {
      fullName: scammerName.trim(),
      username: scammerHandle.trim() || `@${scammerName.toLowerCase().replace(/\s+/g, '')}`,
      avatar: DEFAULT_AVATAR,
      failedClaimsCount: parseInt(scammerCount) || 1,
      reason: scammerReason.trim(),
      status: 'Flagged Scammer'
    }

    await createScammer(scammerData)
    await refreshScammersFromApi()

    setShowScammerModal(false)
    setScammerName('')
    setScammerHandle('')
    setScammerReason('')
    setScammerCount(1)
  }

  const handleToggleClaimForm = (postId) => {
    if (!requireAuth('claim ownership of an item')) return
    setActiveClaimPostId(activeClaimPostId === postId ? null : postId)
  }

  const handleOpenNewPostModal = () => {
    if (!requireAuth('report a found item')) return
    setShowNewPostModal(true)
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
                  Found Items ({posts.length})
                </button>
                <button
                  className="mobile-drawer-trigger-btn"
                  onClick={() => setShowDrawer(true)}
                  type="button"
                >
                  Scammer Board ({scammers.length})
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
              {loading ? (
                <div className="torn-paper-wrapper">
                  <div className="torn-paper" style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ fontSize: '1.1rem', color: 'var(--ink-soft)' }}>
                      Loading (Dam Kadha) ...
                    </p>
                  </div>
                </div>
              ) : posts.length === 0 ? (
                <div className="torn-paper-wrapper">
                  <div className="torn-paper" style={{ textAlign: 'center', padding: '40px' }}>
                    <h3>Database Ready</h3>
                    <p style={{ margin: '12px 0 20px', color: 'var(--ink-soft)' }}>
                      No found item listings reported in PostgreSQL database yet.
                    </p>
                    <button className="primary-button" onClick={handleOpenNewPostModal}>
                      + Report Found Item Now &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                posts.map((post) => {
                  const finderName = post.finderName || post.finder?.name || 'Honest Finder'
                  const finderAvatar = post.finderAvatar || post.finder?.avatar || DEFAULT_AVATAR
                  const claimsList = post.claims || []
                  const commentsList = post.comments || []
                  const isPostOwner = isOwner(finderName || post.finderHandle)
                  const verifiedClaim = claimsList.find((c) => c.status === 'VERIFIED_OWNER' || c.status === 'VERIFIED')

                  return (
                    <article key={post.id} className="insta-card torn-paper-wrapper">
                      <div className="insta-card-inner torn-paper">
                        
                        {/* LEFT SIDE: Found Media & Info */}
                        <div className="card-left-column">
                          <header className="card-author-header">
                            <img className="author-avatar" src={finderAvatar} alt={finderName} />
                            <div className="author-meta">
                              <div className="author-row">
                                <span className="author-name">{finderName}</span>
                                {verifiedClaim ? (
                                  <span className="post-badge badge-found" style={{ background: '#2e7d32', color: '#fff' }}>
                                    REUNITED WITH OWNER
                                  </span>
                                ) : (
                                  <span className="post-badge badge-found">
                                    FOUND
                                  </span>
                                )}
                              </div>
                              <span className="post-location">Location: {post.location} • {post.timeAgo || 'Recently'}</span>
                            </div>

                            {/* Item Edit/Delete Action Controls */}
                            {isPostOwner && (
                              <div className="item-crud-actions">
                                <button
                                  className="crud-btn"
                                  onClick={() => handleOpenEditModal(post)}
                                  title="Edit your item details in database"
                                >
                                  Edit
                                </button>
                                <button
                                  className="crud-btn crud-btn-danger"
                                  onClick={() => handleDeleteItem(post)}
                                  title="Delete your Found Item from database"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </header>

                          <div className="card-image-wrapper">
                            <img className="card-image" src={post.image || DEFAULT_ITEM_IMAGE} alt={post.title} />
                          </div>

                          <div className="card-body">
                            <h2 className="card-title">{post.title}</h2>
                            <p className="card-description">{post.description}</p>

                            <div className="card-actions">
                              <button
                                className="claim-action-btn"
                                onClick={() => handleToggleClaimForm(post.id)}
                              >
                                Claim Ownership
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
                                    value={claimantName || (user?.fullName || user?.name || '')}
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
                          
                          {/* SECTION 1: PUBLIC OWNERSHIP CLAIMS LIST */}
                          <div className="ownership-claims-section">
                            <div className="section-header-row">
                              <h3>Public Ownership Claims</h3>
                              <span className="claims-count-badge">{claimsList.length} Claim{claimsList.length !== 1 ? 's' : ''}</span>
                            </div>

                            {claimsList.length === 0 ? (
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
                                {claimsList.map((claim) => {
                                  const isClaimOwner = isOwner(claim.user)
                                  const isVerifiedOwner = claim.status === 'VERIFIED_OWNER' || claim.status === 'VERIFIED'

                                  return (
                                    <div key={claim.id} className={isVerifiedOwner ? "claim-item is-verified-owner" : "claim-item"}>
                                      <div className="claim-header">
                                        <img className="claim-avatar" src={claim.avatar || DEFAULT_AVATAR} alt={claim.user} />
                                        <div className="claim-user-meta">
                                          <strong>{claim.user}</strong>
                                          <span className="claim-time">{claim.time}</span>
                                        </div>

                                        {isVerifiedOwner ? (
                                          <span className="badge-verified-owner">VERIFIED ORIGINAL OWNER</span>
                                        ) : (
                                          <span className="claim-status-tag">{claim.status || 'Claimant'}</span>
                                        )}

                                        {/* Delete Claim */}
                                        {isClaimOwner && (
                                          <button
                                            className="crud-btn crud-btn-danger"
                                            onClick={() => handleDeleteClaim(claim.user, claim.id)}
                                            title="Delete your claim from database"
                                            style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                                          >
                                            Delete
                                          </button>
                                        )}
                                      </div>

                                      <p className="claim-note">{claim.note}</p>

                                      {/* Claim Status Update Controls */}
                                      {isPostOwner && (
                                        <div className="claim-status-actions">
                                          <button
                                            className="status-chip-btn status-chip-accept"
                                            onClick={() => handleUpdateClaimStatus(finderName, claim.id, 'VERIFIED_OWNER')}
                                            title="Accept & confirm this claimant as the legitimate Original Owner"
                                          >
                                            Accept as Original Owner
                                          </button>
                                          <button
                                            className="status-chip-btn"
                                            onClick={() => handleUpdateClaimStatus(finderName, claim.id, 'UNDER_REVIEW')}
                                            title="Mark under review"
                                          >
                                            Review
                                          </button>
                                          <button
                                            className="status-chip-btn"
                                            onClick={() => handleUpdateClaimStatus(finderName, claim.id, 'REJECTED')}
                                            title="Reject false claim and automatically flag user on Scammer Leaderboard"
                                            style={{ color: '#c62828' }}
                                          >
                                            Reject
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>

                          {/* SEPARATOR */}
                          <div className="column-divider" />

                          {/* SECTION 2: COMMENTS SECTION */}
                          <div className="comments-section">
                            <div className="section-header-row">
                              <h3>Community Discussion</h3>
                              <span className="comments-count">{commentsList.length} Comment{commentsList.length !== 1 ? 's' : ''}</span>
                            </div>

                            <div className="comments-list">
                              {commentsList.length === 0 ? (
                                <p className="no-comments">No comments yet. Help reconnect this item!</p>
                              ) : (
                                commentsList.map((comment) => {
                                  const isCommentOwner = isOwner(comment.user)
                                  return (
                                    <div key={comment.id} className="comment-item">
                                      <img className="comment-avatar" src={comment.avatar || DEFAULT_AVATAR} alt={comment.user} />
                                      <div className="comment-content">
                                        <div className="comment-user-row">
                                          <span className="comment-username">{comment.user}</span>
                                          <span className="comment-time">{comment.time}</span>

                                          {/* Delete Comment */}
                                          {isCommentOwner && (
                                            <button
                                              className="crud-btn crud-btn-danger"
                                              onClick={() => handleDeleteComment(comment.user, comment.id)}
                                              title="Delete your comment from database"
                                              style={{ marginLeft: 'auto', padding: '2px 8px', fontSize: '0.75rem' }}
                                            >
                                              Delete
                                            </button>
                                          )}
                                        </div>
                                        <p className="comment-text">{comment.text}</p>
                                      </div>
                                    </div>
                                  )
                                })
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
                  )
                })
              )}
            </div>
          </section>

          {/* RIGHT COLUMN: SCAMMER LEADERBOARD PROFILE LIST (DESKTOP) */}
          <aside className="sidebar-column scammer-sidebar-column">
            <div className="torn-paper-wrapper">
              <div className="torn-paper scammer-sidebar-card">
                <div className="scammer-header" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>Scammer Leaderboard</h3>
                      <small style={{ color: 'var(--ink-muted)' }}>Flagged Profiles &amp; Fake Claimants</small>
                    </div>
                  </div>
                  {/* <button
                    className="crud-btn crud-btn-danger"
                    onClick={() => {
                      if (!requireAuth('flag a scammer profile')) return
                      setShowScammerModal(true)
                    }}
                    title="Flag a new fake claimant profile"
                  >
                    Flag Scammer
                  </button> */}
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', margin: '12px 0 16px' }}>
                  Profiles publicly flagged for submitting false ownership claims without proof:
                </p>

                <div className="scammer-profile-list">
                  {scammers.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
                      No flagged scammer profiles in database yet.
                    </p>
                  ) : (
                    scammers.map((profile) => (
                      <div key={profile.id} className="scammer-profile-card">
                        <img className="scammer-profile-avatar" src={profile.avatar || DEFAULT_AVATAR} alt={profile.fullName} />
                        
                        <div className="scammer-profile-info">
                          <div className="scammer-user-row">
                            <strong className="scammer-fullname">{profile.fullName}</strong>
                            <span className="badge-red">{profile.failedClaimsCount} Fake Claim{profile.failedClaimsCount !== 1 ? 's' : ''}</span>
                          </div>
                          <span className="scammer-username">{profile.username}</span>
                          <p className="scammer-reason">
                            <strong>Reason:</strong> {profile.reason}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>

      {/* EDIT ITEM MODAL (PUT /api/items/{id}) */}
      {editingPost && (
        <div className="modal-backdrop" onClick={() => setEditingPost(null)}>
          <div className="modal-content torn-paper" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>Edit Found Item Listing</h2>
              <button className="modal-close-btn" onClick={() => setEditingPost(null)}>
                &times;
              </button>
            </header>

            <form onSubmit={handleUpdateItemSubmit}>
              <div className="form-group">
                <label htmlFor="editTitle">Item Title</label>
                <input
                  id="editTitle"
                  className="form-input"
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="editLocation">Location</label>
                <input
                  id="editLocation"
                  className="form-input"
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="editDesc">Description</label>
                <textarea
                  id="editDesc"
                  className="form-input"
                  rows={4}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Item Image (Upload Photo to Database)</label>
                {editImage && (
                  <img
                    src={editImage}
                    alt="Edit Item Preview"
                    style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '8px', border: '1px solid var(--border)' }}
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditItemImageUpload}
                  className="form-input"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="secondary-button" type="button" onClick={() => setEditingPost(null)}>
                  Cancel
                </button>
                <button className="primary-button" type="submit">
                  Save Changes -&gt;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLAG SCAMMER MODAL (POST /api/scammers) */}
      {showScammerModal && (
        <div className="modal-backdrop" onClick={() => setShowScammerModal(false)}>
          <div className="modal-content torn-paper" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>Flag Scammer / Fake Claimant</h2>
              <button className="modal-close-btn" onClick={() => setShowScammerModal(false)}>
                &times;
              </button>
            </header>

            <form onSubmit={handleCreateScammer}>
              <div className="form-group">
                <label htmlFor="scammerName">Full Name</label>
                <input
                  id="scammerName"
                  className="form-input"
                  type="text"
                  placeholder="e.g. Rahul Verma"
                  value={scammerName}
                  onChange={(e) => setScammerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="scammerHandle">Username / Handle</label>
                <input
                  id="scammerHandle"
                  className="form-input"
                  type="text"
                  placeholder="e.g. @rahul_v99"
                  value={scammerHandle}
                  onChange={(e) => setScammerHandle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="scammerCount">Number of Failed / False Claims</label>
                <input
                  id="scammerCount"
                  className="form-input"
                  type="number"
                  min="1"
                  value={scammerCount}
                  onChange={(e) => setScammerCount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="scammerReason">Reason for Flagging</label>
                <textarea
                  id="scammerReason"
                  className="form-input"
                  rows={3}
                  placeholder="e.g. Fake invoice provided, failed serial number verification..."
                  value={scammerReason}
                  onChange={(e) => setScammerReason(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="secondary-button" type="button" onClick={() => setShowScammerModal(false)}>
                  Cancel
                </button>
                <button className="primary-button" type="submit">
                  Flag Scammer Profile -&gt;
                </button>
              </div>
            </form>
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
                Only FOUND items can be posted on this network!
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

              {/* ITEM IMAGE FILE UPLOAD */}
              <div className="form-group">
                <label>Item Image (Upload Photo to Database)</label>
                {newPostImage && (
                  <img
                    src={newPostImage}
                    alt="Found Item Preview"
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '10px', border: '1.5px solid var(--border)' }}
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleItemImageUpload}
                  className="form-input"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
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
