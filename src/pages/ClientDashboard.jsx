import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  User, 
  Heart, 
  MapPin, 
  Activity, 
  X, 
  FileText,
  ClipboardList,
  Mail,
  Shield,
  Send,
  LogOut,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Grid,
  DollarSign
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

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
    setChatSessions,
    chatMessages,
    sendChatMessage,
    currentUser,
    logoutUser
  } = useAppContext();

  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    const selectParam = params.get('select');
    
    if (tabParam) {
      setActiveTab(tabParam);
    }
    if (selectParam) {
      setSelectedSessionId(selectParam);
      
      const exists = chatSessions.some(s => s.id === selectParam);
      if (!exists && profiles.length > 0) {
        const photographerId = selectParam.replace(/^sess-/, '').split('-').find(id => id !== activeProfileId);
        const photographerProfile = profiles.find(p => p.id === photographerId || p._id === photographerId);
        const name = photographerProfile ? photographerProfile.name : "Photographer";
        
        setChatSessions(prev => [
          { id: selectParam, recipientId: photographerId, recipientName: name, lastMessage: "Start typing to chat...", lastUpdated: "Now" },
          ...prev
        ]);
      }
    }
  }, [location, chatSessions, profiles, activeProfileId, setChatSessions]);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0] || { name: '', email: '', bio: '' };

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

  useEffect(() => {
    if (chatSessions && chatSessions.length > 0) {
      const exists = chatSessions.some(s => s.id === selectedSessionId);
      if (!exists) {
        setSelectedSessionId(chatSessions[0].id);
      }
    }
  }, [chatSessions, selectedSessionId]);

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

  const clientBookings = bookings.filter(b => 
    currentUser?.role === 'admin' ||
    b.clientId === activeProfileId || 
    (currentUser && (
      b.clientId === currentUser.id || 
      b.clientId === currentUser._id ||
      (b.clientEmail && currentUser.email && b.clientEmail.toLowerCase() === currentUser.email.toLowerCase())
    ))
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
    <div className="db-layout">
      {/* Sidebar Navigation */}
      <aside className="db-sidebar">
        <div className="db-sidebar-header">
          <div className="db-sidebar-logo" onClick={() => navigate('/')}>
            <img src="/logo.png" alt="PickMyShoot Logo" />
          </div>
          
          <div className="db-sidebar-user-info" style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '8px 0' }}>
            <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b' }}>Client Console:</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#f1f5f9' }}>{activeProfile.name}</span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{activeProfile.email}</span>
          </div>
        </div>

        <nav className="db-sidebar-nav">
          <button className={`db-sidebar-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <Sliders size={16} /> Overview
          </button>
          <button className={`db-sidebar-link ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
            <ClipboardList size={16} /> Bookings placed
          </button>
          <button className={`db-sidebar-link ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>
            <Grid size={16} /> Saved listings
          </button>
          <button className={`db-sidebar-link ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
            <Mail size={16} /> Chat support
          </button>
          <button className={`db-sidebar-link ${activeTab === 'support' ? 'active' : ''}`} onClick={() => setActiveTab('support')}>
            <FileText size={16} /> Support tickets
          </button>
          <button className={`db-sidebar-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Sliders size={16} /> Settings
          </button>
        </nav>

        <div className="db-sidebar-footer">
          <button className="db-sidebar-link" onClick={() => navigate('/')}>
            <ArrowLeft size={16} /> User View
          </button>
          <button className="db-sidebar-link" style={{ color: '#ff4d5a' }} onClick={() => { logoutUser(); navigate('/'); }}>
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="db-main">
        {/* Topbar Info */}
        <header className="db-top-bar">
          <div className="db-top-bar-title-wrap">
            <h2 className="db-top-bar-title">Client Dashboard</h2>
            <span className="db-top-bar-subtitle">Welcome back, {activeProfile.name}!</span>
          </div>
        </header>

        {/* Content Body */}
        <div className="db-content">
{activeTab === 'overview' && (
            <>
              {/* KPI Cards Grid */}
              <div className="db-kpi-grid">
                <div className="db-kpi-card" onClick={() => setActiveTab('bookings')} style={{ cursor: 'pointer' }}>
                  <div className="db-kpi-card-icon red">
                    <ClipboardList size={22} />
                  </div>
                  <div className="db-kpi-card-content">
                    <span className="db-kpi-card-value">{clientBookings.length}</span>
                    <span className="db-kpi-card-label">Total Bookings</span>
                  </div>
                </div>

                <div className="db-kpi-card" onClick={() => setActiveTab('saved')} style={{ cursor: 'pointer' }}>
                  <div className="db-kpi-card-icon green">
                    <Grid size={22} />
                  </div>
                  <div className="db-kpi-card-content">
                    <span className="db-kpi-card-value">{totalSavedCount}</span>
                    <span className="db-kpi-card-label">Saved Favorites</span>
                  </div>
                </div>

                <div className="db-kpi-card">
                  <div className="db-kpi-card-icon blue">
                    <DollarSign size={22} />
                  </div>
                  <div className="db-kpi-card-content">
                    <span className="db-kpi-card-value">₹{clientSpent.toLocaleString('en-IN')}</span>
                    <span className="db-kpi-card-label">Total Spent</span>
                  </div>
                </div>
              </div>

            <section className="console-section" style={{ margin: '24px 0 0 0' }}>
            <div className="console-section-header">
              <h3 className="section-title-text">Recent Orders Schedule</h3>
            </div>
            <div className="console-section-body table-container-no-pad">
              {clientBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', color: '#666', fontStyle: 'italic' }}>
                  No bookings placed yet. Navigate the catalogs to request shoots or studios!
                </div>
              ) : (
                <table className="console-data-table">
                  <thead>
                    <tr>
                      <th>Booking Item</th>
                      <th>Reserved Date</th>
                      <th>Timing</th>
                      <th>Amount Paid</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientBookings.slice(0, 3).map(b => (
                      <tr key={b.id}>
                        <td className="bold" style={{ color: '#c7100d' }}>{b.title}</td>
                        <td>{b.date}</td>
                        <td>{b.time}</td>
                        <td className="bold">{typeof b.price === 'number' ? `₹${b.price.toLocaleString('en-IN')}` : b.price}</td>
                        <td>
                          <span className={`status-badge-chip ${b.status}`}>{b.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
          </>
        )}

        {activeTab === 'bookings' && (
          <section className="console-section" style={{ margin: '24px 0 0 0' }}>
            <div className="console-section-header">
              <h3 className="section-title-text">My Booking Orders Directory</h3>
            </div>
            <div className="console-section-body table-container-no-pad">
              {clientBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666', fontStyle: 'italic' }}>
                  No reservations logged. Book packages or studios in the catalog!
                </div>
              ) : (
                <table className="console-data-table">
                  <thead>
                    <tr>
                      <th>Booking Item</th>
                      <th>Reserved Date</th>
                      <th>Timing</th>
                      <th>Total Paid</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
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
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            className="console-action-btn claim-btn"
                            style={{ background: '#111', padding: '6px 10px', display: 'inline-flex', margin: '0 auto' }}
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
              )}
            </div>
          </section>
        )}

        {activeTab === 'saved' && (
          <section className="console-section" style={{ margin: '24px 0 0 0' }}>
            <div className="console-section-header">
              <h3 className="section-title-text">Saved Favorites Directory</h3>
            </div>
            <div className="console-section-body table-container-no-pad">
              {totalSavedCount === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666', fontStyle: 'italic' }}>
                  No favorite items saved yet. Add favorites in the Explore catalog!
                </div>
              ) : (
                <table className="console-data-table">
                  <thead>
                    <tr>
                      <th>Catalog Listing</th>
                      <th>Category Type</th>
                      <th>Base Pricing</th>
                      <th>Location Context</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedStudios.map(s => (
                      <tr key={s.id}>
                        <td className="bold" style={{ color: '#c7100d' }}>{s.title}</td>
                        <td>Studio Space</td>
                        <td>₹{s.price} / {s.priceUnit || 'hr'}</td>
                        <td>{s.location}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button className="console-action-btn claim-btn" style={{ display: 'inline-flex', marginRight: '8px' }} onClick={() => openDetails(s, 'studio')}>
                            View Info
                          </button>
                          <button className="console-action-btn delete-btn" style={{ display: 'inline-flex' }} onClick={(e) => { toggleLike(s.id, e); triggerToast("Removed from saved list!"); }}>
                            Unlike
                          </button>
                        </td>
                      </tr>
                    ))}
                    {savedGear.map(g => (
                      <tr key={g.id}>
                        <td className="bold" style={{ color: '#c7100d' }}>{g.title}</td>
                        <td>Gear Rental</td>
                        <td>₹{g.price} / {g.priceUnit || 'day'}</td>
                        <td>{g.location}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button className="console-action-btn claim-btn" style={{ display: 'inline-flex', marginRight: '8px' }} onClick={() => openDetails(g, 'gear')}>
                            View Info
                          </button>
                          <button className="console-action-btn delete-btn" style={{ display: 'inline-flex' }} onClick={(e) => { toggleLike(g.id, e); triggerToast("Removed from saved list!"); }}>
                            Unlike
                          </button>
                        </td>
                      </tr>
                    ))}
                    {savedServices.map(sv => (
                      <tr key={sv.id}>
                        <td className="bold" style={{ color: '#c7100d' }}>{sv.title}</td>
                        <td>Photography Service</td>
                        <td>₹{sv.price}</td>
                        <td>{sv.location}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button className="console-action-btn claim-btn" style={{ display: 'inline-flex', marginRight: '8px' }} onClick={() => openDetails(sv, 'service')}>
                            View Info
                          </button>
                          <button className="console-action-btn delete-btn" style={{ display: 'inline-flex' }} onClick={(e) => { toggleLike(sv.id, e); triggerToast("Removed from saved list!"); }}>
                            Unlike
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {activeTab === 'chat' && (
          <section className="console-section" style={{ margin: '24px 0 0 0' }}>
            <div className="console-section-header">
              <h3 className="section-title-text">Chat Support Channels</h3>
            </div>
            <div className="console-section-body" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px', minHeight: '400px' }}>
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
                <div style={{ flex: 1, overflowY: 'auto', padding: '15px', background: '#fcfcfc', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {chatMessages.filter(m => m.sessionId === selectedSessionId).map(msg => {
                    const isMe = msg.senderId === activeProfileId || msg.senderId === 'prof-client' || msg.senderId === 'prof-client-2';
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
          </section>
        )}

        {activeTab === 'support' && (
          <section className="console-section" style={{ margin: '24px 0 0 0' }}>
            <div className="console-section-header">
              <h3 className="section-title-text">Support Ticket Management</h3>
            </div>
            <div className="console-section-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
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
          </section>
        )}

        {activeTab === 'settings' && (
          <section className="console-section" style={{ margin: '24px 0 0 0' }}>
            <div className="console-section-header">
              <h3 className="section-title-text">Workspace Settings</h3>
            </div>
            <div className="console-section-body">
              <form onSubmit={handleProfileUpdate} className="settings-form" style={{ maxWidth: '520px', gap: '16px' }}>
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
          </section>
        )}

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
      </main>
    </div>
  );
};

export default ClientDashboard;
