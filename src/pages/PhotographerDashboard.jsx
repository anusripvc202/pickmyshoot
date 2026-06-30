import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  MapPin, 
  Award,
  TrendingUp,
  DollarSign,
  Activity,
  Eye,
  Clock,
  Grid,
  Trash2,
  X,
  Upload,
  Camera,
  Plus,
  Mail,
  Send,
  Calendar,
  FileText,
  Lock,
  CheckCircle,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const PhotographerDashboard = () => {
  const {
    bookings,
    services,
    gear,
    studios,
    triggerToast,
    profiles,
    setProfiles,
    activeProfileId,
    setActiveProfileId,
    toggleListingActive,
    updateBookingStatus,
    addPortfolioItem,
    portfolioItems,
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
    return sum + (b.status === 'confirmed' || b.status === 'completed' || b.status === 'approved' ? priceVal : 0);
  }, 0);

  const photographerOwnedListings = [
    ...services.filter(s => s.ownerId === activeProfileId || (!s.ownerId && activeProfileId === "prof-photographer" && (s.id === "ps-1" || s.id === "ps-9"))).map(s => ({ ...s, type: "Service Package", categoryKey: "service" })),
    ...gear.filter(g => g.ownerId === activeProfileId || (!g.ownerId && activeProfileId === "prof-photographer" && (g.id === "gr-1" || g.id === "gr-6"))).map(g => ({ ...g, type: "Gear Rental", categoryKey: "gear" })),
    ...studios.filter(st => st.ownerId === activeProfileId).map(st => ({ ...st, type: "Studio Space", categoryKey: "studio" }))
  ];

  // For invoice calculations
  const invoiceSelectedBooking = photographerBookings.find(b => b.id === selectedInvoiceBookingId);
  const baseInvoiceAmt = invoiceSelectedBooking ? (typeof invoiceSelectedBooking.price === 'number' ? invoiceSelectedBooking.price : parseFloat(invoiceSelectedBooking.price) || 0) : 0;
  const discountAmt = Math.round(baseInvoiceAmt * (invoiceDiscount / 100));
  const finalInvoiceAmt = baseInvoiceAmt - discountAmt;

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
          <span className="toolbar-link active">photographer workspace</span>
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
          <span className="superadmin-access-badge" style={{ color: '#ffb81c' }}>
            <Camera size={13} style={{ marginRight: '4px' }} />
            PHOTOGRAPHER ACCESS
          </span>
        </div>
      </div>

      {/* 3. Title Card */}
      <div className="console-title-card">
        <h2 className="console-main-title">PickMyShoot Photographer Partner Console</h2>
        <span className="console-role-desc">
          <strong>Partner ID:</strong> {activeProfile.name} ({activeProfile.email})
        </span>
      </div>

      {/* 4. Split Dashboard Grid */}
      <div className="dashboard-grid-layout" style={{ padding: '0 24px 24px 24px' }}>
        
        {/* Left: Navigation Sidebar */}
        <aside className="dashboard-sidebar-menu" style={{ top: '150px' }}>
          <div className="dashboard-menu-title">Creator Console</div>
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
              <span>Gig Reservations ({photographerBookings.length})</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'listings' ? 'active' : ''}`}
              onClick={() => setActiveTab('listings')}
            >
              <Grid size={16} />
              <span>My Catalog Items ({photographerOwnedListings.length})</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'portfolio' ? 'active' : ''}`}
              onClick={() => setActiveTab('portfolio')}
            >
              <Camera size={16} />
              <span>Portfolio Gallery ({portfolioItems.length})</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
            >
              <Calendar size={16} />
              <span>Block Availability</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'invoices' ? 'active' : ''}`}
              onClick={() => setActiveTab('invoices')}
            >
              <FileText size={16} />
              <span>Billing Invoices</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <Mail size={16} />
              <span>Client Messaging</span>
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
                    <span className="kpi-number text-red">{photographerBookings.length}</span>
                    <span className="kpi-label">TOTAL RESERVED GIGS</span>
                  </div>
                  <div className="overview-kpi-card border-dashed-green bg-green-light" style={{ flex: 1 }}>
                    <span className="kpi-number text-green">{photographerOwnedListings.length}</span>
                    <span className="kpi-label">ACTIVE CATALOG ITEMS</span>
                  </div>
                  <div className="overview-kpi-card border-dashed-red" style={{ flex: 1 }}>
                    <span className="kpi-number text-dark">₹{photographerEarnings.toLocaleString('en-IN')}</span>
                    <span className="kpi-label">TOTAL NET EARNINGS</span>
                  </div>
                </div>

                {/* Sub-panels inside Overview */}
                <div className="overview-split-row" style={{ marginTop: '24px' }}>
                  
                  {/* Recent Bookings Box */}
                  <div className="analytics-card-widget" style={{ minHeight: 'auto' }}>
                    <span className="widget-title">Active Booking Reservations</span>
                    {photographerBookings.length === 0 ? (
                      <p className="muted-italic">No bookings recorded yet.</p>
                    ) : (
                      <div className="admin-log-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {photographerBookings.slice(0, 3).map(b => (
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

                  {/* Settings / Stats shortcut card */}
                  <div className="schedule-timeline-card" style={{ minHeight: 'auto' }}>
                    <span className="widget-title">Account details</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px' }}>
                      <p><strong>Name:</strong> {activeProfile.name}</p>
                      <p><strong>Email:</strong> {activeProfile.email}</p>
                      <p><strong>Followers:</strong> {activeProfile.followers || '0'}</p>
                      <p><strong>Rating Score:</strong> {activeProfile.rating || '5.0'} / 5.0 ⭐</p>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="admin-bookings-view">
                <h3 className="section-title-pro" style={{ color: '#222', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                  Client Gig Reservations Directory
                </h3>
                {photographerBookings.length === 0 ? (
                  <p className="empty-row-text">No active bookings found.</p>
                ) : (
                  <div className="admin-table-container">
                    <table className="console-data-table">
                      <thead>
                        <tr>
                          <th>Booking Package</th>
                          <th>Client Name</th>
                          <th>Reserved Date</th>
                          <th>Slot Time</th>
                          <th>Net Value</th>
                          <th>Status</th>
                          <th>Admin Override</th>
                        </tr>
                      </thead>
                      <tbody>
                        {photographerBookings.map(b => (
                          <tr key={b.id}>
                            <td className="bold" style={{ color: '#c7100d' }}>{b.title}</td>
                            <td>{b.clientName || 'Client Profile'}</td>
                            <td>{b.date}</td>
                            <td>{b.time}</td>
                            <td className="bold">{typeof b.price === 'number' ? `₹${b.price.toLocaleString('en-IN')}` : b.price}</td>
                            <td>
                              <span className={`status-badge-chip ${b.status}`}>{b.status}</span>
                            </td>
                            <td>
                              {b.status === 'pending' && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button 
                                    className="console-action-btn claim-btn"
                                    onClick={() => { updateBookingStatus(b.id, 'approved'); triggerToast("✓ Booking Approved!"); }}
                                    style={{ padding: '6px 10px' }}
                                  >
                                    Approve
                                  </button>
                                  <button 
                                    className="console-action-btn delete-btn"
                                    onClick={() => { updateBookingStatus(b.id, 'cancelled'); triggerToast("✓ Booking Declined!"); }}
                                    style={{ padding: '6px 10px' }}
                                  >
                                    Decline
                                  </button>
                                </div>
                              )}
                              {b.status !== 'pending' && (
                                <span className="muted-italic">Finalized</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'listings' && (
              <div>
                <h3 className="section-title-pro" style={{ color: '#222', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                  My Catalog Items Directory
                </h3>
                {photographerOwnedListings.length === 0 ? (
                  <p className="empty-row-text">No active catalog listings found. Please add a listing via the main toolbar link!</p>
                ) : (
                  <div className="admin-table-container">
                    <table className="console-data-table">
                      <thead>
                        <tr>
                          <th>Item Catalog</th>
                          <th>Category Type</th>
                          <th>Base Pricing</th>
                          <th>Location Context</th>
                          <th>List Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {photographerOwnedListings.map(lst => (
                          <tr key={lst.id}>
                            <td className="bold" style={{ color: '#c7100d' }}>{lst.title}</td>
                            <td style={{ fontWeight: '600' }}>{lst.type}</td>
                            <td>₹{lst.price} / {lst.priceUnit || 'hr'}</td>
                            <td>{lst.location}</td>
                            <td>
                              <button 
                                className={`console-action-btn ${lst.active ? 'claim-btn' : 'delete-btn'}`}
                                onClick={() => { toggleListingActive(lst.id, lst.categoryKey); triggerToast("Listing updated status successfully"); }}
                                style={{ padding: '6px 10px' }}
                              >
                                {lst.active ? 'Active' : 'Disabled'}
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

            {activeTab === 'portfolio' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                  <h3 className="section-title-pro" style={{ color: '#222', margin: 0 }}>
                    My Creative Portfolio Showcase
                  </h3>
                  <button className="console-action-btn claim-btn" onClick={() => setShowPortfolioModal(true)} style={{ padding: '10px 14px' }}>
                    <Plus size={14} style={{ marginRight: '4px' }} />
                    Upload Image
                  </button>
                </div>
                
                {portfolioItems.length === 0 ? (
                  <p className="empty-row-text">No portfolio elements found. Create one now!</p>
                ) : (
                  <div className="desktop-card-grid-3" style={{ gap: '20px', marginTop: '20px' }}>
                    {portfolioItems.map(pf => (
                      <div key={pf.id} className="service-card">
                        <div className="card-img-wrap">
                          <img src={pf.image} className="card-image" alt={pf.title} />
                        </div>
                        <div className="card-info">
                          <span className="card-title">{pf.title}</span>
                          <span className="card-price-value" style={{ color: '#666', fontSize: '12px' }}>{pf.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'calendar' && (
              <div className="admin-bookings-view">
                <h3 className="section-title-pro" style={{ color: '#222', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                  Block Schedule &amp; Working Hours
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
                  
                  {/* Calendar block date Form */}
                  <form onSubmit={handleAddBlockedDate} className="settings-form" style={{ gap: '16px' }}>
                    <h4 style={{ margin: 0, fontWeight: '700' }}>Block an availability date</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '700' }}>Choose calendar date</label>
                      <input 
                        type="date"
                        value={newBlockedDate}
                        onChange={e => setNewBlockedDate(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                      />
                    </div>

                    <button type="submit" className="console-action-btn mail-btn" style={{ padding: '12px' }}>
                      Block selected date
                    </button>
                  </form>

                  {/* Blocked dates display */}
                  <div>
                    <h4 style={{ margin: '0 0 16px 0', fontWeight: '700' }}>Active Blocked Dates</h4>
                    {blockedDates.length === 0 ? (
                      <p className="muted-italic">All calendar slots available.</p>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {blockedDates.map(dt => (
                          <div key={dt} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fafafa', border: '1px solid #ddd', padding: '6px 12px', borderRadius: '20px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '600' }}>{dt}</span>
                            <button onClick={() => handleRemoveBlockedDate(dt)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#c7100d', padding: 0, display: 'flex', alignItems: 'center' }}>
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {activeTab === 'invoices' && (
              <div className="admin-bookings-view">
                <h3 className="section-title-pro" style={{ color: '#222', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                  Billing Invoice Generator
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
                  
                  {/* Invoice Form */}
                  <div className="settings-form" style={{ gap: '16px' }}>
                    <h4 style={{ margin: 0, fontWeight: '700' }}>Create Reservation Invoice</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '700' }}>Select active gig booking</label>
                      <select 
                        value={selectedInvoiceBookingId}
                        onChange={e => setSelectedInvoiceBookingId(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                      >
                        <option value="">-- Choose gig booking --</option>
                        {photographerBookings.map(b => (
                          <option key={b.id} value={b.id}>{b.title} ({b.clientName || 'Client'})</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '700' }}>Apply Discount Percentage (%)</label>
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        value={invoiceDiscount}
                        onChange={e => setInvoiceDiscount(parseInt(e.target.value) || 0)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '700' }}>Invoice Footer Remarks</label>
                      <textarea 
                        value={invoiceNotes}
                        onChange={e => setInvoiceNotes(e.target.value)}
                        rows="3"
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit' }}
                      />
                    </div>

                    <button 
                      className="console-action-btn mail-btn" 
                      onClick={() => {
                        if (!selectedInvoiceBookingId) { triggerToast("Please select a booking first!"); return; }
                        setShowInvoicePreview(true);
                      }} 
                      style={{ padding: '12px' }}
                    >
                      Generate invoice preview
                    </button>
                  </div>

                  {/* Invoice Preview */}
                  {showInvoicePreview && invoiceSelectedBooking && (
                    <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', background: '#fafafa', position: 'relative' }}>
                      <div style={{ borderBottom: '2px solid #c7100d', paddingBottom: '10px', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, color: '#c7100d', fontWeight: '800' }}>Invoice: INV-{invoiceSelectedBooking.id}</h4>
                        <span style={{ fontSize: '12px', color: '#666' }}>Generated by {activeProfile.name}</span>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px', color: '#333' }}>
                        <p><strong>Billing to Client:</strong> {invoiceSelectedBooking.clientName || 'Client Name'}</p>
                        <p><strong>Contact Email:</strong> {invoiceSelectedBooking.clientEmail || 'Client Email'}</p>
                        <p><strong>Gig package details:</strong> {invoiceSelectedBooking.title}</p>
                        <p><strong>Event Schedule:</strong> {invoiceSelectedBooking.date} • {invoiceSelectedBooking.time}</p>
                        <p><strong>Base pricing amount:</strong> ₹{baseInvoiceAmt.toLocaleString('en-IN')}</p>
                        {invoiceDiscount > 0 && (
                          <p style={{ color: '#00b464' }}><strong>Discount Applied ({invoiceDiscount}%):</strong> -₹{discountAmt.toLocaleString('en-IN')}</p>
                        )}
                        
                        <div style={{ borderTop: '1.5px dashed #ccc', paddingTop: '10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '15px' }}>
                          <span>Final Amount Due</span>
                          <span style={{ color: '#c7100d' }}>₹{finalInvoiceAmt.toLocaleString('en-IN')}</span>
                        </div>
                        <p style={{ fontSize: '11px', color: '#666', marginTop: '10px', fontStyle: 'italic' }}>Notes: {invoiceNotes}</p>
                      </div>

                      <button 
                        className="console-action-btn claim-btn" 
                        onClick={() => { triggerToast("✓ Invoice dispatched to client email!"); setShowInvoicePreview(false); }}
                        style={{ width: '100%', justifyContent: 'center', marginTop: '16px', padding: '10px' }}
                      >
                        Mail Invoice to Client
                      </button>
                    </div>
                  )}

                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="admin-bookings-view">
                <h3 className="section-title-pro" style={{ color: '#222', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                  Client Messaging Channels
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

            {activeTab === 'settings' && (
              <div className="admin-bookings-view">
                <h3 className="section-title-pro" style={{ color: '#222', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                  Workspace Settings
                </h3>
                
                <form onSubmit={handleProfileUpdate} className="settings-form" style={{ maxWidth: '520px', gap: '16px', marginTop: '20px' }}>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '700' }}>Creator Profile Name</label>
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
                    <label style={{ fontSize: '13px', fontWeight: '700' }}>Bio Context Description</label>
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

      {/* Upload Image Modal */}
      {showPortfolioModal && (
        <div className="detail-modal-overlay" style={{ zIndex: 1000 }} onClick={() => setShowPortfolioModal(false)}>
          <div className="detail-modal-body" style={{ maxWidth: '500px', minHeight: 'auto', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#c7100d', fontWeight: '800' }}>Upload New Portfolio Item</h3>
              <button onClick={() => setShowPortfolioModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleAddPortfolioSubmit} className="settings-form" style={{ gap: '16px', marginTop: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700' }}>Portfolio Title</label>
                <input 
                  type="text" 
                  value={pfTitle} 
                  onChange={e => setPfTitle(e.target.value)}
                  placeholder="e.g. Wedding Editorial"
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700' }}>Category</label>
                <select 
                  value={pfCategory} 
                  onChange={e => setPfCategory(e.target.value)}
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                >
                  <option value="Western / Editorial">Western / Editorial</option>
                  <option value="Traditional Wedding">Traditional Wedding</option>
                  <option value="Candid Portrait">Candid Portrait</option>
                  <option value="Product Showcase">Product Showcase</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700' }}>Portfolio Image URL</label>
                <input 
                  type="text" 
                  value={pfImage} 
                  onChange={e => setPfImage(e.target.value)}
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>

              <button type="submit" className="console-action-btn claim-btn" style={{ padding: '12px', justifyContent: 'center' }}>
                Save Portfolio Item
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PhotographerDashboard;
