import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { 
  Building2, 
  Camera, 
  User, 
  Video, 
  FileText, 
  IndianRupee, 
  MapPin, 
  Image, 
  Edit3, 
  Star,
  Sparkles
} from 'lucide-react';

const CreatePage = () => {
  const {
    setServices,
    setStudios,
    setModels,
    setGear,
    setExploreTab,
    triggerToast,
    activeProfileId
  } = useAppContext();

  const navigate = useNavigate();

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('studios');
  const [newPrice, setNewPrice] = useState('');
  const [newPriceUnit, setNewPriceUnit] = useState('hr');
  const [newLocation, setNewLocation] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newDescription) {
      triggerToast("Please fill in all required fields!");
      return;
    }

    const priceVal = parseFloat(newPrice);
    const generatedId = `custom-${Date.now()}`;
    const defaultImg = newImage || "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=500&q=80";

    const newItem = {
      id: generatedId,
      title: newTitle,
      price: priceVal,
      priceUnit: newPriceUnit,
      rating: 5.0,
      reviews: 1,
      location: newLocation || "Hyderabad",
      description: newDescription,
      image: defaultImg,
      amenities: ["Verified Seller", "Premium Equipment"],
      features: ["Verified"],
      specs: newDescription,
      ownerId: activeProfileId,
      active: true
    };

    if (newCategory === 'studios') {
      newItem.area = "1000 Sq.ft";
      newItem.capacity = "10 People";
      setStudios(prev => [newItem, ...prev]);
      setExploreTab('studios');
    } else if (newCategory === 'models') {
      newItem.gender = "Female";
      newItem.height = "5'7\"";
      newItem.categories = ["Fashion", "Ethnic"];
      setModels(prev => [newItem, ...prev]);
      setExploreTab('models');
    } else if (newCategory === 'gear') {
      newItem.category = "Camera";
      newItem.includes = "Camera body, standard accessory kit";
      setGear(prev => [newItem, ...prev]);
      setExploreTab('rentals');
    } else {
      setServices(prev => [newItem, ...prev]);
      setExploreTab('services');
    }

    triggerToast(`Listing published: "${newTitle}"`);
    
    // Reset Form
    setNewTitle('');
    setNewPrice('');
    setNewDescription('');
    setNewImage('');
    
    navigate('/explore');
  };

  return (
    <div className="create-page-wrapper">
      
      {/* Left Column: Premium Form */}
      <div className="create-form-column">
        <div className="create-view-box">
          <div className="create-form-header">
            <span className="create-form-title">List Your Asset Live</span>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Publish your studio, models portfolio, camera gear, or creative service to receive bookings and inquiries.
            </p>
          </div>

          <form onSubmit={handleCreateSubmit} className="premium-form-layout">
            
            {/* 1. Category Selector Visual Grid */}
            <div className="form-group">
              <label className="form-label">Choose Asset Category *</label>
              <div className="category-select-grid">
                {[
                  { id: 'studios', label: 'Studio Space', icon: Building2, desc: 'Indoor stages & lots' },
                  { id: 'gear', label: 'Camera Gear', icon: Camera, desc: 'Cameras, lenses & kits' },
                  { id: 'models', label: 'Models Portfolio', icon: User, desc: 'Fashion talents' },
                  { id: 'services', label: 'Shoot Package', icon: Video, desc: 'Post production & photography' }
                ].map(cat => {
                  const Icon = cat.icon;
                  const isActive = newCategory === cat.id;
                  return (
                    <div 
                      key={cat.id} 
                      className={`category-select-card ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        setNewCategory(cat.id);
                        // Sensible default price units depending on category selection
                        if (cat.id === 'studios') setNewPriceUnit('hr');
                        else if (cat.id === 'gear') setNewPriceUnit('day');
                        else if (cat.id === 'models') setNewPriceUnit('day');
                        else setNewPriceUnit('booking');
                      }}
                    >
                      <div className="cat-select-icon"><Icon size={18} /></div>
                      <div className="cat-select-text">
                        <span className="cat-select-label">{cat.label}</span>
                        <span className="cat-select-desc">{cat.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Listing Title */}
            <div className="form-group">
              <label className="form-label">Asset Title / Name *</label>
              <div className="input-with-icon-wrap">
                <div className="input-icon-left"><FileText size={16} /></div>
                <input 
                  type="text" 
                  placeholder="e.g. Industrial Warehouse Space Banjara Hills, Canon EOS R5 Cinematic Package" 
                  className="form-input-premium"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* 3. Pricing Rate & Unit */}
            <div className="form-row-premium">
              <div className="form-group">
                <label className="form-label">Pricing Rate (INR) *</label>
                <div className="input-with-icon-wrap">
                  <div className="input-icon-left"><IndianRupee size={16} /></div>
                  <input 
                    type="number" 
                    placeholder="e.g. 1500" 
                    className="form-input-premium"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Billing Price Unit</label>
                <div className="billing-pill-group">
                  {[
                    { id: 'hr', label: 'Per Hour' },
                    { id: 'day', label: 'Per Day' },
                    { id: 'booking', label: 'Per Session' }
                  ].map(unit => {
                    const isActive = newPriceUnit === unit.id;
                    return (
                      <button
                        key={unit.id}
                        type="button"
                        className={`billing-pill-btn ${isActive ? 'active' : ''}`}
                        onClick={() => setNewPriceUnit(unit.id)}
                      >
                        {unit.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. Location & Image Cover */}
            <div className="form-row-premium">
              <div className="form-group">
                <label className="form-label">Asset Location (City/Area)</label>
                <div className="input-with-icon-wrap">
                  <div className="input-icon-left"><MapPin size={16} /></div>
                  <input 
                    type="text" 
                    placeholder="e.g. Madhapur, Hyderabad" 
                    className="form-input-premium"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">High-Resolution Image URL</label>
                <div className="input-with-icon-wrap">
                  <div className="input-icon-left"><Image size={16} /></div>
                  <input 
                    type="text" 
                    placeholder="Paste a direct image URL (or leave empty for default)" 
                    className="form-input-premium"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* 5. Description Inclusions */}
            <div className="form-group">
              <label className="form-label">Description &amp; Inclusions *</label>
              <div className="input-with-icon-wrap select-textarea">
                <div className="input-icon-left" style={{ top: '16px' }}><Edit3 size={16} /></div>
                <textarea 
                  placeholder="Describe dimensions, camera accessories, backdrops, lighting controls, modifiers, makeup rooms, or editing schedules included in this listing..." 
                  className="form-textarea-premium"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>

            <button type="submit" className="form-submit-premium-btn">
              Publish Listing live
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Live 3D Catalog Card Preview */}
      <div className="create-preview-column">
        <div className="preview-sticky-wrap">
          <div className="preview-header-tag">
            <Sparkles size={12} color="var(--primary)" />
            <span>Interactive Live Preview</span>
          </div>
          
          <div className="live-preview-card-outer">
            <div className="service-card preview-card-actual">
              <div className="card-img-wrap">
                <img 
                  src={newImage || "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=500&q=80"} 
                  className="card-image" 
                  alt="Listing Sandbox Preview" 
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=500&q=80";
                  }}
                />
                <span className="live-preview-tag">Live Sandbox</span>
              </div>
              
              <div className="card-info">
                <span className="card-title">{newTitle || "Your Asset Title Displayed Here"}</span>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <div className="card-sub-info" style={{ marginTop: 0 }}>
                    <span className="card-price-label">Rate</span>
                    <span className="card-price-value">
                      ₹{newPrice ? parseFloat(newPrice).toLocaleString('en-IN') : '0'}
                      <span style={{ fontSize: '11px', fontWeight: '500' }}>/{newPriceUnit}</span>
                    </span>
                  </div>
                  <span className="preview-loc-pill">
                    <MapPin size={10} style={{ marginRight: '2px' }} />
                    {newLocation || "Hyderabad"}
                  </span>
                </div>

                <div className="card-rating-row" style={{ marginTop: '8px' }}>
                  <Star size={11} className="card-rating-star" />
                  <span>5.0</span>
                  <span className="card-rating-count">(1 review • New Listing)</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="preview-instructions">
            <h5>💡 Real-Time Renderer</h5>
            <p>Your listing will display inside the catalog with interactive 3D perspective tilts and lifts exactly as previewed here.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CreatePage;
