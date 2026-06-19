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
      {/* Splitscreen Hero Section */}
      <div className="hero-splitscreen-container">
        <div className="hero-left-col">
          <div className="hero-brand-badge-pro">
            <span className="badge-dot-glow"></span>
            <span>HYDERABAD'S NO. 1 CREATOR MARKETPLACE</span>
          </div>
          <h1 className="hero-title-main">
            Discover & Book <span>Creative Spaces</span>, Gear & Talent
          </h1>
          <p className="hero-subtext">
            PickMyShoot is the ultimate marketplace for photographers, filmmakers, and content creators. Find premium studio lots, high-end camera equipment rentals, models, and editing post-production packages near you.
          </p>
          <div className="hero-ctas-row">
            <button 
              className="hero-cta-btn-primary" 
              onClick={() => {
                setExploreTab('services');
                navigate('/explore');
              }}
            >
              Book a Shoot
            </button>
            <button 
              className="hero-cta-btn-secondary" 
              onClick={() => {
                setExploreTab('models');
                navigate('/explore');
              }}
            >
              Find Creators
            </button>
            <button 
              className="hero-cta-btn-tertiary" 
              onClick={() => {
                navigate('/create');
              }}
            >
              List Your Studio
            </button>
          </div>
        </div>

        <div className="hero-right-col">
          <div className="hero-image-wrapper">
            <div className="hero-blob-glow"></div>
            <img 
              src={`${import.meta.env.BASE_URL}banner_photographer.png`} 
              className="hero-main-photo" 
              alt="Creative Photographer" 
            />
            {/* Floating Visual Badges */}
            <div className="floating-badge badge-top-left">
              <span className="badge-icon">⭐</span>
              <div className="badge-text-col">
                <span className="badge-bold">4.9 Average</span>
                <span className="badge-muted">Client Rating</span>
              </div>
            </div>
            <div className="floating-badge badge-bottom-right">
              <span className="badge-icon">📍</span>
              <div className="badge-text-col">
                <span className="badge-bold">500+ Studios</span>
                <span className="badge-muted">Across South India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stats Strip */}
      <div className="stats-strip-wrapper">
        <div className="stats-strip-inner">
          <div className="stat-pill-item">
            <h3>12,000+</h3>
            <p>Shoots Completed</p>
          </div>
          <div className="stat-pill-item-separator"></div>
          <div className="stat-pill-item">
            <h3>450+</h3>
            <p>Studios & Spaces</p>
          </div>
          <div className="stat-pill-item-separator"></div>
          <div className="stat-pill-item">
            <h3>99.2%</h3>
            <p>Booking Success Rate</p>
          </div>
          <div className="stat-pill-item-separator"></div>
          <div className="stat-pill-item">
            <h3>3,500+</h3>
            <p>Vetted Equipment Items</p>
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

      {/* Homepage Testimonials Section */}
      <section className="homepage-testimonials-section" style={{ marginTop: '40px', borderTop: '1px solid var(--border)', paddingTop: '40px' }}>
        <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', gap: '6px', marginBottom: '32px' }}>
          <h2 className="section-title">What Creators &amp; Clients Say</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', marginTop: '4px' }}>
            Thousands of photographers, brands, and creative professionals rely on PickMyShoot to source production spaces, book talent, and rent high-end gear.
          </p>
        </div>

        <div className="testimonials-grid-pro" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {[
            {
              id: "rev-h-1",
              client: "Aarav Sharma",
              company: "Aura Creative Agency",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
              rating: 5,
              comment: "Booking 'The Loft Studio' through PickMyShoot was seamless. We saved hours coordinating with the studio lot owner and the invoice details were immediate."
            },
            {
              id: "rev-h-2",
              client: "Meera Nair",
              company: "Independent Filmmaker",
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
              rating: 5,
              comment: "The gear rental booking flow is unmatched. I rented a Canon R6 and lens pack for a commercial shoot, and verified pickup took less than 2 minutes."
            },
            {
              id: "rev-h-3",
              client: "Vikram Malhotra",
              company: "D2C Fashion Hub",
              avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
              rating: 5,
              comment: "Finding e-commerce models with verified ratings and booking them for catalog shoots has never been this simple. Highly recommended platform!"
            }
          ].map(rev => (
            <div key={rev.id} className="testimonial-card-pro" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
              <div className="testimonial-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <img src={rev.avatar} className="testimonial-avatar" alt={rev.client} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                <div className="testimonial-client-meta" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span className="client-name" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>{rev.client}</span>
                  <span className="client-company" style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{rev.company}</span>
                </div>
                <div className="client-rating-stars" style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={11} fill="#ffaa00" color="#ffaa00" />
                  ))}
                </div>
              </div>
              <p className="testimonial-comment" style={{ fontSize: '12.5px', lineHeight: '1.5', color: 'var(--text-muted)', fontStyle: 'italic' }}>"{rev.comment}"</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default HomePage;
