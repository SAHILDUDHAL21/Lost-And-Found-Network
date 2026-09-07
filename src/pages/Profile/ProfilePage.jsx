import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { fetchItems, fetchUserProfile, updateUserProfile, deleteItem } from '../../api/apiService'
import './ProfilePage.css'

const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%2330281e'/><circle cx='50' cy='40' r='20' fill='%23faf5e9'/><path d='M20,85 C20,65 35,60 50,60 C65,60 80,65 80,85 Z' fill='%23faf5e9'/></svg>"

function ProfilePage({ user, onLogout, onUpdateUser }) {
  const [profile, setProfile] = useState(user || null)
  const [myPosts, setMyPosts] = useState([])
  const [myClaims, setMyClaims] = useState([])
  const [activeTab, setActiveTab] = useState('items') // 'items', 'claims'
  const [loading, setLoading] = useState(true)

  // Edit Profile Modal State
  const [showEditModal, setShowEditModal] = useState(false)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editAvatar, setEditAvatar] = useState('')

  // Load User Profile & User Activity from Database
  useEffect(() => {
    async function loadProfileData() {
      setLoading(true)
      if (user?.email) {
        const dbProfile = await fetchUserProfile(user.email)
        if (dbProfile && (dbProfile.id || dbProfile.email)) {
          setProfile(dbProfile)
        }
      }

      // Load all items to filter user's posted items & submitted claims
      const allItems = await fetchItems()
      if (allItems && Array.isArray(allItems)) {
        const uName = (user?.fullName || user?.name || user?.email || '').toLowerCase().trim()
        
        // Filter items created by this user
        const userItems = allItems.filter((item) => {
          const finder = (item.finderName || item.finderHandle || '').toLowerCase().trim()
          return finder === uName || finder.includes(uName) || uName.includes(finder)
        })
        setMyPosts(userItems)

        // Filter claims submitted by this user across all items
        const userClaims = []
        allItems.forEach((item) => {
          if (item.claims && Array.isArray(item.claims)) {
            item.claims.forEach((claim) => {
              const claimUser = (claim.user || '').toLowerCase().trim()
              if (claimUser === uName || claimUser.includes(uName) || uName.includes(claimUser)) {
                userClaims.push({ ...claim, itemTitle: item.title, itemId: item.id })
              }
            })
          }
        })
        setMyClaims(userClaims)
      }
      setLoading(false)
    }

    loadProfileData()
  }, [user])

  // Open Edit Profile Modal
  const handleOpenEditModal = () => {
    setEditName(profile?.fullName || profile?.name || '')
    setEditPhone(profile?.phone || '')
    setEditAvatar(profile?.avatar || '')
    setShowEditModal(true)
  }

  // Handle local device image file upload (converts to base64 Data URL)
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditAvatar(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Update Profile (PUT /api/users/{id} or /api/users/email/{email} -> PostgreSQL)
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    const targetKey = profile?.id || profile?.email || user?.email
    if (!targetKey) return

    const updatedData = {
      fullName: editName.trim(),
      phone: editPhone.trim(),
      avatar: editAvatar.trim()
    }

    const res = await updateUserProfile(targetKey, updatedData)
    const updatedUser = (res && (res.id || res.email)) ? res : { ...user, ...profile, ...updatedData }

    setProfile(updatedUser)
    if (onUpdateUser) {
      onUpdateUser(updatedUser)
    }
    setShowEditModal(false)
  }

  // Delete User Item
  const handleDeleteMyPost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this found item listing from the database?')) return
    await deleteItem(postId)
    setMyPosts((prev) => prev.filter((item) => item.id !== postId))
  }

  return (
    <div className="page-shell">
      <Header user={user} onLogout={onLogout} />

      <main className="profile-container">
        {/* TOP PROFILE HEADER CARD */}
        <section className="profile-header-card torn-paper-wrapper">
          <div className="torn-paper profile-card-inner">
            <div className="profile-top-row">

              {/* AVATAR WITH CLICKABLE EDIT OVERLAY */}
              <div
                className="avatar-upload-wrapper"
                onClick={handleOpenEditModal}
                title="Click to update profile picture"
              >
                <img
                  className="profile-avatar-large"
                  src={profile?.avatar || DEFAULT_AVATAR}
                  alt={profile?.fullName || 'User Avatar'}
                />
                <div className="avatar-overlay">
                  <span>Change</span>
                </div>
              </div>

              <div className="profile-meta-info">
                <div className="profile-name-row">
                  <h1 className="profile-fullname">{profile?.fullName || profile?.name || 'Community Member'}</h1>
                  <span className="profile-badge">Verified Member</span>
                </div>
                <p className="profile-email">Email: {profile?.email || 'user@example.com'}</p>
                <p className="profile-phone">Phone: {profile?.phone || 'Phone not added'}</p>
              </div>

              {/* PROFILE ACTIONS BUTTON GROUP */}
              <div className="profile-header-actions">
                <button className="primary-button edit-profile-btn" onClick={handleOpenEditModal}>
                  Update Picture / Edit Profile
                </button>
                <button className="secondary-button profile-logout-btn" onClick={onLogout}>
                  Logout Account
                </button>
              </div>
            </div>

            {/* PROFILE STATS ROW */}
            <div className="profile-stats-row">
              <div className="stat-box">
                <span className="stat-number">{myPosts.length}</span>
                <span className="stat-label">Reported Found Items</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">{myClaims.length}</span>
                <span className="stat-label">Submitted Claims</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">100%</span>
                <span className="stat-label">Honesty Score</span>
              </div>
            </div>
          </div>
        </section>

        {/* TABS NAVIGATION */}
        <div className="profile-tabs-header">
          <div className="filter-tabs">
            <button
              className={activeTab === 'items' ? 'tab-button is-active' : 'tab-button'}
              onClick={() => setActiveTab('items')}
            >
              My Found Items ({myPosts.length})
            </button>
            <button
              className={activeTab === 'claims' ? 'tab-button is-active' : 'tab-button'}
              onClick={() => setActiveTab('claims')}
            >
              My Ownership Claims ({myClaims.length})
            </button>
          </div>
        </div>

        {/* TAB 1: MY REPORTED FOUND ITEMS */}
        {activeTab === 'items' && (
          <section className="profile-tab-content">
            {loading ? (
              <div className="torn-paper-wrapper">
                <div className="torn-paper" style={{ textAlign: 'center', padding: '30px' }}>
                  <p>Loading your reported found items from database...</p>
                </div>
              </div>
            ) : myPosts.length === 0 ? (
              <div className="torn-paper-wrapper">
                <div className="torn-paper" style={{ textAlign: 'center', padding: '40px' }}>
                  <h3>No Reported Found Items</h3>
                  <p style={{ margin: '12px 0 20px', color: 'var(--ink-soft)' }}>
                    You have not reported any found items on the network yet.
                  </p>
                  <a className="primary-button" href="#feed">
                    Report Found Item Now &rarr;
                  </a>
                </div>
              </div>
            ) : (
              <div className="my-items-grid">
                {myPosts.map((item) => (
                  <div key={item.id} className="torn-paper-wrapper">
                    <div className="torn-paper my-item-card">
                      <img className="my-item-img" src={item.image} alt={item.title} />
                      <div className="my-item-body">
                        <div className="my-item-header">
                          <h4>{item.title}</h4>
                          <span className="post-badge badge-found">FOUND</span>
                        </div>
                        <p className="my-item-loc">Location: {item.location}</p>
                        <p className="my-item-desc">{item.description}</p>
                        
                        <div className="my-item-footer">
                          <span className="claims-count-badge">{(item.claims || []).length} Claims</span>
                          <button
                            className="crud-btn crud-btn-danger"
                            onClick={() => handleDeleteMyPost(item.id)}
                            title="Delete this listing"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: MY OWNERSHIP CLAIMS */}
        {activeTab === 'claims' && (
          <section className="profile-tab-content">
            {loading ? (
              <div className="torn-paper-wrapper">
                <div className="torn-paper" style={{ textAlign: 'center', padding: '30px' }}>
                  <p>Loading your submitted claims...</p>
                </div>
              </div>
            ) : myClaims.length === 0 ? (
              <div className="torn-paper-wrapper">
                <div className="torn-paper" style={{ textAlign: 'center', padding: '40px' }}>
                  <h3>No Submitted Claims</h3>
                  <p style={{ margin: '12px 0 20px', color: 'var(--ink-soft)' }}>
                    You have not submitted ownership claims for any items yet.
                  </p>
                </div>
              </div>
            ) : (
              <div className="my-claims-list">
                {myClaims.map((claim) => (
                  <div key={claim.id} className="torn-paper-wrapper">
                    <div className="torn-paper my-claim-card">
                      <div className="claim-header-row">
                        <strong>For Item: {claim.itemTitle}</strong>
                        <span className="claim-status-tag">{claim.status || 'PENDING'}</span>
                      </div>
                      <p className="claim-note-text">"{claim.note}"</p>
                      <small style={{ color: 'var(--ink-muted)' }}>Submitted {claim.time || 'Recently'}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

      </main>

      {/* EDIT PROFILE & UPDATE PICTURE MODAL */}
      {showEditModal && (
        <div className="modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="modal-content torn-paper" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>Update Profile Picture &amp; Details</h2>
              <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                &times;
              </button>
            </header>

            <form onSubmit={handleSaveProfile}>

              {/* PROFILE AVATAR PREVIEW & UPLOAD */}
              <div className="form-group" style={{ textAlign: 'center' }}>
                <label>Profile Picture</label>
                {editAvatar && (
                  <img
                    src={editAvatar}
                    alt="Profile Preview"
                    className="avatar-preview-box"
                  />
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                  <label htmlFor="fileAvatar" style={{ fontSize: '0.82rem', color: 'var(--ink-soft)' }}>
                    Upload photo from your computer/device:
                  </label>
                  <input
                    id="fileAvatar"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="form-input"
                    style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="profName">Full Name</label>
                <input
                  id="profName"
                  className="form-input"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="profPhone">Phone Number</label>
                <input
                  id="profPhone"
                  className="form-input"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="secondary-button" type="button" onClick={() => setShowEditModal(false)}>
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
    </div>
  )
}

export default ProfilePage
