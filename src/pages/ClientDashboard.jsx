import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  User, 
  Heart, 
  MapPin, 
  Activity, 
  Clock, 
  Grid, 
  X, 
  FileText,
  ClipboardList,
  Mail,
  Shield,
  Send,
  HelpCircle,
  CreditCard,
  LogOut,
  ArrowLeft,
  CheckCircle,
  Info
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const {
    bookings,
    likedItems,
    toggleLike,
    studios,
    gear,
    services,
    openDetails,
    triggerToast,
    profiles,
    setProfiles,
    activeProfileId,
    setActiveProfileId,
    tickets,
    addSupportTicket,
    chatSessions,
    chatMessages,
    sendChatMessage,
    currentUser,
    logoutUser
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

  // Client Receipt Viewer state
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Support ticket form states
  const [ticketCategory, setTicketCategory] = useState('Booking Issue');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  // Chat window states
  const [selectedSessionId, setSelectedSessionId] = useState('ch-1');
  const [chatInputText, setChatInputText] = useState('');

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

  // Filter saved/liked catalog items
  const savedStudios = studios.filter(s => likedItems[s.id]);
  const savedGear = gear.filter(g => likedItems[g.id]);
  const savedServices = services.filter(s => likedItems[s.id]);
  const totalSavedCount = savedStudios.length + savedGear.length + savedServices.length;

  return (
    <div className="admin-console-page">
      
      {/* 1. Header Corporate Red Bar */}
      <header className="admin-console-header">
        <div className="admin-console-header-inner">
          <div className="logo-container" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src="/logo.png" className="header-brand-logo" alt="PickMyShoot" />
          </div>
        </div>
      </header>

      {/* 2. Subheader Dark System Toolbar */}
      <div className="admin-console-toolbar">
        <div className="toolbar-left">
          <span className="toolbar-link active">client workspace</span>
          <span className="toolbar-sep">|</span>
          <button className="toolbar-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={12} style={{ marginRight: '4px' }} />
            switch to user view
          </button>
          <span className="toolbar-sep">|</span>
          <button className="toolbar-btn" onClick={() => { logoutUser(); navigate('/'); }}>
            <LogOut size={12} style={{ marginRight: '4px' }} />
            logout
          </button>
        </div>
        <div className="toolbar-right">
          <span className="superadmin-access-badge" style={{ color: '#00c864' }}>
            <User size={13} style={{ marginRight: '4px' }} />
            CLIENT ACCESS
          </span>
        </div>
      </div>

      {/* 3. Client Console Title Card */}
      <div className="console-title-card">
        <h2 className="console-main-title">PickMyShoot Client Management Center</h2>
        <span className="console-role-desc">
          <strong>User:</strong> {activeProfile.name} ({activeProfile.email})
        </span>
      </div>

      {/* 4. Split Dashboard Grid */}
      <div className="dashboard-grid-layout" style={{ padding: '0 24px 24px 24px' }}>
        
        {/* Left: Navigation Sidebar */}
        <aside className="dashboard-sidebar-menu" style={{ top: '150px' }}>
          <div className="dashboard-menu-title">Client Workspace</div>
          <div className="profile-tabs-nav-vertical">
            <button 
              className={`profile-nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Activity size={16} />
              <span>Workspace Overview</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <ClipboardList size={16} />
              <span>My Booking Orders ({clientBookings.length})</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'liked' ? 'active' : ''}`}
              onClick={() => setActiveTab('liked')}
            >
              <Heart size={16} />
              <span>Saved Listings ({totalSavedCount})</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <Mail size={16} />
              <span>Chat Support</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'support' ? 'active' : ''}`}
              onClick={() => setActiveTab('support')}
            >
              <Shield size={16} />
              <span>Support Tickets ({tickets.length})</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Sliders size={16} />
              <span>Settings</span>
            </button>
          </div>
        </aside>

        {/* Right: Main Content Panel */}
        <main className="dashboard-content-area">
          <div className="profile-tab-content" style={{ marginTop: 0 }}>
            
            {activeTab === 'overview' && (
              <div className="tab-overview-grid">
                
                {/* 3 Dashed KPI Cards */}
                <div className="overview-kpi-container" style={{ gap: '20px' }}>
                  <div className="overview-kpi-card border-dashed-red" style={{ flex: 1 }}>
                    <span className="kpi-number text-red">{clientBookings.length}</span>
                    <span className="kpi-label">TOTAL BOOKINGS PLACED</span>
                  </div>
                  <div className="overview-kpi-card border-dashed-green bg-green-light" style={{ flex: 1 }}>
                    <span className="kpi-number text-green">{totalSavedCount}</span>
                    <span className="kpi-label">SAVED FAVORITES</span>
                  </div>
                  <div className="overview-kpi-card border-dashed-red" style={{ flex: 1 }}>
                    <span className="kpi-number text-dark">₹{clientSpent.toLocaleString('en-IN')}</span>
                    <span className="kpi-label">TOTAL SALES TRANSACTION VOLUME</span>
                  </div>
                </div>

                {/* Sub-panels inside Overview */}
                <div className="overview-split-row" style={{ marginTop: '24px' }}>
                  
                  {/* Recent Bookings Box */}
                  <div className="analytics-card-widget" style={{ minHeight: 'auto' }}>
                    <span className="widget-title">Active Booking Schedule</span>
                    {clientBookings.length === 0 ? (
                      <p className="muted-italic">No bookings recorded yet.</p>
                    ) : (
                      <div className="admin-log-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {clientBookings.slice(0, 3).map(b => (
                          <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                            <div>
                              <strong style={{ color: 'var(--primary)', display: 'block' }}>{b.title}</strong>
                              <span style={{ fontSize: '12px', color: '#666' }}>📅 {b.date} • {b.time}</span>
                            </div>
                            <span className={`status-badge-chip ${b.status}`} style={{ textTransform: 'capitalize' }}>{b.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Settings shortcut card */}
                  <div className="schedule-timeline-card" style={{ minHeight: 'auto' }}>
                    <span className="widget-title">Account details</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px' }}>
                      <p><strong>Name:</strong> {activeProfile.name}</p>
                      <p><strong>Email:</strong> {activeProfile.email}</p>
                      <p><strong>Bio:</strong> {activeProfile.bio || 'Add a bio inside Settings.'}</p>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="admin-bookings-view">
                <h3 className="section-title-pro" style={{ color: '#222', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                  My Booking Orders Directory
                </h3>
                {clientBookings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    <ClipboardList size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                    <p style={{ fontWeight: '700' }}>No reservations logged. Book packages or studios in the catalog!</p>
                  </div>
                ) : (
                  <div className="admin-table-container">
                    <table className="console-data-table">
                      <thead>
                        <tr>
                          <th>Item Title</th>
                          <th>Reserved Date</th>
                          <th>Timing</th>
                          <th>Total Paid</th>
                          <th>Status</th>
                          <th>Receipt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientBookings.map(b => (
                          <tr key={b.id}>
                            <td className="bold" style={{ color: '#c7100d' }}>{b.title}</td>
                            <td>{b.date}</td>
                            <td>{b.time}</td>
                            <td className="bold">{typeof b.price === 'number' ? `₹${b.price.toLocaleString('en-IN')}` : b.price}</td>
                            <td>
                              <span className={`status-badge-chip ${b.status}`}>{b.status}</span>
                            </td>
                            <td>
                              <button 
                                className="console-action-btn claim-btn"
                                style={{ background: '#111', padding: '6px 10px' }}
                                onClick={() => { setSelectedBooking(b); setShowReceiptModal(true); }}
                              >
                                <FileText size={12} style={{ marginRight: '4px' }} />
                                View Receipt
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'liked' && (
              <div>
                <h3 className="section-title-pro" style={{ color: '#222', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                  Saved Favorites Directory
                </h3>
                {totalSavedCount === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    <Heart size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                    <p style={{ fontWeight: '700' }}>No favorite items saved yet.</p>
                  </div>
                ) : (
                  <div className="desktop-card-grid-3" style={{ gap: '20px', marginTop: '20px' }}>
                    {savedStudios.map(s => (
                      <div key={s.id} className="service-card" style={{ cursor: 'pointer' }} onClick={() => openDetails(s, 'studio')}>
                        <div className="card-img-wrap">
                          <img src={s.image} className="card-image" alt={s.title} />
                        </div>
                        <div className="card-info">
                          <span className="card-title">{s.title}</span>
                          <span className="card-price-value" style={{ color: '#666', fontSize: '12px' }}>Studio Space</span>
                        </div>
                      </div>
                    ))}
                    {savedGear.map(g => (
                      <div key={g.id} className="service-card" style={{ cursor: 'pointer' }} onClick={() => openDetails(g, 'gear')}>
                        <div className="card-img-wrap">
                          <img src={g.image} className="card-image" alt={g.title} />
                        </div>
                        <div className="card-info">
                          <span className="card-title">{g.title}</span>
                          <span className="card-price-value" style={{ color: '#666', fontSize: '12px' }}>Gear Rental</span>
                        </div>
                      </div>
                    ))}
                    {savedServices.map(sv => (
                      <div key={sv.id} className="service-card" style={{ cursor: 'pointer' }} onClick={() => openDetails(sv, 'service')}>
                        <div className="card-img-wrap">
                          <img src={sv.image} className="card-image" alt={sv.title} />
                        </div>
                        <div className="card-info">
                          <span className="card-title">{sv.title}</span>
                          <span className="card-price-value" style={{ color: '#666', fontSize: '12px' }}>Photography Package</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="admin-bookings-view">
                <h3 className="section-title-pro" style={{ color: '#222', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                  Chat Support Channels
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px', marginTop: '20px', minHeight: '400px' }}>
                  
                  {/* Channels Sidebar */}
                  <div style={{ borderRight: '1px solid #ddd', paddingRight: '15px' }}>
                    {chatSessions.map(sess => (
                      <div 
                        key={sess.id} 
                        onClick={() => setSelectedSessionId(sess.id)}
                        style={{ 
                          padding: '12px', 
                          borderRadius: '8px', 
                          cursor: 'pointer',
                          background: selectedSessionId === sess.id ? '#c7100d' : '#f9f9f9',
                          color: selectedSessionId === sess.id ? 'white' : '#333',
                          marginBottom: '8px',
                          fontWeight: '600'
                        }}
                      >
                        {sess.recipientName}
                      </div>
                    ))}
                  </div>

                  {/* Chat window */}
                  <div style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '10px', background: '#fcfcfc', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {chatMessages.filter(m => m.sessionId === selectedSessionId).map(msg => {
                        const isMe = msg.senderId === activeProfileId;
                        return (
                          <div 
                            key={msg.id} 
                            style={{ 
                              alignSelf: isMe ? 'flex-end' : 'flex-start',
                              background: isMe ? '#c7100d' : '#e0e0e0',
                              color: isMe ? 'white' : '#333',
                              padding: '10px 14px',
                              borderRadius: '12px',
                              maxWidth: '70%',
                              fontSize: '13.5px'
                            }}
                          >
                            {msg.text}
                          </div>
                        );
                      })}
                    </div>
                    
                    <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <input 
                        type="text" 
                        placeholder="Type a message..." 
                        value={chatInputText}
                        onChange={e => setChatInputText(e.target.value)}
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                      />
                      <button type="submit" className="console-action-btn mail-btn" style={{ padding: '10px 16px' }}>
                        <Send size={14} />
                      </button>
                    </form>

                  </div>

                </div>
              </div>
            )}

            {activeTab === 'support' && (
              <div className="admin-bookings-view">
                <h3 className="section-title-pro" style={{ color: '#222', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                  Support Ticket Management
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
                  
                  {/* Create Ticket */}
                  <form onSubmit={handleTicketSubmit} className="settings-form" style={{ gap: '16px' }}>
                    <h4 style={{ margin: 0, fontWeight: '700' }}>Submit new support request</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '700' }}>Category</label>
                      <select 
                        value={ticketCategory}
                        onChange={e => setTicketCategory(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                      >
                        <option value="Booking Issue">Booking Issue</option>
                        <option value="Payment Issue">Payment Issue</option>
                        <option value="Account Dispute">Account Dispute</option>
                        <option value="Feedback">Feedback</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '700' }}>Subject</label>
                      <input 
                        type="text" 
                        value={ticketSubject}
                        onChange={e => setTicketSubject(e.target.value)}
                        placeholder="Brief summary of issue"
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '700' }}>Detailed message</label>
                      <textarea 
                        value={ticketMessage}
                        onChange={e => setTicketMessage(e.target.value)}
                        placeholder="Provide details about the issue..."
                        rows="4"
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit' }}
                      />
                    </div>

                    <button type="submit" className="console-action-btn mail-btn" style={{ padding: '12px' }}>
                      Submit Support Ticket
                    </button>
                  </form>

                  {/* Submitted Tickets list */}
                  <div>
                    <h4 style={{ margin: '0 0 16px 0', fontWeight: '700' }}>Submitted Tickets History</h4>
                    {tickets.length === 0 ? (
                      <p className="muted-italic">No tickets submitted yet.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {tickets.map(tk => (
                          <div key={tk.id} style={{ border: '1px solid #ddd', padding: '14px', borderRadius: '10px', background: '#fafafa' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <strong style={{ color: '#c7100d' }}>{tk.subject}</strong>
                              <span className={`status-badge-chip ${tk.status}`} style={{ fontSize: '10px' }}>{tk.status}</span>
                            </div>
                            <p style={{ fontSize: '13px', margin: '4px 0', color: '#555' }}>{tk.message}</p>
                            <span style={{ fontSize: '11px', color: '#999', display: 'block', marginTop: '6px' }}>
                              Category: {tk.category} • Ticket ID: #{tk.id}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="admin-bookings-view">
                <h3 className="section-title-pro" style={{ color: '#222', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                  Workspace Settings
                </h3>
                
                <form onSubmit={handleProfileUpdate} className="settings-form" style={{ maxWidth: '520px', gap: '16px', marginTop: '20px' }}>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '700' }}>User Profile Name</label>
                    <input 
                      type="text" 
                      value={profileName} 
                      onChange={e => setProfileName(e.target.value)}
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '700' }}>Registered Email</label>
                    <input 
                      type="email" 
                      value={profileEmail} 
                      onChange={e => setProfileEmail(e.target.value)}
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '700' }}>Bio Description</label>
                    <textarea 
                      value={profileBio} 
                      onChange={e => setProfileBio(e.target.value)}
                      rows="4"
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit' }}
                    />
                  </div>

                  <button type="submit" className="console-action-btn mail-btn" style={{ padding: '12px' }}>
                    Save settings changes
                  </button>

                </form>
              </div>
            )}

          </div>
        </main>

      </div>

      {/* 5. Receipt Modal */}
      {showReceiptModal && selectedBooking && (
        <div className="detail-modal-overlay" style={{ zIndex: 1000 }} onClick={() => setShowReceiptModal(false)}>
          <div className="detail-modal-body" style={{ maxWidth: '500px', minHeight: 'auto', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#c7100d', fontWeight: '800' }}>Booking Transaction Receipt</h3>
              <button onClick={() => setShowReceiptModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            
            <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <p><strong>Receipt ID:</strong> REC-{selectedBooking.id}</p>
              <p><strong>Item Title:</strong> {selectedBooking.title}</p>
              <p><strong>Event Date:</strong> {selectedBooking.date}</p>
              <p><strong>Slot Time:</strong> {selectedBooking.time}</p>
              <p><strong>Customer Name:</strong> {selectedBooking.clientName || activeProfile.name}</p>
              <p><strong>Contact Email:</strong> {selectedBooking.clientEmail || activeProfile.email}</p>
              <p><strong>Paid Status:</strong> Paid (via online channels)</p>
              <div style={{ borderTop: '1px dashed #ccc', paddingTop: '10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '16px' }}>
                <span>Total amount paid</span>
                <span style={{ color: '#c7100d' }}>{typeof selectedBooking.price === 'number' ? `₹${selectedBooking.price.toLocaleString('en-IN')}` : selectedBooking.price}</span>
              </div>
            </div>

            <button 
              className="console-action-btn claim-btn" 
              onClick={() => { triggerToast("✓ Receipt PDF download initiated"); setShowReceiptModal(false); }}
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
            >
              Download PDF Copy
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ClientDashboard;
