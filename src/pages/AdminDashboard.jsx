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
  RefreshCw
} from 'lucide-react';
import { 
  popularServices as initialServices, 
  studios as initialStudios, 
  models as initialModels, 
  gearRentals as initialGear, 
  jobs as initialJobs 
} from '../data/mockData';

const AdminDashboard = () => {
  const { logoutUser, triggerToast, profiles } = useAppContext();
  const navigate = useNavigate();

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
        triggerToast(`✓ (Demo) Mock listing "${listing.title}" visibility toggled.`);
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

  // Toggle verified â†’ persisted to MongoDB
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
      triggerToast(newVal ? `âœ“ ${p.name} verified!` : `âœ“ ${p.name} unverified.`);
    } catch (err) {
      triggerToast('Failed to update verification: ' + err.message);
    }
  };

  // Generate & persist code â†’ MongoDB
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
      triggerToast(`âœ“ Code ${randomCode} saved to database!`);
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
      triggerToast('âœ“ Photographer removed from directory.');
    } catch (err) {
      triggerToast('Failed to delete: ' + err.message);
    }
  };

  const handleClaimLink = (slug) => {
    navigator.clipboard.writeText(`${window.location.origin}/claim/${slug}`);
    triggerToast('âœ“ Claim link copied to clipboard!');
  };

  const verifiedCount = photographers.filter(p => p.isVerified).length;

  return (
    <div className="admin-console-page">

      {/* Header */}
      <header className="admin-console-header">
        <div className="admin-console-header-inner">
          <div className="logo-container" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src="/logo.png" className="header-brand-logo" alt="PickMyShoot" />
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="admin-console-toolbar">
        <div className="toolbar-left">
          <span className="toolbar-link active">superadmin system manager</span>
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
          <span className="superadmin-access-badge">
            <User size={13} style={{ marginRight: '4px' }} />
            SUPERADMIN ACCESS
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="console-title-card">
        <h2 className="console-main-title">PickMyShoot Central Operations Console</h2>
        <span className="console-role-desc">
          <strong>Role:</strong> Superadmin (pickmyshootnearme@gmail.com)
        </span>
      </div>

      {/* KPI Overview */}
      <section className="console-section">
        <div className="console-section-header">
          <h3 className="section-title-text">System Operations Overview</h3>
        </div>
        <div className="console-section-body overview-kpi-container">
          <div className="overview-kpi-card border-dashed-red">
            <span className="kpi-number text-red">{photographers.length || 346}</span>
            <span className="kpi-label">TOTAL LISTED PHOTOGRAPHERS</span>
          </div>
          <div className="overview-kpi-card border-dashed-green bg-green-light">
            <span className="kpi-number text-green">{verifiedCount}</span>
            <span className="kpi-label">✓ VERIFIED PARTNER BADGES</span>
          </div>
          <div className="overview-kpi-card border-dashed-red">
            <span className="kpi-number text-dark">11</span>
            <span className="kpi-label">TOTAL SYSTEM LEADS GENERATED</span>
          </div>
          <div className="overview-kpi-card border-dashed-red" style={{ background: '#fcf8e3', border: '1px dashed #f0ad4e' }}>
            <span className="kpi-number" style={{ color: '#f0ad4e' }}>{listings.length}</span>
            <span className="kpi-label" style={{ color: '#8a6d3b' }}>TOTAL CREATIVE LISTINGS</span>
          </div>
        </div>
      </section>


      {/* Photographer Partner Directory */}
      <section className="console-section" style={{ marginTop: '24px' }}>
        <div className="console-section-header flex-header">
          <h3 className="section-title-text">Photographer Partner Directory</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="filter-wrap">
              <label className="filter-label">Quick Filter:</label>
              <input
                type="text"
                placeholder="Search name, city or PMS ID..."
                className="filter-input"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
            <button
              className="console-action-btn"
              style={{ background: '#2980b9', fontSize: '11px', padding: '6px 12px' }}
              onClick={fetchPhotographers}
              disabled={dirLoading}
            >
              <RefreshCw size={12} style={{ marginRight: '4px' }} />
              {dirLoading ? 'Loadingâ€¦' : 'Refresh'}
            </button>
          </div>
        </div>

        <div className="console-section-body table-container-no-pad">
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
                  <tr><td colSpan="5" className="empty-row-text">Loading photographersâ€¦</td></tr>
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
                              <Link size={13} style={{ marginRight: '4px' }} />Claim Link
                            </button>
                            <button className="console-action-btn mail-btn" onClick={() => handleGenerateCode(p)}>
                              <Mail size={13} style={{ marginRight: '4px' }} />Generate & Mail Code
                            </button>
                            <button className="console-action-btn delete-btn" onClick={() => handleDelete(p)}>
                              <Trash2 size={13} style={{ marginRight: '4px' }} />Delete
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
      </section>

      {/* Photographer Listings & Studios Directory */}
      <section className="console-section" style={{ marginTop: '24px' }}>
        <div className="console-section-header flex-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <h3 className="section-title-text" style={{ margin: 0 }}>Photographer Studios & Creative Listings</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Tab Filters */}
            <div style={{ display: 'flex', gap: '4px', background: '#f5f5f5', padding: '4px', borderRadius: '8px' }}>
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
                    color: activeListingTab === tab.id ? '#c7100d' : '#555',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: activeListingTab === tab.id ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="filter-wrap" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label className="filter-label" style={{ fontSize: '11px', fontWeight: 'bold', color: '#666' }}>Search:</label>
              <input
                type="text"
                placeholder="Search title, location..."
                className="filter-input"
                style={{ padding: '6px 10px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }}
                value={listingFilterText}
                onChange={(e) => setListingFilterText(e.target.value)}
              />
            </div>

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
        </div>

        <div className="console-section-body table-container-no-pad">
          {listingsError ? (
            <p style={{ padding: '24px', color: '#c0392b', fontStyle: 'italic' }}>{listingsError}</p>
          ) : (
            <table className="console-data-table">
              <thead>
                <tr>
                  <th>Asset Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Pricing</th>
                  <th>Creator / Owner</th>
                  <th>Visibility Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listingsLoading && listings.length === 0 ? (
                  <tr><td colSpan="7" className="empty-row-text">Loading listings…</td></tr>
                ) : listings.filter(l => {
                    const creatorName = getCreatorName(l) || '';
                    const matchesSearch = l.title.toLowerCase().includes(listingFilterText.toLowerCase()) ||
                      (l.location || '').toLowerCase().includes(listingFilterText.toLowerCase()) ||
                      creatorName.toLowerCase().includes(listingFilterText.toLowerCase());
                    const matchesTab = activeListingTab === 'all' || l.type === activeListingTab;
                    return matchesSearch && matchesTab;
                  }).length === 0 ? (
                  <tr><td colSpan="7" className="empty-row-text">No listing assets found matching your search.</td></tr>
                ) : (
                  listings
                    .filter(l => {
                      const creatorName = getCreatorName(l) || '';
                      const matchesSearch = l.title.toLowerCase().includes(listingFilterText.toLowerCase()) ||
                        (l.location || '').toLowerCase().includes(listingFilterText.toLowerCase()) ||
                        creatorName.toLowerCase().includes(listingFilterText.toLowerCase());
                      const matchesTab = activeListingTab === 'all' || l.type === activeListingTab;
                      return matchesSearch && matchesTab;
                    })
                    .map(l => (
                      <tr key={l._id || l.id}>
                        <td className="photographer-info-cell">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {l.image ? (
                              <img
                                src={l.image}
                                alt={l.title}
                                style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #eee' }}
                              />
                            ) : (
                              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#999', border: '1px dashed #ccc' }}>No Img</div>
                            )}
                            <div>
                              <span className="photographer-name" style={{ fontWeight: '700', fontSize: '13px', color: '#333' }}>{l.title}</span>
                              <span className="photographer-slug" style={{ fontSize: '11px', color: '#888', display: 'block', marginTop: '2px' }}>ID: {l.id || l._id}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            background: l.type === 'studio' ? '#e8f4fd' : l.type === 'gear' ? '#fff9db' : l.type === 'model' ? '#ebfbee' : '#f1f3f5',
                            color: l.type === 'studio' ? '#1c7ed6' : l.type === 'gear' ? '#f59f00' : l.type === 'model' ? '#2b8a3e' : '#495057',
                            border: '1px solid transparent'
                          }}>
                            {l.type || 'Asset'}
                          </span>
                        </td>
                        <td className="location-cell">{l.location || 'N/A'}</td>
                        <td style={{ fontWeight: '700', color: '#2c3e50' }}>
                          ₹{typeof l.price === 'number' ? l.price.toLocaleString() : l.price}
                          <span style={{ fontSize: '11px', color: '#888', fontWeight: 'normal' }}>/{l.priceUnit || 'hr'}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#333' }}>{getCreatorName(l)}</span>
                            <span style={{ fontSize: '10px', color: '#999', marginTop: '1px' }}>ID: {(l.creatorId || l.ownerId || 'N/A').substring(0, 10)}...</span>
                          </div>
                        </td>
                        <td className="verification-cell">
                          <button
                            onClick={() => handleToggleActiveListing(l)}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              padding: 0, display: 'flex', alignItems: 'center', gap: '6px'
                            }}
                            title={l.active !== false ? 'Click to hide this listing' : 'Click to publish this listing'}
                          >
                            {l.active !== false ? (
                              <span className="verified-status-text" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2b8a3e', background: '#ebfbee', padding: '4px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                                <CheckCircle size={12} className="status-icon green" style={{ color: '#2b8a3e' }} />
                                Active (Public)
                              </span>
                            ) : (
                              <span className="unverified-status-text" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#c92a2a', background: '#fff5f5', padding: '4px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                                <AlertTriangle size={12} className="status-icon orange" style={{ color: '#c92a2a' }} />
                                Hidden (Inactive)
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="actions-cell">
                          <div className="action-buttons-group" style={{ justifyContent: 'center' }}>
                            <button className="console-action-btn delete-btn" onClick={() => handleDeleteListing(l)} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Trash2 size={12} />Delete
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
      </section>

    </div>
  );
};

export default AdminDashboard;

