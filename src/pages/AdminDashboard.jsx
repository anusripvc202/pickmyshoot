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

const AdminDashboard = () => {
  const { logoutUser, triggerToast } = useAppContext();
  const navigate = useNavigate();

  // â”€â”€ Photographer Partner Directory (MongoDB via /api/photographers) â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
            <span className="kpi-label">âœ“ VERIFIED PARTNER BADGES</span>
          </div>
          <div className="overview-kpi-card border-dashed-red">
            <span className="kpi-number text-dark">11</span>
            <span className="kpi-label">TOTAL SYSTEM LEADS GENERATED</span>
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


    </div>
  );
};

export default AdminDashboard;

