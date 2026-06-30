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
  Clock,
  Wifi
} from 'lucide-react';

const AdminDashboard = () => {
  const { logoutUser, triggerToast } = useAppContext();
  const navigate = useNavigate();

  // Photographer Partner Directory
  const [photographers, setPhotographers] = useState([
    {
      id: '1',
      name: "24 Frames Photography - South India's Leading Luxury Wedding Photography Brand",
      slug: '24-frames-photography-south-india-s-leading-luxury-wedding-photography-brand',
      location: 'Banjara Hills, Hyderabad',
      isVerified: false,
      code: 'No Code',
      status: 'Active'
    },
    {
      id: '2',
      name: '24mm | Best Photography & Videography in Hyderabad | Wedding Photographers',
      slug: '24mm-best-photography-videography-in-hyderabad-wedding-photographers',
      location: 'Hitech City, Hyderabad',
      isVerified: false,
      code: 'No Code',
      status: 'Active'
    },
    {
      id: '3',
      name: '24mm | Best Photography & Videography in Hyderabad | Wedding Photographers',
      slug: '24mm-best-photography-videography-in-hyderabad-wedding-photographers-1',
      location: 'Jubilee Hills, Hyderabad',
      isVerified: false,
      code: 'No Code',
      status: 'Active'
    },
    {
      id: '4',
      name: '5zaan photography',
      slug: '5zaan-photography',
      location: 'Banjara Hills, Hyderabad',
      isVerified: false,
      code: 'No Code',
      status: 'Active'
    }
  ]);

  const [filterText, setFilterText] = useState('');

  // Login Activity from MongoDB via Vercel API
  const [loginActivity, setLoginActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchLoginActivity = useCallback(async () => {
    setActivityLoading(true);
    setActivityError(null);
    try {
      const res = await fetch('/api/login-activity?limit=50');
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setLoginActivity(Array.isArray(data) ? data : []);
      setLastRefreshed(new Date());
    } catch (err) {
      setActivityError('Could not load login activity: ' + err.message);
    } finally {
      setActivityLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLoginActivity();
    const interval = setInterval(fetchLoginActivity, 30000);
    return () => clearInterval(interval);
  }, [fetchLoginActivity]);

  const handleClearActivity = async () => {
    if (!window.confirm('Clear all login activity records?')) return;
    try {
      const res = await fetch('/api/login-activity', { method: 'DELETE' });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      setLoginActivity([]);
      triggerToast('âœ“ Login activity log cleared.');
    } catch (err) {
      triggerToast('Failed to clear activity log.');
    }
  };

  const isOnline = (loginTime) => {
    return Date.now() - new Date(loginTime).getTime() < 30 * 60 * 1000;
  };

  const formatTime = (loginTime) => {
    return new Date(loginTime).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  // Photographer Directory Helpers
  const filteredPhotographers = photographers.filter(p =>
    p.name.toLowerCase().includes(filterText.toLowerCase()) ||
    p.location.toLowerCase().includes(filterText.toLowerCase()) ||
    p.slug.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleClaimLink = (slug) => {
    navigator.clipboard.writeText(`${window.location.origin}/claim/${slug}`);
    triggerToast('âœ“ Claim link copied to clipboard!');
  };

  const handleGenerateCode = (id) => {
    const randomCode = `PMS-${Math.floor(1000 + Math.random() * 9000)}`;
    setPhotographers(prev => prev.map(p => p.id === id ? { ...p, code: randomCode } : p));
    triggerToast(`âœ“ Verification code ${randomCode} generated!`);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      setPhotographers(prev => prev.filter(p => p.id !== id));
      triggerToast('âœ“ Photographer profile removed.');
    }
  };

  const activeSessions = loginActivity.filter(a => isOnline(a.loginTime)).length;

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
            <span className="kpi-number text-red">346</span>
            <span className="kpi-label">TOTAL LISTED PHOTOGRAPHERS</span>
          </div>
          <div className="overview-kpi-card border-dashed-green bg-green-light">
            <span className="kpi-number text-green">6</span>
            <span className="kpi-label">âœ“ VERIFIED PARTNER BADGES</span>
          </div>
          <div className="overview-kpi-card border-dashed-red">
            <span className="kpi-number text-dark">11</span>
            <span className="kpi-label">TOTAL SYSTEM LEADS GENERATED</span>
          </div>
          <div className="overview-kpi-card" style={{ border: '2px dashed #2980b9', background: '#f0f7ff' }}>
            <span className="kpi-number" style={{ color: '#2980b9' }}>{activeSessions}</span>
            <span className="kpi-label">ðŸŸ¢ ACTIVE NOW (30 MIN)</span>
          </div>
          <div className="overview-kpi-card" style={{ border: '2px dashed #8e44ad', background: '#fdf5ff' }}>
            <span className="kpi-number" style={{ color: '#8e44ad' }}>{loginActivity.length}</span>
            <span className="kpi-label">TOTAL LOGIN EVENTS</span>
          </div>
        </div>
      </section>

      {/* Login Activity Table */}
      <section className="console-section" style={{ marginTop: '24px' }}>
        <div className="console-section-header flex-header">
          <h3 className="section-title-text">
            <Wifi size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Photographer Login Activity (Live)
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {lastRefreshed && (
              <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px' }}>
                <Clock size={11} style={{ marginRight: '3px', verticalAlign: 'middle' }} />
                Updated {lastRefreshed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              className="console-action-btn"
              style={{ background: '#2980b9', fontSize: '11px', padding: '6px 12px' }}
              onClick={fetchLoginActivity}
              disabled={activityLoading}
            >
              <RefreshCw size={12} style={{ marginRight: '4px' }} />
              {activityLoading ? 'Loadingâ€¦' : 'Refresh'}
            </button>
            {loginActivity.length > 0 && (
              <button
                className="console-action-btn delete-btn"
                style={{ fontSize: '11px', padding: '6px 12px' }}
                onClick={handleClearActivity}
              >
                <Trash2 size={12} style={{ marginRight: '4px' }} />
                Clear Log
              </button>
            )}
          </div>
        </div>

        <div className="console-section-body table-container-no-pad">
          {activityError ? (
            <p style={{ padding: '24px', color: '#c0392b', fontStyle: 'italic' }}>{activityError}</p>
          ) : (
            <table className="console-data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Login Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activityLoading && loginActivity.length === 0 ? (
                  <tr><td colSpan="5" className="empty-row-text">Loading login activityâ€¦</td></tr>
                ) : loginActivity.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-row-text">
                      No login activity yet. When any user logs in on the live site, they appear here automatically.
                    </td>
                  </tr>
                ) : (
                  loginActivity.map((a, idx) => (
                    <tr key={a._id || idx}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {a.avatar ? (
                            <img src={a.avatar} alt={a.name}
                              style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '2px solid #eee' }}
                              onError={e => { e.target.style.display = 'none'; }} />
                          ) : (
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#c7100d', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>
                              {(a.name || '?').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="photographer-name">{a.name}</span>
                        </div>
                      </td>
                      <td style={{ color: '#444', fontSize: '13.5px' }}>{a.email}</td>
                      <td>
                        <span style={{
                          padding: '3px 10px', borderRadius: '100px', fontSize: '11px',
                          fontWeight: 700, textTransform: 'uppercase',
                          background: a.role === 'photographer' ? '#fff3e0' : a.role === 'admin' ? '#fdecea' : '#e8f5e9',
                          color: a.role === 'photographer' ? '#e67e22' : a.role === 'admin' ? '#c7100d' : '#27ae60'
                        }}>
                          {a.role}
                        </span>
                      </td>
                      <td style={{ color: '#444', fontSize: '13px' }}>{formatTime(a.loginTime)}</td>
                      <td>
                        {isOnline(a.loginTime) ? (
                          <span style={{ color: '#27ae60', fontWeight: 700, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#27ae60', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                            Online
                          </span>
                        ) : (
                          <span style={{ color: '#95a5a6', fontWeight: 600, fontSize: '12px' }}>Recent</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Photographer Partner Directory */}
      <section className="console-section" style={{ marginTop: '24px' }}>
        <div className="console-section-header flex-header">
          <h3 className="section-title-text">Photographer Partner Directory</h3>
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
        </div>

        <div className="console-section-body table-container-no-pad">
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
              {filteredPhotographers.length === 0 ? (
                <tr><td colSpan="5" className="empty-row-text">No photographer profiles found matching your search.</td></tr>
              ) : (
                filteredPhotographers.map(p => (
                  <tr key={p.id}>
                    <td className="photographer-info-cell">
                      <span className="photographer-name">{p.name}</span>
                      <span className="photographer-slug">ID Slug: {p.slug}</span>
                    </td>
                    <td className="location-cell">{p.location}</td>
                    <td className="verification-cell">
                      {p.isVerified ? (
                        <span className="verified-status-text"><CheckCircle size={14} className="status-icon green" />Verified Profile</span>
                      ) : (
                        <span className="unverified-status-text"><AlertTriangle size={14} className="status-icon orange" />Unverified Profile</span>
                      )}
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
                        <button className="console-action-btn mail-btn" onClick={() => handleGenerateCode(p.id)}>
                          <Mail size={13} style={{ marginRight: '4px' }} />Generate & Mail Code
                        </button>
                        <button className="console-action-btn delete-btn" onClick={() => handleDelete(p.id, p.name)}>
                          <Trash2 size={13} style={{ marginRight: '4px' }} />Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};

export default AdminDashboard;

