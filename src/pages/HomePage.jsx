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

  const handleCategoryClick = (tabName) => {
    setExploreTab(tabName);
    navigate('/explore');
  };

  return (
    <>
      {/* Full-width Hero Banner Slider */}
      <div className="hero-carousel-container">
        <div className="hero-banner">
          <div className="hero-banner-inner">
            <div className="hero-banner-content">
              {/* Concept Tag */}
              <div className="hero-tags-row">
                <span className="hero-tag">India's #1 Creator Marketplace</span>
                <span className="hero-tag-green">✓ Verified Listings</span>
              </div>

              {/* Main headline */}
              <h1 className="hero-title">
                Book Studios,<br />
                Gear &amp; Talent<br />
                <span className="hero-title-accent">Instantly.</span>
              </h1>

              {/* Sub-headline */}
              <p className="hero-subtitle">
                Connect with top-rated photographers, premium studio spaces,
                professional models &amp; camera gear — all in one place.
              </p>

              {/* Live Stats Row */}
              <div className="hero-stats-row">
                <div className="hero-stat-pill">
                  <span className="hero-stat-num">2,800+</span>
                  <span className="hero-stat-label">Verified Studios</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat-pill">
                  <span className="hero-stat-num">15K+</span>
                  <span className="hero-stat-label">Creators</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat-pill">
                  <span className="hero-stat-num">4.9★</span>
                  <span className="hero-stat-label">Avg. Rating</span>
                </div>
              </div>

              {/* Dual CTA Buttons */}
              <div className="hero-cta-row">
                <button
                  className="hero-btn"
                  onClick={() => { setExploreTab('studios'); navigate('/explore'); }}
                >
                  🎬 Book a Studio
                </button>
                <button
                  className="hero-btn-outline"
                  onClick={() => { setExploreTab('services'); navigate('/explore'); }}
                >
                  Find a Photographer
                </button>
              </div>

              {/* Trust Strip */}
              <div className="hero-trust-strip">
                <span>📸 Wedding Shoots</span>
                <span>•</span>
                <span>🎥 Reels &amp; Ads</span>
                <span>•</span>
                <span>🏢 Corporate Events</span>
                <span>•</span>
                <span>👗 Fashion &amp; Editorial</span>
              </div>
            </div>

            {/* Photographer Center Overlay */}
            <div className="hero-banner-image-wrap">
              <img
                src={`${import.meta.env.BASE_URL}banner_photographer.png`}
                className="hero-banner-image"
                alt="Photographer"
              />
            </div>



          </div>
        </div>
        <div className="carousel-indicators">
          <span className="indicator active"></span>
          <span className="indicator"></span>
          <span className="indicator"></span>
          <span className="indicator"></span>
        </div>
      </div>

      {/* How it Works Strip */}
      <div className="how-it-works-strip">
        <div className="hiw-step">
          <div className="hiw-icon">🔍</div>
          <div className="hiw-body">
            <span className="hiw-num">Step 01</span>
            <span className="hiw-title">Search &amp; Filter</span>
            <span className="hiw-desc">Browse studios, gear &amp; talent by location, category &amp; budget.</span>
          </div>
        </div>
        <div className="hiw-divider" />
        <div className="hiw-step">
          <div className="hiw-icon">📅</div>
          <div className="hiw-body">
            <span className="hiw-num">Step 02</span>
            <span className="hiw-title">Instant Booking</span>
            <span className="hiw-desc">Pick your date &amp; slot. Confirm with secure payment in seconds.</span>
          </div>
        </div>
        <div className="hiw-divider" />
        <div className="hiw-step">
          <div className="hiw-icon">🎬</div>
          <div className="hiw-body">
            <span className="hiw-num">Step 03</span>
            <span className="hiw-title">Shoot &amp; Deliver</span>
            <span className="hiw-desc">Show up &amp; create magic. Receive edited content on time, every time.</span>
          </div>
        </div>
      </div>

      {/* Category Grid Row */}
      <div className="categories-container">
        <div className="categories-grid">
          
          <div className="category-card" onClick={() => handleCategoryClick('services')}>
            <div className="category-icon-wrap"><Camera size={26} /></div>
            <span className="category-label">Book a Shoot</span>
          </div>

          <div className="category-card" onClick={() => handleCategoryClick('studios')}>
            <div className="category-icon-wrap"><Building2 size={26} /></div>
            <span className="category-label">Studios</span>
          </div>

          <div className="category-card" onClick={() => handleCategoryClick('models')}>
            <div className="category-icon-wrap"><User size={26} /></div>
            <span className="category-label">Models</span>
          </div>

          <div className="category-card" onClick={() => handleCategoryClick('rentals')}>
            <div className="category-icon-wrap"><Camera size={26} /></div>
            <span className="category-label">Gear Rentals</span>
          </div>

          <div className="category-card" onClick={() => handleCategoryClick('rentals')}>
            <div className="category-icon-wrap"><ShoppingCart size={26} /></div>
            <span className="category-label">Buy Gear</span>
          </div>

          <div className="category-card" onClick={() => handleCategoryClick('studios')}>
            <div className="category-icon-wrap"><MapPin size={26} /></div>
            <span className="category-label">Locations</span>
          </div>

          <div className="category-card" onClick={() => handleCategoryClick('services')}>
            <div className="category-icon-wrap"><Video size={26} /></div>
            <span className="category-label">Videography</span>
          </div>

          <div className="category-card" onClick={() => handleCategoryClick('services')}>
            <div className="category-icon-wrap"><Scissors size={26} /></div>
            <span className="category-label">Editing & Post Production</span>
          </div>

          <div className="category-card" onClick={() => handleCategoryClick('workshops')}>
            <div className="category-icon-wrap"><Calendar size={26} /></div>
            <span className="category-label">Workshops & Events</span>
          </div>

          <div className="category-card" onClick={() => handleCategoryClick('jobs')}>
            <div className="category-icon-wrap"><Briefcase size={26} /></div>
            <span className="category-label">Jobs & Collabs</span>
          </div>

          <div className="category-card" onClick={() => handleCategoryClick('workshops')}>
            <div className="category-icon-wrap"><GraduationCap size={26} /></div>
            <span className="category-label">Admissions (Institutes)</span>
          </div>

          <div className="category-card" onClick={() => handleCategoryClick('services')}>
            <div className="category-icon-wrap"><LayoutGrid size={26} /></div>
            <span className="category-label">More Services</span>
          </div>

        </div>
      </div>

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
            <div key={inst.id} className="institute-card">
              <div className="inst-logo-badge">
                {(() => {
                  switch (inst.id) {
                    case 'in-1': return <Film size={22} />;
                    case 'in-2': return <Clapperboard size={22} />;
                    case 'in-3': return <GraduationCap size={22} />;
                    case 'in-4': return <Palette size={22} />;
                    case 'in-5': return <Video size={22} />;
                    default: return <GraduationCap size={22} />;
                  }
                })()}
              </div>
              <div className="inst-meta">
                <span className="inst-title">{inst.title}</span>
                <span className="inst-location">{inst.location}</span>
                <span className="inst-rating">⭐ {inst.rating}</span>
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
