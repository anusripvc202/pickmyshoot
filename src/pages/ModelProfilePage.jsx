import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Heart,
  MessageSquare,
  Phone,
  Check,
  Clock,
  X,
  Share2,
  Award,
  AlertCircle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './ModelProfilePage.css';

/* ─── Fallback portfolio images (curated fashion / model shots) ─── */
const portfolioImages = [
  { url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80", caption: "Outdoor Fashion Editorial" },
  { url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80", caption: "Studio Lookbook — Minimalist Set" },
  { url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80", caption: "Ethnic Bridal Campaign" },
  { url: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80", caption: "Corporate Lifestyle Shoot" },
  { url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80", caption: "High Fashion Runway Editorial" },
  { url: "https://images.unsplash.com/photo-1487222444842-a44ea7b6ea05?auto=format&fit=crop&w=900&q=80", caption: "Beauty & Close-up Portrait" }
];

const mockReviews = [
  {
    id: 1,
    name: "Rahul Kapoor — Brand Director",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
    rating: 5,
    date: "3 weeks ago",
    text: "Worked with her for our autumn catalog shoot. She was incredibly professional, took direction brilliantly, and had natural expressions throughout. Delivery was on time and the photos were stunning."
  },
  {
    id: 2,
    name: "Meera Studios — Wedding Photographer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
    rating: 5,
    date: "1 month ago",
    text: "Booked for a bridal jewelry editorial. Her grace and command on traditional poses made every shot magazine-worthy. Will definitely book again for our next project."
  },
  {
    id: 3,
    name: "Preethi Nair — Fashion Designer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80",
    rating: 4,
    date: "6 weeks ago",
    text: "She was great to work with. Very photogenic and versatile. The only feedback is to arrive 10 mins early as we had to rush the first 15 minutes."
  }
];

const ModelProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { models, openDetails, likedItems, toggleLike, triggerToast } = useAppContext();

  const [activeSlide, setActiveSlide] = useState(0);
  const [showFullBio, setShowFullBio] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('halfDay');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  /* Auto-advance slider */
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % portfolioImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  /* Resolve model by ID */
  const model = useMemo(() => {
    return models?.find(m => m.id === id) || {
      id,
      title: "Ananya Singh",
      price: 6000,
      priceUnit: "day",
      rating: 4.9,
      reviews: 87,
      gender: "Female",
      type: "Model",
      location: "Jubilee Hills, Hyderabad",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
      height: "5'7\"",
      categories: ["Fashion", "Commercial", "Ethnic"],
      description: "Professional model with over 4 years of experience working with top fashion brands, ethnic wear labels, and e-commerce campaigns. Known for her versatility across editorial, catalog, and commercial projects."
    };
  }, [models, id]);

  const pricePerDay = model.price || 6000;

  const packages = {
    hourly: {
      name: "Half-Day Session (4 hrs)",
      desc: "Ideal for brand shoots, catalog sessions or quick e-commerce campaigns.",
      price: Math.round(pricePerDay * 0.6),
      unit: " flat"
    },
    halfDay: {
      name: "Full Day Session (8 hrs)",
      desc: "Full coverage for fashion shoots, ad campaigns, wedding looks & bridal shoots.",
      price: pricePerDay,
      unit: "/day"
    },
    fullDay: {
      name: "2-Day Package",
      desc: "Extended shoot for complete lookbook, web catalog or multi-set ad production.",
      price: Math.round(pricePerDay * 1.8),
      unit: " flat"
    }
  };

  const handleBook = () => {
    const bookingItem = {
      id: model.id,
      title: `${model.title} — ${packages[selectedPackage].name}`,
      price: packages[selectedPackage].price,
      image: model.image,
      ownerId: model.ownerId || model.id,
      location: model.location,
      rating: model.rating,
      reviews: model.reviews
    };
    openDetails(bookingItem, 'service');
  };

  const openLightbox = idx => { setLightboxIndex(idx); setLightboxOpen(true); };

  return (
    <div className="model-profile-container">

      {/* Breadcrumbs */}
      <div className="model-breadcrumb">
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
        <ChevronRight size={12} />
        <Link to="/explore" style={{ color: 'inherit', textDecoration: 'none' }}>Models &amp; Talents</Link>
        <ChevronRight size={12} />
        <span>{model.title}</span>
      </div>

      {/* Two-column layout */}
      <div className="model-main-layout">

        {/* ── LEFT COLUMN ── */}
        <div className="model-left-col">

          {/* Header */}
          <div className="model-header-card">
            <div className="model-header-top-row">
              <div className="model-meta-info">
                <div className="model-verified-badge">
                  <Award size={12} /> Verified Model
                </div>
                <h1 className="model-name-title">{model.title}</h1>
                <div className="model-location-row">
                  <MapPin size={15} color="#7c3aed" />
                  <span>{model.location || 'Hyderabad'}</span>
                </div>
              </div>

              <div className="model-avatar-wrap">
                <img src={model.image} className="model-avatar-img" alt={model.title} />
                <span className="model-available-dot" />
              </div>
            </div>

            <div className="model-status-badges">
              <span className="model-badge-pill available">
                <Clock size={13} /> Available Today
              </span>
              <span className="model-badge-pill responds">
                ⚡ Responds within 1 hr
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto', fontSize: '13px', fontWeight: '700' }}>
                <Star size={14} fill="#ffaa00" color="#ffaa00" />
                <span>{model.rating || '4.9'}</span>
                <span style={{ color: '#9ca3af', fontWeight: '500' }}>({model.reviews} reviews)</span>
              </div>
            </div>
          </div>

          {/* Slider Gallery */}
          <div className="model-slider-wrap">
            {portfolioImages.map((img, idx) => (
              <div
                key={idx}
                className="model-slide"
                style={{ display: activeSlide === idx ? 'block' : 'none' }}
              >
                <img src={img.url} className="model-slide-img" alt={img.caption} onClick={() => openLightbox(idx)} />
              </div>
            ))}
            <button className="model-slider-btn prev" onClick={e => { e.stopPropagation(); setActiveSlide(p => (p - 1 + portfolioImages.length) % portfolioImages.length); }}>
              <ChevronLeft size={20} />
            </button>
            <button className="model-slider-btn next" onClick={e => { e.stopPropagation(); setActiveSlide(p => (p + 1) % portfolioImages.length); }}>
              <ChevronRight size={20} />
            </button>
            <div className="model-slider-dots">
              {portfolioImages.map((_, idx) => (
                <span key={idx} className={`model-dot ${activeSlide === idx ? 'active' : ''}`} onClick={() => setActiveSlide(idx)} />
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="model-stats-grid">
            <div className="model-stat-block">
              <span className="model-stat-num">{model.reviews}+</span>
              <span className="model-stat-label">Projects Done</span>
            </div>
            <div className="model-stat-block">
              <span className="model-stat-num">4+ Yrs</span>
              <span className="model-stat-label">Experience</span>
            </div>
            <div className="model-stat-block">
              <span className="model-stat-num">{model.rating} ★</span>
              <span className="model-stat-label">Avg Rating</span>
            </div>
            <div className="model-stat-block">
              <span className="model-stat-num">{model.height || '5\'7"'}</span>
              <span className="model-stat-label">Height</span>
            </div>
          </div>

          {/* Specializations */}
          <div className="model-section-card">
            <h3 className="model-section-title">Specializations</h3>
            <div className="model-chips-list">
              {(model.categories || ['Fashion', 'Commercial', 'Ethnic']).map((cat, idx) => (
                <span key={idx} className="model-chip">{cat}</span>
              ))}
              {(model.tags || []).map((tag, idx) => (
                <span key={`tag-${idx}`} className="model-chip">{tag}</span>
              ))}
            </div>
          </div>

          {/* Physical Attributes */}
          <div className="model-section-card">
            <h3 className="model-section-title">Physical Attributes</h3>
            <div className="model-specs-grid">
              {[
                { label: 'Gender', value: model.gender || 'Female' },
                { label: 'Height', value: model.height || '5\'7"' },
                { label: 'Build', value: 'Slim / Toned' },
                { label: 'Skin Tone', value: 'Wheatish' },
                { label: 'Hair', value: 'Long / Dark Brown' },
                { label: 'Eyes', value: 'Brown' }
              ].map((spec, i) => (
                <div key={i} className="model-spec-card">
                  <span className="model-spec-label">{spec.label}</span>
                  <span className="model-spec-value">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="model-section-card">
            <h3 className="model-section-title">About Model</h3>
            <p className="model-bio-text">
              {showFullBio ? model.description : `${model.description.slice(0, 160)}...`}
            </p>
            <button className="model-read-more-btn" onClick={() => setShowFullBio(s => !s)}>
              {showFullBio ? 'Read Less' : 'Read More'}
            </button>
          </div>

          {/* What's Included */}
          <div className="model-section-card">
            <h3 className="model-section-title">What's Included</h3>
            <div className="model-services-grid">
              {[
                "Professional Makeup & Styling",
                "Wardrobe Coordination",
                "Up to 3 Outfit Changes",
                "Natural Posing Direction",
                "Punctual & Professional",
                "Post-session Feedback Call"
              ].map((s, i) => (
                <div key={i} className="model-service-item">
                  <Check size={16} className="model-check-icon" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Grid */}
          <div className="model-section-card">
            <h3 className="model-section-title">Portfolio Gallery</h3>
            <div className="model-portfolio-grid">
              {portfolioImages.map((img, idx) => (
                <div key={idx} className="model-grid-card" onClick={() => openLightbox(idx)}>
                  <img src={img.url} className="model-grid-img" alt={img.caption} />
                  <div className="model-grid-overlay">
                    <span className="model-overlay-label">{img.caption.split(' ')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="model-view-all-btn" onClick={() => openLightbox(0)}>
              View Full Portfolio <ChevronRight size={14} />
            </button>
          </div>

          {/* Reviews */}
          <div className="model-section-card">
            <h3 className="model-section-title">Client Reviews ({model.reviews} Verified)</h3>
            <div className="model-reviews-list">
              {mockReviews.map(rev => (
                <div key={rev.id} className="model-review-card">
                  <div className="model-review-header">
                    <div className="model-reviewer-info">
                      <img src={rev.avatar} className="model-reviewer-avatar" alt={rev.name} />
                      <div>
                        <span className="model-reviewer-name">{rev.name}</span>
                        <span className="model-review-date">{rev.date}</span>
                      </div>
                    </div>
                    <div className="model-review-stars">
                      {[...Array(rev.rating)].map((_, i) => <Star key={i} size={13} fill="#ffaa00" color="#ffaa00" />)}
                    </div>
                  </div>
                  <p className="model-review-quote">"{rev.text}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Location Map */}
          <div className="model-section-card" style={{ borderBottom: 'none' }}>
            <h3 className="model-section-title">Location &amp; Availability Area</h3>
            <div className="model-map-wrap">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15228.384661448651!2d78.39994326589308!3d17.407238260787167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb96df69cc2f67%3A0x6e9f5bb64c7e4cc4!2sJubilee%20Hills%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%" height="100%" style={{ border: 0 }}
                allowFullScreen="" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Model availability area"
              />
            </div>
            <div className="model-travel-note">
              <AlertCircle size={16} />
              <span>Available for shoots within 40 km radius of {(model.location || 'Hyderabad').split(',')[0]}. Outstation shoots on request (travel expenses apply).</span>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN (Sticky Booking Card) ── */}
        <div className="model-right-col">
          <div className="model-booking-card">
            <div className="model-booking-price-row">
              <span className="model-price-num">₹{packages[selectedPackage].price.toLocaleString('en-IN')}</span>
              <span className="model-price-unit">{packages[selectedPackage].unit}</span>
            </div>

            <div className="model-packages-list">
              {Object.keys(packages).map(key => {
                const pkg = packages[key];
                return (
                  <div
                    key={key}
                    className={`model-package-option ${selectedPackage === key ? 'selected' : ''}`}
                    onClick={() => setSelectedPackage(key)}
                  >
                    <div className="model-pkg-label">
                      <span className="model-pkg-name">{pkg.name}</span>
                      <span className="model-pkg-desc">{pkg.desc}</span>
                    </div>
                    <span className="model-pkg-price">₹{pkg.price.toLocaleString('en-IN')}</span>
                  </div>
                );
              })}
            </div>

            <button className="model-book-btn" onClick={handleBook}>
              Book This Model Now
            </button>

            <div className="model-social-row">
              <a
                href={`https://wa.me/919999988888?text=Hi%2C%20I%20found%20${encodeURIComponent(model.title)}'s%20profile%20on%20PickMyShoot%20and%20would%20like%20to%20book%20a%20shoot!`}
                target="_blank"
                rel="noopener noreferrer"
                className="model-social-btn whatsapp"
              >
                <MessageSquare size={14} /> WhatsApp
              </a>
              <a
                href={`https://instagram.com/pickmyshoot`}
                target="_blank"
                rel="noopener noreferrer"
                className="model-social-btn instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                Instagram
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="model-lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <div className="model-lightbox-body" onClick={e => e.stopPropagation()}>
            <button className="model-lightbox-close" onClick={() => setLightboxOpen(false)}>
              <X size={20} />
            </button>
            <div className="model-lightbox-img-wrap">
              <img src={portfolioImages[lightboxIndex].url} className="model-lightbox-img" alt="Portfolio" />
            </div>
            <p className="model-lightbox-caption">
              {portfolioImages[lightboxIndex].caption} ({lightboxIndex + 1} / {portfolioImages.length})
            </p>
            <button
              className="model-slider-btn prev"
              style={{ left: '-60px', background: 'rgba(255,255,255,0.15)', color: '#fff' }}
              onClick={() => setLightboxIndex(p => (p - 1 + portfolioImages.length) % portfolioImages.length)}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="model-slider-btn next"
              style={{ right: '-60px', background: 'rgba(255,255,255,0.15)', color: '#fff' }}
              onClick={() => setLightboxIndex(p => (p + 1) % portfolioImages.length)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bar */}
      <div className="model-sticky-mobile-bar">
        <div className="model-mobile-bar-inner">
          <div className="model-mobile-price-col">
            <span className="model-mobile-price-val">₹{packages[selectedPackage].price.toLocaleString('en-IN')}</span>
            <span className="model-mobile-price-lbl">Per {selectedPackage === 'hourly' ? 'Half Day' : selectedPackage === 'halfDay' ? 'Full Day' : '2 Days'}</span>
          </div>
          <div className="model-mobile-actions">
            <a href="tel:+919999988888" className="model-mobile-icon-btn">
              <Phone size={16} />
            </a>
            <a
              href={`https://wa.me/919999988888?text=Hi%20I%20found%20${encodeURIComponent(model.title)}%20on%20PickMyShoot`}
              target="_blank"
              rel="noopener noreferrer"
              className="model-mobile-icon-btn"
            >
              <MessageSquare size={16} />
            </a>
            <button className="model-mobile-book-btn" onClick={handleBook}>
              Book Now
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ModelProfilePage;
