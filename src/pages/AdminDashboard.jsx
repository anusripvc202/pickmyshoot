import React, { useState } from 'react';
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
  ArrowLeft
} from 'lucide-react';

const AdminDashboard = () => {
  const { logoutUser, triggerToast } = useAppContext();
  const navigate = useNavigate();

  // Mock initial photographer partners matching the screenshot exactly
  const [photographers, setPhotographers] = useState([
    {
      id: '1',
      name: '24 Frames Photography - South India\'s Leading Luxury Wedding Photography Brand',
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

  // Handle Search filter
  const filteredPhotographers = photographers.filter(p => 
    p.name.toLowerCase().includes(filterText.toLowerCase()) ||
    p.location.toLowerCase().includes(filterText.toLowerCase()) ||
    p.slug.toLowerCase().includes(filterText.toLowerCase())
  );

  // Handle Claim Link Action
  const handleClaimLink = (slug) => {
    const claimUrl = `${window.location.origin}/claim/${slug}`;
    navigator.clipboard.writeText(claimUrl);
    triggerToast("✓ Claim link copied to clipboard!");
  };

  // Handle Code Generation Action
  const handleGenerateCode = (id) => {
    const randomCode = `PMS-${Math.floor(1000 + Math.random() * 9000)}`;
    setPhotographers(prev => prev.map(p => 
      p.id === id ? { ...p, code: randomCode } : p
    ));
    triggerToast(`✓ Verification code ${randomCode} generated and sent to email!`);
  };

  // Handle Delete Action
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setPhotographers(prev => prev.filter(p => p.id !== id));
      triggerToast("✓ Photographer profile removed from directory");
    }
  };

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

      {/* 3. Central Operations Console Title Card */}
      <div className="console-title-card">
        <h2 className="console-main-title">PickMyShoot Central Operations Console</h2>
        <span className="console-role-desc">
          <strong>Role:</strong> Superadmin (pickmyshootnearme@gmail.com)
        </span>
      </div>

      {/* 4. System Operations Overview Segment */}
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
            <span className="kpi-label">✓ VERIFIED PARTNER BADGES</span>
          </div>
          <div className="overview-kpi-card border-dashed-red">
            <span className="kpi-number text-dark">11</span>
            <span className="kpi-label">TOTAL SYSTEM LEADS GENERATED</span>
          </div>
        </div>
      </section>

      {/* 5. Photographer Partner Directory Segment */}
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
                <tr>
                  <td colSpan="5" className="empty-row-text">
                    No photographer profiles found matching your search.
                  </td>
                </tr>
              ) : (
                filteredPhotographers.map(p => (
                  <tr key={p.id}>
                    
                    {/* Photographer Info */}
                    <td className="photographer-info-cell">
                      <span className="photographer-name">{p.name}</span>
                      <span className="photographer-slug">ID Slug: {p.slug}</span>
                    </td>

                    {/* Location */}
                    <td className="location-cell">
                      {p.location}
                    </td>

                    {/* Verification Status */}
                    <td className="verification-cell">
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
                    </td>

                    {/* Active Code / Status */}
                    <td className="code-cell">
                      <span className={`code-value ${p.code === 'No Code' ? 'no-code' : 'has-code'}`}>
                        {p.code}
                      </span>
                      <span className="status-value active">{p.status}</span>
                    </td>

                    {/* Actions */}
                    <td className="actions-cell">
                      <div className="action-buttons-group">
                        <button 
                          className="console-action-btn claim-btn"
                          onClick={() => handleClaimLink(p.slug)}
                        >
                          <Link size={13} style={{ marginRight: '4px' }} />
                          Claim Link
                        </button>
                        <button 
                          className="console-action-btn mail-btn"
                          onClick={() => handleGenerateCode(p.id)}
                        >
                          <Mail size={13} style={{ marginRight: '4px' }} />
                          Generate & Mail Code
                        </button>
                        <button 
                          className="console-action-btn delete-btn"
                          onClick={() => handleDelete(p.id, p.name)}
                        >
                          <Trash2 size={13} style={{ marginRight: '4px' }} />
                          Delete
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
