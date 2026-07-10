import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Calendar,
  X,
  Share2,
  Camera,
  Layers,
  Award,
  Video,
  AlertCircle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './PhotographerProfilePage.css';

// Fallback high-quality photographers list
const fallbackPhotographers = [
  {
    id: "p-mock-1",
    name: "Arjun Kamath",
    role: "photographer",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    bio: "Award-winning portrait and wedding photographer based in Hyderabad. Specialized in cinematic storytelling, fine-art wedding albums, and natural light photography. With over 8 years of traveling across India capturing couples, Arjun focuses on preserving raw, unscripted emotions. His style blends deep tones with high-contrast cinematic lighting.",
    location: "Jubilee Hills, Hyderabad",
    rating: "4.9",
    reviews: 580,
    shoots: "150+",
    followers: "24K",
    experience: "8+ Years",
    startingPrice: 2000,
    instaUrl: "https://instagram.com/arjunkamath8",
    isVerified: true
  },
  {
    id: "p-mock-2",
    name: "Sanjana Roy",
    role: "photographer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    bio: "A highly sought-after fashion and editorial photographer. Sanjana has shot cover pages and campaign shoots for top commercial brands. She specializes in studio setups, studio portraiture, product styling, and high-fashion modeling portfolios. Her signature edits focus on clean aesthetics and vibrant pastel colors.",
    location: "Gachibowli, Hyderabad",
    rating: "4.8",
    reviews: 245,
    shoots: "95+",
    followers: "8.5K",
    experience: "5+ Years",
    startingPrice: 3000,
    instaUrl: "https://instagram.com/sanjanaroy.photography",
    isVerified: true
  },
  {
    id: "p-mock-3",
    name: "Kabir Singh",
    role: "photographer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    bio: "Documentary and travel photographer who focuses on candid, photojournalistic wedding photography and street narratives. Kabir is always on the move, capturing landscapes and cultural events. He believes in minimal interference, documenting weddings and occasions as they unfold naturally without stiff poses.",
    location: "Banjara Hills, Hyderabad",
    rating: "4.9",
    reviews: 188,
    shoots: "150+",
    followers: "24K",
    experience: "9+ Years",
    startingPrice: 2000,
    instaUrl: "https://instagram.com/kabirsingh_wildlife",
    isVerified: true
  },
  {
    id: "p-mock-4",
    name: "Meera Nair",
    role: "photographer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    bio: "Fine art portrait and couples photographer. Creating beautiful lighting setups and capturing intimate, candid moments. Specializing in sunset golden hour photography and outdoor couples sessions.",
    location: "Begumpet, Hyderabad",
    rating: "4.9",
    reviews: 110,
    shoots: "110+",
    followers: "15K",
    experience: "6+ Years",
    startingPrice: 2200,
    instaUrl: "https://instagram.com/meeranair_photography",
    isVerified: true
  },
  {
    id: "p-mock-5",
    name: "Rohan Mehta",
    role: "photographer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    bio: "Commercial, architectural and interior photographer. Helping hotels, brands, and realtors display their spaces with grand lighting layouts and clean symmetry.",
    location: "Secunderabad, TS",
    rating: "4.7",
    reviews: 85,
    shoots: "85+",
    followers: "5.2K",
    experience: "4+ Years",
    startingPrice: 3500,
    instaUrl: "https://instagram.com/rohanmehta_frames",
    isVerified: false
  },
  {
    id: "p-mock-6",
    name: "Ananya Rao",
    role: "photographer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    bio: "Specialist in baby, kids, and maternal portraiture. Friendly, patient, and operates out of a cozy child-safe studio with cute props and colorful background layers.",
    location: "Kondapur, Hyderabad",
    rating: "4.9",
    reviews: 140,
    shoots: "140+",
    followers: "9.8K",
    experience: "7+ Years",
    startingPrice: 1800,
    instaUrl: "https://instagram.com/ananyarao_babyportraits",
    isVerified: true
  }
];

// Curated high quality portfolio images for slides and grid
const portfolioImages = [
  { url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80", caption: "Premium Pre-Wedding Ceremony Shoot" },
  { url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80", caption: "Traditional Indian Wedding Candid Portrait" },
  { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80", caption: "Couple Dance Reception Event" },
  { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80", caption: "Fine Art Fashion Portraiture" },
  { url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80", caption: "Outdoor Cinematic Modeling Session" },
  { url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80", caption: "Studio Gear & Lighting Setup Demo" }
];

const mockReviews = [
  {
    id: 1,
    name: "Nikhil & Anusha",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
    rating: 5,
    date: "2 weeks ago",
    text: "We booked him for our pre-wedding shoot in Hyderabad. He was absolutely amazing! He made us feel so comfortable and captured the most beautiful candid emotions. The Same Day Preview photos blew our minds."
  },
  {
    id: 2,
    name: "Karan Johar",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
    rating: 5,
    date: "1 month ago",
    text: "Extremely professional, prompt, and creative. The choice of angles and lighting layouts for our corporate launch were top-notch. Highly recommended for premium brands looking for top-tier visual representation."
  },
  {
    id: 3,
    name: "Priyanka Sen",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80",
    rating: 4,
    date: "2 months ago",
    text: "Fabulous fashion shoot. Very patient and knows exactly how to direct poses. The final edited album is absolutely gorgeous."
  }
];

const PhotographerProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profiles, openDetails, likedItems, toggleLike, triggerToast } = useAppContext();
  
  const [activeSlide, setActiveSlide] = useState(0);
  const [showFullBio, setShowFullBio] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('hourly');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);

  // Auto-scroll logic for slider
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % portfolioImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Retrieve matching photographer
  const photographer = useMemo(() => {
    const matched = profiles.find(p => p.id === id || p._id === id);
    if (matched) {
      return {
        ...matched,
        reviews: matched.reviews || 500,
        shoots: matched.shoots || "150+",
        followers: matched.followers || "24K",
        experience: matched.experience || "8+ Years",
        startingPrice: matched.startingPrice || 2000,
        instaUrl: matched.instaUrl || "https://instagram.com/pickmyshoot",
        isVerified: matched.isVerified !== undefined ? matched.isVerified : true
      };
    }
    // Fallback search in fallback list
    const mockMatched = fallbackPhotographers.find(p => p.id === id);
    return mockMatched || fallbackPhotographers[0];
  }, [profiles, id]);

  const priceVal = photographer.startingPrice || 2000;

  // Calculate pricing packages dynamically
  const packages = {
    hourly: {
      name: "Hourly Session",
      desc: "Perfect for quick portrait sessions, custom events or headshots.",
      price: priceVal,
      unit: "/hr"
    },
    halfDay: {
      name: "Half Day Package (4 Hours)",
      desc: "Ideal for pre-wedding shoots, fashion model portfolios & corporate events.",
      price: priceVal * 3.5, // Discounted rate
      unit: " flat"
    },
    fullDay: {
      name: "Full Day Package (8 Hours)",
      desc: "Complete coverage of weddings, events or multi-set studio sessions.",
      price: priceVal * 6.5, // Bulk discount
      unit: " flat"
    }
  };

  const handleBookNow = () => {
    // Open standard AppContext booking modal by converting photographer to service format
    const bookingItem = {
      id: photographer.id || photographer._id,
      title: `${photographer.name} — ${packages[selectedPackage].name}`,
      price: packages[selectedPackage].price,
      image: photographer.avatar,
      ownerId: photographer.id || photographer._id,
      location: photographer.location,
      rating: photographer.rating,
      reviews: photographer.reviews
    };
    
    // Open details modal which triggers scheduling
    openDetails(bookingItem, 'service');
  };

  const handleSocialClick = (platform) => {
    triggerToast(`Opening photographer's ${platform}...`);
  };

  const openLightbox = (index) => {
    setLightboxImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="photographer-profile-container">
      
      {/* Breadcrumbs */}
      <div className="profile-breadcrumb">
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
        <ChevronRight size={12} />
        <Link to="/explore" style={{ color: 'inherit', textDecoration: 'none' }}>Photographers</Link>
        <ChevronRight size={12} />
        <span>{photographer.name}</span>
      </div>

      {/* Main Two Column Layout */}
      <div className="profile-main-layout">
        
        {/* Left Column: Media & details */}
        <div className="profile-left-col">
          
          {/* Top Info Banner Card */}
          <div className="photographer-header-card">
            <div className="header-top-row">
              <div className="header-meta-info">
                {photographer.isVerified && (
                  <div className="verified-badge-wrap red-accent">
                    <Award size={12} style={{ marginRight: '4px' }} /> Verified Photographer
                  </div>
                )}
                <h1 className="photographer-name-title">{photographer.name}</h1>
                <div className="location-row">
                  <MapPin size={15} color="#e53935" />
                  <span>{photographer.location}</span>
                </div>
              </div>

              <div className="avatar-container-large">
                <img src={photographer.avatar} className="avatar-large-img" alt={photographer.name} />
                <span className="available-online-dot"></span>
              </div>
            </div>

            <div className="status-badge-row">
              <span className="badge-pill-item available-today">
                <Clock size={13} /> Available Today
              </span>
              <span className="badge-pill-item responses">
                ⚡ Responds within 15 mins
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto', fontSize: '13px', fontWeight: '700' }}>
                <Star size={14} fill="#ffaa00" color="#ffaa00" />
                <span>{photographer.rating || '4.9'}</span>
                <span style={{ color: '#9ca3af', fontWeight: '500' }}>({photographer.reviews} reviews)</span>
              </div>
            </div>
          </div>

          {/* Large Image Portfolio Gallery Slider */}
          <div className="portfolio-slider-container">
            {portfolioImages.map((image, idx) => (
              <div 
                key={idx} 
                className="portfolio-slide-item" 
                style={{ display: activeSlide === idx ? 'block' : 'none' }}
              >
                <img src={image.url} className="portfolio-slide-img" alt={image.caption} onClick={() => openLightbox(idx)} />
              </div>
            ))}
            
            {/* Slider Navigation */}
            <button 
              className="slider-navigation-btn prev-btn" 
              onClick={(e) => {
                e.stopPropagation();
                setActiveSlide(prev => (prev - 1 + portfolioImages.length) % portfolioImages.length);
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              className="slider-navigation-btn next-btn"
              onClick={(e) => {
                e.stopPropagation();
                setActiveSlide(prev => (prev + 1) % portfolioImages.length);
              }}
            >
              <ChevronRight size={20} />
            </button>

            {/* Slider Pagination */}
            <div className="slider-pagination-dots">
              {portfolioImages.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`slider-pagination-dot ${activeSlide === idx ? 'active-dot' : ''}`}
                  onClick={() => setActiveSlide(idx)}
                />
              ))}
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="stats-cards-row">
            <div className="stat-item-block">
              <span className="stat-num-val">{photographer.shoots || '150+'}</span>
              <span className="stat-label-text">Shoots</span>
            </div>
            <div className="stat-item-block">
              <span className="stat-num-val">{photographer.followers || '24K'}</span>
              <span className="stat-label-text">Followers</span>
            </div>
            <div className="stat-item-block">
              <span className="stat-num-val">{photographer.rating || '4.9'} ★</span>
              <span className="stat-label-text">Avg Rating</span>
            </div>
            <div className="stat-item-block">
              <span className="stat-num-val">{photographer.experience || '8+ Years'}</span>
              <span className="stat-label-text">Experience</span>
            </div>
          </div>

          {/* Specialization Chips */}
          <div className="profile-section-card">
            <h3 className="section-card-title">Specializations</h3>
            <div className="chips-wrap-list">
              {["Wedding", "Pre-Wedding", "Birthday", "Maternity", "Fashion", "Corporate", "Product Photography"].map((chip, idx) => (
                <span key={idx} className="specialty-chip-item">{chip}</span>
              ))}
            </div>
          </div>

          {/* About Biography Section */}
          <div className="profile-section-card">
            <h3 className="section-card-title">About Photographer</h3>
            <p className="bio-desc-text">
              {showFullBio 
                ? photographer.bio 
                : `${photographer.bio.slice(0, 160)}...`}
            </p>
            <button className="read-more-toggle-btn" onClick={() => setShowFullBio(!showFullBio)}>
              {showFullBio ? 'Read Less' : 'Read More'}
            </button>
          </div>

          {/* Services Included */}
          <div className="profile-section-card">
            <h3 className="section-card-title">Services Included</h3>
            <div className="services-checkbox-grid">
              {[
                "Photo Editing / Color Grading",
                "Drone Aerial Photography",
                "Custom Album Design",
                "All Raw Unedited Photos",
                "Same Day Preview Slides"
              ].map((service, idx) => (
                <div key={idx} className="included-service-item">
                  <Check size={16} className="check-icon-green" />
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment Section */}
          <div className="profile-section-card">
            <h3 className="section-card-title">Equipment List</h3>
            <div className="equipment-list-row">
              {[
                { name: "Sony Alpha A7 IV", icon: <Camera size={14} /> },
                { name: "Canon EOS R6 Mark II", icon: <Camera size={14} /> },
                { name: "DJI Mavic 3 Pro Cine", icon: <Video size={14} /> },
                { name: "Godox Professional Lighting Kit", icon: <Layers size={14} /> }
              ].map((item, idx) => (
                <div key={idx} className="equipment-badge-card">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Responsive Portfolio Grid (6 Images) */}
          <div className="profile-section-card">
            <h3 className="section-card-title">Recent Portfolio Grid</h3>
            <div className="portfolio-grid-layout">
              {portfolioImages.map((image, idx) => (
                <div key={idx} className="portfolio-grid-card" onClick={() => openLightbox(idx)}>
                  <img src={image.url} className="portfolio-grid-img" alt={image.caption} />
                  <div className="portfolio-grid-hover-overlay">
                    <span className="portfolio-overlay-text">{image.caption.split(' ')[0]}</span>
                    <Share2 size={14} color="#ffffff" />
                  </div>
                </div>
              ))}
            </div>
            <button className="view-all-portfolio-btn" onClick={() => openLightbox(0)}>
              View All 15 Portfolio Photos <ChevronRight size={14} />
            </button>
          </div>

          {/* Client Reviews Section */}
          <div className="profile-section-card">
            <h3 className="section-card-title">Client Reviews ({photographer.reviews} Verified)</h3>
            <div className="reviews-scroller-box">
              {mockReviews.map(review => (
                <div key={review.id} className="customer-review-card">
                  <div className="review-author-row">
                    <div className="review-author-profile">
                      <img src={review.avatar} className="review-author-avatar" alt={review.name} />
                      <div>
                        <span className="review-author-name">{review.name}</span>
                        <span className="review-date-text">{review.date}</span>
                      </div>
                    </div>
                    <div className="rating-stars-list">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={13} fill="#ffaa00" color="#ffaa00" />
                      ))}
                    </div>
                  </div>
                  <p className="review-desc-quote">"{review.text}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Embedded Map Section */}
          <div className="profile-section-card" style={{ borderBottom: 'none' }}>
            <h3 className="section-card-title">Location & Travel Radius</h3>
            <div className="map-embed-wrapper">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15228.384661448651!2d78.39994326589308!3d17.407238260787167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb96df69cc2f67%3A0x6e9f5bb64c7e4cc4!2sJubilee%20Hills%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map location"
              ></iframe>
            </div>
            <div className="map-radius-overlay-info">
              <AlertCircle size={16} />
              <span>Available for shoots within 50 km radius of {photographer.location.split(',')[0]} (Travel fees apply outside standard area)</span>
            </div>
          </div>

        </div>

        {/* Right Column: Sticky booking card */}
        <div className="profile-right-col">
          
          <div className="sticky-pricing-card">
            <div className="booking-card-price-row">
              <span className="booking-rate-num">₹{packages[selectedPackage].price.toLocaleString('en-IN')}</span>
              <span className="booking-rate-unit">{packages[selectedPackage].unit}</span>
            </div>

            {/* Packages Selector */}
            <div className="booking-packages-selection">
              {Object.keys(packages).map((key) => {
                const pkg = packages[key];
                return (
                  <div 
                    key={key} 
                    className={`booking-package-radio-option ${selectedPackage === key ? 'selected' : ''}`}
                    onClick={() => setSelectedPackage(key)}
                  >
                    <div className="package-label-wrap">
                      <span className="package-name-title">{pkg.name}</span>
                      <span className="package-features-subtitle">{pkg.desc}</span>
                    </div>
                    <span className="package-price-value">₹{pkg.price.toLocaleString('en-IN')}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <button className="booking-submit-cta-btn" onClick={handleBookNow}>
              Book Photographer Now
            </button>

            <div className="social-buttons-flex-row">
              <a 
                href={`https://wa.me/919999988888?text=Hi%20${encodeURIComponent(photographer.name)},%20I%20found%20your%20profile%20on%20PickMyShoot%20and%20would%20like%20to%20book%20a%20shoot!`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-action-btn-item whatsapp-btn"
                onClick={() => handleSocialClick('WhatsApp')}
              >
                <MessageSquare size={14} /> WhatsApp
              </a>
              <a 
                href={photographer.instaUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-action-btn-item instagram-btn"
                onClick={() => handleSocialClick('Instagram')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style={{ marginRight: '6px' }}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> Instagram
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* Lightbox / View All Photos Overlay Modal */}
      {lightboxOpen && (
        <div className="lightbox-modal-overlay" onClick={() => setLightboxOpen(false)}>
          <div className="lightbox-modal-body" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={() => setLightboxOpen(false)}>
              <X size={20} />
            </button>
            <div className="lightbox-image-wrap">
              <img 
                src={portfolioImages[lightboxImageIndex].url} 
                className="lightbox-main-img" 
                alt="Enlarged Portfolio Frame" 
              />
            </div>
            <p className="lightbox-caption-text">
              {portfolioImages[lightboxImageIndex].caption} ({lightboxImageIndex + 1} / {portfolioImages.length})
            </p>
            
            <button 
              className="slider-navigation-btn prev-btn" 
              style={{ left: '-60px', background: 'rgba(255,255,255,0.15)', color: '#fff' }}
              onClick={() => setLightboxImageIndex(prev => (prev - 1 + portfolioImages.length) % portfolioImages.length)}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              className="slider-navigation-btn next-btn"
              style={{ right: '-60px', background: 'rgba(255,255,255,0.15)', color: '#fff' }}
              onClick={() => setLightboxImageIndex(prev => (prev + 1) % portfolioImages.length)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar for Mobile viewports */}
      <div className="sticky-bottom-mobile-cta">
        <div className="mobile-cta-flex-row">
          <div className="mobile-cta-price-col">
            <span className="mobile-price-val">₹{packages[selectedPackage].price.toLocaleString('en-IN')}</span>
            <span className="mobile-price-lbl">{packages[selectedPackage].name.split(' ')[0]} RATE</span>
          </div>

          <div className="mobile-action-buttons-wrap">
            <a 
              href={`tel:+919999988888`} 
              className="mobile-quick-action-icon-btn"
              onClick={() => handleSocialClick('Call')}
            >
              <Phone size={16} />
            </a>
            <a 
              href={`https://wa.me/919999988888?text=Hi%2520${encodeURIComponent(photographer.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-quick-action-icon-btn"
              onClick={() => handleSocialClick('WhatsApp')}
            >
              <MessageSquare size={16} />
            </a>
            <button className="mobile-main-book-btn" onClick={handleBookNow}>
              Book Now
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PhotographerProfilePage;
