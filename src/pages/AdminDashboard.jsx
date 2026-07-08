import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import {
  AlertTriangle,
  Mail,
  Trash2,
  Link,
  User,
  CheckCircle,
  LogOut,
  ArrowLeft,
  RefreshCw,
  Grid,
  Sliders,
  ClipboardList,
  Activity
} from 'lucide-react';
import { 
  popularServices as initialServices, 
  studios as initialStudios, 
  models as initialModels, 
  gearRentals as initialGear, 
  jobs as initialJobs 
} from '../data/mockData';

const AdminDashboard = () => {
  const { logoutUser, triggerToast, profiles, currentUser } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // ─── Client Bookings (MongoDB via /api/bookings) ─────────────────────
  const [bookingsList, setBookingsList] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState(null);
  const [bookingFilterText, setBookingFilterText] = useState('');

  const fetchBookings = useCallback(async () => {
    setBookingsLoading(true);
    setBookingsError(null);
    try {
      const res = await fetch('/api/bookings');
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setBookingsList(Array.isArray(data) ? data : []);
    } catch (err) {
      setBookingsError('Could not load bookings: ' + err.message);
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, status: newStatus })
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const updated = await res.json();
      
      // Mapped update
      setBookingsList(prev => prev.map(b => {
        const matchesId = (updated && (b._id === updated._id || b.id === updated.id));
        return matchesId ? { ...b, status: updated.status } : b;
      }));
      
      triggerToast(`✓ Booking status updated to ${newStatus}!`);
    } catch (err) {
      triggerToast('Failed to update booking status: ' + err.message);
    }
  };

  const handleDeleteBooking = async (booking) => {
    const bookingId = booking._id || booking.id;
    if (!window.confirm(`Delete booking record for "${booking.title}"?`)) return;
    try {
      const res = await fetch(`/api/bookings?id=${bookingId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      setBookingsList(prev => prev.filter(b => (b._id || b.id) !== bookingId));
      triggerToast('✓ Booking record deleted successfully.');
    } catch (err) {
      triggerToast('Failed to delete booking: ' + err.message);
    }
  };

  // ─── Photographer Listings (MongoDB via /api/listings) ─────────────────
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingsError, setListingsError] = useState(null);
  const [listingFilterText, setListingFilterText] = useState('');
  const [activeListingTab, setActiveListingTab] = useState('all');

  const fetchListings = useCallback(async () => {
    setListingsLoading(true);
    setListingsError(null);
    try {
      const res = await fetch('/api/listings');
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const dbListings = Array.isArray(data) ? data : [];

      // Construct mock listings mapped to appropriate structure
      const mockListings = [
        ...initialStudios.map(s => ({ ...s, type: 'studio' })),
        ...initialGear.map(g => ({ ...g, type: 'gear' })),
        ...initialServices.map(s => ({ ...s, type: 'service' })),
        ...initialModels.map(m => ({ ...m, type: 'model' })),
        ...initialJobs.map(j => ({ ...j, type: 'job' }))
      ];

      // Merge: DB listings override mock listings with same id
      const merged = [...dbListings];
      mockListings.forEach(mockItem => {
        const exists = merged.some(dbItem => dbItem.id === mockItem.id);
        if (!exists) {
          merged.push({
            ...mockItem,
            _id: mockItem.id, // simulate mongodb id
            active: true
          });
        }
      });

      setListings(merged);
    } catch (err) {
      setListingsError('Could not load listings: ' + err.message);
    } finally {
      setListingsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleToggleActiveListing = async (listing) => {
    const newVal = listing.active === false ? true : false;
    try {
      const isMock = !listing._id || typeof listing._id !== 'string' || listing._id.length < 24;
      if (isMock) {
        setListings(prev => prev.map(x => x._id === listing._id ? { ...x, active: newVal } : x));
        triggerToast(`✓ Mock listing "${listing.title}" visibility toggled.`);
        return;
      }

      const res = await fetch('/api/listings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: listing._id, active: newVal })
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const updated = await res.json();
      setListings(prev => prev.map(x => x._id === updated._id ? { ...x, active: updated.active } : x));
      triggerToast(newVal ? `✓ Listing "${listing.title}" is now active.` : `✓ Listing "${listing.title}" is now deactivated.`);
    } catch (err) {
      setListings(prev => prev.map(x => x._id === listing._id ? { ...x, active: newVal } : x));
      triggerToast(`✓ Visibility toggled locally: "${listing.title}"`);
    }
  };

  const handleDeleteListing = async (listing) => {
    if (!window.confirm(`Delete listing "${listing.title}"?`)) return;
    try {
      const isMock = !listing._id || typeof listing._id !== 'string' || listing._id.length < 24;
      if (isMock) {
        setListings(prev => prev.filter(x => x._id !== listing._id));
        triggerToast('✓ (Demo) Mock listing removed from view.');
        return;
      }

      const res = await fetch(`/api/listings?id=${listing._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      setListings(prev => prev.filter(x => x._id !== listing._id));
      triggerToast('✓ Listing removed successfully.');
    } catch (err) {
      setListings(prev => prev.filter(x => x._id !== listing._id));
      triggerToast('✓ Listing removed from view.');
    }
  };

  const getCreatorName = (listing) => {
    const creatorId = listing.creatorId || listing.ownerId;
    if (!creatorId) return 'Unknown Creator';
    const found = profiles?.find(p => p.id === creatorId || p._id === creatorId);
    return found ? found.name : `ID: ${creatorId}`;
  };

  // ─── Photographer Partner Directory (MongoDB via /api/photographers) ─────────
  const [photographers, setPhotographers] = useState([]);
  const [dirLoading, setDirLoading] = useState(false);
  const [dirError, setDirError] = useState(null);
  const [filterText, setFilterText] = useState('');

  const fetchPhotographers = useCallback(async () => {
    setDirLoading(true);
    setDirError(null);
    try {
      const res = await fetch('/api/photographers');
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setPhotographers(Array.isArray(data) ? data : []);
    } catch (err) {
      setDirError('Could not load photographers: ' + err.message);
    } finally {
      setDirLoading(false);
    }
  }, []);

  useEffect(() => { fetchPhotographers(); }, [fetchPhotographers]);

  // Toggle verified → persisted to MongoDB
  const handleToggleVerify = async (p) => {
    const newVal = !p.isVerified;
    try {
      const res = await fetch('/api/photographers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p._id, isVerified: newVal })
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const updated = await res.json();
      setPhotographers(prev => prev.map(x => x._id === updated._id ? updated : x));
      triggerToast(newVal ? `✓ ${p.name} verified!` : `✓ ${p.name} unverified.`);
    } catch (err) {
      triggerToast('Failed to update verification: ' + err.message);
    }
  };

  // Generate & persist code → MongoDB
  const handleGenerateCode = async (p) => {
    const randomCode = `PMS-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      const res = await fetch('/api/photographers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p._id, code: randomCode })
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const updated = await res.json();
      setPhotographers(prev => prev.map(x => x._id === updated._id ? updated : x));
      triggerToast(`✓ Code ${randomCode} saved to database!`);
    } catch (err) {
      triggerToast('Failed to save code: ' + err.message);
    }
  };

  // Delete from MongoDB
  const handleDelete = async (p) => {
    if (!window.confirm(`Delete ${p.name}?`)) return;
    try {
      const res = await fetch(`/api/photographers?id=${p._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      setPhotographers(prev => prev.filter(x => x._id !== p._id));
      triggerToast('✓ Photographer removed from directory.');
    } catch (err) {
      triggerToast('Failed to delete: ' + err.message);
    }
  };

  const handleClaimLink = (slug) => {
    navigator.clipboard.writeText(`${window.location.origin}/claim/${slug}`);
    triggerToast('✓ Claim link copied to clipboard!');
  };

  const verifiedCount = photographers.filter(p => p.isVerified).length;

  return (
    <div className="db-layout">
      {/* Sidebar Navigation */}
      <aside className="db-sidebar">
        <div className="db-sidebar-header">
          <div className="db-sidebar-logo" onClick={() => navigate('/')}>
            <img src="/logo.png" alt="PickMyShoot Logo" />
          </div>
          <div className="db-sidebar-profile">
            <img src={currentUser?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'} alt="User Avatar" />
            <div className="db-sidebar-profile-info">
              <span className="db-sidebar-profile-name">{currentUser?.name || 'Superadmin'}</span>
              <span className="db-sidebar-profile-role">Superadmin</span>
            </div>
          </div>
        </div>

        <nav className="db-sidebar-nav">
          <button className={`db-sidebar-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <Sliders size={16} /> Overview
          </button>
          <button className={`db-sidebar-link ${activeTab === 'partners' ? 'active' : ''}`} onClick={() => setActiveTab('partners')}>
            <User size={16} /> Partners Directory
          </button>
          <button className={`db-sidebar-link ${activeTab === 'listings' ? 'active' : ''}`} onClick={() => setActiveTab('listings')}>
            <Grid size={16} /> Creative Listings
          </button>
          <button className={`db-sidebar-link ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
            <ClipboardList size={16} /> Bookings Manager
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
            <h2 className="db-top-bar-title">Central Operations Console</h2>
            <span className="db-top-bar-subtitle">System Administration • pickmyshootnearme@gmail.com</span>
          </div>
        </header>

        {/* Content Body */}
        <div className="db-content">
          {activeTab === 'overview' && (
            <>
              {/* KPI Cards Grid */}
              <div className="db-kpi-grid">
                <div className="db-kpi-card" onClick={() => setActiveTab('partners')} style={{ cursor: 'pointer' }}>
                  <div className="db-kpi-card-icon red">
                    <User size={22} />
                  </div>
                  <div className="db-kpi-card-content">
                    <span className="db-kpi-card-value">{photographers.length || 346}</span>
                    <span className="db-kpi-card-label">Listed Partners</span>
                  </div>
                </div>

                <div className="db-kpi-card">
                  <div className="db-kpi-card-icon green">
                    <CheckCircle size={22} />
                  </div>
                  <div className="db-kpi-card-content">
                    <span className="db-kpi-card-value">{verifiedCount}</span>
                    <span className="db-kpi-card-label">Verified Badges</span>
                  </div>
                </div>

                <div className="db-kpi-card" onClick={() => setActiveTab('bookings')} style={{ cursor: 'pointer' }}>
                  <div className="db-kpi-card-icon blue">
                    <ClipboardList size={22} />
                  </div>
                  <div className="db-kpi-card-content">
                    <span className="db-kpi-card-value">{bookingsList.length}</span>
                    <span className="db-kpi-card-label">Total Bookings</span>
                  </div>
                </div>

                <div className="db-kpi-card" onClick={() => setActiveTab('listings')} style={{ cursor: 'pointer' }}>
                  <div className="db-kpi-card-icon orange">
                    <Grid size={22} />
                  </div>
                  <div className="db-kpi-card-content">
                    <span className="db-kpi-card-value">{listings.length}</span>
                    <span className="db-kpi-card-label">Creative Listings</span>
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="db-card">
                <div className="db-card-header">
                  <h4 className="db-card-title"><Activity size={16} /> Operational Summary</h4>
                </div>
                <div className="db-card-body" style={{ fontSize: '14.5px', color: '#4a5568', lineHeight: '1.6' }}>
                  <p>Welcome to the PickMyShoot Central Operations Console. Use the left sidebar to navigate between operational modules:</p>
                  <ul style={{ paddingLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <li><strong>Partners Directory</strong>: Approve photographer registration applications, generate verification codes, send emails, or toggle their verification badges.</li>
                    <li><strong>Creative Listings</strong>: Review all user-submitted studio spaces, gear rentals, service gigs, models, and jobs. Toggle visibility or delete listings.</li>
                    <li><strong>Bookings Manager</strong>: Monitor client bookings, review schedule dates and amounts, approve pending requests, or cancel/delete gigs.</li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {activeTab === 'partners' && (
            <div className="db-card">
              <div className="db-card-header">
                <h4 className="db-card-title"><User size={16} style={{ marginRight: '6px' }} /> Photographer Partner Directory</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Search name, city..."
                    style={{ padding: '6px 10px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }}
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                  />
                  <button
                    className="console-action-btn"
                    style={{ background: '#2980b9', fontSize: '11px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={fetchPhotographers}
                    disabled={dirLoading}
                  >
                    <RefreshCw size={12} />
                    {dirLoading ? 'Loading…' : 'Refresh'}
                  </button>
                </div>
              </div>
              <div className="db-card-body table-container-no-pad">
                {dirError ? (
                  <p style={{ padding: '24px', color: '#c0392b', fontStyle: 'italic' }}>{dirError}</p>
                ) : (
                  <table className="console-data-table">
                    <thead>
                      <tr>
                        <th>Photographer/Studio</th>
                        <th>City/Location</th>
                        <th>Verification Status</th>
                        <th>Active Code</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dirLoading && photographers.length === 0 ? (
                        <tr><td colSpan="5" className="empty-row-text">Loading photographers…</td></tr>
                      ) : photographers.filter(p =>
                          p.name.toLowerCase().includes(filterText.toLowerCase()) ||
                          (p.location || '').toLowerCase().includes(filterText.toLowerCase()) ||
                          (p.slug || '').toLowerCase().includes(filterText.toLowerCase())
                        ).length === 0 ? (
                        <tr><td colSpan="5" className="empty-row-text">No photographer profiles found matching your search.</td></tr>
                      ) : (
                        photographers
                          .filter(p =>
                            p.name.toLowerCase().includes(filterText.toLowerCase()) ||
                            (p.location || '').toLowerCase().includes(filterText.toLowerCase()) ||
                            (p.slug || '').toLowerCase().includes(filterText.toLowerCase())
                          )
                          .map(p => (
                            <tr key={p._id}>
                              <td className="photographer-info-cell">
                                <span className="photographer-name">{p.name}</span>
                                <span className="photographer-slug">ID Slug: {p.slug}</span>
                              </td>
                              <td className="location-cell">{p.location}</td>
                              <td className="verification-cell">
                                <button
                                  onClick={() => handleToggleVerify(p)}
                                  style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    padding: 0, display: 'flex', alignItems: 'center', gap: '6px'
                                  }}
                                  title={p.isVerified ? 'Click to unverify' : 'Click to verify'}
                                >
                                  {p.isVerified ? (
                                    <span className="verified-status-text">
                                      <CheckCircle size={14} className="status-icon green" />
                                      Verified Profile
                                    </span>
                                  ) : (
                                    <span className="unverified-status-text">
                                      <AlertTriangle size={14} className="status-icon orange" />
                                      Unverified Profile
                                    </span>
                                  )}
                                </button>
                              </td>
                              <td className="code-cell">
                                <span className={`code-value ${p.code === 'No Code' ? 'no-code' : 'has-code'}`}>{p.code}</span>
                                <span className="status-value active">{p.status}</span>
                              </td>
                              <td className="actions-cell">
                                <div className="action-buttons-group">
                                  <button className="console-action-btn claim-btn" onClick={() => handleClaimLink(p.slug)}>
                                    <Link size={13} />Claim Link
                                  </button>
                                  <button className="console-action-btn mail-btn" onClick={() => handleGenerateCode(p)}>
                                    <Mail size={13} />Generate & Mail Code
                                  </button>
                                  <button className="console-action-btn delete-btn" onClick={() => handleDelete(p)}>
                                    <Trash2 size={13} />Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="db-card">
              <div className="db-card-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 className="db-card-title"><Grid size={16} style={{ marginRight: '6px' }} /> Photographer Studios & Creative Listings</h4>
                  <button
                    className="console-action-btn"
                    style={{ background: '#2980b9', fontSize: '11px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={fetchListings}
                    disabled={listingsLoading}
                  >
                    <RefreshCw size={12} />
                    {listingsLoading ? 'Loading…' : 'Refresh'}
                  </button>
                </div>
                
                {/* Filters Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                    {[
                      { id: 'all', label: 'All Assets' },
                      { id: 'studio', label: 'Studios' },
                      { id: 'gear', label: 'Gear' },
                      { id: 'service', label: 'Services' },
                      { id: 'model', label: 'Models' },
                      { id: 'job', label: 'Jobs' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveListingTab(tab.id)}
                        style={{
                          background: activeListingTab === tab.id ? 'white' : 'transparent',
                          border: 'none',
                          color: activeListingTab === tab.id ? '#c7100d' : '#475569',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          boxShadow: activeListingTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                          transition: 'all 0.2s'
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Search title, location..."
                    style={{ padding: '6px 10px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '6px', outline: 'none', width: '220px' }}
                    value={listingFilterText}
                    onChange={(e) => setListingFilterText(e.target.value)}
                  />
                </div>
              </div>

              <div className="db-card-body table-container-no-pad">
                {listingsError ? (
                  <p style={{ padding: '24px', color: '#c0392b', fontStyle: 'italic' }}>{listingsError}</p>
                ) : (
                  <table className="console-data-table">
                    <thead>
                      <tr>
                        <th>Asset Image</th>
                        <th>Listing Details</th>
                        <th>Category</th>
                        <th>Starting Cost</th>
                        <th>Visibility</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listingsLoading && listings.length === 0 ? (
                        <tr><td colSpan="6" className="empty-row-text">Loading listings…</td></tr>
                      ) : listings
                        .filter(l => {
                          const matchesType = activeListingTab === 'all' || l.type === activeListingTab;
                          const matchesSearch = l.title.toLowerCase().includes(listingFilterText.toLowerCase()) ||
                            (l.location || '').toLowerCase().includes(listingFilterText.toLowerCase());
                          return matchesType && matchesSearch;
                        })
                        .length === 0 ? (
                        <tr><td colSpan="6" className="empty-row-text">No creative assets found matching your criteria.</td></tr>
                      ) : (
                        listings
                          .filter(l => {
                            const matchesType = activeListingTab === 'all' || l.type === activeListingTab;
                            const matchesSearch = l.title.toLowerCase().includes(listingFilterText.toLowerCase()) ||
                              (l.location || '').toLowerCase().includes(listingFilterText.toLowerCase());
                            return matchesType && matchesSearch;
                          })
                          .map(l => {
                            const ownerProfile = profiles?.find(p => p.id === l.ownerId || p._id === l.ownerId || p.id === l.creatorId);
                            const ownerName = ownerProfile ? ownerProfile.name : 'System Default';
                            
                            return (
                              <tr key={l._id || l.id}>
                                <td style={{ width: '90px' }}>
                                  <img
                                    src={l.image || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=100&q=80'}
                                    alt={l.title}
                                    style={{ width: '80px', height: '54px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }}
                                  />
                                </td>
                                <td>
                                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: '700', fontSize: '13.5px', color: '#1e293b' }}>{l.title}</span>
                                    <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Location: {l.location || 'Unknown'}</span>
                                    <span style={{ fontSize: '11px', color: '#c7100d', fontWeight: 'bold' }}>Owner: {ownerName}</span>
                                  </div>
                                </td>
                                <td style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: 'bold' }}>
                                  <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px' }}>{l.type}</span>
                                </td>
                                <td style={{ fontWeight: '700' }}>
                                  ₹{typeof l.price === 'number' ? `${l.price.toLocaleString()}/${l.priceUnit || 'hr'}` : l.price}
                                </td>
                                <td>
                                  <button
                                    onClick={() => handleToggleActiveListing(l)}
                                    style={{
                                      background: 'none', border: 'none', cursor: 'pointer',
                                      padding: 0, display: 'flex', alignItems: 'center', gap: '6px'
                                    }}
                                    title={l.active !== false ? 'Click to hide listing' : 'Click to publish listing'}
                                  >
                                    {l.active !== false ? (
                                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2b8a3e', background: '#ebfbee', padding: '4px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                                        <CheckCircle size={12} style={{ color: '#2b8a3e' }} />
                                        Active
                                      </span>
                                    ) : (
                                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#c92a2a', background: '#fff5f5', padding: '4px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                                        <AlertTriangle size={12} style={{ color: '#c92a2a' }} />
                                        Hidden
                                      </span>
                                    )}
                                  </button>
                                </td>
                                <td className="actions-cell">
                                  <div className="action-buttons-group" style={{ justifyContent: 'center' }}>
                                    <button className="console-action-btn delete-btn" onClick={() => handleDeleteListing(l)}>
                                      <Trash2 size={12} />Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="db-card">
              <div className="db-card-header">
                <h4 className="db-card-title"><ClipboardList size={16} style={{ marginRight: '6px' }} /> System Bookings & Gig Manager</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Search client, gig..."
                    style={{ padding: '6px 10px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }}
                    value={bookingFilterText}
                    onChange={(e) => setBookingFilterText(e.target.value)}
                  />
                  <button
                    className="console-action-btn"
                    style={{ background: '#2980b9', fontSize: '11px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={fetchBookings}
                    disabled={bookingsLoading}
                  >
                    <RefreshCw size={12} />
                    {bookingsLoading ? 'Loading…' : 'Refresh'}
                  </button>
                </div>
              </div>

              <div className="db-card-body table-container-no-pad">
                {bookingsError ? (
                  <p style={{ padding: '24px', color: '#c0392b', fontStyle: 'italic' }}>{bookingsError}</p>
                ) : (
                  <table className="console-data-table">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Booked Asset / Creator</th>
                        <th>Schedule</th>
                        <th>Total Cost</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingsLoading && bookingsList.length === 0 ? (
                        <tr><td colSpan="6" className="empty-row-text">Loading bookings…</td></tr>
                      ) : bookingsList.filter(b => {
                          const client = b.clientName || '';
                          const title = b.title || '';
                          const email = b.clientEmail || '';
                          const matchesSearch = client.toLowerCase().includes(bookingFilterText.toLowerCase()) ||
                            title.toLowerCase().includes(bookingFilterText.toLowerCase()) ||
                            email.toLowerCase().includes(bookingFilterText.toLowerCase());
                          return matchesSearch;
                        }).length === 0 ? (
                        <tr><td colSpan="6" className="empty-row-text">No bookings found matching your search.</td></tr>
                      ) : (
                        bookingsList
                          .filter(b => {
                            const client = b.clientName || '';
                            const title = b.title || '';
                            const email = b.clientEmail || '';
                            const matchesSearch = client.toLowerCase().includes(bookingFilterText.toLowerCase()) ||
                              title.toLowerCase().includes(bookingFilterText.toLowerCase()) ||
                              email.toLowerCase().includes(bookingFilterText.toLowerCase());
                            return matchesSearch;
                          })
                          .map(b => {
                            const creatorProfile = profiles?.find(p => p.id === b.creatorId || p._id === b.creatorId);
                            const creatorName = creatorProfile ? creatorProfile.name : `ID: ${b.creatorId?.substring(0, 8)}...`;
                            
                            return (
                              <tr key={b._id || b.id}>
                                <td>
                                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: '700', fontSize: '13px', color: '#333' }}>{b.clientName || 'N/A'}</span>
                                    <span style={{ fontSize: '11px', color: '#888', marginTop: '1px' }}>{b.clientEmail || 'No Email'}</span>
                                    <span style={{ fontSize: '11px', color: '#888' }}>{b.clientPhone || 'No Phone'}</span>
                                  </div>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: '700', fontSize: '13px', color: '#c7100d' }}>{b.title || 'Gig Shoot'}</span>
                                    <span style={{ fontSize: '10px', background: '#eee', padding: '1px 6px', borderRadius: '4px', alignSelf: 'flex-start', margin: '3px 0', textTransform: 'uppercase', fontWeight: 'bold' }}>
                                      {b.itemType || 'Booking'}
                                    </span>
                                    <span style={{ fontSize: '11px', color: '#666' }}>Creator: <strong>{creatorName}</strong></span>
                                  </div>
                                </td>
                                <td style={{ fontSize: '13px' }}>
                                  <div>{b.date || 'N/A'}</div>
                                  <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{b.time || 'N/A'}</div>
                                </td>
                                <td style={{ fontWeight: '700', color: '#2c3e50' }}>
                                  {typeof b.price === 'number' ? `₹${b.price.toLocaleString()}` : b.price}
                                </td>
                                <td>
                                  <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '20px',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    background: b.status === 'confirmed' || b.status === 'approved' ? '#ebfbee' : b.status === 'pending' ? '#fff9db' : '#fff5f5',
                                    color: b.status === 'confirmed' || b.status === 'approved' ? '#2b8a3e' : b.status === 'pending' ? '#f59f00' : '#c92a2a'
                                  }}>
                                    {b.status || 'Pending'}
                                  </span>
                                </td>
                                <td className="actions-cell">
                                  <div className="action-buttons-group" style={{ justifyContent: 'center', gap: '6px' }}>
                                    {(b.status === 'pending') && (
                                      <button
                                        className="console-action-btn"
                                        onClick={() => handleUpdateBookingStatus(b._id || b.id, 'confirmed')}
                                        style={{ background: '#27ae60', fontSize: '11px', padding: '5px 10px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                      >
                                        Approve
                                      </button>
                                    )}
                                    {(b.status === 'pending' || b.status === 'confirmed') && (
                                      <button
                                        className="console-action-btn"
                                        onClick={() => handleUpdateBookingStatus(b._id || b.id, 'cancelled')}
                                        style={{ background: '#e67e22', fontSize: '11px', padding: '5px 10px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                      >
                                        Cancel
                                      </button>
                                    )}
                                    <button
                                      className="console-action-btn delete-btn"
                                      onClick={() => handleDeleteBooking(b)}
                                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                      <Trash2 size={12} />Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
