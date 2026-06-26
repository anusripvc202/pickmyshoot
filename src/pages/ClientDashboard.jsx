import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  User, 
  Heart, 
  MapPin, 
  Activity, 
  Clock, 
  Grid, 
  Share2, 
  X, 
  FileText,
  ClipboardList,
  DollarSign,
  Mail,
  Shield,
  Send,
  HelpCircle,
  CreditCard,
  Plus,
  ThumbsUp,
  Briefcase
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import PublishListingModal from '../components/PublishListingModal';

const ClientDashboard = () => {
  const {
    theme,
    setTheme,
    bookings,
    likedItems,
    toggleLike,
    studios,
    gear,
    services,
    jobs,
    setJobs,
    models,
    toggleListingActive,
    openDetails,
    triggerToast,
    profiles,
    setProfiles,
    activeProfileId,
    setActiveProfileId,
    updateBookingStatus,
    tickets,
    addSupportTicket,
    chatSessions,
    chatMessages,
    sendChatMessage,
    currentUser,
    portfolioItems,
    setPortfolioItems,
    addPortfolioItem,
    publishPostToListing
  } = useAppContext();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  // Local state for profile inputs in settings
  const [profileName, setProfileName] = useState(activeProfile.name);
  const [profileEmail, setProfileEmail] = useState(activeProfile.email);
  const [profileBio, setProfileBio] = useState(activeProfile.bio);

  // Sync settings form inputs when active profile changes
  useEffect(() => {
    setProfileName(activeProfile.name);
    setProfileEmail(activeProfile.email);
    setProfileBio(activeProfile.bio);
  }, [activeProfileId, activeProfile]);

  // Sharing interaction state
  const [shareText, setShareText] = useState('Share Dashboard');

  // Client Receipt Viewer state
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Support ticket form states
  const [ticketCategory, setTicketCategory] = useState('Booking Issue');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  // Client Posts & creations states
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [pfTitle, setPfTitle] = useState('');
  const [pfCategory, setPfCategory] = useState('Jobs & Gigs');
  const [pfImage, setPfImage] = useState('https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=600&q=80');

  // Publish listing modal state
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedPostForPublish, setSelectedPostForPublish] = useState(null);

  // Chat window states
  const [selectedSessionId, setSelectedSessionId] = useState('ch-1');
  const [chatInputText, setChatInputText] = useState('');

  const handleAddPortfolioSubmit = (e) => {
    e.preventDefault();
    if (!pfTitle) {
      triggerToast("Please provide a title");
      return;
    }
    addPortfolioItem({
      title: pfTitle,
      category: pfCategory,
      image: pfImage
    });
    setShowPortfolioModal(false);
    setPfTitle('');
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) {
      triggerToast("Please fill in subject and detailed description.");
      return;
    }
    addSupportTicket({
      category: ticketCategory,
      subject: ticketSubject,
      message: ticketMessage
    });
    setTicketSubject('');
    setTicketMessage('');
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;
    sendChatMessage(selectedSessionId, chatInputText.trim());
    setChatInputText('');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareText('Copied! ✓');
    triggerToast("Dashboard URL copied to clipboard!");
    setTimeout(() => {
      setShareText('Share Dashboard');
    }, 2000);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const updatedFields = {
      id: activeProfileId,
      name: profileName,
      email: profileEmail,
      bio: profileBio
    };

    setProfiles(prev => prev.map(p => {
      if (p.id === activeProfileId) {
        return {
          ...p,
          name: profileName,
          email: profileEmail,
          bio: profileBio
        };
      }
      return p;
    }));

    fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save to database");
        return res.json();
      })
      .then(() => {
        triggerToast("Profile details updated successfully!");
      })
      .catch(err => {
        console.warn("Could not sync profile update to DB:", err);
        triggerToast("Profile updated locally");
      });
  };

  // Client filtering
  const clientBookings = bookings.filter(b => 
    b.clientId === activeProfileId || 
    (currentUser && (b.clientId === currentUser.id || b.clientId === currentUser._id))
  );
  const clientSpent = clientBookings.reduce((sum, b) => {
    const priceVal = typeof b.price === 'number' ? b.price : parseFloat(b.price) || 0;
    return sum + (b.status === 'cancelled' ? 0 : priceVal);
  }, 0);

  const clientOwnedListings = [
    ...jobs.filter(j => j.ownerId === activeProfileId || j.creatorId === activeProfileId || (!j.ownerId && activeProfileId === "prof-1" && j.id === "jb-2")).map(j => ({ ...j, type: "Job Listing", categoryKey: "job" })),
    ...services.filter(s => s.ownerId === activeProfileId || s.creatorId === activeProfileId).map(s => ({ ...s, type: "Service Package", categoryKey: "service" })),
    ...studios.filter(st => st.ownerId === activeProfileId || st.creatorId === activeProfileId).map(st => ({ ...st, type: "Studio Space", categoryKey: "studio" })),
    ...gear.filter(g => g.ownerId === activeProfileId || g.creatorId === activeProfileId).map(g => ({ ...g, type: "Gear Rental", categoryKey: "gear" })),
    ...models.filter(m => m.ownerId === activeProfileId || m.creatorId === activeProfileId).map(m => ({ ...m, type: "Model Listing", categoryKey: "model" }))
  ];

  return (
    <div className="profile-pro-container">
      
      {/* 1. Cover Photo */}
      <div className="profile-cover-banner role-cover-client">
        <img 
          src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80"
          className="cover-img" 
          alt="Creative Background Setup" 
        />
        <div className="cover-glass-overlay">
          <span className="cover-badge-top">Client Workspace</span>
        </div>
      </div>

      {/* 2. Professional Overlapping Creator Identity Block */}
      <div className="profile-header-card">
        <div className="profile-header-inner">
          
          <div className="avatar-overlap-wrap">
            <img 
              src={activeProfile.avatar} 
              className="profile-avatar-pro" 
              alt="Profile Owner Avatar" 
            />
            <span className="avatar-badge-active" title="User Online"></span>
          </div>

          <div className="profile-title-bio-col">
            <div className="profile-name-row">
              <div className="profile-selector-wrap">
                {currentUser?.role === 'admin' ? (
                  <select 
                    value={activeProfileId} 
                    onChange={(e) => setActiveProfileId(e.target.value)}
                    className="profile-active-name-select"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: '22px',
                      fontWeight: '800',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      outline: 'none',
                      paddingRight: '20px'
                    }}
                  >
                    {profiles.filter(p => p.role.includes('client')).map(client => (
                      <option key={client.id} value={client.id} style={{ color: '#000' }}>
                        {client.name} ({client.role})
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="profile-active-name">{activeProfile.name}</span>
                )}
              </div>
              <span className="badge-verified role-badge-client">
                <User size={12} color="white" />
                <span>{activeProfile.role}</span>
              </span>
            </div>
            
            <div className="profile-meta-row">
              <span className="meta-item"><MapPin size={13} color="var(--primary)" /> Hyderabad, TS</span>
              <span className="meta-item-sep">•</span>
              <span className="meta-item">{activeProfile.email}</span>
            </div>

            <p className="profile-bio-pro">{activeProfile.bio}</p>
          </div>

          <div className="profile-header-right-col">
            <div className="profile-stats-row-pro">
              <div className="stat-pill-pro">
                <span className="stat-num-pro">{clientBookings.length}</span>
                <span className="stat-lbl-pro">Bookings</span>
              </div>
              <div className="stat-pill-pro">
                <span className="stat-num-pro">₹{clientSpent.toLocaleString('en-IN')}</span>
                <span className="stat-lbl-pro">Spent</span>
              </div>
              <div className="stat-pill-pro">
                <span className="stat-num-pro">{activeProfile.rating}</span>
                <span className="stat-lbl-pro">Rating</span>
              </div>
            </div>

            <button className="pro-btn-primary theme-btn-client" onClick={handleShare}>
              <Share2 size={13} />
              <span>{shareText}</span>
            </button>
          </div>

        </div>
      </div>

      {/* 3. Dashboard Sidebar Grid Layout */}
      <div className="dashboard-grid-layout">
        
        {/* Left: Navigation Sidebar */}
        <aside className="dashboard-sidebar-menu">
          <div className="dashboard-menu-title">Client Panel</div>
          <div className="profile-tabs-nav-vertical">
            <button 
              className={`profile-nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Activity size={16} />
              <span>My Orders & Bookings</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'bookmarks' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookmarks')}
            >
              <Heart size={16} />
              <span>Favorites Wishlist</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              <Grid size={16} />
              <span>My Posts & Gigs</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Sliders size={16} />
              <span>Profile Settings</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              <Mail size={16} />
              <span>Messages & Chat</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              <DollarSign size={16} />
              <span>Payment History</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'support' ? 'active' : ''}`}
              onClick={() => setActiveTab('support')}
            >
              <Shield size={16} />
              <span>Help & Support</span>
            </button>
          </div>
        </aside>

        {/* Right: Main Content Panel */}
        <main className="dashboard-content-area">
          <div className="profile-tab-content">
        
        {activeTab === 'overview' && (
          <div className="tab-overview-grid">
            
            {/* KPI metrics */}
            <div className="kpi-grid">
              <div className="kpi-card client-card">
                <div className="kpi-icon-wrap client-kpi">
                  <ClipboardList size={20} />
                </div>
                <div className="kpi-info-col">
                  <span className="kpi-val">{clientBookings.length}</span>
                  <span className="kpi-lbl">Bookings Ordered</span>
                  <span className="kpi-trend positive">Active sessions</span>
                </div>
              </div>
              <div className="kpi-card client-card">
                <div className="kpi-icon-wrap client-kpi">
                  <DollarSign size={20} />
                </div>
                <div className="kpi-info-col">
                  <span className="kpi-val">₹{clientSpent.toLocaleString('en-IN')}</span>
                  <span className="kpi-lbl">Total Expenditure</span>
                  <span className="kpi-trend positive">UPI / Card Transactions</span>
                </div>
              </div>
              <div className="kpi-card client-card">
                <div className="kpi-icon-wrap client-kpi">
                  <Heart size={20} />
                </div>
                <div className="kpi-info-col">
                  <span className="kpi-val">{Object.values(likedItems).filter(Boolean).length}</span>
                  <span className="kpi-lbl">Wishlisted Items</span>
                  <span className="kpi-trend positive">Saved for future bookings</span>
                </div>
              </div>
              <div className="kpi-card client-card">
                <div className="kpi-icon-wrap client-kpi">
                  <Clock size={20} />
                </div>
                <div className="kpi-info-col">
                  <span className="kpi-val">{clientBookings.filter(b => b.status === 'confirmed').length}</span>
                  <span className="kpi-lbl">Awaiting Sessions</span>
                  <span className="kpi-trend positive">Upcoming reservations</span>
                </div>
              </div>
            </div>

            {/* Ordered Bookings Tracker */}
            <div className="timeline-full-widget">
              <span className="widget-title">My Orders Booking Timeline</span>
              <div className="timeline-bookings-list">
                {clientBookings.map((b) => (
                  <div key={b.id} className="timeline-booking-row-client">
                    <img src={b.item?.image || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=180&q=80'} className="timeline-row-img" alt={b.item?.title} />
                    <div className="timeline-row-info">
                      <div className="row-title-badge-flex">
                        <span className="row-title-main">{b.item?.title}</span>
                        <span className={`status-badge-chip ${b.status}`}>{b.status}</span>
                      </div>
                      <span className="row-sub-info">Reserved: {b.date} • {b.time} | Category: {b.itemType}</span>
                      <span className="row-price">Invoiced Amount: <strong>{typeof b.price === 'number' ? `₹${b.price.toLocaleString('en-IN')}` : b.price}</strong></span>
                    </div>
                    <div className="row-action-buttons">
                      <button 
                        className="receipt-btn-icon" 
                        onClick={() => { setSelectedBooking(b); setShowReceiptModal(true); }}
                        title="View Invoiced Receipt"
                      >
                        <FileText size={14} /> Receipt
                      </button>
                      {(b.status === 'confirmed' || b.status === 'pending') && (
                        <button 
                          className="cancel-btn-action" 
                          onClick={() => { updateBookingStatus(b.id, 'cancelled'); }}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {clientBookings.length === 0 && (
                  <div className="timeline-empty" style={{ background: 'var(--card-bg)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <Clock size={28} color="var(--text-muted)" />
                    <span style={{ fontWeight: '700', marginTop: '8px' }}>No reservations logged. Book packages or studios in the catalog!</span>
                    <button className="pro-btn-primary theme-btn-client" onClick={() => navigate('/explore')} style={{ marginTop: '12px' }}>Explore Listings</button>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'bookmarks' && (
          <div className="bookmarks-grid-view">
            <h3 className="section-title-pro">Bookmarked Listings Wishlist</h3>
            <div className="profile-favorites-card-pro" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
              <div className="fav-cards-list">
                {studios.filter(s => likedItems[s.id]).map(fav => (
                  <div key={fav.id} className="fav-item-row" onClick={() => openDetails(fav, 'studio')}>
                    <img src={fav.image} className="fav-row-image" alt={fav.title} />
                    <div className="fav-row-info">
                      <span className="fav-row-title">{fav.title}</span>
                      <span className="fav-row-desc">Studio Lot • {fav.location} • ₹{fav.price}/hr</span>
                    </div>
                    <button 
                      className="card-like-btn liked" 
                      onClick={(e) => toggleLike(fav.id, e)}
                    >
                      <Heart size={14} fill="var(--primary)" />
                    </button>
                  </div>
                ))}
                {gear.filter(g => likedItems[g.id]).map(fav => (
                  <div key={fav.id} className="fav-item-row" onClick={() => openDetails(fav, 'gear')}>
                    <img src={fav.image} className="fav-row-image" alt={fav.title} />
                    <div className="fav-row-info">
                      <span className="fav-row-title">{fav.title}</span>
                      <span className="fav-row-desc">Camera Equipment • {fav.category} • ₹{fav.price}/day</span>
                    </div>
                    <button 
                      className="card-like-btn liked" 
                      onClick={(e) => toggleLike(fav.id, e)}
                    >
                      <Heart size={14} fill="var(--primary)" />
                    </button>
                  </div>
                ))}
                {services.filter(s => likedItems[s.id]).map(fav => (
                  <div key={fav.id} className="fav-item-row" onClick={() => openDetails(fav, 'service')}>
                    <img src={fav.image} className="fav-row-image" alt={fav.title} />
                    <div className="fav-row-info">
                      <span className="fav-row-title">{fav.title}</span>
                      <span className="fav-row-desc">Photoshoot Package • ₹{fav.price} Session</span>
                    </div>
                    <button 
                      className="card-like-btn liked" 
                      onClick={(e) => toggleLike(fav.id, e)}
                    >
                      <Heart size={14} fill="var(--primary)" />
                    </button>
                  </div>
                ))}
                {Object.values(likedItems).filter(Boolean).length === 0 && (
                  <span className="fav-empty-note">
                    No saved items in wishlist yet. Browse the explore tab to bookmark.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="tab-portfolio-gallery">
            <div className="listings-header-row">
              <h3 className="section-title-pro">My Posts & Creations</h3>
              <button className="pro-btn-primary theme-btn-client" onClick={() => setShowPortfolioModal(true)}>
                <Plus size={14} /> Upload Creation
              </button>
            </div>

            <div className="portfolio-masonry-grid">
              {portfolioItems.filter(pf => pf.ownerId === activeProfileId).map((pf) => (
                <div key={pf.id} className="portfolio-item-card portrait">
                  <div className="portfolio-img-container">
                    <img src={pf.image} className="portfolio-main-img" alt={pf.title} />
                    <div className="portfolio-hover-overlay">
                      <div className="portfolio-hover-details">
                        <span className="portfolio-item-category">{pf.category}</span>
                        <h4 className="portfolio-item-title">{pf.title}</h4>
                        <div className="portfolio-item-footer" style={{ flexWrap: 'wrap', gap: '8px' }}>
                          <span className="portfolio-likes"><ThumbsUp size={12} /> {pf.likes || 0} Likes</span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <span className="portfolio-action-view" style={{ fontSize: '10px', padding: '3px 8px' }}>View</span>
                            <span 
                              className="portfolio-action-publish" 
                              onClick={(e) => { e.stopPropagation(); setSelectedPostForPublish(pf); setShowPublishModal(true); }}
                              style={{ 
                                backgroundColor: 'var(--primary)', 
                                border: '1px solid var(--primary)', 
                                padding: '3px 8px', 
                                borderRadius: '20px', 
                                fontWeight: '700', 
                                fontSize: '10px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '3px',
                                color: '#fff'
                              }}
                            >
                              <Briefcase size={10} /> Publish
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {portfolioItems.filter(pf => pf.ownerId === activeProfileId).length === 0 && (
                <div className="timeline-empty" style={{ gridColumn: 'span 5', width: '100%', background: 'var(--card-bg)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                  <span style={{ fontWeight: '700' }}>No creations uploaded. Upload reference images or drafts here!</span>
                </div>
              )}
            </div>

            {/* Published listings section */}
            <div style={{ marginTop: '40px' }}>
              <h3 className="section-title-pro">My Published Listings & Jobs</h3>
              <div className="owned-listings-grid">
                {clientOwnedListings.map((item) => (
                  <div key={item.id} className="owned-listing-card">
                    <div className="owned-card-img-wrap">
                      <img src={item.image} className="owned-card-img" alt={item.title} />
                      <span className="owned-card-badge">{item.type}</span>
                    </div>
                    <div className="owned-card-content">
                      <h4 className="owned-card-title">{item.title}</h4>
                      <span className="owned-card-price">₹{item.price}/{item.priceUnit || 'session'}</span>
                      <div className="owned-card-actions">
                        <div className="visibility-control">
                          <span className="visibility-label">Active:</span>
                          <label className="switch">
                            <input 
                              type="checkbox" 
                              checked={item.active} 
                              onChange={() => toggleListingActive(item.categoryKey, item.id)} 
                            />
                            <span className="slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {clientOwnedListings.length === 0 && (
                  <span className="fav-empty-note" style={{ gridColumn: 'span 3', width: '100%' }}>No listings active. Select a post above and click "Publish" to register it in Jobs or Explorer Grid!</span>
                )}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'settings' && (
          <div className="tab-settings-grid">
            <div className="settings-section-card">
              <h3 className="section-title-pro">Workspace Configuration</h3>
              <div className="profile-settings-menu" style={{ border: 'none', padding: 0, boxShadow: 'none' }}>
                <div className="profile-menu-item" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                  <div className="profile-menu-left">
                    <Sliders size={16} />
                    <span>Theme: {theme === 'light' ? 'CreatorVerse Dark' : 'PickMyShoot Light'}</span>
                  </div>
                  <label className="switch" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={theme === 'dark'} 
                      onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="settings-section-card">
              <h3 className="section-title-pro">Update Public Profile Bio</h3>
              <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                <div className="form-group-row">
                  <div className="form-group">
                    <label className="form-label">Display Name</label>
                    <input 
                      type="text" 
                      value={profileName} 
                      onChange={(e) => setProfileName(e.target.value)} 
                      className="form-input-pro" 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Support Email</label>
                    <input 
                      type="email" 
                      value={profileEmail} 
                      onChange={(e) => setProfileEmail(e.target.value)} 
                      className="form-input-pro" 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Public Biography Details</label>
                  <textarea 
                    value={profileBio} 
                    onChange={(e) => setProfileBio(e.target.value)} 
                    className="form-textarea-pro"
                    style={{ minHeight: '80px' }}
                  ></textarea>
                </div>
                <button type="submit" className="pro-btn-primary theme-btn-client" style={{ alignSelf: 'flex-start' }}>
                  Save Account Details
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="chat-layout-grid">
            {/* Sidebar list of sessions */}
            <div className="chat-sidebar-pane">
              <h4 className="section-title-pro" style={{ fontSize: '14px', marginBottom: '8px' }}>Active Dialogues</h4>
              {chatSessions.filter(s => s.participantIds.includes(activeProfileId)).map(session => {
                const partnerId = session.participantIds.find(id => id !== activeProfileId);
                const partner = profiles.find(p => p.id === partnerId) || { name: "Creator Partner", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80", role: "Photographer" };
                return (
                  <div 
                    key={session.id} 
                    onClick={() => setSelectedSessionId(session.id)}
                    className={`chat-session-item ${selectedSessionId === session.id ? 'selected' : ''}`}
                  >
                    <img src={partner.avatar} alt={partner.name} className="chat-session-avatar" />
                    <div className="chat-session-meta">
                      <span className="chat-session-name">{partner.name}</span>
                      <span className="chat-session-lastmsg">{session.lastMessage}</span>
                    </div>
                    <span className="chat-session-time">{session.lastUpdated}</span>
                  </div>
                );
              })}
            </div>

            {/* Main Chat Screen */}
            <div className="chat-window-main">
              {(() => {
                const currentSession = chatSessions.find(s => s.id === selectedSessionId);
                if (!currentSession) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)' }}>Select a conversation to begin chatting.</div>;
                const partnerId = currentSession.participantIds.find(id => id !== activeProfileId);
                const partner = profiles.find(p => p.id === partnerId) || { name: "Creator Partner" };
                const filteredMessages = chatMessages.filter(m => m.sessionId === selectedSessionId);

                return (
                  <>
                    {/* Header */}
                    <div className="chat-header-bar">
                      <img src={partner.avatar} alt={partner.name} className="chat-header-avatar" />
                      <div className="chat-header-info">
                        <span className="chat-header-name">{partner.name}</span>
                        <span className="chat-header-role">{partner.role}</span>
                      </div>
                    </div>

                    {/* Messages Body */}
                    <div className="chat-feed-box">
                      {filteredMessages.map(msg => {
                        const isMe = msg.senderId === activeProfileId;
                        return (
                          <div 
                            key={msg.id} 
                            className={`chat-bubble-wrapper ${isMe ? 'me' : 'partner'}`}
                          >
                            <div className="chat-msg-bubble">
                              {msg.text}
                            </div>
                            <span className="chat-msg-time">
                              {msg.time}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer Form Input */}
                    <form onSubmit={handleSendChat} className="chat-input-row">
                      <input 
                        type="text" 
                        placeholder="Type a message..." 
                        value={chatInputText}
                        onChange={(e) => setChatInputText(e.target.value)}
                        className="chat-text-input"
                      />
                      <button 
                        type="submit" 
                        className="chat-send-btn"
                      >
                        <Send size={15} />
                      </button>
                    </form>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="tab-payments-layout" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 className="section-title-pro">Platform Transaction Ledger</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '-12px' }}>Review receipts, payment statuses, and generated invoices.</p>
            <div className="admin-table-container">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Date Issued</th>
                    <th>Listing / Session</th>
                    <th>Payment Method</th>
                    <th>Amount Paid</th>
                    <th>Billing Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {clientBookings.map(b => (
                    <tr key={b.id}>
                      <td className="bold" title={`TXN-${b.id.toUpperCase()}`}>
                        TXN-{b.id && b.id.length > 8 ? `${b.id.substring(0, 6)}...${b.id.substring(b.id.length - 4)}`.toUpperCase() : b.id.toUpperCase()}
                      </td>
                      <td>{b.date}</td>
                      <td>{b.item?.title}</td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CreditCard size={13} color="var(--primary)" />
                          <span>UPI / Card</span>
                        </span>
                      </td>
                      <td className="bold">{typeof b.price === 'number' ? `₹${b.price.toLocaleString('en-IN')}` : b.price}</td>
                      <td><span className={`status-badge-chip ${b.status}`}>{b.status}</span></td>
                      <td>
                        <button 
                          className="receipt-btn-icon"
                          onClick={() => { setSelectedBooking(b); setShowReceiptModal(true); }}
                        >
                          <FileText size={12} /> Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                  {clientBookings.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>No payment transactions recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="tab-support-layout responsive-two-col-grid">
            {/* Left side: Support Ticket Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="settings-section-card" style={{ margin: 0 }}>
                <h3 className="section-title-pro">Submit Help &amp; Support Ticket</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Encountered a bug or billing discrepancy? Drop a ticket to our administration queue.</p>
                <form onSubmit={handleTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group-row">
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select 
                        value={ticketCategory} 
                        onChange={(e) => setTicketCategory(e.target.value)} 
                        className="form-input-pro"
                      >
                        <option value="Booking Issue">Booking Issue</option>
                        <option value="Billing Refund">Billing Refund</option>
                        <option value="Technical Bug">Technical Bug</option>
                        <option value="General Question">General Question</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subject Headline</label>
                      <input 
                        type="text" 
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        placeholder="Briefly state the issue..."
                        className="form-input-pro"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Detailed Explanation</label>
                    <textarea 
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      placeholder="Please explain the details of the problem..."
                      className="form-textarea-pro"
                      style={{ minHeight: '100px' }}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="pro-btn-primary theme-btn-client" style={{ alignSelf: 'flex-start' }}>
                    File Support Ticket
                  </button>
                </form>
              </div>

              {/* List of active support tickets */}
              <div className="settings-section-card" style={{ margin: 0 }}>
                <h3 className="section-title-pro">My Filed Tickets</h3>
                <div className="ticket-list-container">
                  {tickets.filter(t => t.clientId === activeProfileId).map(ticket => (
                    <div key={ticket.id} className="ticket-card">
                      <div className="ticket-header">
                        <span className="ticket-category-tag">{ticket.category}</span>
                        <span className={`status-badge-chip ${ticket.status === 'open' ? 'pending' : 'completed'}`}>{ticket.status}</span>
                      </div>
                      <h4 className="ticket-title">{ticket.subject}</h4>
                      <p className="ticket-body">{ticket.message}</p>
                      <div className="ticket-footer">
                        <span>Ticket ID: {ticket.id}</span>
                        <span>Opened on: {ticket.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side: FAQs Help Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="settings-section-card" style={{ margin: 0 }}>
                <h3 className="section-title-pro" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <HelpCircle size={16} color="var(--primary)" />
                  <span>Frequently Asked Questions</span>
                </h3>
                <div className="faq-list-container">
                  {[
                    { q: "How do I cancel my booking?", a: "Go to 'My Orders & Bookings' and click 'Cancel Booking' on active rows. Refunds are initiated instantly." },
                    { q: "Are cameras and equipment included in studios?", a: "Each studio listing outlines what is included. Some offer rentals on-site; others are dry hire." },
                    { q: "How are creators verified?", a: "Creators submit portfolios and identity checks. Verified vendors feature the blue star badge." }
                  ].map((faq, i) => (
                    <div key={i} className="faq-card">
                      <span className="faq-question">{faq.q}</span>
                      <span className="faq-answer">{faq.a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
        </main>
      </div>

      {/* Invoice Receipt Viewer Modal */}
      {showReceiptModal && selectedBooking && (
        <div className="profile-modal-overlay" onClick={() => setShowReceiptModal(false)}>
          <div className="profile-modal-body receipt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3 className="section-title-pro" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} color="var(--primary)" />
                <span>Booking Invoice Receipt</span>
              </h3>
              <button className="close-modal-btn" onClick={() => setShowReceiptModal(false)}><X size={16} /></button>
            </div>

            <div className="receipt-content-card">
              <div className="receipt-brand-header">
                <h3>PICKMYSHOOT</h3>
                <span>Invoice: #{selectedBooking.id}</span>
              </div>
              <div className="receipt-meta-grid">
                <div>
                  <span className="label">Date issued</span>
                  <span className="val">{selectedBooking.date}</span>
                </div>
                <div>
                  <span className="label">Category Type</span>
                  <span className="val">{selectedBooking.itemType}</span>
                </div>
                <div>
                  <span className="label">Timing Slot</span>
                  <span className="val">{selectedBooking.time}</span>
                </div>
                <div>
                  <span className="label">Payment Status</span>
                  <span className={`val status-badge-chip ${selectedBooking.status}`}>{selectedBooking.status.toUpperCase()}</span>
                </div>
              </div>

              <div className="receipt-items-table">
                <div className="table-header-row">
                  <span>Reserved Item description</span>
                  <span>Amount</span>
                </div>
                <div className="table-body-row">
                  <span>{selectedBooking.item?.title} ({selectedBooking.itemType})</span>
                  <span>{typeof selectedBooking.price === 'number' ? `₹${selectedBooking.price.toLocaleString('en-IN')}` : selectedBooking.price}</span>
                </div>
                <div className="table-total-divider" />
                <div className="table-total-row">
                  <span>Net Price (Tax included)</span>
                  <span className="total-bold">{typeof selectedBooking.price === 'number' ? `₹${selectedBooking.price.toLocaleString('en-IN')}` : selectedBooking.price}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer-actions">
              <button type="button" className="pro-btn-primary theme-btn-client" onClick={() => { triggerToast("Invoice receipt PDF generated!"); setShowReceiptModal(false); }}>
                Print Receipt
              </button>
              <button type="button" className="modal-cancel-btn" onClick={() => setShowReceiptModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showPortfolioModal && (
        <div className="profile-modal-overlay" onClick={() => setShowPortfolioModal(false)}>
          <div className="profile-modal-body" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3 className="section-title-pro">Upload Reference / Draft Post</h3>
              <button className="close-modal-btn" onClick={() => setShowPortfolioModal(false)}><X size={16} /></button>
            </div>
            
            <form onSubmit={handleAddPortfolioSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
              <div className="form-group">
                <label className="form-label">Post Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Wedding Cinematic Video Reference" 
                  value={pfTitle}
                  onChange={(e) => setPfTitle(e.target.value)}
                  className="form-input-pro"
                  required
                />
              </div>
              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">Post Category</label>
                  <select 
                    value={pfCategory} 
                    onChange={(e) => setPfCategory(e.target.value)} 
                    className="form-input-pro"
                  >
                    <option value="Bridal / Ethnic Wear">Bridal / Wedding</option>
                    <option value="Product / Commercial">E-Commerce Product</option>
                    <option value="Western / Editorial">Western Fashion</option>
                    <option value="Cinematography / Nature">Cinematography</option>
                    <option value="Jobs & Gigs">Jobs & Gigs Reference</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Reference Image URL</label>
                  <input 
                    type="text" 
                    value={pfImage}
                    onChange={(e) => setPfImage(e.target.value)}
                    className="form-input-pro"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Quick Image Preview</label>
                <div className="preview-image-box-modal">
                  <img src={pfImage} alt="Portfolio preview" className="modal-preview-img" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80" }} />
                </div>
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setShowPortfolioModal(false)}>Cancel</button>
                <button type="submit" className="pro-btn-primary theme-btn-client">Upload Post</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPublishModal && (
        <PublishListingModal 
          isOpen={showPublishModal}
          onClose={() => { setShowPublishModal(false); setSelectedPostForPublish(null); }}
          post={selectedPostForPublish}
          onPublish={(listingData) => {
            publishPostToListing(listingData);
          }}
        />
      )}

    </div>
  );
};

export default ClientDashboard;
