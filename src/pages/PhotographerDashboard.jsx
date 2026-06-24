import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  MapPin, 
  Award,
  TrendingUp,
  DollarSign,
  Activity,
  Eye,
  CheckCircle2,
  Clock,
  Grid,
  Trash2,
  ThumbsUp,
  X,
  Upload,
  Camera,
  Plus,
  Mail,
  Send,
  Calendar,
  FileText,
  Lock,
  Check,
  Share2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const PhotographerDashboard = () => {
  const {
    theme,
    setTheme,
    bookings,
    services,
    gear,
    studios,
    triggerToast,
    profiles,
    setProfiles,
    activeProfileId,
    toggleListingActive,
    updateBookingStatus,
    addPortfolioItem,
    portfolioItems,
    chatSessions,
    chatMessages,
    sendChatMessage,
    currentUser
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

  // Portfolio image upload modal state
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [pfTitle, setPfTitle] = useState('');
  const [pfCategory, setPfCategory] = useState('Western / Editorial');
  const [pfImage, setPfImage] = useState('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80');

  // Chat window states
  const [selectedSessionId, setSelectedSessionId] = useState('ch-1');
  const [chatInputText, setChatInputText] = useState('');

  // Calendar Availability states
  const [blockedDates, setBlockedDates] = useState(['2026-06-22', '2026-06-25']);
  const [workingHoursStart, setWorkingHoursStart] = useState('09:00 AM');
  const [workingHoursEnd, setWorkingHoursEnd] = useState('06:00 PM');
  const [newBlockedDate, setNewBlockedDate] = useState('');

  // Invoice generator states
  const [selectedInvoiceBookingId, setSelectedInvoiceBookingId] = useState('');
  const [invoiceNotes, setInvoiceNotes] = useState('Thank you for choosing PickMyShoot! We look forward to working together.');
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;
    sendChatMessage(selectedSessionId, chatInputText.trim());
    setChatInputText('');
  };

  const handleAddBlockedDate = (e) => {
    e.preventDefault();
    if (!newBlockedDate) return;
    if (blockedDates.includes(newBlockedDate)) {
      triggerToast("Date is already blocked!");
      return;
    }
    setBlockedDates(prev => [...prev, newBlockedDate]);
    setNewBlockedDate('');
    triggerToast("Availability calendar updated! Date blocked.");
  };

  const handleRemoveBlockedDate = (date) => {
    setBlockedDates(prev => prev.filter(d => d !== date));
    triggerToast("Date unblocked! Available for bookings.");
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

  // Photographer filtering & data
  const photographerBookings = bookings.filter(b => 
    b.ownerId === activeProfileId || 
    b.creatorId === activeProfileId || 
    (currentUser && (b.ownerId === currentUser.id || b.ownerId === currentUser._id || b.creatorId === currentUser.id || b.creatorId === currentUser._id))
  );
  const photographerEarnings = photographerBookings.reduce((sum, b) => {
    const priceVal = typeof b.price === 'number' ? b.price : parseFloat(b.price) || 0;
    return sum + (b.status === 'confirmed' || b.status === 'completed' ? priceVal : 0);
  }, 0);
  const photographerOwnedListings = [
    ...services.filter(s => s.ownerId === activeProfileId || (!s.ownerId && activeProfileId === "prof-photographer" && (s.id === "ps-1" || s.id === "ps-9"))).map(s => ({ ...s, type: "Service Package", categoryKey: "service" })),
    ...gear.filter(g => g.ownerId === activeProfileId || (!g.ownerId && activeProfileId === "prof-photographer" && (g.id === "gr-1" || g.id === "gr-6"))).map(g => ({ ...g, type: "Gear Rental", categoryKey: "gear" })),
    ...studios.filter(st => st.ownerId === activeProfileId).map(st => ({ ...st, type: "Studio Space", categoryKey: "studio" }))
  ];

  return (
    <div className="profile-pro-container">
      
      {/* 1. Cover Photo */}
      <div className="profile-cover-banner role-cover-photographer">
        <img 
          src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80"
          className="cover-img" 
          alt="Creative Background Setup" 
        />
        <div className="cover-glass-overlay">
          <span className="cover-badge-top">Verified Creator Studio</span>
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
                <span className="profile-active-name">{activeProfile.name}</span>
              </div>
              <span className="badge-verified role-badge-photographer">
                <Camera size={12} color="white" />
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
                <span className="stat-num-pro">{photographerBookings.length}</span>
                <span className="stat-lbl-pro">Gigs</span>
              </div>
              <div className="stat-pill-pro">
                <span className="stat-num-pro">₹{photographerEarnings.toLocaleString('en-IN')}</span>
                <span className="stat-lbl-pro">Revenue</span>
              </div>
              <div className="stat-pill-pro">
                <span className="stat-num-pro">{activeProfile.rating}</span>
                <span className="stat-lbl-pro">Rating</span>
              </div>
            </div>

            <button className="pro-btn-primary theme-btn-photographer" onClick={handleShare}>
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
          <div className="dashboard-menu-title">Creator Panel</div>
          <div className="profile-tabs-nav-vertical">
            <button 
              className={`profile-nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Activity size={16} />
              <span>Creator Overview</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'portfolio' ? 'active' : ''}`}
              onClick={() => setActiveTab('portfolio')}
            >
              <Camera size={16} />
              <span>My Showcase Portfolio</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'listings' ? 'active' : ''}`}
              onClick={() => setActiveTab('listings')}
            >
              <Grid size={16} />
              <span>Catalog Visibility</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
            >
              <Calendar size={16} />
              <span>Availability Calendar</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              <Mail size={16} />
              <span>Messages &amp; Chat</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'invoices' ? 'active' : ''}`}
              onClick={() => setActiveTab('invoices')}
            >
              <FileText size={16} />
              <span>Invoice Generator</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Sliders size={16} />
              <span>Profile Settings</span>
            </button>
          </div>
        </aside>

        {/* Right: Main Content Panel */}
        <main className="dashboard-content-area">
          <div className="profile-tab-content">
        
        {activeTab === 'overview' && (
          <div className="tab-overview-grid">
            
            {/* KPI grid */}
            <div className="kpi-grid">
              <div className="kpi-card photographer-card">
                <div className="kpi-icon-wrap photographer-kpi">
                  <DollarSign size={20} />
                </div>
                <div className="kpi-info-col">
                  <span className="kpi-val">₹{photographerEarnings.toLocaleString('en-IN')}</span>
                  <span className="kpi-lbl">Gross Earnings</span>
                  <span className="kpi-trend positive"><TrendingUp size={12} /> Confirmed Gigs</span>
                </div>
              </div>
              <div className="kpi-card photographer-card">
                <div className="kpi-icon-wrap photographer-kpi">
                  <Clock size={20} />
                </div>
                <div className="kpi-info-col">
                  <span className="kpi-val">{photographerBookings.length}</span>
                  <span className="kpi-lbl">Bookings Received</span>
                  <span className="kpi-trend positive">Total bookings volume</span>
                </div>
              </div>
              <div className="kpi-card photographer-card">
                <div className="kpi-icon-wrap photographer-kpi">
                  <Eye size={20} />
                </div>
                <div className="kpi-info-col">
                  <span className="kpi-val">{activeProfile.views}</span>
                  <span className="kpi-lbl">Profile Views</span>
                  <span className="kpi-trend positive">Monthly reach stats</span>
                </div>
              </div>
              <div className="kpi-card photographer-card">
                <div className="kpi-icon-wrap photographer-kpi">
                  <Award size={20} />
                </div>
                <div className="kpi-info-col">
                  <span className="kpi-val">{activeProfile.success || '98.5%'}</span>
                  <span className="kpi-lbl">Success Rate</span>
                  <span className="kpi-trend positive">Completed sessions</span>
                </div>
              </div>
            </div>

            {/* Split row: SVG chart & bookings requests list */}
            <div className="overview-split-row">
              {/* Monthly earnings chart */}
              <div className="analytics-card-widget">
                <span className="widget-title">Creator Monthly Revenue Stream</span>
                <span className="widget-desc">Dynamic visual chart tracking shoots vs equipment earnings.</span>
                <div className="graph-container">
                  <div className="graph-bars-wrap">
                    {[
                      { month: "Jan", shoots: 30, gear: 10 },
                      { month: "Feb", shoots: 45, gear: 15 },
                      { month: "Mar", shoots: 60, gear: 25 },
                      { month: "Apr", shoots: 80, gear: 30 },
                      { month: "May", shoots: 95, gear: 40 },
                      { month: "Jun", shoots: 120, gear: 50 }
                    ].map((g, idx) => (
                      <div key={idx} className="graph-column-group">
                        <div className="bars-stack">
                          <div className="bar bar-shoots bar-photog" style={{ height: `${g.shoots * 1.2}px` }} title={`Shoots: ₹${g.shoots * 1000}`} />
                          <div className="bar bar-gear" style={{ height: `${g.gear * 1.2}px` }} title={`Gear: ₹${g.gear * 1000}`} />
                        </div>
                        <span className="graph-label">{g.month}</span>
                      </div>
                    ))}
                  </div>
                  <div className="graph-legend">
                    <div className="legend-item">
                      <div className="legend-color-dot" style={{ background: 'var(--primary)' }} />
                      <span>Photoshoot Gigs</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color-dot" style={{ background: 'var(--primary-sec)' }} />
                      <span>Gear Rentals</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Incoming Booking Gigs requests manager */}
              <div className="schedule-timeline-card">
                <span className="widget-title">Incoming Customer Reservations</span>
                <span className="widget-desc">Moderate incoming shoot requests and completed sessions.</span>
                <div className="timeline-list">
                  {photographerBookings.map((b) => {
                    const clientProfile = profiles.find(p => p.id === b.clientId || p._id === b.clientId);
                    const clientName = clientProfile?.name || b.clientName || "Customer Partnership";
                    const clientAvatar = clientProfile?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80";

                    return (
                      <div key={b.id} className="request-card-item">
                        <div className="request-header-row">
                          <div className="request-client-info">
                            <img src={clientAvatar} alt={clientName} className="req-client-avatar" />
                            <div>
                              <span className="req-client-name">{clientName}</span>
                              <span className="req-time-slot">{b.date} • {b.time}</span>
                            </div>
                          </div>
                          <span className={`status-badge-chip ${b.status}`}>{b.status}</span>
                        </div>
                      
                      <span className="request-listing-title">{b.item?.title || 'Photoshoot Package Session'}</span>
                      <span className="request-price-tag">Amount Due: <strong>{typeof b.price === 'number' ? `₹${b.price.toLocaleString('en-IN')}` : b.price}</strong></span>
                      
                      <div className="request-actions-row">
                        {b.status === 'pending' && (
                          <>
                            <button className="action-btn-sm confirm-btn" onClick={() => updateBookingStatus(b.id, 'confirmed')}>Accept Session</button>
                            <button className="action-btn-sm decline-btn" onClick={() => updateBookingStatus(b.id, 'cancelled')}>Decline</button>
                          </>
                        )}
                        {b.status === 'confirmed' && (
                          <button className="action-btn-sm confirm-btn" onClick={() => updateBookingStatus(b.id, 'completed')}>Complete Shoot</button>
                        )}
                        {b.status === 'completed' && (
                          <span className="completed-success-tag">Completed ✓ Paid</span>
                        )}
                        {b.status === 'cancelled' && (
                          <span className="cancelled-fail-tag">Declined</span>
                        )}
                      </div>
                    </div>
                  );
                })}
                  {photographerBookings.length === 0 && (
                    <div className="timeline-empty">
                      <Clock size={28} />
                      <span>No customer requests received yet. Explore listings will list you in search index!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="tab-portfolio-gallery">
            <div className="listings-header-row">
              <h3 className="section-title-pro">Showcase Portfolio Shots</h3>
              <button className="pro-btn-primary theme-btn-photographer" onClick={() => setShowPortfolioModal(true)}>
                <Plus size={14} /> Upload Creation
              </button>
            </div>

            <div className="portfolio-masonry-grid">
              {portfolioItems.map((pf) => (
                <div key={pf.id} className="portfolio-item-card portrait">
                  <div className="portfolio-img-container">
                    <img src={pf.image} className="portfolio-main-img" alt={pf.title} />
                    <div className="portfolio-hover-overlay">
                      <div className="portfolio-hover-details">
                        <span className="portfolio-item-category">{pf.category}</span>
                        <h4 className="portfolio-item-title">{pf.title}</h4>
                        <div className="portfolio-item-footer">
                          <span className="portfolio-likes"><ThumbsUp size={12} /> 120 Likes</span>
                          <span className="portfolio-action-view">View Shot</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="tab-listings-view">
            <h3 className="section-title-pro">My Registered Catalog Items</h3>
            <div className="owned-listings-grid">
              {photographerOwnedListings.map((item) => (
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
              {photographerOwnedListings.length === 0 && (
                <span className="fav-empty-note">No listings cataloged under your profile. Contact support to register models/equipment.</span>
              )}
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
                const partner = profiles.find(p => p.id === partnerId) || { name: "Client Partner", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80", role: "Client" };
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
                const partner = profiles.find(p => p.id === partnerId) || { name: "Client Partner" };
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

        {activeTab === 'calendar' && (
          <div className="tab-calendar-availability-layout responsive-two-col-grid">
            {/* Left side: operating settings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="settings-section-card" style={{ margin: 0 }}>
                <h3 className="section-title-pro">
                  <Calendar size={18} color="var(--primary)" />
                  <span>Working Hours &amp; Weekly Schedule</span>
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Configure weekly operating slots for automatic booking confirmation gates.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group-row">
                    <div className="form-group">
                      <label className="form-label">Active Start Time</label>
                      <select value={workingHoursStart} onChange={(e) => setWorkingHoursStart(e.target.value)} className="form-input-pro">
                        <option value="08:00 AM">08:00 AM</option>
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Active End Time</label>
                      <select value={workingHoursEnd} onChange={(e) => setWorkingHoursEnd(e.target.value)} className="form-input-pro">
                        <option value="05:00 PM">05:00 PM</option>
                        <option value="06:00 PM">06:00 PM</option>
                        <option value="07:00 PM">07:00 PM</option>
                        <option value="08:00 PM">08:00 PM</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--bg-app)', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: '800', display: 'block', color: 'var(--text-main)' }}>Confirm Bookings Automatically</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Lock dates immediately if customer selects a free slot.</span>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Blocked Dates list */}
              <div className="settings-section-card" style={{ margin: 0 }}>
                <h3 className="section-title-pro">Blocked Vacation Dates</h3>
                <div className="blocked-dates-grid">
                  {blockedDates.map(date => (
                    <div key={date} className="blocked-date-tag">
                      <Lock size={12} />
                      <span>{date}</span>
                      <button 
                        onClick={() => handleRemoveBlockedDate(date)}
                        className="blocked-date-remove-btn"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {blockedDates.length === 0 && (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No vacation days blocked. Open for all dates!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right side: Block new date form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="settings-section-card" style={{ margin: 0 }}>
                <h3 className="section-title-pro">Block Calendar Slot</h3>
                <form onSubmit={handleAddBlockedDate} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Select Date to Block</label>
                    <input 
                      type="date" 
                      value={newBlockedDate}
                      onChange={(e) => setNewBlockedDate(e.target.value)}
                      className="form-input-pro"
                      required
                    />
                  </div>
                  <button type="submit" className="pro-btn-primary theme-btn-photographer" style={{ width: '100%' }}>
                    Block Date
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="tab-invoices-generator-layout responsive-two-col-grid invoice-grid">
            {/* Left side: Invoice Creator Settings */}
            <div className="settings-section-card" style={{ margin: 0 }}>
              <h3 className="section-title-pro">
                <FileText size={18} color="var(--primary)" />
                <span>Invoice Builder</span>
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Draft and customize professional transaction bills for your clients.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Select Client Session Booking</label>
                  <select 
                    value={selectedInvoiceBookingId} 
                    onChange={(e) => setSelectedInvoiceBookingId(e.target.value)} 
                    className="form-input-pro"
                  >
                    <option value="">-- Choose confirmed booking --</option>
                    {photographerBookings.map(b => (
                      <option key={b.id} value={b.id}>{b.item?.title} - {b.date} (₹{b.price})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label className="form-label">Discount Percent (%)</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="100" 
                      value={invoiceDiscount}
                      onChange={(e) => setInvoiceDiscount(Number(e.target.value))}
                      className="form-input-pro"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Currency Unit</label>
                    <input type="text" value="INR (₹)" disabled className="form-input-pro" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Client Notes &amp; Terms</label>
                  <textarea 
                    value={invoiceNotes}
                    onChange={(e) => setInvoiceNotes(e.target.value)}
                    className="form-textarea-pro"
                    style={{ minHeight: '80px' }}
                  ></textarea>
                </div>

                <button 
                  type="button" 
                  disabled={!selectedInvoiceBookingId}
                  onClick={() => setShowInvoicePreview(true)}
                  className="pro-btn-primary theme-btn-photographer" 
                  style={{ alignSelf: 'flex-start' }}
                >
                  Generate Invoice Preview
                </button>
              </div>
            </div>

            {/* Right side: Interactive Invoice Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="live-invoice-placeholder">
                <FileText size={32} />
                <span style={{ fontSize: '13px', fontWeight: '800', marginTop: '10px', display: 'block', color: 'var(--text-main)' }}>Live Invoice View</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px', maxWidth: '240px' }}>Select a customer booking on the left to review the PDF receipt invoice draft.</span>
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
                <button type="submit" className="pro-btn-primary theme-btn-photographer" style={{ alignSelf: 'flex-start' }}>
                  Save Account Details
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
        </main>
      </div>

      {/* Preview Modal Overlay */}
      {showInvoicePreview && (() => {
        const bookingObj = bookings.find(b => b.id === selectedInvoiceBookingId);
        if (!bookingObj) return null;
        const priceVal = typeof bookingObj.price === 'number' ? bookingObj.price : parseFloat(bookingObj.price) || 0;
        const discAmt = Math.round(priceVal * (invoiceDiscount / 100));
        const finalPrice = priceVal - discAmt;
        return (
          <div className="profile-modal-overlay" onClick={() => setShowInvoicePreview(false)}>
            <div className="profile-modal-body receipt-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-row">
                <h3 className="section-title-pro" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={18} color="var(--primary)" />
                  <span>Generated Invoice Draft</span>
                </h3>
                <button className="close-modal-btn" onClick={() => setShowInvoicePreview(false)}><X size={16} /></button>
              </div>

              <div className="receipt-content-card">
                <div className="receipt-brand-header">
                  <div>
                    <h3>{activeProfile.name.toUpperCase()}</h3>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Creator Studio, Hyderabad</span>
                  </div>
                  <span>Draft Invoice: #{bookingObj.id}</span>
                </div>
                <div className="receipt-meta-grid">
                  <div>
                    <span className="label">Client Partner</span>
                    <span className="val">{(profiles.find(p => p.id === bookingObj.clientId) || { name: 'Client' }).name}</span>
                  </div>
                  <div>
                    <span className="label">Date issued</span>
                    <span className="val">{bookingObj.date}</span>
                  </div>
                  <div>
                    <span className="label">Status</span>
                    <span className="val" style={{ color: 'var(--primary)', fontWeight: '800' }}>DRAFT INVOICE</span>
                  </div>
                </div>

                <div className="receipt-items-table">
                  <div className="table-header-row">
                    <span>Reserved Session</span>
                    <span>Amount</span>
                  </div>
                  <div className="table-body-row">
                    <span>{bookingObj.item?.title}</span>
                    <span>{typeof bookingObj.price === 'number' ? `₹${bookingObj.price.toLocaleString('en-IN')}` : bookingObj.price}</span>
                  </div>
                  {invoiceDiscount > 0 && (
                    <div className="table-body-row" style={{ color: '#e74c3c' }}>
                      <span>Discount ({invoiceDiscount}%)</span>
                      <span>-₹{discAmt.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="table-total-divider" />
                  <div className="table-total-row">
                    <span>Final Total Due</span>
                    <span className="total-bold">₹{finalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div style={{ marginTop: '16px', background: 'var(--bg-app)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', display: 'block', color: 'var(--text-main)', textTransform: 'uppercase' }}>Notes &amp; terms</span>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>{invoiceNotes}</p>
                </div>
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="pro-btn-primary theme-btn-photographer" onClick={() => { triggerToast("Draft Invoice PDF printed successfully!"); setShowInvoicePreview(false); }}>
                  Confirm &amp; Send Client
                </button>
                <button type="button" className="modal-cancel-btn" onClick={() => setShowInvoicePreview(false)}>Cancel</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Portfolio Creation Modal */}
      {showPortfolioModal && (
        <div className="profile-modal-overlay" onClick={() => setShowPortfolioModal(false)}>
          <div className="profile-modal-body" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3 className="section-title-pro">Publish New Portfolio Shot</h3>
              <button className="close-modal-btn" onClick={() => setShowPortfolioModal(false)}><X size={16} /></button>
            </div>
            
            <form onSubmit={handleAddPortfolioSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
              <div className="form-group">
                <label className="form-label">Creation Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Vintage Outdoor Cinematic Portrait" 
                  value={pfTitle}
                  onChange={(e) => setPfTitle(e.target.value)}
                  className="form-input-pro"
                  required
                />
              </div>
              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">Specialization Category</label>
                  <select 
                    value={pfCategory} 
                    onChange={(e) => setPfCategory(e.target.value)} 
                    className="form-input-pro"
                  >
                    <option value="Bridal / Ethnic Wear">Bridal / Wedding</option>
                    <option value="Product / Commercial">E-Commerce Product</option>
                    <option value="Western / Editorial">Western Fashion</option>
                    <option value="Cinematography / Nature">Cinematography</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Creation Image URL</label>
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
                <button type="submit" className="pro-btn-primary theme-btn-photographer">Upload Photo</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PhotographerDashboard;
