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

  const slides = [
    {
      tag: "India's #1 Creator Marketplace",
      tagGreen: "✓ Verified Listings",
      title: (
        <>
          Book Studios,<br />
          Gear &amp; Talent<br />
          <span className="hero-title-accent">Instantly.</span>
        </>
      ),
      subtitle: "Connect with top-rated photographers, premium studio spaces, professional models & camera gear — all in one place.",
      image: "banner_photographer.png",
      cta1Text: "🎬 Book a Studio",
      cta1Tab: "studios",
      cta2Text: "Find a Photographer",
      cta2Tab: "services",
      trustText: "📸 Wedding Shoots • 🎥 Reels & Ads • 🏢 Corporate Events • 👗 Fashion & Editorial",
      stats: [
        { num: "2,800+", label: "Verified Studios" },
        { num: "15K+", label: "Creators" },
        { num: "4.9★", label: "Avg. Rating" }
      ],
      background: "linear-gradient(135deg, #C8102E 0%, #800A1A 100%)"
    },
    {
      tag: "Save on Production Costs",
      tagGreen: "✓ Standard Insurance",
      title: (
        <>
          Top-Tier Cameras<br />
          &amp; Gear Rentals<br />
          <span className="hero-title-accent">Insured.</span>
        </>
      ),
      subtitle: "Rent professional cinema packages, high-end DSLRs, prime lenses, and specialized lighting with flexible daily rates.",
      image: "banner_cameras.png",
      cta1Text: "🎥 Rent Gear",
      cta1Tab: "rentals",
      cta2Text: "Explore Packages",
      cta2Tab: "rentals",
      trustText: "🎥 RED & Arri • 📸 Prime Lenses • 💡 Studio Lights • 🛸 Professional Drones",
      stats: [
        { num: "500+", label: "Camera Kits" },
        { num: "100%", label: "Quality Inspected" },
        { num: "Free", label: "Delivery Options" }
      ],
      background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)"
    },
    {
      tag: "Work with the Best",
      tagGreen: "✓ Trusted by Brands",
      title: (
        <>
          Capture Your Vision<br />
          With Top Talent<br />
          <span className="hero-title-accent">Perfected.</span>
        </>
      ),
      subtitle: "Hire pre-screened professionals for weddings, high-fashion editorials, e-commerce, commercial ads, and post-production.",
      image: "pre_wedding_shoot_new.png",
      cta1Text: "💍 Book a Shoot",
      cta1Tab: "services",
      cta2Text: "View Creative Portfolios",
      cta2Tab: "services",
      trustText: "👰 Weddings • 👕 E-Commerce • 🎬 Music Videos • 🍔 Food Photography",
      stats: [
        { num: "1,200+", label: "Photo Shoots" },
        { num: "48hr", label: "Average Delivery" },
        { num: "100%", label: "Secure Payments" }
      ],
      background: "linear-gradient(135deg, #8C6239 0%, #4A3B32 100%)"
    }
  ];

  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleCategoryClick = (tabName) => {
    setExploreTab(tabName);
    navigate('/explore');
  };

  // ---- Booking Widget State ----
  const [bookEvent, setBookEvent]       = React.useState('Wedding Photography');
  const [bookLocation, setBookLocation] = React.useState('Hyderabad');
  const [bookPrice, setBookPrice]       = React.useState(1000000);
  const [bookDate, setBookDate]         = React.useState('');

  const eventOptions = [
    'Wedding Photography', 'Pre-Wedding Shoot', 'Baby & Maternity',
    'Fashion Editorial', 'Corporate Events', 'Product Photography',
    'Real Estate', 'Food Photography', 'Music Videos', 'Reels & Ads'
  ];

  const formatPrice = (val) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(val % 100000 === 0 ? 0 : 1)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const handleBookingSearch = () => {
    setExploreTab('services');
    navigate('/explore');
  };

  return (
    <>
      {/* ======= FULL-WIDTH SPLIT HERO SLIDER ======= */}
      <div className="hero-carousel-container">

        {/* Slide Background Image (full bleed) */}
        <div
          className="hero-bg-image active-slide"
          key={`bg-${currentSlide}`}
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}${slides[currentSlide].image})` }}
        />

        {/* Dark gradient overlay */}
        <div className="hero-overlay" />

        {/* Navigation Arrows */}
        <button className="carousel-arrow prev" onClick={prevSlide} aria-label="Previous Slide">
          <ChevronLeft size={22} />
        </button>
        <button className="carousel-arrow next" onClick={nextSlide} aria-label="Next Slide">
          <ChevronRight size={22} />
        </button>

        {/* ===== SPLIT LAYOUT: Left text | Right widget ===== */}
        <div className="hero-split-layout active-slide" key={`content-${currentSlide}`}>

          {/* ---- LEFT: Text Content ---- */}
          <div className="hero-left-col">
            <div className="hero-tags-row">
              <span className="hero-tag">{slides[currentSlide].tag}</span>
              <span className="hero-tag-green">{slides[currentSlide].tagGreen}</span>
            </div>

            <h1 className="hero-title">{slides[currentSlide].title}</h1>
            <p className="hero-subtitle">{slides[currentSlide].subtitle}</p>

            <div className="hero-cta-row">
              <button className="hero-btn"
                onClick={() => { setExploreTab(slides[currentSlide].cta1Tab); navigate('/explore'); }}>
                {slides[currentSlide].cta1Text}
              </button>
              <button className="hero-btn-outline"
                onClick={() => { setExploreTab(slides[currentSlide].cta2Tab); navigate('/explore'); }}>
                {slides[currentSlide].cta2Text}
              </button>
            </div>

            <div className="hero-trust-strip">{slides[currentSlide].trustText}</div>

            {/* Stats inline */}
            <div className="hero-stats-inline">
              {slides[currentSlide].stats.map((stat, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <div className="hero-stat-divider" />}
                  <div className="hero-stat-pill">
                    <span className="hero-stat-num">{stat.num}</span>
                    <span className="hero-stat-label">{stat.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ---- RIGHT: Booking Widget ---- */}
          <div className="hero-booking-widget">
            <div className="booking-widget-header">
              <span className="booking-widget-title">Find &amp; Book Instantly</span>
              <span className="booking-widget-sub">Fill in your requirements below</span>
            </div>

            <div className="booking-widget-body">
              {/* Row 1: Event + Location */}
              <div className="booking-row">
                <div className="booking-field">
                  <label className="booking-label">
                    <span className="booking-label-icon">🎬</span> EVENT
                  </label>
                  <div className="booking-select-wrap">
                    <select
                      className="booking-select"
                      value={bookEvent}
                      onChange={e => setBookEvent(e.target.value)}
                    >
                      {eventOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="booking-field">
                  <label className="booking-label">
                    <span className="booking-label-icon">📍</span> LOCATION
                  </label>
                  <input
                    className="booking-input"
                    type="text"
                    value={bookLocation}
                    onChange={e => setBookLocation(e.target.value)}
                    placeholder="City or Area"
                  />
                </div>
              </div>

              {/* Row 2: Price + Date */}
              <div className="booking-row">
                <div className="booking-field">
                  <label className="booking-label">
                    <span className="booking-label-icon">₹</span>
                    MAX PRICE: <strong style={{ color: '#C8102E' }}>{formatPrice(bookPrice)}</strong>
                  </label>
                  <input
                    className="booking-range"
                    type="range"
                    min={5000}
                    max={1000000}
                    step={5000}
                    value={bookPrice}
                    onChange={e => setBookPrice(Number(e.target.value))}
                  />
                </div>

                <div className="booking-field">
                  <label className="booking-label">
                    <span className="booking-label-icon">📅</span> PHOTOSHOOT DATE
                  </label>
                  <input
                    className="booking-input booking-date"
                    type="date"
                    value={bookDate}
                    onChange={e => setBookDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button className="booking-search-btn" onClick={handleBookingSearch}>
              Search
            </button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>



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
          <h2 className="section-title">Popular Photography Packages</h2>
          <span className="section-link" onClick={() => handleCategoryClick('services')}>
            See All Packages <ChevronRight size={14} />
          </span>
        </div>
        <div className="desktop-card-grid-5 mobile-scroll-row">
          {services.slice(0, 7).map(service => (
            <div key={service.id} className="service-card" onClick={() => openDetails(service, 'service')}>
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
                <div className="card-sub-info">
                  <span className="card-price-label">From</span>
                  <span className="card-price-value">₹{service.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="card-rating-row">
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
            <div key={studio.id} className="near-you-card" onClick={() => openDetails(studio, 'studio')}>
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
                <div className="near-you-price-row">
                  <span className="card-price-value">₹{studio.price.toLocaleString('en-IN')}<span style={{ fontSize: '11px', fontWeight: '500' }}>/{studio.priceUnit}</span></span>
                </div>
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
            <div key={wk.id} className="workshop-card" onClick={() => openDetails(wk, 'workshop')}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <span className="workshop-price">₹{wk.price.toLocaleString('en-IN')}</span>
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
    </>
  );
};

export default HomePage;
