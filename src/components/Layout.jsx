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
  ChevronLeft,
  ChevronRight, 
  Check, 
  Camera,
  CheckCircle,
  Sun,
  Moon,
  Mail,
  Phone,
  ArrowLeft,
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
  Briefcase,
  Info,
  AlertCircle
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
  const [notificationDropdownOpen, setNotificationDropdownOpen] = React.useState(false);
  const [readNotificationIds, setReadNotificationIds] = React.useState(() => {
    try {
      const stored = localStorage.getItem('read_notification_ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [bookingStatus, setBookingStatus] = React.useState('idle'); // 'idle' | 'processing' | 'success'
  const [showFullDesc, setShowFullDesc] = React.useState(false);
  const scrollRef = React.useRef(null);

  const userMenuRef = React.useRef(null);
  const notificationMenuRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target)) {
        setNotificationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Payment UI States
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState('upi');
  const [upiId, setUpiId] = React.useState('');
  const [cardName, setCardName] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardExpiry, setCardExpiry] = React.useState('');
  const [cardCvv, setCardCvv] = React.useState('');

  const getPriceNumeric = (price) => {
    if (typeof price === 'number') return price;
    if (!price) return 0;
    const matched = price.toString().replace(/,/g, '').match(/\d+/);
    return matched ? parseInt(matched[0], 10) : 0;
  };

  const baseAmount = selectedItem ? getPriceNumeric(selectedItem.price) : 0;
  const platformFee = Math.round(baseAmount * 0.1);
  const gstAmount = Math.round((baseAmount + platformFee) * 0.18);
  const totalAmount = baseAmount + platformFee + gstAmount;

  // Generate the next 14 upcoming/coming dates starting from today dynamically
  const upcomingDatesList = React.useMemo(() => {
    const dates = [];
    const today = new Date();
    const weekdayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    for (let i = 0; i < 14; i++) {
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + i);
      
      dates.push({
        day: futureDate.getDate().toString(),
        name: weekdayNames[futureDate.getDay()],
        month: monthNamesShort[futureDate.getMonth()],
        year: futureDate.getFullYear().toString(),
        fullDateStr: `${futureDate.getDate()} ${monthNamesShort[futureDate.getMonth()]} ${futureDate.getFullYear()}`,
      });
    }
    return dates;
  }, []);

  // Redesigned premium time slots
  const timeSlots = [
    { time: '08:00 AM', status: 'Almost Full', category: 'Morning' },
    { time: '10:00 AM', status: 'Available', category: 'Morning' },
    { time: '11:30 AM', status: 'Booked', category: 'Morning' },
    { time: '01:00 PM', status: 'Available', category: 'Afternoon' },
    { time: '02:30 PM', status: 'Available', category: 'Afternoon' },
    { time: '04:00 PM', status: 'Almost Full', category: 'Afternoon' },
    { time: '05:30 PM', status: 'Available', category: 'Evening' },
    { time: '07:00 PM', status: 'Available', category: 'Evening' }
  ];

  // Derive notifications from bookings based on active workspace role
  const activeNotifications = React.useMemo(() => {
    if (!currentUser) return [];
    
    const list = [];
    
    if (currentRole === 'photographer') {
      bookings.forEach(b => {
        if (b.ownerId === activeProfileId || b.creatorId === activeProfileId) {
          if (b.status === 'pending') {
            list.push({
              id: `photographer-pending-${b.id}`,
              type: 'pending',
              title: 'New Booking Request',
              message: `"${b.title}" requested by ${b.clientName || 'Client'}.`,
              timestamp: b.date || 'Upcoming',
              link: '/dashboard/photographer',
              bookingId: b.id
            });
          } else if (b.status === 'approved') {
            list.push({
              id: `photographer-approved-${b.id}`,
              type: 'success',
              title: 'Booking Approved',
              message: `You approved "${b.title}" for ${b.clientName || 'Client'}.`,
              timestamp: b.date || 'Upcoming',
              link: '/dashboard/photographer',
              bookingId: b.id
            });
          } else if (b.status === 'rejected' || b.status === 'declined') {
            list.push({
              id: `photographer-rejected-${b.id}`,
              type: 'danger',
              title: 'Booking Declined',
              message: `You declined "${b.title}" request.`,
              timestamp: b.date || 'Upcoming',
              link: '/dashboard/photographer',
              bookingId: b.id
            });
          }
        }
      });
    } else if (currentRole === 'admin') {
      bookings.forEach(b => {
        if (b.status === 'pending') {
          list.push({
            id: `admin-pending-${b.id}`,
            type: 'pending',
            title: 'Pending Booking Request',
            message: `"${b.title}" requires admin review.`,
            timestamp: b.date || 'Upcoming',
            link: '/dashboard/admin',
            bookingId: b.id
          });
        }
      });
    } else if (currentRole === 'client') {
      bookings.forEach(b => {
        if (b.clientId === activeProfileId || (currentUser && (
          b.clientId === currentUser.id || 
          b.clientId === currentUser._id ||
          (b.clientEmail && currentUser.email && b.clientEmail.toLowerCase() === currentUser.email.toLowerCase())
        ))) {
          if (b.status === 'pending') {
            list.push({
              id: `client-pending-${b.id}`,
              type: 'info',
              title: 'Booking Request Sent',
              message: `Booking for "${b.title}" is pending approval.`,
              timestamp: b.date || 'Upcoming',
              link: '/dashboard/client',
              bookingId: b.id
            });
          } else if (b.status === 'approved') {
            list.push({
              id: `client-approved-${b.id}`,
              type: 'success',
              title: 'Booking Confirmed 🎉',
              message: `"${b.title}" has been approved!`,
              timestamp: b.date || 'Upcoming',
              link: '/dashboard/client',
              bookingId: b.id
            });
          } else if (b.status === 'rejected' || b.status === 'declined') {
            list.push({
              id: `client-rejected-${b.id}`,
              type: 'danger',
              title: 'Booking Declined',
              message: `"${b.title}" was declined by host.`,
              timestamp: b.date || 'Upcoming',
              link: '/dashboard/client',
              bookingId: b.id
            });
          }
        }
      });
    }
    
    return list;
  }, [bookings, currentRole, currentUser, activeProfileId]);

  const unreadNotifications = activeNotifications.filter(n => !readNotificationIds.includes(n.id));
  const unreadCount = unreadNotifications.length;

  const markAllAsRead = () => {
    const allIds = activeNotifications.map(n => n.id);
    setReadNotificationIds(allIds);
    try {
      localStorage.setItem('read_notification_ids', JSON.stringify(allIds));
    } catch (e) {
      console.error(e);
    }
  };

  const markAsRead = (id) => {
    if (!readNotificationIds.includes(id)) {
      const updated = [...readNotificationIds, id];
      setReadNotificationIds(updated);
      try {
        localStorage.setItem('read_notification_ids', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
  };

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
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      // Auto-switch to the most relevant category tab based on keywords
      if (q.includes('gear') || q.includes('camera') || q.includes('lens') || q.includes('drone') || q.includes('light') || q.includes('gimbal') || q.includes('rental')) {
        setExploreTab('rentals');
      } else if (q.includes('studio') || q.includes('location') || q.includes('cyclorama') || q.includes('daylight') || q.includes('outdoor space')) {
        setExploreTab('studios');
      } else if (q.includes('model') || q.includes('talent') || q.includes('actor') || q.includes('fashion model')) {
        setExploreTab('models');
      } else if (q.includes('workshop') || q.includes('course') || q.includes('masterclass') || q.includes('bootcamp') || q.includes('training')) {
        setExploreTab('workshops');
      } else if (q.includes('job') || q.includes('gig') || q.includes('hiring') || q.includes('freelance') || q.includes('vacancy')) {
        setExploreTab('jobs');
      }
      // else: stay on current tab (photography services or whatever is active)
    }
    navigate('/explore');
  };

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      triggerToast("Please log in to complete your booking.");
      setSelectedItem(null);
      navigate('/login');
      return;
    }
    // If it is free (job/institute), bypass payment!
    if (selectedItemType === 'job' || selectedItemType === 'institute') {
      if (bookingStatus !== 'idle') return;
      setBookingStatus('processing');
      setTimeout(() => {
        handleBookingSubmit(false);
        setBookingStatus('success');
        setTimeout(() => {
          setSelectedItem(null);
          navigate('/bookings');
        }, 1800);
      }, 1500);
    } else {
      // Transition to payment step!
      setBookingStatus('payment');
    }
  };

  const handlePaymentSubmit = () => {
    if (bookingStatus !== 'payment') return;
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
      {location.pathname !== '/login' && (
        <header className="app-header">
        <div className="max-width-wrapper">
          <div className="header-row">
            
            {/* Logo */}
            <div className="logo-container" onClick={() => { navigate('/'); setSelectedItem(null); }} style={{ cursor: 'pointer' }}>
              <img src="/logo.png" className="header-brand-logo" alt="PickMyShoot" />
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
              {isAuthenticated && currentUser?.role === 'admin' && (
                <NavLink 
                  to="/dashboard/admin" 
                  className={({ isActive }) => `header-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => { setSelectedItem(null); changeUserRole('admin'); }}
                >
                  Admin Dashboard
                </NavLink>
              )}
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

              <div 
                ref={notificationMenuRef}
                className="notification-dropdown-container"
              >
                <button 
                  className={`icon-btn-wrap ${notificationDropdownOpen ? 'active' : ''}`}
                  onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                  title="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
                </button>
                
                {notificationDropdownOpen && (
                  <div className="header-notification-dropdown-card">
                    <div className="notification-dropdown-header">
                      <span className="notification-title">Notifications</span>
                      {unreadCount > 0 && (
                        <button className="mark-all-read-btn" onClick={markAllAsRead}>
                          Mark all read
                        </button>
                      )}
                    </div>
                    
                    <div className="notification-dropdown-body">
                      {activeNotifications.length === 0 ? (
                        <div className="notification-empty-state">
                          <Bell size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                          <p className="empty-title">All caught up!</p>
                          <p className="empty-subtitle">No notifications for your current workspace role.</p>
                        </div>
                      ) : (
                        activeNotifications.map(n => {
                          const isUnread = !readNotificationIds.includes(n.id);
                          return (
                            <div 
                              key={n.id} 
                              className={`notification-item ${n.type} ${isUnread ? 'unread' : ''}`}
                              onClick={() => {
                                markAsRead(n.id);
                                setNotificationDropdownOpen(false);
                                navigate(n.link);
                              }}
                            >
                              <div className="notification-item-icon">
                                {n.type === 'success' && <CheckCircle size={14} />}
                                {n.type === 'pending' && <Bell size={14} />}
                                {n.type === 'danger' && <X size={14} />}
                                {n.type === 'info' && <Info size={14} />}
                              </div>
                              <div className="notification-item-text">
                                <div className="notification-item-title-row">
                                  <span className="notification-item-title">{n.title}</span>
                                  {isUnread && <span className="unread-dot"></span>}
                                </div>
                                <p className="notification-item-msg">{n.message}</p>
                                <span className="notification-item-time">{n.timestamp}</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    
                    <div className="notification-dropdown-footer">
                      <button 
                        className="view-dashboard-link-btn"
                        onClick={() => {
                          setNotificationDropdownOpen(false);
                          if (currentRole === 'photographer') navigate('/dashboard/photographer');
                          else if (currentRole === 'admin') navigate('/dashboard/admin');
                          else if (currentRole === 'client') navigate('/dashboard/client');
                        }}
                      >
                        Go to Workspace Dashboard
                      </button>
                    </div>
                  </div>
                )}
              </div>

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
                  ref={userMenuRef}
                  className="user-profile-menu-container"
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
                      <div 
                        className="dropdown-user-info" 
                        onClick={() => { navigate('/profile'); setUserDropdownOpen(false); }}
                        style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer', transition: 'background-color 0.2s', padding: '6px' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--background-alt, #f8f9fb)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        title="Click to view profile page"
                      >
                        <img 
                          src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=40&q=80'} 
                          alt="Dropdown User Avatar"
                          style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div className="user-name-role">
                          <span className="dropdown-user-name">{currentUser?.name}</span>
                          <span className="dropdown-user-role" style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--primary, #C8102E)' }}>{currentUser?.role}</span>
                        </div>
                      </div>
                      <div className="dropdown-menu-list">
                        <button className="dropdown-menu-item-btn" onClick={() => { navigate('/profile'); setUserDropdownOpen(false); }}>
                          👤 My Profile
                        </button>
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
                            <button className="dropdown-menu-item-btn" onClick={() => { changeUserRole('admin'); navigate('/dashboard/admin'); setUserDropdownOpen(false); }}>
                              🛡️ Admin Dashboard
                            </button>
                            <button className="dropdown-menu-item-btn" onClick={() => { changeUserRole('client'); navigate('/dashboard/client'); setUserDropdownOpen(false); }}>
                              💼 Client View
                            </button>
                            <button className="dropdown-menu-item-btn" onClick={() => { changeUserRole('photographer'); navigate('/dashboard/photographer'); setUserDropdownOpen(false); }}>
                              📸 Photographer View
                            </button>
                          </>
                        )}
                        <div style={{ borderTop: '1px dashed var(--border)', margin: '6px 0' }} />
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
      )}

      {/* MAIN CONTENT BODY */}
      <main className="page-content-body">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            {location.pathname === '/' || location.pathname === '/login' || location.pathname.startsWith('/dashboard') ? (
              <Outlet />
            ) : (
              <div className="max-width-wrapper">
                <Outlet />
              </div>
            )}
          </PageTransition>
        </AnimatePresence>
      </main>

      {/* DYNAMIC DESKTOP SPLIT VIEW MODAL DIALOG */}
      {selectedItem && (
        <div className="detail-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="detail-modal-body" onClick={(e) => e.stopPropagation()}>
            
            {/* Left Column: Image gallery */}
            <div className="detail-header-image-box">
              <img src={selectedItem.image || selectedItem.coverImage} className="card-image" alt={selectedItem.title} />
              
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
                              <span className="metric-value">{selectedItem.jobType || selectedItem.type}</span>
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
                        {selectedItemType === 'photographer' && (
                          <>
                            <div className="metric-pill">
                              <span className="metric-label">Shoots</span>
                              <span className="metric-value">{selectedItem.shoots || '0'}+</span>
                            </div>
                            <div className="metric-pill">
                              <span className="metric-label">Followers</span>
                              <span className="metric-value">{selectedItem.followers || '0'}</span>
                            </div>
                            <div className="metric-pill">
                              <span className="metric-label">Rating</span>
                              <span className="metric-value">{selectedItem.rating || '5.0'} ★</span>
                            </div>
                            <div className="metric-pill">
                              <span className="metric-label">Location</span>
                              <span className="metric-value">{selectedItem.location || 'Hyderabad'}</span>
                            </div>
                          </>
                        )}
                        {selectedItemType === 'institute' && (
                          <>
                            <div className="metric-pill">
                              <span className="metric-label">Offered Course</span>
                              <span className="metric-value">{selectedItem.course}</span>
                            </div>
                            <div className="metric-pill">
                              <span className="metric-label">Admissions</span>
                              <span className="metric-value">{selectedItem.status || 'Open'}</span>
                            </div>
                            <div className="metric-pill">
                              <span className="metric-label">Rating</span>
                              <span className="metric-value">{selectedItem.rating} ★</span>
                            </div>
                            <div className="metric-pill">
                              <span className="metric-label">Campus Location</span>
                              <span className="metric-value">{selectedItem.location}</span>
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
                         selectedItemType === 'service' ? 'About Shoot Package' :
                         selectedItemType === 'institute' ? 'About Institute' :
                         selectedItemType === 'photographer' ? 'About Photographer' : 'About Listing'}
                      </span>
                      <p className="detail-desc-text">
                        {showFullDesc || !selectedItem.description || selectedItem.description.length <= 110 
                          ? (selectedItem.description || "No description available.") 
                          : `${selectedItem.description.slice(0, 110)}...`}
                      </p>
                      {selectedItem.description && selectedItem.description.length > 110 && (
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
                    {selectedItemType !== 'job' && selectedItemType !== 'workshop' && selectedItemType !== 'photographer' && (
                      <div className="scheduler-box">
                        <span className="scheduler-title">Select Date & Time</span>
                        
                        {/* Interactive Horizontal Coming Dates Carousel */}
                        <div className="upcoming-dates-scroll">
                          {upcomingDatesList.map((item, idx) => {
                            const isSelected = selectedDate === item.fullDateStr;
                            return (
                              <button 
                                key={idx} 
                                type="button"
                                className={`upcoming-date-pill ${isSelected ? 'active' : ''}`}
                                onClick={() => setSelectedDate(item.fullDateStr)}
                              >
                                <span className="date-pill-month">{item.month}</span>
                                <span className="date-pill-day">{item.day}</span>
                                <span className="date-pill-name">{item.name}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Selected Date Indicator */}
                        <div className="selected-date-indicator">
                          <span>📅 Selected Date: <strong>{selectedDate}</strong></span>
                        </div>

                        {/* Redesigned Premium Categorized Time Slots */}
                        <div className="time-slots-container">
                          <span className="scheduler-subtitle">Select Time Slot</span>
                          
                          {/* Group by category */}
                          {['Morning', 'Afternoon', 'Evening'].map((category) => {
                            const categorySlots = timeSlots.filter(s => s.category === category);
                            return (
                              <div key={category} className="time-category-group">
                                <span className="time-category-title">{category}</span>
                                <div className="time-slot-subgrid">
                                  {categorySlots.map((slot, idx) => {
                                    const isSelected = selectedTime === slot.time;
                                    const isBooked = slot.status === 'Booked';
                                    
                                    return (
                                      <button
                                        key={idx}
                                        type="button"
                                        className={`premium-time-slot ${isSelected ? 'active' : ''} ${isBooked ? 'booked' : ''}`}
                                        disabled={isBooked}
                                        onClick={() => setSelectedTime(slot.time)}
                                      >
                                        <span className="slot-time">{slot.time}</span>
                                        <span className={`slot-status-lbl status-${slot.status.toLowerCase().replace(' ', '-')}`}>
                                          {slot.status}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fixed bottom action panel */}
                  <div className="detail-fixed-checkout-bar">
                    <div className="checkout-price-col">
                      <span className="checkout-price-val">
                        {selectedItemType === 'institute' 
                          ? 'Free to Apply' 
                          : selectedItemType === 'photographer'
                            ? `₹${(selectedItem.startingPrice || 1800).toLocaleString('en-IN')}/hr`
                            : (typeof selectedItem.price === 'number' 
                                ? `₹${selectedItem.price.toLocaleString('en-IN')}${selectedItem.priceUnit ? ` /${selectedItem.priceUnit}` : ''}` 
                                : selectedItem.price || 'Free')}
                      </span>
                      <span className="checkout-price-unit">
                        {selectedItemType === 'institute' 
                          ? 'No application fee' 
                          : selectedItemType === 'photographer'
                            ? 'Starting Price'
                            : 'Total (incl. taxes)'}
                      </span>
                    </div>

                    {selectedItemType === 'photographer' ? (
                      <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                        <a 
                          href={selectedItem.instaUrl || "https://instagram.com/pickmyshoot"} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="checkout-submit-btn"
                          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', color: '#374151' }}
                        >
                          Instagram
                        </a>
                        <button 
                          className="checkout-submit-btn" 
                          onClick={() => {
                            setSelectedItem(null);
                            navigate(`/photographer/${selectedItem.id || selectedItem._id}`);
                          }}
                        >
                          View Full Profile
                        </button>
                      </div>
                    ) : (
                      <button className="checkout-submit-btn" onClick={handleBookingClick}>
                        {selectedItemType === 'job' || selectedItemType === 'institute' ? 'Apply Now' : 
                         selectedItemType === 'workshop' ? 'Register Now' : 'Book Now'}
                      </button>
                    )}
                  </div>
                </>
              )}

              {bookingStatus === 'payment' && (
                <div className="payment-checkout-view">
                  <div className="payment-header-row">
                    <button type="button" className="payment-back-btn" onClick={() => setBookingStatus('idle')}>
                      <ArrowLeft size={16} /> Back
                    </button>
                    <h4>Secure Checkout</h4>
                  </div>

                  <div className="payment-scroll-content">
                    {/* Order summary card */}
                    <div className="payment-summary-card">
                      <span className="summary-section-title">Order Summary</span>
                      <div className="summary-item-title-row">
                        <span className="summary-item-name">{selectedItem.title}</span>
                        <span className="summary-item-tag">{selectedItemType.toUpperCase()}</span>
                      </div>
                      
                      <div className="summary-details-grid">
                        <div>📅 Date: <strong>{selectedDate}</strong></div>
                        <div>⏰ Time: <strong>{selectedTime}</strong></div>
                      </div>

                      <div className="price-breakdown-box">
                        <div className="breakdown-row">
                          <span>Base Amount</span>
                          <span>₹{baseAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="breakdown-row">
                          <span>Platform Fee (10%)</span>
                          <span>₹{platformFee.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="breakdown-row">
                          <span>GST (18%)</span>
                          <span>₹{gstAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="breakdown-row total-row">
                          <span>Total to Pay</span>
                          <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment methods selector */}
                    <div className="payment-method-section">
                      <span className="payment-section-title">Select Payment Method</span>
                      <div className="payment-methods-grid">
                        {[
                          { id: 'upi', label: 'UPI / GPay', desc: 'Scan QR or enter UPI ID' },
                          { id: 'card', label: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay' },
                          { id: 'netbanking', label: 'Net Banking', desc: 'All Indian Banks' }
                        ].map(method => (
                          <div 
                            key={method.id} 
                            className={`payment-method-card ${selectedPaymentMethod === method.id ? 'active' : ''}`}
                            onClick={() => setSelectedPaymentMethod(method.id)}
                          >
                            <span className="method-label">{method.label}</span>
                            <span className="method-desc">{method.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Conditional input fields based on payment method */}
                    {selectedPaymentMethod === 'upi' && (
                      <div className="upi-input-container">
                        <div className="upi-qr-mock">
                          <div className="mock-qr-code-box">
                            <div className="qr-corner top-left"></div>
                            <div className="qr-corner top-right"></div>
                            <div className="qr-corner bottom-left"></div>
                            <div className="qr-content-sim">QR Code Scan & Pay</div>
                          </div>
                          <span className="qr-sub-text">Scan with Google Pay, PhonePe or Paytm</span>
                        </div>

                        <div className="form-field-wrap">
                          <label className="form-label">Or Enter UPI ID</label>
                          <input 
                            type="text" 
                            className="form-input-pro" 
                            placeholder="username@okaxis" 
                            value={upiId} 
                            onChange={(e) => setUpiId(e.target.value)} 
                          />
                        </div>
                      </div>
                    )}

                    {selectedPaymentMethod === 'card' && (
                      <div className="card-input-container">
                        <div className="form-field-wrap">
                          <label className="form-label">Cardholder Name</label>
                          <input 
                            type="text" 
                            className="form-input-pro" 
                            placeholder="Full Name" 
                            value={cardName} 
                            onChange={(e) => setCardName(e.target.value)} 
                          />
                        </div>
                        <div className="form-field-wrap">
                          <label className="form-label">Card Number</label>
                          <input 
                            type="text" 
                            className="form-input-pro" 
                            placeholder="4111 2222 3333 4444" 
                            value={cardNumber} 
                            onChange={(e) => setCardNumber(e.target.value)} 
                          />
                        </div>
                        <div className="form-row-two-col">
                          <div className="form-field-wrap">
                            <label className="form-label">Expiry Date</label>
                            <input 
                              type="text" 
                              className="form-input-pro" 
                              placeholder="MM/YY" 
                              value={cardExpiry} 
                              onChange={(e) => setCardExpiry(e.target.value)} 
                            />
                          </div>
                          <div className="form-field-wrap">
                            <label className="form-label">CVV</label>
                            <input 
                              type="password" 
                              maxLength="3"
                              className="form-input-pro" 
                              placeholder="***" 
                              value={cardCvv} 
                              onChange={(e) => setCardCvv(e.target.value)} 
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedPaymentMethod === 'netbanking' && (
                      <div className="netbanking-input-container">
                        <label className="form-label">Choose Bank</label>
                        <select className="form-input-pro">
                          <option>SBI - State Bank of India</option>
                          <option>HDFC Bank</option>
                          <option>ICICI Bank</option>
                          <option>Axis Bank</option>
                          <option>Kotak Mahindra Bank</option>
                        </select>
                      </div>
                    )}

                  </div>

                  <div className="payment-fixed-action-bar">
                    <div className="pay-amount-col">
                      <span className="pay-amount-val">₹{totalAmount.toLocaleString('en-IN')}</span>
                      <span className="pay-amount-lbl">Amount Payable</span>
                    </div>
                    <button 
                      type="button" 
                      className="pay-submit-btn" 
                      onClick={handlePaymentSubmit}
                      disabled={selectedPaymentMethod === 'card' && (!cardName || !cardNumber || !cardExpiry || !cardCvv)}
                    >
                      Pay & Confirm Booking
                    </button>
                  </div>
                </div>
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
                  <h4>
                    {selectedItemType === 'job' || selectedItemType === 'institute' 
                      ? 'Application Submitted!' 
                      : 'Booking Confirmed!'}
                  </h4>
                  <p className="success-tagline">
                    {selectedItemType === 'job' 
                      ? `Your application for ${selectedItem.title} has been sent successfully.` 
                      : (selectedItemType === 'institute' 
                          ? `Your query has been sent to ${selectedItem.title}.` 
                          : 'Your reservation is secured successfully.')}
                  </p>
                  
                  <div className="success-summary-card">
                    <div className="summary-row">
                      <span className="summary-label">
                        {selectedItemType === 'job' ? 'Position' : (selectedItemType === 'institute' ? 'Institute' : 'Listing')}
                      </span>
                      <span className="summary-value">{selectedItem.title}</span>
                    </div>
                    {selectedItemType !== 'job' && selectedItemType !== 'workshop' && selectedItemType !== 'institute' && (
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
                      <span className="summary-label">
                        {selectedItemType === 'job' 
                          ? 'Salary Range' 
                          : (selectedItemType === 'institute' ? 'Application Status' : 'Total Invoiced')}
                      </span>
                      <span className="summary-value">
                        {selectedItemType === 'institute' 
                          ? 'Submitted' 
                          : (typeof selectedItem.price === 'number' ? `₹${selectedItem.price.toLocaleString('en-IN')}` : selectedItem.price || 'Free')}
                      </span>
                    </div>
                  </div>
                  <p className="redirect-note">
                    {selectedItemType === 'job' 
                      ? 'Redirecting to your applications dashboard...' 
                      : 'Redirecting to your bookings dashboard...'}
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ===== FOOTER ===== */}
      {location.pathname !== '/login' && (
        <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-inner">
            <div className="footer-brand-col">
              <div className="footer-logo" onClick={() => { navigate('/'); setSelectedItem(null); }} style={{ cursor: 'pointer' }}>
                <svg viewBox="0 0 170 100" style={{ height: '42px', width: 'auto' }}>
                  <path d="M 25,38 C 25,33 29,33 32,33 L 58,33 C 63,33 65,30 68,25 L 73,17 C 75,14 79,14 83,14 L 87,14 C 91,14 95,14 97,17 L 102,25 C 105,30 107,33 112,33 L 138,33 C 141,33 145,33 145,38 L 145,73 C 145,78 141,78 138,78 L 32,78 C 29,78 25,78 25,73 Z" stroke="#c7100d" strokeWidth="2.5" fill="none" />
                  <text x="85" y="47" textAnchor="middle" fill="#c7100d" style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive", fontSize: '23px', fontWeight: 'bold' }}>pick my</text>
                  <text x="85" y="71" textAnchor="middle" fill="#c7100d" style={{ fontFamily: "'Montserrat', 'Arial Black', sans-serif", fontSize: '26px', fontWeight: '900', letterSpacing: '1px' }}>SHOOT</text>
                  <line x1="15" y1="84" x2="155" y2="84" stroke="#c7100d" strokeWidth="1.5" />
                  <text x="85" y="93" textAnchor="middle" fill="#c7100d" style={{ fontFamily: "var(--font-body)", fontSize: '7.5px', fontWeight: '700', letterSpacing: '0.5px' }}>Every Story Builds a Brand.</text>
                </svg>
              </div>
              <p className="footer-tagline">
                India's leading marketplace for photographers, studio spaces, models, gear rentals &amp; creative professionals.
              </p>
            </div>

            <div className="footer-links-col">
              <h4 className="footer-col-title"><span className="footer-col-title-dot" />Explore</h4>
              <ul className="footer-links-list">
                <li><NavLink to="/explore" onClick={() => setSelectedItem(null)}>Book a Shoot</NavLink></li>
                <li><NavLink to="/explore" onClick={() => setSelectedItem(null)}>Rent a Studio</NavLink></li>
                <li><NavLink to="/explore" onClick={() => setSelectedItem(null)}>Hire a Model</NavLink></li>
                <li><NavLink to="/explore" onClick={() => setSelectedItem(null)}>Gear Rentals</NavLink></li>
              </ul>
              
            </div>
            
            <div className="footer-links-col">
              <h4 className="footer-col-title"><span className="footer-col-title-dot" />Company</h4>
              <ul className="footer-links-list">
                <li><NavLink to="/about" onClick={() => setSelectedItem(null)}>About Us</NavLink></li>
                <li><a href="#">Careers <span className="footer-link-tag">We're Hiring!</span></a></li>
                <li><NavLink to="/blog" onClick={() => setSelectedItem(null)}>Blog</NavLink></li>
                <li><NavLink to="/contact" onClick={() => setSelectedItem(null)}>Partner with Us</NavLink></li>
              </ul>
              
            </div>

            <div className="footer-links-col">
              <h4 className="footer-col-title"><span className="footer-col-title-dot" />Support</h4>
              <ul className="footer-links-list">
                <li><NavLink to="/faq" onClick={() => setSelectedItem(null)}>Help Center &amp; FAQ</NavLink></li>
                <li><a href="#">Refund Policy</a></li>
              </ul>
              {/* ── Social icons ── */}
              <div className="footer-social-badges-row" style={{ marginTop: '16px' }}>
                <div className="footer-socials">
                  <a href="#" className="footer-social-btn footer-social-instagram" aria-label="Instagram">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  <a href="#" className="footer-social-btn footer-social-youtube" aria-label="YouTube">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                  <a href="#" className="footer-social-btn footer-social-twitter" aria-label="Twitter / X">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="#" className="footer-social-btn footer-social-facebook" aria-label="Facebook">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="#" className="footer-social-btn footer-social-linkedin" aria-label="LinkedIn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="footer-links-col">
              <h4 className="footer-col-title"><span className="footer-col-title-dot" />Contact Us</h4>
              <ul className="footer-links-list">
                <li><NavLink to="/contact" onClick={() => setSelectedItem(null)}>Get in Touch</NavLink></li>
                <li><NavLink to="/contact" onClick={() => setSelectedItem(null)}>Partner with Us</NavLink></li>
                <li><NavLink to="/faq" onClick={() => setSelectedItem(null)}>Support Center</NavLink></li>
              </ul>
              
              <div className="footer-contact" style={{ marginTop: 'auto', borderTop: '1px solid var(--footer-border)', paddingTop: '8px' }}>
                <a href="mailto:hello@pickmyshoot.in" className="footer-contact-item">
                  <Mail size={13} />
                  <span>hello@pickmyshoot.in</span>
                </a>
                <a href="tel:+919876543210" className="footer-contact-item">
                  <Phone size={13} />
                  <span>+91 98765 43210</span>
                </a>
              </div>
            </div>
          </div>
          <div className="footer-mid-strip">
            <div className="footer-mid-strip-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
              <div className="footer-mid-newsletter">
                <div className="footer-newsletter-text-group">
                  <span className="footer-newsletter-label">Stay in the Loop</span>
                  <p className="footer-newsletter-desc-short">Get exclusive shoots, workshops &amp; deals.</p>
                </div>
                <div className="footer-newsletter-form-row">
                  <input type="email" placeholder="Your email address" className="footer-email-input" />
                  <button className="footer-subscribe-btn">Subscribe</button>
                </div>
              </div>
              {/* ── Stats center ── */}
              <div className="footer-stats-row" style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0, width: 'auto', background: 'var(--footer-social-bg)', border: '1px solid var(--footer-social-border)', borderRadius: '10px', padding: '8px 16px', fontFamily: 'var(--font-body)' }}>
                <div className="footer-stat-item" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                  <span className="footer-stat-num" style={{ fontSize: '14px', fontWeight: '700' }}>15K+</span>
                  <span className="footer-stat-lbl" style={{ fontSize: '9px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '1px' }}>Creators</span>
                </div>
                <div className="footer-stat-sep" style={{ width: '1.5px', height: '14px', background: 'rgba(98, 106, 128, 0.25)' }} />
                <div className="footer-stat-item" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                  <span className="footer-stat-num" style={{ fontSize: '14px', fontWeight: '700' }}>2.8K+</span>
                  <span className="footer-stat-lbl" style={{ fontSize: '9px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '1px' }}>Studios</span>
                </div>
                <div className="footer-stat-sep" style={{ width: '1.5px', height: '14px', background: 'rgba(98, 106, 128, 0.25)' }} />
                <div className="footer-stat-item" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                  <span className="footer-stat-num" style={{ fontSize: '14px', fontWeight: '700' }}>50K+</span>
                  <span className="footer-stat-lbl" style={{ fontSize: '9px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '1px' }}>Bookings</span>
                </div>
              </div>
              {/* ── App badges on right ── */}
              <div className="footer-app-badges" style={{ flexShrink: 0 }}>
                <a href="#" className="footer-app-badge" aria-label="Download on the App Store">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  <div>
                    <span className="app-badge-small">Download on the</span>
                    <span className="app-badge-large">App Store</span>
                  </div>
                </a>
                <a href="#" className="footer-app-badge" aria-label="Get it on Google Play">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3.18 23.76c.3.17.64.24.99.2l12.6-12.6-3.18-3.18L3.18 23.76zm17.6-12.57c.38-.2.62-.58.62-1-.01-.42-.25-.8-.63-1L17.88 7.8 14.4 11.28l3.48 3.48 2.9-1.57zM.98.83a1.04 1.04 0 0 0-.98 1.1v20.08c0 .44.2.81.52 1.03L13.36 11.2.98.83zm12.77 9.67L2.09.5c-.1-.07-.2-.1-.32-.12L13.75 11.5l-.01-.01-.99-.99z"/></svg>
                  <div>
                    <span className="app-badge-small">GET IT ON</span>
                    <span className="app-badge-large">Google Play</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <div className="footer-bottom-left">
              <span className="footer-copy">@2026 pickmyshoot. all rights reserved. Powered by <a href="https://thepatternscompany.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Patterns Infotech Private Limited</a>.</span>
            </div>
            <div className="footer-bottom-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
              <a href="#">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
      )}


      {/* MOBILE BOTTOM NAVIGATION BAR */}
      {location.pathname !== '/login' && (
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
      )}

    </div>
  );
};

export default Layout;
