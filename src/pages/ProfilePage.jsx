import React, { useState } from 'react';
import { 
  Moon, 
  Sun, 
  Sliders, 
  User, 
  ChevronRight, 
  Heart, 
  Plus, 
  MapPin, 
  Award,
  TrendingUp,
  DollarSign,
  Activity,
  Eye,
  CheckCircle2,
  Clock,
  Calendar,
  Grid,
  Trash2,
  Edit3,
  MessageSquare,
  ClipboardList,
  ThumbsUp,
  Star,
  Share2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const {
    theme,
    setTheme,
    bookings,
    likedItems,
    toggleLike,
    studios,
    gear,
    services,
    openDetails,
    triggerToast
  } = useAppContext();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Local state for profile inputs
  const [profileName, setProfileName] = useState('Dev Creator Workspace');
  const [profileEmail, setProfileEmail] = useState('creator.workspace@pickmyshoot.com');
  const [profilePhone, setProfilePhone] = useState('+91 98765 43210');
  const [profileBio, setProfileBio] = useState(
    'Premium visual productions hub & studio lot manager. Hosting state-of-the-art camera rentals, lighting packages, and fashion models portfolios across South India.'
  );

  // Sharing interaction state
  const [shareText, setShareText] = useState('Share Dashboard');

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
    triggerToast("Profile details updated successfully!");
  };

  // Mock Portfolio Items (landscape & portrait)
  const portfolioItems = [
    {
      id: "pf-1",
      title: "Royal Bridal Lookbook",
      category: "Bridal / Ethnic Wear",
      image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
      likes: 312,
      aspect: "portrait"
    },
    {
      id: "pf-2",
      title: "E-Commerce Gadget Shoot",
      category: "Product / Commercial",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
      likes: 198,
      aspect: "landscape"
    },
    {
      id: "pf-3",
      title: "Daylight Fashion Editorial",
      category: "High-Fashion / Western",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
      likes: 425,
      aspect: "portrait"
    },
    {
      id: "pf-4",
      title: "Premium SUV Advertising",
      category: "Automotive / Action",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
      likes: 184,
      aspect: "landscape"
    },
    {
      id: "pf-5",
      title: "Gourmet Dessert Catalog",
      category: "Food / Styling",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
      likes: 290,
      aspect: "portrait"
    },
    {
      id: "pf-6",
      title: "Minimalist Portrait Studies",
      category: "Fine Art / Studio Studio",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      likes: 356,
      aspect: "landscape"
    },
    {
      id: "pf-7",
      title: "Nature Cinematography",
      category: "Cinematography / Nature",
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80",
      likes: 220,
      aspect: "landscape"
    }
  ];

  // Client Testimonials
  const clientReviews = [
    {
      id: "rev-1",
      client: "Siddharth Sen",
      company: "Aura Couture",
      rating: 5,
      comment: "Absolutely outstanding studio setup. The lighting equipment included with the Loft Studio rental was world-class. Exceptionally clean spaces and professional staff.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "rev-2",
      client: "Meera Nair",
      company: "D2C Cosmetics",
      rating: 5,
      comment: "Rented the Sony mirrorless camera kits and the Chroma green room. Pristine equipment condition, zero failures, and quick crew response on bookings.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  // Listings "owned" by the user
  const userOwnedListings = [
    {
      id: "st-1",
      title: "The Loft Studio",
      price: 1500,
      priceUnit: "hr",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80",
      type: "Studio Space",
      views: 340,
      active: true
    },
    {
      id: "gr-1",
      title: "Canon R6 Mark II",
      price: 2000,
      priceUnit: "day",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80",
      type: "Camera Gear",
      views: 198,
      active: true
    }
  ];

  return (
    <div className="profile-pro-container">
      
      {/* 1. Creative Studio Header Cover Photo */}
      <div className="profile-cover-banner">
        <img 
          src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80" 
          className="cover-img" 
          alt="Creative Studio Setup" 
        />
        <div className="cover-glass-overlay">
          <span className="cover-badge-top">Live Studio Operator Dashboard</span>
        </div>
      </div>

      {/* 2. Professional Overlapping Creator Identity Block */}
      <div className="profile-header-card">
        <div className="profile-header-inner">
          
          {/* Avatar with Status indicator */}
          <div className="avatar-overlap-wrap">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=180&q=80" 
              className="profile-avatar-pro" 
              alt="Workspace Owner Avatar" 
            />
            <span className="avatar-badge-active" title="Creator Online"></span>
          </div>

          {/* Bio Description Details */}
          <div className="profile-title-bio-col">
            <div className="profile-name-row">
              <h2 className="profile-name-pro">{profileName}</h2>
              <span className="badge-verified">
                <Award size={12} color="white" />
                <span>Verified Studio Partner</span>
              </span>
            </div>
            
            <div className="profile-meta-row">
              <span className="meta-item"><MapPin size={13} color="var(--primary)" /> Hyderabad, TS</span>
              <span className="meta-item-sep">•</span>
              <span className="meta-item">{profileEmail}</span>
            </div>

            <p className="profile-bio-pro">{profileBio}</p>
          </div>

          {/* Dynamic Stats Row & Action Button */}
          <div className="profile-header-right-col">
            <div className="profile-stats-row-pro">
              <div className="stat-pill-pro">
                <span className="stat-num-pro">120+</span>
                <span className="stat-lbl-pro">Shoots</span>
              </div>
              <div className="stat-pill-pro">
                <span className="stat-num-pro">4.9 ★</span>
                <span className="stat-lbl-pro">Rating</span>
              </div>
              <div className="stat-pill-pro">
                <span className="stat-num-pro">15K</span>
                <span className="stat-lbl-pro">Followers</span>
              </div>
            </div>

            <button className="pro-btn-primary" onClick={handleShare}>
              <Share2 size={13} />
              <span>{shareText}</span>
            </button>
          </div>

        </div>
      </div>

      {/* 3. Dashboard Navigation Tabs */}
      <div className="profile-tabs-nav">
        <button 
          className={`profile-nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Activity size={16} />
          <span>Overview</span>
        </button>
        <button 
          className={`profile-nav-tab ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          <Award size={16} />
          <span>Portfolio Gallery</span>
        </button>
        <button 
          className={`profile-nav-tab ${activeTab === 'listings' ? 'active' : ''}`}
          onClick={() => setActiveTab('listings')}
        >
          <Grid size={16} />
          <span>My Listings</span>
        </button>
        <button 
          className={`profile-nav-tab ${activeTab === 'bookmarks' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookmarks')}
        >
          <Heart size={16} />
          <span>Bookmarks</span>
        </button>
        <button 
          className={`profile-nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Sliders size={16} />
          <span>Settings</span>
        </button>
      </div>

      {/* 4. Tab Layout Mount */}
      <div className="profile-tab-content">
        
        {/* ===================================================
           TAB: OVERVIEW
           =================================================== */}
        {activeTab === 'overview' && (
          <div className="tab-overview-grid">
            
            {/* KPI Cards Grid */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-icon-wrap" style={{ background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)' }}>
                  <DollarSign size={20} />
                </div>
                <div className="kpi-info-col">
                  <span className="kpi-val">₹1,42,800</span>
                  <span className="kpi-lbl">Gross Revenue</span>
                  <span className="kpi-trend positive"><TrendingUp size={10} /> +12.5% this mo.</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-wrap" style={{ background: 'rgba(0, 180, 100, 0.1)', color: '#00b464' }}>
                  <CheckCircle2 size={20} />
                </div>
                <div className="kpi-info-col">
                  <span className="kpi-val">99.2%</span>
                  <span className="kpi-lbl">Booking Success</span>
                  <span className="kpi-trend positive">Superhost Status</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-wrap" style={{ background: 'rgba(50, 150, 255, 0.1)', color: '#3296ff' }}>
                  <ClipboardList size={20} />
                </div>
                <div className="kpi-info-col">
                  <span className="kpi-val">{bookings.length + 3}</span>
                  <span className="kpi-lbl">Total Projects</span>
                  <span className="kpi-trend positive">{bookings.length} active bookings</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-wrap" style={{ background: 'rgba(255, 170, 0, 0.1)', color: '#ffaa00' }}>
                  <Eye size={20} />
                </div>
                <div className="kpi-info-col">
                  <span className="kpi-val">1,284</span>
                  <span className="kpi-lbl">Profile Views</span>
                  <span className="kpi-trend positive">+28% Traffic</span>
                </div>
              </div>
            </div>

            {/* Analytics Mini-Chart and Upcoming Timeline Split */}
            <div className="overview-split-row">
              
              {/* Analytics graph card */}
              <div className="analytics-card-widget">
                <span className="widget-title">Monthly Booking Performance</span>
                <span className="widget-desc">Gross monthly shoots volume vs gear rentals</span>
                
                {/* CSS Visual Inquiries Graph bar representation */}
                <div className="graph-container">
                  <div className="graph-bars-wrap">
                    {[
                      { month: 'Jan', shoots: 40, gear: 60 },
                      { month: 'Feb', shoots: 55, gear: 45 },
                      { month: 'Mar', shoots: 70, gear: 80 },
                      { month: 'Apr', shoots: 85, gear: 50 },
                      { month: 'May', shoots: 95, gear: 75 },
                      { month: 'Jun', shoots: 120, gear: 90 }
                    ].map((data, idx) => (
                      <div key={idx} className="graph-column-group">
                        <div className="bars-stack">
                          <div className="bar bar-shoots" style={{ height: `${data.shoots * 0.9}px` }} title={`Shoots: ${data.shoots}`}></div>
                          <div className="bar bar-gear" style={{ height: `${data.gear * 0.9}px` }} title={`Gear: ${data.gear}`}></div>
                        </div>
                        <span className="graph-label">{data.month}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Legend */}
                  <div className="graph-legend">
                    <div className="legend-item">
                      <span className="legend-color-dot" style={{ background: 'var(--primary)' }}></span>
                      <span>Studio Shoots</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color-dot" style={{ background: '#3296ff' }}></span>
                      <span>Gear Rentals</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking schedule timeline card */}
              <div className="schedule-timeline-card">
                <div className="timeline-header-row">
                  <span className="widget-title">Upcoming Schedule Timeline</span>
                  <button className="timeline-action-btn" onClick={() => navigate('/bookings')}>
                    View All Calendar
                  </button>
                </div>

                <div className="timeline-list">
                  {bookings.map((b, idx) => (
                    <div key={b.id || idx} className="timeline-step">
                      <div className="timeline-marker">
                        <div className="marker-dot"></div>
                        {idx !== bookings.length - 1 && <div className="marker-line"></div>}
                      </div>
                      <div className="timeline-details-box">
                        <div className="timeline-details-header">
                          <span className="timeline-time">{b.date} • {b.time}</span>
                          <span className={`timeline-badge ${b.status === 'confirmed' ? 'active' : ''}`}>
                            {b.status}
                          </span>
                        </div>
                        <span className="timeline-title">{b.item?.title || "Premium Rental Asset"}</span>
                        <p className="timeline-desc">Type: {b.itemType} • Rate: ₹{b.price.toLocaleString('en-IN')}</p>
                        <div className="timeline-actions-row">
                          <button className="action-btn-sm" onClick={() => triggerToast("Client message center loading...")}>
                            <MessageSquare size={11} /> Message Client
                          </button>
                          <button className="action-btn-sm text-btn" onClick={() => openDetails(b.item, b.itemType.toLowerCase())}>
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <div className="timeline-empty">
                      <Clock size={24} color="var(--text-muted)" />
                      <span>No upcoming shoots scheduled.</span>
                      <button className="timeline-cta-btn" onClick={() => navigate('/explore')}>Browse Spaces</button>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Testimonials segment */}
            <div className="testimonials-section-widget">
              <h3 className="section-title-pro">Verified Client Testimonials</h3>
              <p className="section-subtitle-pro">What top brands and creators say about booking with our workspace</p>
              
              <div className="testimonials-grid-pro">
                {clientReviews.map(rev => (
                  <div key={rev.id} className="testimonial-card-pro">
                    <div className="testimonial-header">
                      <img src={rev.avatar} className="testimonial-avatar" alt={rev.client} />
                      <div className="testimonial-client-meta">
                        <span className="client-name">{rev.client}</span>
                        <span className="client-company">{rev.company}</span>
                      </div>
                      <div className="client-rating-stars">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={12} fill="#ffaa00" color="#ffaa00" />
                        ))}
                      </div>
                    </div>
                    <p className="testimonial-comment">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ===================================================
           TAB: PORTFOLIO GALLERY (NEW)
           =================================================== */}
        {activeTab === 'portfolio' && (
          <div className="tab-portfolio-gallery">
            <div className="portfolio-header-row">
              <div>
                <h3 className="section-title-pro">Creative Production Portfolio</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  A visual archive of previous shoots, fashion catalog projects, and automotive commercials executed by our studio lot.
                </p>
              </div>
            </div>

            {/* Masonry-style/Premium Gallery Grid */}
            <div className="portfolio-masonry-grid">
              {portfolioItems.map(item => (
                <div key={item.id} className={`portfolio-item-card ${item.aspect}`}>
                  <div className="portfolio-img-container">
                    <img src={item.image} alt={item.title} className="portfolio-main-img" />
                    
                    {/* Hover Content Overlay */}
                    <div className="portfolio-hover-overlay">
                      <div className="portfolio-hover-details">
                        <span className="portfolio-item-category">{item.category}</span>
                        <h4 className="portfolio-item-title">{item.title}</h4>
                        <div className="portfolio-item-footer">
                          <span className="portfolio-likes">
                            <ThumbsUp size={11} fill="white" /> {item.likes} likes
                          </span>
                          <span className="portfolio-action-view">View Shot</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================
           TAB: MY LISTINGS
           =================================================== */}
        {activeTab === 'listings' && (
          <div className="tab-listings-view">
            <div className="listings-header-row">
              <div>
                <h3 className="section-title-pro">Listed Inventory &amp; Spaces</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Manage rates, live visibility, and view traffic metrics for your listed studios and equipment.
                </p>
              </div>
              <button className="pro-btn-primary" onClick={() => navigate('/create')}>
                <Plus size={16} /> Add Listing
              </button>
            </div>

            <div className="owned-listings-grid">
              {userOwnedListings.map(item => (
                <div key={item.id} className="owned-listing-card">
                  <div className="owned-card-img-wrap">
                    <img src={item.image} alt={item.title} className="owned-card-img" />
                    <span className="owned-card-badge">{item.type}</span>
                  </div>
                  <div className="owned-card-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span className="owned-card-title">{item.title}</span>
                      <span className="owned-card-price">₹{item.price}/{item.priceUnit}</span>
                    </div>

                    <div className="owned-card-metrics">
                      <div className="metric-tag">
                        <Eye size={12} />
                        <span>{item.views} Views</span>
                      </div>
                      <div className="metric-tag">
                        <Activity size={12} />
                        <span>Live Status</span>
                      </div>
                    </div>

                    <div className="owned-card-actions">
                      <div className="visibility-control">
                        <label className="switch">
                          <input type="checkbox" defaultChecked={item.active} onChange={() => triggerToast(`Listing visibility toggled.`)} />
                          <span className="slider"></span>
                        </label>
                        <span className="visibility-label">Active</span>
                      </div>
                      <div className="button-group-right">
                        <button className="action-btn-sm" onClick={() => triggerToast("Listing rates locked for edit.")}>
                          <Edit3 size={12} /> Edit
                        </button>
                        <button className="action-btn-sm danger" onClick={() => triggerToast("Cannot delete primary mock listings.")}>
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================
           TAB: BOOKMARKS
           =================================================== */}
        {activeTab === 'bookmarks' && (
          <div className="profile-favorites-col">
            <h3 className="section-title-pro">Bookmarked Listings</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Your saved studios, camera gear, and photoshoot packages for quick access.
            </p>

            <div className="profile-favorites-card-pro">
              <div className="fav-cards-list">
                {studios.filter(s => likedItems[s.id]).map(fav => (
                  <div key={fav.id} className="fav-item-row" onClick={() => openDetails(fav, 'studio')}>
                    <img src={fav.image} className="fav-row-image" alt={fav.title} />
                    <div className="fav-row-info">
                      <span className="fav-row-title">{fav.title}</span>
                      <span className="fav-row-desc">Studio Lot • {fav.location} • ₹{fav.price}/hr</span>
                    </div>
                    <button 
                      className="card-like-btn liked" 
                      onClick={(e) => toggleLike(fav.id, e)}
                      style={{ position: 'relative', top: 0, right: 0, alignSelf: 'center' }}
                    >
                      <Heart size={14} fill="var(--primary)" />
                    </button>
                  </div>
                ))}

                {gear.filter(g => likedItems[g.id]).map(fav => (
                  <div key={fav.id} className="fav-item-row" onClick={() => openDetails(fav, 'gear')}>
                    <img src={fav.image} className="fav-row-image" alt={fav.title} />
                    <div className="fav-row-info">
                      <span className="fav-row-title">{fav.title}</span>
                      <span className="fav-row-desc">Camera Equipment • {fav.category} • ₹{fav.price}/day</span>
                    </div>
                    <button 
                      className="card-like-btn liked" 
                      onClick={(e) => toggleLike(fav.id, e)}
                      style={{ position: 'relative', top: 0, right: 0, alignSelf: 'center' }}
                    >
                      <Heart size={14} fill="var(--primary)" />
                    </button>
                  </div>
                ))}

                {services.filter(s => likedItems[s.id]).map(fav => (
                  <div key={fav.id} className="fav-item-row" onClick={() => openDetails(fav, 'service')}>
                    <img src={fav.image} className="fav-row-image" alt={fav.title} />
                    <div className="fav-row-info">
                      <span className="fav-row-title">{fav.title}</span>
                      <span className="fav-row-desc">Photoshoot Package • ₹{fav.price} Session</span>
                    </div>
                    <button 
                      className="card-like-btn liked" 
                      onClick={(e) => toggleLike(fav.id, e)}
                      style={{ position: 'relative', top: 0, right: 0, alignSelf: 'center' }}
                    >
                      <Heart size={14} fill="var(--primary)" />
                    </button>
                  </div>
                ))}

                {Object.values(likedItems).filter(Boolean).length === 0 && (
                  <span className="fav-empty-note">
                    No listings bookmarked yet. Browse the catalog to select spaces or rent equipment.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================
           TAB: SETTINGS
           =================================================== */}
        {activeTab === 'settings' && (
          <div className="tab-settings-grid">
            
            {/* Account preferences */}
            <div className="settings-section-card">
              <h3 className="section-title-pro">Workspace Configuration</h3>
              
              <div className="profile-settings-menu" style={{ border: 'none', padding: 0, boxShadow: 'none' }}>
                <div className="profile-menu-item" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
                  <div className="profile-menu-left">
                    {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    <span>Theme: {theme === 'light' ? 'CreatorVerse Dark' : 'PickMyShoot Light'}</span>
                  </div>
                  <label className="switch" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={theme === 'dark'} 
                      onChange={() => setTheme(t => t === 'light' ? 'dark' : 'light')} 
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="profile-menu-item" onClick={() => triggerToast("Payout channels synced.")}>
                  <div className="profile-menu-left">
                    <Sliders size={16} />
                    <span>Payout Channels &amp; Preferences</span>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>

                <div className="profile-menu-item" onClick={() => triggerToast("Support request queued.")}>
                  <div className="profile-menu-left">
                    <User size={16} />
                    <span>Contact Helpdesk 24/7</span>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              </div>
            </div>

            {/* Edit Profile Form */}
            <div className="settings-section-card">
              <h3 className="section-title-pro">Update Public Bio</h3>
              
              <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
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
                  <label className="form-label">Brief Studio Biography</label>
                  <textarea 
                    value={profileBio} 
                    onChange={(e) => setProfileBio(e.target.value)} 
                    className="form-textarea-pro"
                    style={{ minHeight: '80px' }}
                  ></textarea>
                </div>
                <button type="submit" className="pro-btn-primary" style={{ alignSelf: 'flex-start' }}>
                  Save Account Details
                </button>
              </form>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default ProfilePage;
