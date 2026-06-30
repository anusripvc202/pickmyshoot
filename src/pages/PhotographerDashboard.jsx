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
      
      {/* 2. Subheader Dark System Toolbar with Horizontal Tab Navigation */}
      <div className="admin-console-toolbar">
        <div className="toolbar-left">
          <button className={`toolbar-tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>overview</button>
          <span className="toolbar-sep">|</span>
          <button className={`toolbar-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>bookings</button>
          <span className="toolbar-sep">|</span>
          <button className={`toolbar-tab-btn ${activeTab === 'catalog' ? 'active' : ''}`} onClick={() => setActiveTab('catalog')}>catalog</button>
          <span className="toolbar-sep">|</span>
          <button className={`toolbar-tab-btn ${activeTab === 'portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('portfolio')}>portfolio</button>
          <span className="toolbar-sep">|</span>
          <button className={`toolbar-tab-btn ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>calendar</button>
          <span className="toolbar-sep">|</span>
          <button className={`toolbar-tab-btn ${activeTab === 'invoices' ? 'active' : ''}`} onClick={() => setActiveTab('invoices')}>invoices</button>
          <span className="toolbar-sep">|</span>
          <button className={`toolbar-tab-btn ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>messages</button>
          <span className="toolbar-sep">|</span>
          <button className={`toolbar-tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>settings</button>
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

      {/* 4. Full-width KPI Overview Cards */}
      <section className="console-section" style={{ border: 'none', background: 'transparent', boxShadow: 'none', margin: '24px 24px 0 24px' }}>
        <div className="console-section-body overview-kpi-container" style={{ padding: 0 }}>
          <div className="overview-kpi-card border-dashed-red">
            <span className="kpi-number text-red">{photographerBookings.length}</span>
            <span className="kpi-label">TOTAL RESERVED GIGS</span>
          </div>
          <div className="overview-kpi-card border-dashed-green bg-green-light">
            <span className="kpi-number text-green">{photographerOwnedListings.length}</span>
            <span className="kpi-label">ACTIVE CATALOG ITEMS</span>
          </div>
          <div className="overview-kpi-card border-dashed-red">
            <span className="kpi-number text-dark">₹{photographerEarnings.toLocaleString('en-IN')}</span>
            <span className="kpi-label">TOTAL NET EARNINGS</span>
          </div>
        </div>
      </section>

      {/* 5. Main Section Area */}
      <div style={{ padding: '0 24px 24px 24px' }}>
        
        {activeTab === 'overview' && (
          <section className="console-section" style={{ margin: '24px 0 0 0' }}>
            <div className="console-section-header">
              <h3 className="section-title-text">Recent Bookings Reservations</h3>
            </div>
            <div className="console-section-body table-container-no-pad">
              {photographerBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', color: '#666', fontStyle: 'italic' }}>
                  No reservations logged yet.
                </div>
              ) : (
                <table className="console-data-table">
                  <thead>
                    <tr>
                      <th>Booking Package</th>
                      <th>Client Name</th>
                      <th>Reserved Date</th>
                      <th>Slot Time</th>
                      <th>Net Value</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {photographerBookings.slice(0, 3).map(b => (
                      <tr key={b.id}>
                        <td className="bold" style={{ color: '#c7100d' }}>{b.title}</td>
                        <td>{b.clientName || 'Client Profile'}</td>
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
        )}

        {activeTab === 'bookings' && (
          <section className="console-section" style={{ margin: '24px 0 0 0' }}>
            <div className="console-section-header">
              <h3 className="section-title-text">Client Gig Reservations Directory</h3>
            </div>
            <div className="console-section-body table-container-no-pad">
              {photographerBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666', fontStyle: 'italic' }}>
                  No gig reservations logged.
                </div>
              ) : (
                <table className="console-data-table">
                  <thead>
                    <tr>
                      <th>Booking Package</th>
                      <th>Client Name</th>
                      <th>Reserved Date</th>
                      <th>Slot Time</th>
                      <th>Net Value</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
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
                        <td style={{ textAlign: 'center' }}>
                          {b.status === 'pending' && (
                            <div style={{ display: 'inline-flex', gap: '8px', margin: '0 auto' }}>
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
                            <span className="muted-italic" style={{ fontSize: '12px' }}>Finalized</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {activeTab === 'catalog' && (
          <section className="console-section" style={{ margin: '24px 0 0 0' }}>
            <div className="console-section-header">
              <h3 className="section-title-text">My Catalog Items Directory</h3>
            </div>
            <div className="console-section-body table-container-no-pad">
              {photographerOwnedListings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666', fontStyle: 'italic' }}>
                  No active catalog listings found. Add listings via the primary header button!
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
                    {photographerOwnedListings.map(lst => (
                      <tr key={lst.id}>
                        <td className="bold" style={{ color: '#c7100d' }}>{lst.title}</td>
                        <td style={{ fontWeight: '600' }}>{lst.type}</td>
                        <td>₹{lst.price} / {lst.priceUnit || 'hr'}</td>
                        <td>{lst.location}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            className={`console-action-btn ${lst.active ? 'claim-btn' : 'delete-btn'}`}
                            onClick={() => { toggleListingActive(lst.id, lst.categoryKey); triggerToast("Listing visibility toggled!"); }}
                            style={{ padding: '6px 14px', display: 'inline-flex', margin: '0 auto' }}
                          >
                            {lst.active ? 'Active' : 'Disabled'}
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

        {activeTab === 'portfolio' && (
          <section className="console-section" style={{ margin: '24px 0 0 0' }}>
            <div className="console-section-header flex-header">
              <h3 className="section-title-text">My Creative Portfolio Showcase</h3>
              <button className="console-action-btn claim-btn" onClick={() => setShowPortfolioModal(true)} style={{ padding: '6px 12px' }}>
                <Plus size={14} style={{ marginRight: '4px' }} />
                Upload Image
              </button>
            </div>
            <div className="console-section-body table-container-no-pad">
              {portfolioItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666', fontStyle: 'italic' }}>
                  No portfolio items loaded. Add items to build your creative showcase!
                </div>
              ) : (
                <table className="console-data-table">
                  <thead>
                    <tr>
                      <th>Creation Item</th>
                      <th>Category Tag</th>
                      <th>Source URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioItems.map(pf => (
                      <tr key={pf.id}>
                        <td className="bold" style={{ color: '#c7100d' }}>{pf.title}</td>
                        <td style={{ fontWeight: '600' }}>{pf.category}</td>
                        <td className="photographer-slug" style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pf.image}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {activeTab === 'calendar' && (
          <section className="console-section" style={{ margin: '24px 0 0 0' }}>
            <div className="console-section-header">
              <h3 className="section-title-text">Availability Calendar & Block Dates</h3>
            </div>
            <div className="console-section-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
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
          </section>
        )}

        {activeTab === 'invoices' && (
          <section className="console-section" style={{ margin: '24px 0 0 0' }}>
            <div className="console-section-header">
              <h3 className="section-title-text">Billing Invoice Generator</h3>
            </div>
            <div className="console-section-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
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
          </section>
        )}

        {activeTab === 'messages' && (
          <section className="console-section" style={{ margin: '24px 0 0 0' }}>
            <div className="console-section-header">
              <h3 className="section-title-text">Client Messaging Channels</h3>
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
          </section>
        )}

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
