import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  MapPin, 
  Heart, 
  Star, 
  Plus, 
  X, 
  ChevronRight, 
  Check, 
  Camera,
  CheckCircle,
  Sun,
  Moon,
  Mail,
  Phone,
  ArrowRight,
  Home,
  Compass,
  Calendar,
  User
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Layout = () => {
  const {
    theme, setTheme,
    searchQuery, setSearchQuery,
    likedItems,
    selectedItem, setSelectedItem,
    selectedItemType,
    selectedDate, setSelectedDate,
    selectedTime, setSelectedTime,
    toast,
    toggleLike,
    handleBookingSubmit,
    isAuthenticated,
    currentUser,
    logoutUser
  } = useAppContext();

  const navigate = useNavigate();
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    document.body.className = `${theme}-theme`;
  }, [theme]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    navigate('/explore');
  };

  const handleBookingClick = () => {
    handleBookingSubmit();
    setTimeout(() => {
      navigate('/bookings');
    }, 800);
  };

  return (
    <div className={`app-container ${theme}-theme`}>
      {/* Toast popup */}
      {toast.show && (
        <div className="toast-notice">
          <CheckCircle size={16} color="var(--primary)" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* TOP DESKTOP HEADER */}
      <header className="app-header">
        <div className="max-width-wrapper">
          <div className="header-row">
            
            {/* Logo */}
            <div className="logo-container" onClick={() => { navigate('/'); setSelectedItem(null); }} style={{ cursor: 'pointer' }}>
              <svg viewBox="0 0 170 100" className="header-brand-logo">
                <path d="M 25,38 C 25,33 29,33 32,33 L 58,33 C 63,33 65,30 68,25 L 73,17 C 75,14 79,14 83,14 L 87,14 C 91,14 95,14 97,17 L 102,25 C 105,30 107,33 112,33 L 138,33 C 141,33 145,33 145,38 L 145,73 C 145,78 141,78 138,78 L 32,78 C 29,78 25,78 25,73 Z" stroke="var(--primary)" strokeWidth="2.5" fill="none" />
                <text x="85" y="47" textAnchor="middle" fill="var(--primary)" style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive", fontSize: '23px', fontWeight: 'bold' }}>pick my</text>
                <text x="85" y="71" textAnchor="middle" fill="var(--primary)" style={{ fontFamily: "'Montserrat', 'Arial Black', sans-serif", fontSize: '26px', fontWeight: '900', letterSpacing: '1px' }}>SHOOT</text>
                <line x1="15" y1="84" x2="155" y2="84" stroke="var(--primary)" strokeWidth="1.5" />
                <text x="85" y="93" textAnchor="middle" fill="var(--primary)" style={{ fontFamily: "var(--font-body)", fontSize: '7.5px', fontWeight: '700', letterSpacing: '0.5px' }}>Every Story Builds a Brand.</text>
              </svg>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="header-search-wrap">
              <Search size={18} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="Search services, studios, gear, models..." 
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-action-btn">
                <ChevronRight size={16} color="white" />
              </button>
            </form>

            {/* Navigation tabs */}
            <div className="header-nav-tabs">
              <NavLink 
                to="/" 
                className={({ isActive }) => `header-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedItem(null)}
              >
                Home
              </NavLink>
              <NavLink 
                to="/explore" 
                className={({ isActive }) => `header-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedItem(null)}
              >
                Explore Listings
              </NavLink>
              <NavLink 
                to="/bookings" 
                className={({ isActive }) => `header-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedItem(null)}
              >
                My Bookings
              </NavLink>
              {isAuthenticated ? (
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => `header-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedItem(null)}
                >
                  Profile
                </NavLink>
              ) : (
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => `header-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedItem(null)}
                >
                  Sign In
                </NavLink>
              )}
            </div>

            {/* Right actions */}
            <div className="header-right-actions">
              <div className="location-badge">
                <MapPin size={14} color="var(--primary)" />
                <span>Hyderabad, TS</span>
              </div>
              
              <button 
                className="icon-btn-wrap" 
                onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                title="Toggle Light/Dark Theme"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              <button className="icon-btn-wrap">
                <Bell size={18} />
                <span className="badge-count">3</span>
              </button>

              <button 
                className="header-primary-cta"
                onClick={() => { navigate('/create'); setSelectedItem(null); }}
              >
                <Plus size={16} />
                <span>List Space / Gear</span>
              </button>

              {/* Authentication Widget */}
              {isAuthenticated ? (
                <div 
                  className="user-profile-menu-container"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <button 
                    className="user-avatar-badge-btn" 
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <img 
                      src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=40&q=80'} 
                      className="header-user-avatar" 
                      alt="User Profile" 
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                    />
                  </button>
                  {userDropdownOpen && (
                    <div className="header-user-dropdown-card">
                      <div className="dropdown-user-info">
                        <div className="user-name-role">
                          <span className="dropdown-user-name">{currentUser?.name}</span>
                          <span className="dropdown-user-role">{currentUser?.role}</span>
                        </div>
                      </div>
                      <div className="dropdown-menu-list">
                        <button className="dropdown-menu-item-btn" onClick={() => { navigate('/profile'); setUserDropdownOpen(false); }}>
                          Creator Dashboard
                        </button>
                        <button className="dropdown-menu-item-btn logout-btn-action" onClick={() => { logoutUser(); setUserDropdownOpen(false); navigate('/'); }}>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  className="header-secondary-cta"
                  onClick={() => { navigate('/login'); setSelectedItem(null); }}
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '10px', 
                    border: '1.5px solid var(--primary)', 
                    background: 'transparent', 
                    color: 'var(--primary)', 
                    fontWeight: '600', 
                    fontSize: '13px', 
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  Sign In
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* MAIN CONTENT BODY */}
      <main className="max-width-wrapper page-content-body">
        <Outlet />
      </main>

      {/* DYNAMIC DESKTOP SPLIT VIEW MODAL DIALOG */}
      {selectedItem && (
        <div className="detail-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="detail-modal-body" onClick={(e) => e.stopPropagation()}>
            
            {/* Left Column: Image gallery */}
            <div className="detail-header-image-box">
              <img src={selectedItem.image} className="card-image" alt={selectedItem.title} />
              
              <button 
                className={`card-like-btn ${likedItems[selectedItem.id] ? 'liked' : ''}`}
                onClick={(e) => toggleLike(selectedItem.id, e)}
                style={{ top: '20px', left: '20px' }}
              >
                <Heart size={16} fill={likedItems[selectedItem.id] ? 'var(--primary)' : 'none'} />
              </button>

              <div className="detail-image-count">
                1 / 15 High-res Photos
              </div>
            </div>

            {/* Right Column: details content */}
            <div className="detail-content-wrap">
              
              {/* Close Button */}
              <button className="detail-close-btn" onClick={() => setSelectedItem(null)}>
                <X size={18} />
              </button>

              <div className="detail-title-section">
                {selectedItem.isFeatured && (
                  <span className="detail-featured-badge">Featured Space</span>
                )}
                <h3 className="detail-main-title">{selectedItem.title}</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <div className="detail-rating-row">
                    <Star size={13} fill="#ffaa00" color="#ffaa00" />
                    <span>{selectedItem.rating}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: '500', fontSize: '12px' }}>
                      ({selectedItem.reviews} Reviews)
                    </span>
                  </div>

                  {selectedItem.location && (
                    <span className="detail-sub-header">
                      <MapPin size={13} color="var(--primary)" />
                      <span>{selectedItem.location}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Metrics specifications blocks */}
              {selectedItemType === 'studio' && (
                <div className="detail-metrics-grid">
                  <div className="metric-pill">
                    <span className="metric-label">Dimensions</span>
                    <span className="metric-value">{selectedItem.area}</span>
                  </div>
                  <div className="metric-pill">
                    <span className="metric-label">Capacity</span>
                    <span className="metric-value">{selectedItem.capacity}</span>
                  </div>
                  <div className="metric-pill">
                    <span className="metric-label">Features</span>
                    <span className="metric-value">{selectedItem.features.slice(0, 2).join(' & ')}</span>
                  </div>
                </div>
              )}

              {selectedItemType === 'model' && (
                <div className="detail-metrics-grid">
                  <div className="metric-pill">
                    <span className="metric-label">Height</span>
                    <span className="metric-value">{selectedItem.height}</span>
                  </div>
                  <div className="metric-pill">
                    <span className="metric-label">Experience</span>
                    <span className="metric-value">4+ Years</span>
                  </div>
                  <div className="metric-pill">
                    <span className="metric-label">Categories</span>
                    <span className="metric-value">{selectedItem.categories.join('/')}</span>
                  </div>
                </div>
              )}

              {selectedItemType === 'gear' && (
                <div className="detail-metrics-grid">
                  <div className="metric-pill">
                    <span className="metric-label">Rental Type</span>
                    <span className="metric-value">{selectedItem.category}</span>
                  </div>
                  <div className="metric-pill">
                    <span className="metric-label">Includes</span>
                    <span className="metric-value">Standard Kit</span>
                  </div>
                  <div className="metric-pill">
                    <span className="metric-label">Status</span>
                    <span className="metric-value">Available</span>
                  </div>
                </div>
              )}

              {selectedItemType === 'workshop' && (
                <div className="detail-metrics-grid">
                  <div className="metric-pill">
                    <span className="metric-label">Instructor</span>
                    <span className="metric-value">{selectedItem.instructor}</span>
                  </div>
                  <div className="metric-pill">
                    <span className="metric-label">Timing</span>
                    <span className="metric-value">{selectedItem.timing}</span>
                  </div>
                  <div className="metric-pill">
                    <span className="metric-label">Location</span>
                    <span className="metric-value">{selectedItem.location.split(',')[0]}</span>
                  </div>
                </div>
              )}

              {selectedItemType === 'job' && (
                <div className="detail-metrics-grid">
                  <div className="metric-pill">
                    <span className="metric-label">Salary Rate</span>
                    <span className="metric-value">{selectedItem.price}</span>
                  </div>
                  <div className="metric-pill">
                    <span className="metric-label">Company</span>
                    <span className="metric-value">{selectedItem.company}</span>
                  </div>
                  <div className="metric-pill">
                    <span className="metric-label">Job Format</span>
                    <span className="metric-value">{selectedItem.type}</span>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="detail-desc-box">
                <span className="detail-desc-title">
                  {selectedItemType === 'job' ? 'Job Inclusions & Description' : 'Listing Description'}
                </span>
                <p className="detail-desc-text">
                  {selectedItem.description}
                </p>
                {selectedItem.specs && (
                  <p className="detail-desc-text" style={{ fontStyle: 'italic', marginTop: '4px' }}>
                    ⚙️ Technical Specs: {selectedItem.specs}
                  </p>
                )}
                {selectedItem.includes && (
                  <p className="detail-desc-text" style={{ fontStyle: 'italic', marginTop: '4px' }}>
                    📦 Inclusions: {selectedItem.includes}
                  </p>
                )}
              </div>

              {/* Amenities tags */}
              {selectedItem.amenities && (
                <div className="detail-amenities-section">
                  <span className="detail-desc-title">Amenities List</span>
                  <div className="amenities-list">
                    {selectedItem.amenities.map((amen, idx) => (
                      <div key={idx} className="amenity-item">
                        <Check size={12} color="var(--primary)" />
                        <span>{amen}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Schedulers (for booking items) */}
              {selectedItemType !== 'job' && selectedItemType !== 'workshop' && (
                <div className="scheduler-box">
                  <span className="scheduler-title">Select Rental Date & Time Slot</span>
                  
                  {/* Date pills */}
                  <div className="date-carousel">
                    {[
                      { day: '18', name: 'SAT' },
                      { day: '19', name: 'SUN' },
                      { day: '20', name: 'MON' },
                      { day: '21', name: 'TUE' },
                      { day: '22', name: 'WED' }
                    ].map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`date-select-pill ${selectedDate === `${item.day} ${item.name}` ? 'active' : ''}`}
                        onClick={() => setSelectedDate(`${item.day} ${item.name}`)}
                      >
                        <span className="date-select-day">{item.day}</span>
                        <span className="date-select-name">{item.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Time slots */}
                  <div className="time-slot-grid">
                    {['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'].map((slot, idx) => (
                      <div 
                        key={idx} 
                        className={`time-slot-pill ${selectedTime === slot ? 'active' : ''}`}
                        onClick={() => setSelectedTime(slot)}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Sticky action panel */}
              <div className="detail-checkout-bar">
                <div className="checkout-price-col">
                  <span className="checkout-price-val">
                    ₹{selectedItem.price.toLocaleString('en-IN')}
                  </span>
                  <span className="checkout-price-unit">
                    Total billing rate ({selectedItem.priceUnit || 'booking'})
                  </span>
                </div>

                <button className="checkout-submit-btn" onClick={handleBookingClick}>
                  {selectedItemType === 'job' ? 'Apply for Gig' : 
                   selectedItemType === 'workshop' ? 'Register for Workshop' : 'Book Listing Now'}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <footer className="site-footer">
        <div className="footer-inner">

          {/* Brand column */}
          <div className="footer-brand-col">
            <div className="footer-logo" onClick={() => { navigate('/'); setSelectedItem(null); }} style={{ cursor: 'pointer' }}>
              <svg viewBox="0 0 170 100" style={{ height: '48px', width: 'auto' }}>
                <path d="M 25,38 C 25,33 29,33 32,33 L 58,33 C 63,33 65,30 68,25 L 73,17 C 75,14 79,14 83,14 L 87,14 C 91,14 95,14 97,17 L 102,25 C 105,30 107,33 112,33 L 138,33 C 141,33 145,33 145,38 L 145,73 C 145,78 141,78 138,78 L 32,78 C 29,78 25,78 25,73 Z" stroke="var(--primary)" strokeWidth="2.5" fill="none" />
                <text x="85" y="47" textAnchor="middle" fill="var(--primary)" style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive", fontSize: '23px', fontWeight: 'bold' }}>pick my</text>
                <text x="85" y="71" textAnchor="middle" fill="var(--primary)" style={{ fontFamily: "'Montserrat', 'Arial Black', sans-serif", fontSize: '26px', fontWeight: '900', letterSpacing: '1px' }}>SHOOT</text>
                <line x1="15" y1="84" x2="155" y2="84" stroke="var(--primary)" strokeWidth="1.5" />
                <text x="85" y="93" textAnchor="middle" fill="var(--primary)" style={{ fontFamily: "var(--font-body)", fontSize: '7.5px', fontWeight: '700', letterSpacing: '0.5px' }}>Every Story Builds a Brand.</text>
              </svg>
            </div>
            <p className="footer-tagline">
              India's #1 platform for photographers, studios, models, gear rentals &amp; creative professionals.
            </p>
            {/* Social icons */}
            <div className="footer-socials">
              <a href="#" className="footer-social-btn" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="footer-social-btn" aria-label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="#" className="footer-social-btn" aria-label="Twitter / X">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="footer-social-btn" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="footer-social-btn" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Explore</h4>
            <ul className="footer-links-list">
              <li><NavLink to="/explore" onClick={() => setSelectedItem(null)}>Book a Shoot</NavLink></li>
              <li><NavLink to="/explore" onClick={() => setSelectedItem(null)}>Rent a Studio</NavLink></li>
              <li><NavLink to="/explore" onClick={() => setSelectedItem(null)}>Hire a Model</NavLink></li>
              <li><NavLink to="/explore" onClick={() => setSelectedItem(null)}>Gear Rentals</NavLink></li>
              <li><NavLink to="/explore" onClick={() => setSelectedItem(null)}>Workshops</NavLink></li>
              <li><NavLink to="/explore" onClick={() => setSelectedItem(null)}>Find Jobs</NavLink></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-links-list">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Press Kit</a></li>
              <li><a href="#">Partner with Us</a></li>
              <li><a href="#">Advertise</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Support</h4>
            <ul className="footer-links-list">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Refund Policy</a></li>
              <li><a href="#">Safety Guidelines</a></li>
            </ul>
            <div className="footer-contact">
              <div className="footer-contact-item">
                <Mail size={13} />
                <span>hello@pickmyshoot.in</span>
              </div>
              <div className="footer-contact-item">
                <Phone size={13} />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer-newsletter-col">
            <h4 className="footer-col-title">Stay Updated</h4>
            <p className="footer-newsletter-desc">Get the latest shoots, workshops &amp; deals in your inbox.</p>
            <div className="footer-newsletter-form">
              <input
                type="email"
                placeholder="Your email address"
                className="footer-email-input"
              />
              <button className="footer-subscribe-btn">
                <ArrowRight size={15} />
              </button>
            </div>
            <p className="footer-newsletter-note">By subscribing you agree to our Privacy Policy.</p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span className="footer-copy">© 2025 PickMyShoot Technologies Pvt. Ltd. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="mobile-bottom-nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          onClick={() => setSelectedItem(null)}
        >
          <Home size={20} />
          <span>Home</span>
        </NavLink>
        <NavLink 
          to="/explore" 
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          onClick={() => setSelectedItem(null)}
        >
          <Compass size={20} />
          <span>Explore</span>
        </NavLink>
        <div 
          className="mobile-nav-item center-add-btn"
          onClick={() => { navigate('/create'); setSelectedItem(null); }}
        >
          <div className="add-btn-inner">
            <Plus size={22} color="white" />
          </div>
        </div>
        <NavLink 
          to="/bookings" 
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          onClick={() => setSelectedItem(null)}
        >
          <Calendar size={20} />
          <span>Bookings</span>
        </NavLink>
        {isAuthenticated ? (
          <NavLink 
            to="/profile" 
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setSelectedItem(null)}
          >
            <User size={20} />
            <span>Profile</span>
          </NavLink>
        ) : (
          <NavLink 
            to="/login" 
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setSelectedItem(null)}
          >
            <User size={20} />
            <span>Sign In</span>
          </NavLink>
        )}
      </nav>

    </div>
  );
};

export default Layout;
