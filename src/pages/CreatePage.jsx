import React, { useState } from 'react';
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
  Sparkles,
  Lightbulb,
  Upload
} from 'lucide-react';

const CreatePage = () => {
  const {
    setServices,
    setStudios,
    setModels,
    setGear,
    setJobs,
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
  // Photography-specific fields
  const [newSpecialization, setNewSpecialization] = useState('Wedding Photography');
  const [newExperience, setNewExperience] = useState('');
  const [newPortfolio, setNewPortfolio] = useState('');
  // Job-specific fields
  const [newCompany, setNewCompany] = useState('');
  const [newSkills, setNewSkills] = useState('');
  const [newJobType, setNewJobType] = useState('Full Time');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 4.5 * 1024 * 1024) {
      triggerToast('Please upload an image smaller than 4.5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newDescription) {
      triggerToast("Please fill in all required fields!");
      return;
    }

    const priceVal = newCategory === 'jobs' ? newPrice : parseFloat(newPrice);
    const generatedId = `custom-${Date.now()}`;
    const defaultImg = newImage || (newCategory === 'jobs' 
      ? "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80"
      : "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=500&q=80");

    // Map frontend category to DB type value
    const typeMap = { 
      studios: 'studio', 
      gear: 'gear', 
      models: 'model', 
      services: 'service', 
      photography: 'service',
      makeup: 'service',
      lighting: 'gear',
      locations: 'studio',
      jobs: 'job'
    };

    const newItem = {
      id: generatedId,
      title: newTitle,
      type: typeMap[newCategory] || 'service',
      price: priceVal,
      priceUnit: newPriceUnit,
      rating: 5.0,
      reviews: 1,
      location: newLocation || "Hyderabad",
      description: newDescription,
      image: defaultImg,
      amenities: ["Verified Provider", "Professional Service"],
      features: ["Verified"],
      specs: newDescription,
      ownerId: activeProfileId,
      creatorId: activeProfileId,
      active: true
    };

    if (newCategory === 'studios' || newCategory === 'locations') {
      newItem.area = "1200 Sq.ft";
      newItem.capacity = "10 Capacity";
      newItem.amenities = newCategory === 'locations' ? ["Outdoor Set", "Changing Room"] : ["Lighting Equipment", "Backdrops", "Makeup Room"];
      setStudios(prev => [newItem, ...prev]);
      setExploreTab('studios');
    } else if (newCategory === 'models') {
      newItem.gender = "Female";
      newItem.height = "5'7\"";
      newItem.categories = ["Fashion", "Ethnic"];
      setModels(prev => [newItem, ...prev]);
      setExploreTab('models');
    } else if (newCategory === 'gear' || newCategory === 'lighting') {
      newItem.category = newCategory === 'lighting' ? "Lights" : "Camera";
      newItem.includes = "Standard kit and accessories";
      setGear(prev => [newItem, ...prev]);
      setExploreTab('rentals');
    } else if (newCategory === 'makeup') {
      newItem.category = "Makeup & Styling";
      newItem.amenities = ["Makeup Room", "Styling Kit", "Professional Cosmetics"];
      setServices(prev => [newItem, ...prev]);
      setExploreTab('services');
    } else if (newCategory === 'photography') {
      newItem.specialization = newSpecialization;
      newItem.experience = newExperience ? `${newExperience} years` : 'Not specified';
      newItem.portfolio = newPortfolio;
      newItem.category = newSpecialization;
      newItem.amenities = [newSpecialization, 'Professional Gear', 'Edited Deliverables'];
      setServices(prev => [newItem, ...prev]);
      setExploreTab('services');
    } else if (newCategory === 'jobs') {
      newItem.company = newCompany || "Independent Recruiter";
      newItem.skills = newSkills ? newSkills.split(',').map(s => s.trim()) : ["Video Editing"];
      newItem.jobType = newJobType || "Full Time";
      setJobs(prev => [newItem, ...prev]);
      setExploreTab('jobs');
    } else {
      setServices(prev => [newItem, ...prev]);
      setExploreTab('services');
    }

    // ✅ Save to MongoDB Atlas via /api/listings
    fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    })
      .then(res => res.json())
      .then(saved => console.log('Listing saved to DB:', saved._id))
      .catch(err => console.warn('Failed to sync listing to DB:', err));

    triggerToast(`Listing published: "${newTitle}"`);
    
    // Reset Form
    setNewTitle('');
    setNewPrice('');
    setNewDescription('');
    setNewImage('');
    setNewExperience('');
    setNewPortfolio('');
    setNewCompany('');
    setNewSkills('');
    setNewJobType('Full Time');
    
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
                  { id: 'photography', label: 'Photography Services', icon: Camera, desc: 'List yourself as a photographer' },
                  { id: 'makeup', label: 'Makeup & Styling', icon: Sparkles, desc: 'Professional MUAs & hair stylists' },
                  { id: 'lighting', label: 'Lighting & Props', icon: Lightbulb, desc: 'Studio flashes, modifiers & props' },
                  { id: 'locations', label: 'Shooting Locations', icon: MapPin, desc: 'Resorts, villas & outdoor sets' },
                  { id: 'services', label: 'Shoot Package', icon: Video, desc: 'Post production & editing' },
                  { id: 'jobs', label: 'Jobs & Gigs', icon: FileText, desc: 'Post job offers and freelance gigs' }
                ].map(cat => {
                  const Icon = cat.icon;
                  const isActive = newCategory === cat.id;
                  return (
                    <div 
                      key={cat.id} 
                      className={`category-select-card ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        setNewCategory(cat.id);
                        if (cat.id === 'studios' || cat.id === 'locations') setNewPriceUnit('hr');
                        else if (cat.id === 'gear' || cat.id === 'lighting') setNewPriceUnit('day');
                        else if (cat.id === 'models') setNewPriceUnit('day');
                        else if (cat.id === 'jobs') setNewPriceUnit('month');
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
              <label className="form-label">{newCategory === 'jobs' ? 'Job Title / Role *' : 'Asset Title / Name *'}</label>
              <div className="input-with-icon-wrap">
                <div className="input-icon-left"><FileText size={16} /></div>
                <input 
                  type="text" 
                  placeholder={newCategory === 'jobs' ? "e.g. Video Editor, Fashion Photographer, Production Manger" : "e.g. Industrial Warehouse Space Banjara Hills, Canon EOS R5 Cinematic Package"} 
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
                <label className="form-label">{newCategory === 'jobs' ? 'Salary / Pay Rate *' : 'Pricing Rate (INR) *'}</label>
                <div className="input-with-icon-wrap">
                  <div className="input-icon-left"><IndianRupee size={16} /></div>
                  <input 
                    type="text" 
                    placeholder={newCategory === 'jobs' ? "e.g. ₹30K - ₹50K/Month, ₹15K - ₹25K/Project" : "e.g. 1500"} 
                    className="form-input-premium"
                    value={newPrice}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (newCategory === 'jobs' || val === '' || /^\d*\.?\d*$/.test(val)) {
                        setNewPrice(val);
                      }
                    }}
                    required
                  />
                </div>
              </div>

              {newCategory !== 'jobs' && (
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
              )}
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
                <label className="form-label">Gallery Cover Image</label>
                <div className="form-file-upload-wrap">
                  <label htmlFor="create-image-upload" className="form-file-upload-label">
                    <Upload size={16} />
                    <span>{newImage ? 'Change Photo' : 'Upload from Gallery'}</span>
                  </label>
                  <input 
                    id="create-image-upload"
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  {newImage && (
                    <div className="form-file-upload-status">
                      <span className="file-success-badge">✓ Image loaded successfully</span>
                      <button 
                        type="button" 
                        className="file-clear-btn" 
                        onClick={() => setNewImage('')}
                      >
                        Remove
                      </button>
                    </div>
                  )}
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

            {/* 6. Photography-specific fields (only shown for Photography Services) */}
            {newCategory === 'photography' && (
              <>
                <div className="form-group">
                  <label className="form-label">Photography Specialization *</label>
                  <div className="auth-input-wrap">
                    <select
                      className="auth-select-input"
                      value={newSpecialization}
                      onChange={(e) => setNewSpecialization(e.target.value)}
                    >
                      <option value="Wedding Photography">Wedding Photography</option>
                      <option value="Portrait Photography">Portrait Photography</option>
                      <option value="Fashion Photography">Fashion Photography</option>
                      <option value="Product Photography">Product Photography</option>
                      <option value="Event Photography">Event Photography</option>
                      <option value="Wildlife Photography">Wildlife Photography</option>
                      <option value="Aerial / Drone Photography">Aerial / Drone Photography</option>
                      <option value="Cinematography / Videography">Cinematography / Videography</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-premium">
                  <div className="form-group">
                    <label className="form-label">Years of Experience</label>
                    <div className="input-with-icon-wrap">
                      <div className="input-icon-left"><Star size={16} /></div>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="e.g. 5"
                        className="form-input-premium"
                        value={newExperience}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || /^\d*$/.test(val)) {
                            setNewExperience(val);
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Portfolio / Instagram URL</label>
                    <div className="input-with-icon-wrap">
                      <div className="input-icon-left"><Image size={16} /></div>
                      <input
                        type="url"
                        placeholder="https://instagram.com/yourhandle"
                        className="form-input-premium"
                        value={newPortfolio}
                        onChange={(e) => setNewPortfolio(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </>
            {/* Job-specific fields (only shown for Jobs & Gigs) */}
            {newCategory === 'jobs' && (
              <>
                <div className="form-row-premium">
                  <div className="form-group">
                    <label className="form-label">Company / Studio Name *</label>
                    <div className="input-with-icon-wrap">
                      <div className="input-icon-left"><Building2 size={16} /></div>
                      <input
                        type="text"
                        placeholder="e.g. EditX Studios"
                        className="form-input-premium"
                        value={newCompany}
                        onChange={(e) => setNewCompany(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Job Type</label>
                    <div className="auth-input-wrap">
                      <select
                        className="auth-select-input"
                        value={newJobType}
                        onChange={(e) => setNewJobType(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border)',
                          borderRadius: '10px',
                          padding: '12px 14px',
                          color: 'var(--text-main)',
                          outline: 'none',
                          fontSize: '13px',
                          height: '46px'
                        }}
                      >
                        <option value="Full Time">Full Time</option>
                        <option value="Part Time">Part Time</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Required Skills (Comma separated) *</label>
                  <div className="input-with-icon-wrap">
                    <div className="input-icon-left"><Sparkles size={16} /></div>
                    <input
                      type="text"
                      placeholder="e.g. Premiere Pro, After Effects, Sound Mixing"
                      className="form-input-premium"
                      value={newSkills}
                      onChange={(e) => setNewSkills(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

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
                  src={newImage || (newCategory === 'jobs' 
                    ? "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80"
                    : "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=500&q=80")} 
                  className="card-image" 
                  alt="Listing Sandbox Preview" 
                  onError={(e) => {
                    e.currentTarget.src = newCategory === 'jobs' 
                      ? "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80"
                      : "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=500&q=80";
                  }}
                />
                <span className="live-preview-tag">Live Sandbox</span>
              </div>
              
              <div className="card-info">
                <span className="card-title">{newTitle || (newCategory === 'jobs' ? "Job Title Displayed Here" : "Your Asset Title Displayed Here")}</span>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <div className="card-sub-info" style={{ marginTop: 0 }}>
                    <span className="card-price-label">{newCategory === 'jobs' ? 'Salary' : 'Rate'}</span>
                    <span className="card-price-value">
                      {newCategory === 'jobs' 
                        ? (newPrice || '₹30K - ₹50K/Month') 
                        : `₹${newPrice ? parseFloat(newPrice).toLocaleString('en-IN') : '0'}`}
                      {newCategory !== 'jobs' && (
                        <span style={{ fontSize: '11px', fontWeight: '500' }}>/{newPriceUnit}</span>
                      )}
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
