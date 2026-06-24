import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  MapPin, 
  TrendingUp,
  DollarSign,
  Activity,
  Eye,
  Grid,
  X,
  Shield,
  UserCheck,
  ClipboardList,
  PlusCircle,
  Tag,
  Check,
  Share2,
  User
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const {
    theme,
    setTheme,
    bookings,
    studios,
    setStudios,
    gear,
    setGear,
    services,
    setServices,
    triggerToast,
    profiles,
    setProfiles,
    activeProfileId,
    setActiveProfileId,
    toggleListingActive,
    updateBookingStatus,
    toggleUserVerification,
    tickets,
    updateTicketStatus,
    coupons,
    toggleCouponStatus,
    createCoupon,
    currentUser,
    changeUserRole
  } = useAppContext();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');

  const adminProfile = profiles.find(p => p.role === 'admin') || currentUser || profiles[0];

  // Local state for profile inputs in settings
  const [profileName, setProfileName] = useState(adminProfile.name);
  const [profileEmail, setProfileEmail] = useState(adminProfile.email);
  const [profileBio, setProfileBio] = useState(adminProfile.bio);

  // Sync settings form inputs when admin profile changes
  useEffect(() => {
    setProfileName(adminProfile.name);
    setProfileEmail(adminProfile.email);
    setProfileBio(adminProfile.bio);
  }, [adminProfile]);

  // Sharing interaction state
  const [shareText, setShareText] = useState('Share Dashboard');

  // Admin New Listing creation modal state
  const [showCreateListingModal, setShowCreateListingModal] = useState(false);
  const [listTitle, setListTitle] = useState('');
  const [listPrice, setListPrice] = useState(1500);
  const [listType, setListType] = useState('studio'); // 'studio' | 'gear' | 'service'
  const [listImage, setListImage] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80');
  const [listLocation, setListLocation] = useState('Madhapur, Hyderabad');
  const [listDesc, setListDesc] = useState('');

  // Coupon form states
  const [showCreateCouponModal, setShowCreateCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('');
  const [couponDesc, setCouponDesc] = useState('');

  const handleCreateCouponSubmit = (e) => {
    e.preventDefault();
    if (!couponCode || !couponDiscount) {
      triggerToast("Please specify code and discount amount.");
      return;
    }
    createCoupon({
      code: couponCode.toUpperCase().replace(/\s+/g, ''),
      discount: couponDiscount,
      description: couponDesc || `${couponDiscount} discount code coupon on PickMyShoot.`
    });
    setShowCreateCouponModal(false);
    setCouponCode('');
    setCouponDiscount('');
    setCouponDesc('');
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
      id: adminProfile.id,
      name: profileName,
      email: profileEmail,
      bio: profileBio
    };

    setProfiles(prev => prev.map(p => {
      if (p.id === adminProfile.id) {
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

  const handleCreateListingSubmit = (e) => {
    e.preventDefault();
    if (!listTitle) {
      triggerToast("Please fill in listing title");
      return;
    }

    const newListing = {
      id: `${listType === 'studio' ? 'st' : listType === 'gear' ? 'gr' : 'ps'}-${Date.now()}`,
      title: listTitle,
      price: Number(listPrice),
      priceUnit: listType === 'studio' ? 'hr' : 'day',
      rating: 5.0,
      reviews: 1,
      location: listLocation,
      distance: "Local Area",
      image: listImage,
      active: true,
      description: listDesc || `${listTitle} - premium listing added on PickMyShoot.`,
      ownerId: "prof-photographer"
    };

    if (listType === 'studio') {
      setStudios(prev => [newListing, ...prev]);
    } else if (listType === 'gear') {
      setGear(prev => [newListing, ...prev]);
    } else {
      setServices(prev => [newListing, ...prev]);
    }

    setShowCreateListingModal(false);
    setListTitle('');
    setListDesc('');
    triggerToast(`New listing "${listTitle}" added to Explore catalog!`);
  };

  // Admin platform calculations
  const platformRevenue = bookings.reduce((sum, b) => {
    const priceVal = typeof b.price === 'number' ? b.price : parseFloat(b.price) || 0;
    return sum + (b.status !== 'cancelled' ? priceVal : 0);
  }, 0);
  const platformCommission = Math.round(platformRevenue * 0.1);
  const totalVerifiedCount = profiles.filter(p => p.role.startsWith("Verified")).length;

  return (
    <div className="profile-pro-container">
      
      {/* 1. Cover Photo */}
      <div className="profile-cover-banner role-cover-admin">
        <img 
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
          className="cover-img" 
          alt="Creative Background Setup" 
        />
        <div className="cover-glass-overlay">
          <span className="cover-badge-top">Platform Security Control Center</span>
        </div>
      </div>

      {/* 2. Professional Overlapping Creator Identity Block */}
      <div className="profile-header-card">
        <div className="profile-header-inner">
          
          <div className="avatar-overlap-wrap">
            <img 
              src={adminProfile.avatar} 
              className="profile-avatar-pro" 
              alt="Profile Owner Avatar" 
            />
            <span className="avatar-badge-active" title="User Online"></span>
          </div>

          <div className="profile-title-bio-col">
            <div className="profile-name-row">
              <div className="profile-selector-wrap">
                <span className="profile-active-name">{adminProfile.name}</span>
              </div>
              <span className="badge-verified role-badge-admin">
                <Shield size={12} color="white" />
                <span>{adminProfile.role}</span>
              </span>
            </div>
            
            <div className="profile-meta-row">
              <span className="meta-item"><MapPin size={13} color="var(--primary)" /> Hyderabad, TS</span>
              <span className="meta-item-sep">•</span>
              <span className="meta-item">{adminProfile.email}</span>
            </div>

            <p className="profile-bio-pro">{adminProfile.bio}</p>
          </div>

          <div className="profile-header-right-col">
            <div className="profile-stats-row-pro">
              <div className="stat-pill-pro">
                <span className="stat-num-pro">₹{platformRevenue.toLocaleString('en-IN')}</span>
                <span className="stat-lbl-pro">Volume</span>
              </div>
              <div className="stat-pill-pro">
                <span className="stat-num-pro">{profiles.length}</span>
                <span className="stat-lbl-pro">Users</span>
              </div>
              <div className="stat-pill-pro">
                <span className="stat-num-pro">{adminProfile.rating}</span>
                <span className="stat-lbl-pro">Rating</span>
              </div>
            </div>

            <button className="pro-btn-primary theme-btn-admin" onClick={handleShare}>
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
          <div className="dashboard-menu-title">Admin Panel</div>
          <div className="profile-tabs-nav-vertical">
            <button 
              className={`profile-nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Activity size={16} />
              <span>Global Statistics</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <ClipboardList size={16} />
              <span>All Gigs Booked</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'verification' ? 'active' : ''}`}
              onClick={() => setActiveTab('verification')}
            >
              <UserCheck size={16} />
              <span>Verifications ({profiles.filter(p => !p.role.startsWith("Verified")).length})</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'listings' ? 'active' : ''}`}
              onClick={() => setActiveTab('listings')}
            >
              <Grid size={16} />
              <span>Listings Control</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Sliders size={16} />
              <span>Settings</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'support' ? 'active' : ''}`}
              onClick={() => setActiveTab('support')}
            >
              <Shield size={16} />
              <span>Support Tickets ({tickets.filter(t => t.status === 'open').length})</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'coupons' ? 'active' : ''}`}
              onClick={() => setActiveTab('coupons')}
            >
              <Tag size={16} />
              <span>Coupons &amp; Offers</span>
            </button>
            <button 
              className={`profile-nav-tab ${activeTab === 'clients' ? 'active' : ''}`}
              onClick={() => setActiveTab('clients')}
            >
              <User size={16} />
              <span>Clients List ({profiles.filter(p => p.role.includes('client')).length})</span>
            </button>
          </div>
        </aside>

        {/* Right: Main Content Panel */}
        <main className="dashboard-content-area">
          <div className="profile-tab-content">
        
        {activeTab === 'overview' && (
          <div className="tab-overview-grid">
            
            {/* KPI Metrics */}
            <div className="kpi-grid">
              <div className="kpi-card admin-card">
                <div className="kpi-icon-wrap admin-kpi">
                  <DollarSign size={20} />
                </div>
                <div className="kpi-info-col">
                  <span className="kpi-val">₹{platformRevenue.toLocaleString('en-IN')}</span>
                  <span className="kpi-lbl">Gross Platform Sales</span>
                  <span className="kpi-trend positive"><TrendingUp size={10} /> Live volume tracked</span>
                </div>
              </div>
              <div className="kpi-card admin-card">
                <div className="kpi-icon-wrap admin-kpi">
                  <TrendingUp size={20} />
                </div>
                <div className="kpi-info-col">
                  <span className="kpi-val">₹{platformCommission.toLocaleString('en-IN')}</span>
                  <span className="kpi-lbl">Platform Fee (10%)</span>
                  <span className="kpi-trend positive">Net revenue generated</span>
                </div>
              </div>
              <div className="kpi-card admin-card">
                <div className="kpi-icon-wrap admin-kpi">
                  <UserCheck size={20} />
                </div>
                <div className="kpi-info-col">
                  <span className="kpi-val">{totalVerifiedCount} / {profiles.length}</span>
                  <span className="kpi-lbl">Verified Vendors</span>
                  <span className="kpi-trend positive">High-trust rating profile</span>
                </div>
              </div>
              <div className="kpi-card admin-card">
                <div className="kpi-icon-wrap admin-kpi">
                  <Grid size={20} />
                </div>
                <div className="kpi-info-col">
                  <span className="kpi-val">{studios.length + gear.length + services.length}</span>
                  <span className="kpi-lbl">Total Catalog Listings</span>
                  <span className="kpi-trend positive">Active spaces & rentals</span>
                </div>
              </div>
            </div>

            {/* Revenue Growth chart & admin logs split */}
            <div className="overview-split-row">
              
              <div className="analytics-card-widget admin-widget">
                <span className="widget-title">Platform Fees Commission</span>
                <span className="widget-desc">Net monthly platform commissions (₹ thousands)</span>
                <div className="graph-container">
                  <div className="graph-bars-wrap">
                    {[
                      { month: 'Jan', fees: 3.0 },
                      { month: 'Feb', fees: 4.5 },
                      { month: 'Mar', fees: 7.0 },
                      { month: 'Apr', fees: 5.2 },
                      { month: 'May', fees: 8.0 },
                      { month: 'Jun', fees: platformCommission / 1000 }
                    ].map((d, i) => (
                      <div key={i} className="graph-column-group">
                        <div className="bars-stack admin-bars-stack">
                          <div className="bar bar-admin" style={{ height: `${d.fees * 10}px` }} title={`Fees: ₹${d.fees}K`}></div>
                        </div>
                        <span className="graph-label">{d.month}</span>
                      </div>
                    ))}
                  </div>
                  <div className="graph-legend">
                    <div className="legend-item">
                      <span className="legend-color-dot admin-dot"></span>
                      <span>10% Platform Cut</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="schedule-timeline-card admin-widget">
                <span className="widget-title">Recent Administrative Logs</span>
                <div className="timeline-list admin-log-list">
                  <div className="admin-log-row">
                    <span className="admin-log-dot success"></span>
                    <div className="admin-log-text-wrap">
                      <span className="admin-log-title">Provider "Ananya" verification approved</span>
                      <span className="admin-log-time">5 mins ago</span>
                    </div>
                  </div>
                  <div className="admin-log-row">
                    <span className="admin-log-dot success"></span>
                    <div className="admin-log-text-wrap">
                      <span className="admin-log-title">New booking registered on " Loft Studio"</span>
                      <span className="admin-log-time">1 hour ago</span>
                    </div>
                  </div>
                  <div className="admin-log-row">
                    <span className="admin-log-dot warning"></span>
                    <div className="admin-log-text-wrap">
                      <span className="admin-log-title">Sony A7 IV listings modified by provider</span>
                      <span className="admin-log-time">Yesterday</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="admin-bookings-view">
            <h3 className="section-title-pro">Platform Global Booking Control Panel</h3>
            <div className="admin-table-container">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Client</th>
                    <th>Provider</th>
                    <th>Listing</th>
                    <th>Reserved Date</th>
                    <th>Timing</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Admin Override</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => {
                    const clientUser = profiles.find(p => p.id === b.clientId) || { name: "Client" };
                    const vendorUser = profiles.find(p => p.id === b.ownerId) || { name: "Studio Operator" };
                    return (
                      <tr key={b.id}>
                        <td className="bold" title={b.id}>
                          {b.id && b.id.length > 8 ? `${b.id.substring(0, 6)}...${b.id.substring(b.id.length - 4)}` : b.id}
                        </td>
                        <td>{clientUser.name}</td>
                        <td>{vendorUser.name}</td>
                        <td>{b.item?.title}</td>
                        <td>{b.date}</td>
                        <td>{b.time}</td>
                        <td className="bold">{typeof b.price === 'number' ? `₹${b.price.toLocaleString('en-IN')}` : b.price}</td>
                        <td><span className={`status-badge-chip ${b.status}`}>{b.status}</span></td>
                        <td>
                          <div className="admin-action-btn-group">
                            {b.status !== 'completed' && b.status !== 'cancelled' && (
                              <>
                                <button 
                                  className="admin-action-btn complete"
                                  onClick={() => updateBookingStatus(b.id, 'completed')}
                                >
                                  Force Complete
                                </button>
                                <button 
                                  className="admin-action-btn cancel"
                                  onClick={() => updateBookingStatus(b.id, 'cancelled')}
                                >
                                  Force Cancel
                                </button>
                              </>
                            )}
                            {(b.status === 'completed' || b.status === 'cancelled') && (
                              <span className="muted-italic">Locked</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="admin-verification-view">
            <h3 className="section-title-pro">Onboarding Vendor Verification Center</h3>
            <p className="section-desc-pro">Manage user status, edit credentials, and toggle trust verifications.</p>
            
            <div className="verification-users-grid">
              {profiles.map(user => {
                const isVerified = user.role.startsWith("Verified");
                return (
                  <div key={user.id} className="verification-user-card">
                    <img src={user.avatar} className="ver-user-avatar" alt={user.name} />
                    <div className="ver-user-info">
                      <span className="ver-user-name">{user.name}</span>
                      <span className="ver-user-role">{user.role}</span>
                      <span className="ver-user-email">{user.email}</span>
                    </div>
                    <div className="ver-toggle-row">
                      <span className="ver-status-label">{isVerified ? "✓ Verified Vendor" : "Unverified User"}</span>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={isVerified}
                          onChange={() => toggleUserVerification(user.id)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="admin-listings-view">
            <div className="listings-header-row">
              <div>
                <h3 className="section-title-pro">Platform Content Moderation</h3>
                <p className="section-desc-pro">Disable flagged entries or add catalog mock listings directly.</p>
              </div>
              <button className="pro-btn-primary theme-btn-admin" onClick={() => setShowCreateListingModal(true)}>
                <PlusCircle size={14} className="btn-icon-left" /> Create Listing
              </button>
            </div>

            <div className="admin-listings-moderation-list">
              <div className="admin-table-container">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Thumbnail</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Price Rate</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ...studios.map(s => ({ ...s, cat: 'studio' })),
                      ...gear.map(g => ({ ...g, cat: 'gear' })),
                      ...services.map(ps => ({ ...ps, cat: 'service' }))
                    ].map(item => (
                      <tr key={item.id}>
                        <td>
                          <img src={item.image} className="admin-listing-thumb" alt={item.title} />
                        </td>
                        <td className="bold">{item.title}</td>
                        <td><span className="category-pill-admin">{item.cat.toUpperCase()}</span></td>
                        <td className="bold">₹{item.price}/{item.priceUnit || 'shoot'}</td>
                        <td>{item.location || 'Hyderabad'}</td>
                        <td>
                          <span className={`visibility-label-badge ${item.active !== false ? 'active' : 'inactive'}`}>
                            {item.active !== false ? 'Live' : 'Hidden'}
                          </span>
                        </td>
                        <td>
                          <div className="admin-moderation-toggle-cell">
                            <label className="switch">
                              <input 
                                type="checkbox"
                                checked={item.active !== false}
                                onChange={() => {
                                  toggleListingActive(item.id, item.cat);
                                  triggerToast(`Toggled listing visibility: ${item.title}`);
                                }}
                              />
                              <span className="slider"></span>
                            </label>
                            <button className="action-btn-sm danger" onClick={() => triggerToast("Admin mock deletion locked.")}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="tab-settings-grid">
            <div className="settings-section-card">
              <h3 className="section-title-pro">Workspace Configuration</h3>
              <div className="profile-settings-menu borderless-menu">
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
              <form onSubmit={handleProfileUpdate} className="modal-form-layout">
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
                    className="form-textarea-pro form-textarea-bio"
                  ></textarea>
                </div>
                <button type="submit" className="pro-btn-primary theme-btn-admin align-start">
                  Save Account Details
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="admin-support-layout admin-column-layout">
            <h3 className="section-title-pro">Global Customer Support Desk</h3>
            <p className="section-desc-pro mt-negative">Review filed tickets, track billing issues, and toggle resolution status.</p>
            <div className="admin-table-container">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Client Name</th>
                    <th>Category</th>
                    <th>Subject</th>
                    <th>Description Message</th>
                    <th>Date Filed</th>
                    <th>Ticket Status</th>
                    <th>Moderator Override</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(ticket => {
                    const clientObj = profiles.find(p => p.id === ticket.clientId) || { name: "Platform Client" };
                    return (
                      <tr key={ticket.id}>
                        <td className="bold" title={ticket.id}>
                          {ticket.id && ticket.id.length > 8 ? `${ticket.id.substring(0, 6)}...${ticket.id.substring(ticket.id.length - 4)}` : ticket.id}
                        </td>
                        <td>{clientObj.name}</td>
                        <td><span className="support-ticket-cat">{ticket.category}</span></td>
                        <td className="bold">{ticket.subject}</td>
                        <td className="table-cell-truncate">{ticket.message}</td>
                        <td>{ticket.date}</td>
                        <td>
                          <span className={`status-badge-chip ${ticket.status === 'open' ? 'pending' : 'confirmed'}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td>
                          <div className="admin-action-btn-group">
                            {ticket.status === 'open' ? (
                              <button 
                                className="admin-action-btn complete"
                                onClick={() => updateTicketStatus(ticket.id, 'resolved')}
                              >
                                Mark Resolved
                              </button>
                            ) : (
                              <button 
                                className="admin-action-btn cancel"
                                onClick={() => updateTicketStatus(ticket.id, 'open')}
                              >
                                Re-open Ticket
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {tickets.length === 0 && (
                    <tr>
                      <td colSpan="8" className="table-cell-empty">No support tickets filed.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="admin-coupons-layout admin-column-layout">
            <div className="listings-header-row">
              <div>
                <h3 className="section-title-pro">Platform Coupon Campaign Moderation</h3>
                <p className="section-desc-pro">Configure promotional deals, discount percentages, and active coupon cards.</p>
              </div>
              <button className="pro-btn-primary theme-btn-admin" onClick={() => setShowCreateCouponModal(true)}>
                <PlusCircle size={14} className="btn-icon-left" /> Create Coupon Code
              </button>
            </div>

            <div className="coupons-grid-list">
              {coupons.map(cp => (
                <div key={cp.code} className={`coupon-card ${cp.active ? 'active' : 'inactive'}`}>
                  <div className="coupon-header">
                    <div className={`coupon-code-badge ${cp.active ? 'active' : 'inactive'}`}>
                      {cp.code}
                    </div>
                    <span className="coupon-discount-val">{cp.discount}</span>
                  </div>
                  <p className="coupon-desc">{cp.description}</p>
                  
                  <div className="coupon-footer">
                    <span className={`coupon-status-label ${cp.active ? 'active' : 'inactive'}`}>
                      {cp.active ? '● Active Promo' : '○ Inactive Coupon'}
                    </span>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={cp.active}
                        onChange={() => toggleCouponStatus(cp.code)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Create Coupon Modal Form */}
            {showCreateCouponModal && (
              <div className="profile-modal-overlay" onClick={() => setShowCreateCouponModal(false)}>
                <div className="profile-modal-body" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header-row">
                    <h3 className="section-title-pro">Publish New Campaign Coupon</h3>
                    <button className="close-modal-btn" onClick={() => setShowCreateCouponModal(false)}><X size={16} /></button>
                  </div>

                  <form onSubmit={handleCreateCouponSubmit} className="modal-form-layout">
                    <div className="form-group">
                      <label className="form-label">Coupon Promo Code</label>
                      <input 
                        type="text" 
                        placeholder="e.g. FLASH50" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="form-input-pro"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Discount Value Rate (e.g. 50% or ₹1,000 Flat)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 20% or ₹200" 
                        value={couponDiscount}
                        onChange={(e) => setCouponDiscount(e.target.value)}
                        className="form-input-pro"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Offer Campaign Description</label>
                      <textarea 
                        placeholder="Detail terms of service usage (e.g. valid on gear rentals)..." 
                        value={couponDesc} 
                        onChange={(e) => setCouponDesc(e.target.value)} 
                        className="form-textarea-pro form-textarea-coupon"
                      ></textarea>
                    </div>

                    <div className="modal-footer-actions">
                      <button type="button" className="modal-cancel-btn" onClick={() => setShowCreateCouponModal(false)}>Cancel</button>
                      <button type="submit" className="pro-btn-primary theme-btn-admin">Launch Campaign</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="admin-clients-layout admin-column-layout">
            <h3 className="section-title-pro">Platform Registered Clients</h3>
            <p className="section-desc-pro mt-negative">Overview of all active clients, their contact information, and platform utilization.</p>
            <div className="admin-table-container">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Total Bookings</th>
                    <th>Total Spent</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.filter(p => p.role.includes('client')).map(client => {
                    const clientBookings = bookings.filter(b => b.clientId === client.id);
                    const clientSpent = clientBookings.reduce((sum, b) => sum + (b.status === 'cancelled' ? 0 : (parseFloat(b.price) || 0)), 0);
                    return (
                      <tr key={client.id}>
                        <td>
                          <img src={client.avatar} className="ver-user-avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} alt={client.name} />
                        </td>
                        <td className="bold">{client.name}</td>
                        <td>{client.email}</td>
                        <td>{client.phone}</td>
                        <td><span className="category-pill-admin">{client.role.toUpperCase()}</span></td>
                        <td className="bold">{clientBookings.length} bookings</td>
                        <td className="bold">₹{clientSpent.toLocaleString('en-IN')}</td>
                        <td>
                          <button 
                            className="admin-action-btn complete"
                            onClick={() => {
                              setActiveProfileId(client.id);
                              changeUserRole('client');
                              navigate('/dashboard/client');
                            }}
                          >
                            View Client Dashboard
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
        </main>
      </div>

      {/* Admin Create Listing Modal */}
      {showCreateListingModal && (
        <div className="profile-modal-overlay" onClick={() => setShowCreateListingModal(false)}>
          <div className="profile-modal-body" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3 className="section-title-pro">Publish New Listing</h3>
              <button className="close-modal-btn" onClick={() => setShowCreateListingModal(false)}><X size={16} /></button>
            </div>

            <form onSubmit={handleCreateListingSubmit} className="modal-form-layout">
              <div className="form-group">
                <label className="form-label">Listing Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Olympus Pro Studio Lot" 
                  value={listTitle}
                  onChange={(e) => setListTitle(e.target.value)}
                  className="form-input-pro"
                  required
                />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">Listing Category Type</label>
                  <select 
                    value={listType}
                    onChange={(e) => setListType(e.target.value)}
                    className="form-input-pro"
                  >
                    <option value="studio">Studio / Locations</option>
                    <option value="gear">Gear Rentals</option>
                    <option value="service">Photography Packages</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Price Rate (₹)</label>
                  <input 
                    type="number" 
                    value={listPrice}
                    onChange={(e) => setListPrice(e.target.value)}
                    className="form-input-pro"
                    required
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">Location Address</label>
                  <input 
                    type="text" 
                    value={listLocation}
                    onChange={(e) => setListLocation(e.target.value)}
                    className="form-input-pro"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Thumbnail Image URL</label>
                  <input 
                    type="text" 
                    value={listImage}
                    onChange={(e) => setListImage(e.target.value)}
                    className="form-input-pro"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Technical Description</label>
                <textarea 
                  placeholder="Describe lighting setups, camera specs, or booking schedules..." 
                  value={listDesc} 
                  onChange={(e) => setListDesc(e.target.value)} 
                  className="form-textarea-pro form-textarea-coupon"
                ></textarea>
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setShowCreateListingModal(false)}>Cancel</button>
                <button type="submit" className="pro-btn-primary theme-btn-admin">Publish Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
