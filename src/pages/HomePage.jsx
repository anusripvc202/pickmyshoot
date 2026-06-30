import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Building2, 
  User, 
  ShoppingCart, 
  MapPin, 
  Video, 
  Scissors, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  LayoutGrid, 
  ChevronLeft,
  ChevronRight, 
  Heart, 
  Star,
  Film,
  Clapperboard,
  Palette
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { institutes } from '../data/mockData';

const HomePage = () => {
  const {
    services,
    studios,
    workshops,
    likedItems,
    toggleLike,
    openDetails,
    setExploreTab
  } = useAppContext();

  const navigate = useNavigate();

  // Ensure a baby photoshoot is included in the homepage list of services
  const displayedServices = React.useMemo(() => {
    const babyShoot = services.find(s => s.serviceType === 'Baby Photoshoot' || s.title.toLowerCase().includes('baby'));
    const otherShoots = services.filter(s => s.id !== (babyShoot?.id || ''));
    // Place the baby photoshoot as the second item so it is immediately visible on the home page without scrolling
    return babyShoot ? [otherShoots[0], babyShoot, ...otherShoots.slice(1, 6)] : services.slice(0, 7);
  }, [services]);

  const heroData = {
    tag: "BIGGEST CREATOR FEST",
    title: "CREATOR FEST 2024",
    subtitle: "Workshops | Gear Deals | Meetups\nNetworking | Awards",
    description: "Join India's largest gathering of photographers, filmmakers, and digital creators. Level up your craft with hands-on masterclasses, exclusive gear deals, and premium networking.",
    image: "banner_photographer.png",
    rightOffer: "Early Bird Offer",
    rightDiscount: "Upto 30% OFF",
    rightCta: "Book Now",
    rightDate: "20-22 JULY",
    rightVenue: "HICC, HYDERABAD",
    urgencyText: "⚡ Only 45 Passes Left!",
    background: "radial-gradient(circle at 60% 40%, rgba(250, 20, 77, 0.25) 0%, transparent 60%), linear-gradient(135deg, #f0144d 0%, #9c0022 100%)"
  };

  const handleCategoryClick = (tabName) => {
    setExploreTab(tabName);
    navigate('/explore');
  };

  return (
    <>
      {/* ======= STATIC HERO BANNER SECTION ======= */}
      <div className="hero-carousel-container">

        {/* Slide Background (colored gradient) */}
        <div
          className="hero-bg-image active-slide"
          style={{ 
            background: heroData.background, 
            backgroundSize: 'cover',
            backgroundPosition: 'center center'
          }}
        />

        {/* Dynamic Abstract background curves for Creator Fest */}
        <div className="fest-bg-pattern-overlay">
          <svg viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <path opacity="0.06" d="M-100 350C120 220 380 580 600 350C820 120 1080 470 1340 350" stroke="white" strokeWidth="50" strokeLinecap="round" />
            <path opacity="0.04" d="M-50 450C190 320 450 680 670 450C890 220 1150 570 1370 450" stroke="white" strokeWidth="30" strokeLinecap="round" />
            <path opacity="0.05" d="M80 180C300 400 560 50 780 270C1000 490 1260 140 1510 270" stroke="white" strokeWidth="70" strokeLinecap="round" />
          </svg>
        </div>

        {/* ===== SPLIT LAYOUT: Left text | Center Image | Right widget ===== */}
        <div className="hero-fest-layout active-slide">
          
          {/* ---- LEFT: Creator Fest Details ---- */}
          <div className="fest-left-col">
            <div className="fest-tag-badge">
              {heroData.tag}
            </div>
            <h1 className="fest-title">{heroData.title}</h1>
            <p className="fest-description">
              {heroData.description}
            </p>
            <div className="fest-subtags">
              <span className="fest-subtag-line">Workshops | Gear Deals | Meetups</span>
              <span className="fest-subtag-line">Networking | Awards</span>
            </div>
            <button className="fest-explore-btn" onClick={() => { setExploreTab('workshops'); navigate('/explore'); }}>
              Explore Now
            </button>
          </div>

          {/* ---- CENTER: Photographer Image ---- */}
          <div className="fest-center-col">
            <img 
              src={`${import.meta.env.BASE_URL}${heroData.image}`} 
              className="fest-photographer-img" 
              alt="Creator Fest Photographer" 
            />
          </div>

          {/* ---- RIGHT: Ticket/Discount Details ---- */}
          <div className="fest-right-col">
            <div className="fest-offer-info">
              <span className="fest-offer-label">{heroData.rightOffer}</span>
              <span className="fest-offer-discount">{heroData.rightDiscount}</span>
              {heroData.urgencyText && (
                <span className="fest-urgency-badge">
                  {heroData.urgencyText}
                </span>
              )}
              <button className="fest-book-btn" onClick={() => { setExploreTab('workshops'); navigate('/explore'); }}>
                {heroData.rightCta}
              </button>
            </div>
            
            <div className="fest-divider-line" />
            
            <div className="fest-event-details">
              <Calendar size={20} className="fest-calendar-icon" />
              <div className="fest-event-text">
                <div className="fest-date">{heroData.rightDate}</div>
                <div className="fest-venue">{heroData.rightVenue}</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="max-width-wrapper">

      {/* Category Grid Row */}
      <section style={{ marginTop: '48px', marginBottom: '24px' }}>
        <div className="section-header" style={{ marginBottom: '20px' }}>
          <h2 className="section-title">Explore Categories</h2>
        </div>
        <div className="categories-container" style={{ marginBottom: 0 }}>
          <div className="categories-grid">
          
          <div className="category-card" onClick={() => handleCategoryClick('services')}>
            <div className="category-icon-wrap">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M4 5h3l1.8-2.4C9.2 2.2 9.6 2 10 2h4c.4 0 .8.2 1.2.6L17 5h3a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3zm8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
              </svg>
            </div>
            <span className="category-label">Book a Shoot</span>
          </div>

          <div className="category-card" onClick={() => handleCategoryClick('studios')}>
            <div className="category-icon-wrap">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M10 2v20H3V2h7zm11 6v14h-7V8h7zM7 6H5v2h2V6zm0 4H5v2h2v-2zm0 4H5v2h2v-2zm0 4H5v2h2v-2zm11-8h-2v2h2v-2zm0 4h-2v2h2v-2zm0 4h-2v2h2v-2z" />
              </svg>
            </div>
            <span className="category-label">Studios</span>
          </div>

          <div className="category-card" onClick={() => handleCategoryClick('models')}>
            <div className="category-icon-wrap">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm-7 8c0-2.8 2.2-5 5-5h4c2.8 0 5 2.2 5 5v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-1z" />
              </svg>
            </div>
            <span className="category-label">Models</span>
          </div>

          <div className="category-card" onClick={() => handleCategoryClick('rentals')}>
            <div className="category-icon-wrap">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M8 3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H8zm4 5a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                <path d="M11 10.5h2v2.5h-2z" />
                <path d="M11.5 13L6.5 21.5a.8.8 0 0 0 .7 1.2h1.3a.8.8 0 0 0 .7-.4L12 16.5l2.8 5.8a.8.8 0 0 0 .7.4h1.3a.8.8 0 0 0 .7-1.2L12.5 13h-1z" />
                <path d="M11.25 13v7.5a.75.75 0 0 0 1.5 0V13h-1.5z" />
              </svg>
            </div>
            <span className="category-label">Gear Rentals</span>
          </div>

          <div className="category-card" onClick={() => handleCategoryClick('rentals')}>
            <div className="category-icon-wrap">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </div>
            <span className="category-label">Buy Gear</span>
          </div>

          <div className="category-card" onClick={() => handleCategoryClick('studios')}>
            <div className="category-icon-wrap">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
              </svg>
            </div>
            <span className="category-label">Locations</span>
          </div>

          <div className="category-card" onClick={() => handleCategoryClick('services')}>
            <div className="category-icon-wrap">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z" />
              </svg>
            </div>
            <span className="category-label">Videography</span>
          </div>

          <div className="category-card" onClick={() => handleCategoryClick('services')}>
            <div className="category-icon-wrap">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M2 3h10v18H2V3zm2 2v2h2V5H4v2zm0 4v2h2V9H4v2zm0 4v2h2v-2H4v2zm4 2h2V5H8v14z" opacity="0.85" />
                <path d="M13.5 10.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm0-2a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1z" />
                <path d="M13.5 16.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm0-2a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1z" />
                <path d="M14.5 11l5-5h2.5v1l-5 5z" />
                <path d="M14.5 13l5 5h2.5v-1l-5-5z" />
              </svg>
            </div>
            <span className="category-label">Editing & Post Production</span>
          </div>

          <div className="category-card" onClick={() => handleCategoryClick('workshops')}>
            <div className="category-icon-wrap">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
                <path d="M12 8.5l1.5 3 3.3.5-2.4 2.3.6 3.3-3-1.6-3 1.6.6-3.3-2.4-2.3 3.3-.5z" fill="white" />
              </svg>
            </div>
            <span className="category-label">Workshops & Events</span>
          </div>

          <div className="category-card" onClick={() => handleCategoryClick('jobs')}>
            <div className="category-icon-wrap">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H2c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h18c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM10 4h4v2h-4V4z" />
              </svg>
            </div>
            <span className="category-label">Jobs & Collabs</span>
          </div>

          <div className="category-card" onClick={() => handleCategoryClick('workshops')}>
            <div className="category-icon-wrap">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                <path d="M5 13.18v4c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-4l-7 3.82-7-3.82z" />
              </svg>
            </div>
            <span className="category-label">Admissions (Institutes)</span>
          </div>

          <div className="category-card" onClick={() => handleCategoryClick('services')}>
            <div className="category-icon-wrap">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="2" />
                <rect x="14" y="3" width="7" height="7" rx="2" />
                <rect x="3" y="14" width="7" height="7" rx="2" />
                <rect x="14" y="14" width="7" height="7" rx="2" opacity="0.8" />
              </svg>
            </div>
            <span className="category-label">More Services</span>
          </div>

        </div>
      </div>
    </section>

      {/* Promo Banner stripe */}
      <div className="mid-promo-stripe">
        <div className="stripe-info-box">
          <span className="stripe-tag">Exclusive Deals on Gear Rentals</span>
          <span className="stripe-title">Up to <span className="stripe-bold">40% OFF</span></span>
          <span className="stripe-desc">Rent top cameras, premium lenses & lighting packages.</span>
        </div>

        <div className="stripe-image-wrap">
          <img src={`${import.meta.env.BASE_URL}banner_cameras.png`} className="stripe-image" alt="Camera Gear Group" />
        </div>

        <button 
          className="stripe-btn" 
          onClick={() => handleCategoryClick('rentals')}
        >
          Rent Now
        </button>
      </div>

      {/* Popular Services Section */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Popular Photography Shoots</h2>
          <span className="section-link" onClick={() => handleCategoryClick('services')}>
            See All Shoots <ChevronRight size={14} />
          </span>
        </div>
        <div className="desktop-card-grid-5 mobile-scroll-row">
          {displayedServices.map(service => (
            <div key={service.id} className="service-card" onClick={() => { setExploreTab('services'); navigate('/explore'); }}>
              <div className="card-img-wrap">
                <img src={service.image} className="card-image" alt={service.title} />
                <button 
                  className={`card-like-btn ${likedItems[service.id] ? 'liked' : ''}`}
                  onClick={(e) => toggleLike(service.id, e)}
                >
                  <Heart size={15} fill={likedItems[service.id] ? 'var(--primary)' : 'none'} />
                </button>
              </div>
              <div className="card-info">
                <span className="card-title">{service.title}</span>
                <div className="card-rating-row" style={{ marginTop: '8px' }}>
                  <Star size={11} className="card-rating-star" />
                  <span>{service.rating}</span>
                  <span className="card-rating-count">({service.reviews} reviews)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Near You (Studios & Premium Gear) */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Trending Studios & Gear Near You</h2>
          <span className="section-link" onClick={() => handleCategoryClick('studios')}>
            See All Listings <ChevronRight size={14} />
          </span>
        </div>
        <div className="desktop-card-grid-5 mobile-scroll-row">
          {studios.map(studio => (
            <div key={studio.id} className="near-you-card" onClick={() => { setExploreTab('studios'); navigate('/explore'); }}>
              <div className="near-you-img-wrap">
                <img src={studio.image} className="card-image" alt={studio.title} />
                <span className="near-you-badge">Featured</span>
                <button 
                  className={`card-like-btn ${likedItems[studio.id] ? 'liked' : ''}`}
                  onClick={(e) => toggleLike(studio.id, e)}
                >
                  <Heart size={15} fill={likedItems[studio.id] ? 'var(--primary)' : 'none'} />
                </button>
              </div>
              <div className="near-you-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="near-you-title">{studio.title}</span>
                  <div className="card-rating-row" style={{ marginTop: 0 }}>
                    <Star size={11} className="card-rating-star" />
                    <span>{studio.rating}</span>
                  </div>
                </div>
                <span className="near-you-loc">📍 {studio.location} • {studio.distance}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Institutes & Courses */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Top Film & Animation Institutes</h2>
        </div>
        <div className="desktop-card-grid-5 mobile-scroll-row">
          {institutes.map(inst => (
            <div 
              key={inst.id} 
              className="institute-card" 
              onClick={() => openDetails(inst, 'institute')}
              style={{ cursor: 'pointer' }}
            >
              {/* Cover Image & Overlay badges */}
              <div className="inst-cover-wrap">
                <img 
                  src={inst.coverImage} 
                  alt={`${inst.title} Campus`} 
                  className="inst-cover-img" 
                />
                
                {/* Status badge with animated breathing dot */}
                {inst.status && (
                  <span className="inst-status-badge">
                    <span className="pulse-dot"></span>
                    {inst.status}
                  </span>
                )}

                {/* Rating Pill */}
                <div className="inst-rating-pill">
                  <Star size={11} fill="#ff9c00" color="#ff9c00" />
                  <span>{inst.rating}</span>
                </div>
              </div>

              {/* Overlapping Logo container */}
              <div className="inst-logo-container">
                <div className="inst-logo-badge" style={{ background: inst.bgColor || '#ffffff' }}>
                  <img 
                    src={`${import.meta.env.BASE_URL}${inst.logo.startsWith('/') ? inst.logo.slice(1) : inst.logo}`} 
                    alt={inst.title} 
                  />
                </div>
              </div>
              
              {/* Card Content details */}
              <div className="inst-card-body">
                <span className="inst-title" title={inst.title}>
                  {inst.title}
                </span>
                
                <div className="inst-details-row">
                  {/* Course specialty badge */}
                  <span className="inst-course-badge">
                    {inst.course || 'Film Studies'}
                  </span>
                </div>

                <div className="inst-footer-row">
                  <span className="inst-location">
                    <MapPin size={12} color="var(--primary)" />
                    <span>{inst.location}</span>
                  </span>
                  
                  <span className="inst-apply-btn">
                    Apply <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Workshops */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Trending workshops</h2>
          <span className="section-link" onClick={() => handleCategoryClick('workshops')}>
            See Workshops <ChevronRight size={14} />
          </span>
        </div>
        <div className="desktop-card-grid-5 mobile-scroll-row">
          {workshops.slice(0, 7).map(wk => (
            <div key={wk.id} className="workshop-card" onClick={() => { setExploreTab('workshops'); navigate('/explore'); }}>
              <div className="workshop-img-wrap">
                <img src={wk.image} className="card-image" alt={wk.title} />
                <div className="date-badge">
                  <span className="date-day">{wk.date.split(' ')[0]}</span>
                  <span className="date-month">{wk.date.split(' ')[1]}</span>
                </div>
              </div>
              <div className="workshop-info">
                <span className="workshop-title">{wk.title}</span>
                <span className="workshop-instructor">Instructor: <strong>{wk.instructor}</strong></span>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '4px' }}>
                  <div className="card-rating-row" style={{ marginTop: 0 }}>
                    <Star size={11} className="card-rating-star" />
                    <span>{wk.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      </div>
    </>
  );
};

export default HomePage;
