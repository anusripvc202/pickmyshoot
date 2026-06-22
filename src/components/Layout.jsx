import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './PageTransition';
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
  User,
  Maximize2,
  Users,
  Car,
  Wind,
  Wifi,
  Lightbulb,
  Image,
  Sparkles,
  Shirt,
  Coffee,
  Layers,
  VolumeX,
  Palette,
  Grid,
  Sliders,
  Award,
  Video,
  Briefcase
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const amenityIconMap = {
  'Lighting Equipment': <Lightbulb size={22} />,
  'Studio Lights': <Lightbulb size={22} />,
  'Backdrops': <Image size={22} />,
  'Makeup Room': <Sparkles size={22} />,
  'Changing Room': <Shirt size={22} />,
  'Pantry': <Coffee size={22} />,
  'Cyc Wall': <Layers size={22} />,
  'Vintage Props': <Award size={22} />,
  'Colored Backgrounds': <Palette size={22} />,
  'Industrial Props': <Sliders size={22} />,
  'High Ceilings': <Maximize2 size={22} />,
  'Full Cyc Green Screen': <Video size={22} />,
  'Soundproofing': <VolumeX size={22} />,
  'Controllable LED Grid': <Grid size={22} />,
  'Lounge Area': <Heart size={22} />,
  'Softbox Panels': <Grid size={22} />,
  'Textured Backdrops': <Layers size={22} />,
  'Classic Mahogany Bookshelves': <Briefcase size={22} />,
  'Leather Sofas': <Heart size={22} />,
  'Retro Table Lamps': <Sun size={22} />
};

const featureIconMap = {
  'Parking': <Car size={20} />,
  'AC': <Wind size={20} />,
  'Wi-Fi': <Wifi size={20} />,
  'Lighting Equipment': <Lightbulb size={20} />,
  'Studio Lights': <Lightbulb size={20} />,
  'Cyc Wall': <Layers size={20} />,
  'Soundproofing': <VolumeX size={20} />,
  'Controllable LED Grid': <Grid size={20} />
};

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
    triggerToast,
    toggleLike,
    handleBookingSubmit,
    isAuthenticated,
    currentUser,
    logoutUser,
    currentRole,
    changeUserRole,
    setExploreTab,
    bookings,
    activeProfileId
  } = useAppContext();

  const navigate = useNavigate();
  const location = useLocation();
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const [bookingStatus, setBookingStatus] = React.useState('idle'); // 'idle' | 'processing' | 'success'
  const [showFullDesc, setShowFullDesc] = React.useState(false);
  const scrollRef = React.useRef(null);

  // Calculate pending booking notification count
  const pendingCount = bookings.filter(b => {
    if (!currentUser) return false;
    if (currentUser.role === 'photographer') {
      return (b.ownerId === activeProfileId || b.creatorId === activeProfileId) && b.status === 'pending';
    }
    if (currentUser.role === 'admin') {
      return b.status === 'pending';
    }
    return false;
  }).length;

  React.useEffect(() => {
    document.body.className = `${theme}-theme`;
  }, [theme]);

  React.useEffect(() => {
    if (selectedItem) {
      // Force scroll position to top on next render frame to handle layout shifts / focus resets
      const timer = setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = 0;
        }
      }, 0);
      return () => clearTimeout(timer);
    } else {
      setBookingStatus('idle');
      setShowFullDesc(false);
    }
  }, [selectedItem]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    navigate('/explore');
  };

  const handleBookingClick = () => {
    if (bookingStatus !== 'idle') return;
    setBookingStatus('processing');
    setTimeout(() => {
      handleBookingSubmit(false); // registers the booking without closing modal
      setBookingStatus('success');
      setTimeout(() => {
        setSelectedItem(null);
        navigate('/bookings');
      }, 1800);
    }, 1500);
  };

  return (
    <div className={`app-container ${theme}-theme role-${currentRole}-mode`}>
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
            </div>

            {/* Right actions */}
            <div className="header-right-actions">
              
              <button 
                className="icon-btn-wrap" 
                onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                title="Toggle Light/Dark Theme"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              <button 
                className="icon-btn-wrap"
                onClick={() => {
                  if (currentUser?.role === 'photographer') navigate('/dashboard/photographer');
                  else if (currentUser?.role === 'admin') navigate('/dashboard/admin');
                  else if (currentUser?.role === 'client') navigate('/dashboard/client');
                }}
                title={pendingCount > 0 ? `${pendingCount} Pending Bookings` : 'Notifications'}
              >
                <Bell size={18} />
                {pendingCount > 0 && <span className="badge-count">{pendingCount}</span>}
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
                        {/* Show dashboard link that matches the user's actual registered role */}
                        {currentUser?.role === 'client' && (
                          <button className="dropdown-menu-item-btn" onClick={() => { navigate('/dashboard/client'); setUserDropdownOpen(false); }}>
                            💼 My Dashboard
                          </button>
                        )}
                        {currentUser?.role === 'photographer' && (
                          <button className="dropdown-menu-item-btn" onClick={() => { navigate('/dashboard/photographer'); setUserDropdownOpen(false); }}>
                            📸 My Dashboard
                          </button>
                        )}
                        {currentUser?.role === 'admin' && (
                          <>
                            <button className="dropdown-menu-item-btn" onClick={() => { navigate('/dashboard/admin'); setUserDropdownOpen(false); }}>
                              🛡️ Admin Dashboard
                            </button>
                            <button className="dropdown-menu-item-btn" onClick={() => { navigate('/dashboard/client'); setUserDropdownOpen(false); }}>
                              💼 Client View
                            </button>
                            <button className="dropdown-menu-item-btn" onClick={() => { navigate('/dashboard/photographer'); setUserDropdownOpen(false); }}>
                              📸 Photographer View
                            </button>
                          </>
                        )}
                        <div style={{ borderTop: '1px dashed var(--border)', margin: '6px 0' }} />
                        <button className="dropdown-menu-item-btn" onClick={() => { navigate('/profile'); setUserDropdownOpen(false); }}>
                          👤 My Profile
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
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
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
            <div className="detail-right-container">
              
              {/* Close Button */}
              <button className="detail-close-btn" onClick={() => setSelectedItem(null)}>
                <X size={18} />
              </button>

              {bookingStatus === 'idle' && (
                <>
                  <div className="detail-scrollable-content" ref={scrollRef}>
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
                      <div className="detail-specs-row">
                        <div className="spec-icon-card">
                          <div className="spec-icon-wrap"><Maximize2 size={20} /></div>
                          <span className="spec-icon-label">{selectedItem.area || '1500 Sq.ft'}</span>
                        </div>
                        <div className="spec-icon-card">
                          <div className="spec-icon-wrap"><Users size={20} /></div>
                          <span className="spec-icon-label">{selectedItem.capacity ? `${selectedItem.capacity.split(' ')[0]} Capacity` : '15 Capacity'}</span>
                        </div>
                        {selectedItem.features && selectedItem.features.map((feat, idx) => (
                          <div key={idx} className="spec-icon-card">
                            <div className="spec-icon-wrap">{featureIconMap[feat] || <CheckCircle size={20} />}</div>
                            <span className="spec-icon-label">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedItemType !== 'studio' && (
                      <div className="detail-metrics-grid">
                        {selectedItemType === 'model' && (
                          <>
                            <div className="metric-pill">
                              <span className="metric-label">Height</span>
                              <span className="metric-value">{selectedItem.height}</span>
                            </div>
                            <div className="metric-pill">
                              <span className="metric-label">Gender</span>
                              <span className="metric-value">{selectedItem.gender || 'Female'}</span>
                            </div>
                            <div className="metric-pill">
                              <span className="metric-label">Location</span>
                              <span className="metric-value">{selectedItem.location || 'Hyderabad'}</span>
                            </div>
                            <div className="metric-pill">
                              <span className="metric-label">Experience</span>
                              <span className="metric-value">4+ Years</span>
                            </div>
                          </>
                        )}
                        {selectedItemType === 'gear' && (
                          <>
                            <div className="metric-pill">
                              <span className="metric-label">Rental Type</span>
                              <span className="metric-value">{selectedItem.category}</span>
                            </div>
                            <div className="metric-pill">
                              <span className="metric-label">Status</span>
                              <span className="metric-value">Available</span>
                            </div>
                            <div className="metric-pill">
                              <span className="metric-label">Includes</span>
                              <span className="metric-value">Standard Kit</span>
                            </div>
                          </>
                        )}
                        {selectedItemType === 'workshop' && (
                          <>
                            <div className="metric-pill">
                              <span className="metric-label">Instructor</span>
                              <span className="metric-value">{selectedItem.instructor}</span>
                            </div>
                            <div className="metric-pill">
                              <span className="metric-label">Date</span>
                              <span className="metric-value">{selectedItem.date}</span>
                            </div>
                            <div className="metric-pill">
                              <span className="metric-label">Timing</span>
                              <span className="metric-value">{selectedItem.timing}</span>
                            </div>
                            <div className="metric-pill">
                              <span className="metric-label">Location</span>
                              <span className="metric-value">{selectedItem.location.split(',')[0]}</span>
                            </div>
                          </>
                        )}
                        {selectedItemType === 'job' && (
                          <>
                            <div className="metric-pill">
                              <span className="metric-label">Company</span>
                              <span className="metric-value">{selectedItem.company}</span>
                            </div>
                            <div className="metric-pill">
                              <span className="metric-label">Job Format</span>
                              <span className="metric-value">{selectedItem.type}</span>
                            </div>
                            <div className="metric-pill">
                              <span className="metric-label">Location</span>
                              <span className="metric-value">{selectedItem.location}</span>
                            </div>
                            <div className="metric-pill">
                              <span className="metric-label">Salary Rate</span>
                              <span className="metric-value">{selectedItem.price}</span>
                            </div>
                          </>
                        )}
                        {selectedItemType === 'service' && (
                          <>
                            <div className="metric-pill">
                              <span className="metric-label">Category</span>
                              <span className="metric-value">{selectedItem.category || 'Book Shoot'}</span>
                            </div>
                            <div className="metric-pill">
                              <span className="metric-label">Deliverables</span>
                              <span className="metric-value">High-Res Photos</span>
                            </div>
                            <div className="metric-pill">
                              <span className="metric-label">Location</span>
                              <span className="metric-value">Hyderabad, TS</span>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Description */}
                    <div className="detail-desc-box">
                      <span className="detail-desc-title">
                        {selectedItemType === 'studio' ? 'About Studio' :
                         selectedItemType === 'model' ? 'About Model' :
                         selectedItemType === 'gear' ? 'About Gear Rental' :
                         selectedItemType === 'workshop' ? 'About Workshop' :
                         selectedItemType === 'job' ? 'About Job Opening' :
                         selectedItemType === 'service' ? 'About Shoot Package' : 'About Listing'}
                      </span>
                      <p className="detail-desc-text">
                        {showFullDesc || selectedItem.description.length <= 110 
                          ? selectedItem.description 
                          : `${selectedItem.description.slice(0, 110)}...`}
                      </p>
                      {selectedItem.description.length > 110 && (
                        <button 
                          className="read-more-btn-link" 
                          onClick={() => setShowFullDesc(!showFullDesc)}
                        >
                          {showFullDesc ? 'Read Less' : 'Read More'}
                        </button>
                      )}
                      {selectedItem.specs && (
                        <div style={{ marginTop: '12px', borderTop: '1px dashed var(--border)', paddingTop: '10px' }}>
                          <span className="detail-desc-title" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Technical Specifications</span>
                          <p className="detail-desc-text" style={{ marginTop: '2px', color: 'var(--text-main)' }}>
                            {selectedItem.specs}
                          </p>
                        </div>
                      )}
                      {selectedItem.includes && (
                        <div style={{ marginTop: '12px', borderTop: '1px dashed var(--border)', paddingTop: '10px' }}>
                          <span className="detail-desc-title" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>What's Included</span>
                          <p className="detail-desc-text" style={{ marginTop: '2px', color: 'var(--text-main)' }}>
                            {selectedItem.includes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Model Categories */}
                    {selectedItemType === 'model' && selectedItem.categories && (
                      <div className="detail-amenities-section" style={{ borderTop: '1px solid var(--border)', paddingTop: '14px', marginTop: '14px' }}>
                        <span className="detail-desc-title">Specialization Categories</span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                          {selectedItem.categories.map((cat, idx) => (
                            <span key={idx} className="skill-tag" style={{
                              background: 'var(--bg-app)',
                              border: '1px solid var(--border)',
                              color: 'var(--text-main)',
                              padding: '5px 12px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: '700'
                            }}>{cat}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Job Skills */}
                    {selectedItemType === 'job' && selectedItem.skills && (
                      <div className="detail-amenities-section" style={{ borderTop: '1px solid var(--border)', paddingTop: '14px', marginTop: '14px' }}>
                        <span className="detail-desc-title">Required Skills & Expertise</span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                          {selectedItem.skills.map((skill, idx) => (
                            <span key={idx} className="skill-tag" style={{
                              background: 'var(--bg-app)',
                              border: '1px solid var(--border)',
                              color: 'var(--text-main)',
                              padding: '5px 12px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: '700'
                            }}>{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Amenities tags */}
                    {selectedItem.amenities && (
                      <div className="detail-amenities-section">
                        <span className="detail-desc-title">Amenities</span>
                        <div className="amenities-icons-row">
                          {selectedItem.amenities.map((amen, idx) => (
                            <div key={idx} className="amenity-icon-card">
                              <div className="amenity-icon-wrap">
                                {amenityIconMap[amen] || <CheckCircle size={22} />}
                              </div>
                              <span className="amenity-icon-label">{amen}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Schedulers (for booking items) */}
                    {selectedItemType !== 'job' && selectedItemType !== 'workshop' && (
                      <div className="scheduler-box">
                        <span className="scheduler-title">Select Date & Time</span>
                        
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
                          {/* More Pill */}
                          <div 
                            className="date-select-pill date-more-btn"
                            onClick={() => triggerToast("Calendar picker opened!")}
                          >
                            <span className="date-select-day" style={{ fontSize: '13px', fontWeight: '800' }}>More</span>
                            <span className="date-select-name">...</span>
                          </div>
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
                  </div>

                  {/* Fixed bottom action panel */}
                  <div className="detail-fixed-checkout-bar">
                    <div className="checkout-price-col">
                      <span className="checkout-price-val">
                        {typeof selectedItem.price === 'number' 
                          ? `₹${selectedItem.price.toLocaleString('en-IN')}${selectedItem.priceUnit ? ` /${selectedItem.priceUnit}` : ''}` 
                          : selectedItem.price}
                      </span>
                      <span className="checkout-price-unit">
                        Total (incl. taxes)
                      </span>
                    </div>

                    <button className="checkout-submit-btn" onClick={handleBookingClick}>
                      {selectedItemType === 'job' ? 'Apply Now' : 
                       selectedItemType === 'workshop' ? 'Register Now' : 'Book Now'}
                    </button>
                  </div>
                </>
              )}

              {bookingStatus === 'processing' && (
                <div className="booking-status-overlay processing">
                  <div className="spinner"></div>
                  <h4>Securing your slot...</h4>
                  <p>Processing transaction &amp; locking dates.</p>
                </div>
              )}

              {bookingStatus === 'success' && (
                <div className="booking-status-overlay success">
                  <div className="success-badge-pulse">
                    <CheckCircle size={48} color="var(--primary)" />
                  </div>
                  <h4>Booking Confirmed!</h4>
                  <p className="success-tagline">Your reservation is secured successfully.</p>
                  
                  <div className="success-summary-card">
                    <div className="summary-row">
                      <span className="summary-label">Listing</span>
                      <span className="summary-value">{selectedItem.title}</span>
                    </div>
                    {selectedItemType !== 'job' && selectedItemType !== 'workshop' && (
                      <>
                        <div className="summary-row">
                          <span className="summary-label">Date</span>
                          <span className="summary-value">{selectedDate}</span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">Time Slot</span>
                          <span className="summary-value">{selectedTime}</span>
                        </div>
                      </>
                    )}
                    <div className="summary-row total">
                      <span className="summary-label">Total Invoiced</span>
                      <span className="summary-value">{typeof selectedItem.price === 'number' ? `₹${selectedItem.price.toLocaleString('en-IN')}` : selectedItem.price}</span>
                    </div>
                  </div>
                  <p className="redirect-note">Redirecting to your bookings dashboard...</p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ===== PREMIUM FOOTER ===== */}
      <footer className="site-footer" style={{ borderTop: '1.5px solid var(--border)' }}>
        <div className="footer-bottom" style={{ borderTop: 'none' }}>
          <div className="footer-bottom-inner-centered" style={{ padding: '48px 20px' }}>
            <p className="footer-powered-by">
              Powered by <span className="powered-highlight">Patterns Infotech Private Limited</span>
            </p>
            <p className="footer-copyright">
              © 2026 VisaVaani. All rights reserved.
            </p>
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
        <NavLink 
          to="/profile" 
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          onClick={() => setSelectedItem(null)}
        >
          <User size={20} />
          <span>Profile</span>
        </NavLink>
      </nav>

    </div>
  );
};

export default Layout;
