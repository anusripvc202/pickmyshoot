import React, { useState, useEffect } from 'react';
import { 
  X, 
  Briefcase, 
  Camera, 
  Building2, 
  User, 
  Sparkles, 
  MapPin, 
  IndianRupee, 
  Info,
  CheckCircle,
  FileText
} from 'lucide-react';

const PublishListingModal = ({ isOpen, onClose, post, onPublish }) => {
  if (!isOpen || !post) return null;

  // Selected Listing Category/Type
  const [category, setCategory] = useState('jobs'); // 'jobs' | 'services' | 'studios' | 'models' | 'gear'

  // Common fields
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState('hr');
  const [location, setLocation] = useState('Hyderabad, TS');
  const [description, setDescription] = useState('');

  // Category specific fields
  // Jobs & Gigs
  const [company, setCompany] = useState('');
  const [skills, setSkills] = useState('');

  // Photography Services
  const [specialization, setSpecialization] = useState('Wedding Photography');
  const [experience, setExperience] = useState('2 years');

  // Studios & Locations
  const [area, setArea] = useState('1500 Sq.ft');
  const [capacity, setCapacity] = useState('15 Capacity');
  const [amenities, setAmenities] = useState('AC, Lighting Setup, Makeup Room');

  // Models & Talents
  const [gender, setGender] = useState('Female');
  const [height, setHeight] = useState("5'7\"");
  const [modelCategories, setModelCategories] = useState('Fashion, Commercial');

  // Gear Rentals
  const [gearCategory, setGearCategory] = useState('Camera');
  const [includes, setIncludes] = useState('Standard Case, 2x Batteries, Charger');

  // Initialize fields with post details
  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setDescription(post.description || post.category || `Premium showcase of ${post.title}`);
      
      // Smart defaults based on post category
      const pc = (post.category || '').toLowerCase();
      if (pc.includes('wedding') || pc.includes('bridal') || pc.includes('ethnic')) {
        setCategory('services');
        setSpecialization('Wedding Photography');
      } else if (pc.includes('product') || pc.includes('commercial')) {
        setCategory('services');
        setSpecialization('Product Shoot');
      } else if (pc.includes('fashion') || pc.includes('western') || pc.includes('editorial')) {
        setCategory('services');
        setSpecialization('Fashion Photography');
      } else if (pc.includes('studio') || pc.includes('fine art')) {
        setCategory('studios');
      } else if (pc.includes('nature') || pc.includes('cinematography')) {
        setCategory('services');
        setSpecialization('Cinematography');
      } else {
        setCategory('jobs'); // default for client reference posts
      }
    }
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !price || !description) {
      alert("Please fill in all required fields.");
      return;
    }

    const priceVal = parseFloat(price);
    if (isNaN(priceVal)) {
      alert("Please enter a valid price number.");
      return;
    }

    // Map selected category to DB listing type
    const typeMap = {
      jobs: 'job',
      services: 'service',
      studios: 'studio',
      models: 'model',
      gear: 'gear'
    };

    const listingData = {
      id: `promoted-${Date.now()}`,
      title,
      type: typeMap[category],
      price: priceVal,
      priceUnit,
      location,
      description,
      image: post.image,
      rating: 5.0,
      reviews: 1,
      active: true,
      promotedFromPostId: post.id
    };

    // Category specific additions
    if (category === 'jobs') {
      listingData.company = company || 'Independent Hirer';
      listingData.skills = skills ? skills.split(',').map(s => s.trim()) : ['Photography'];
      listingData.type = 'Project / Freelance';
    } else if (category === 'services') {
      listingData.specialization = specialization;
      listingData.experience = experience;
      listingData.category = specialization;
      listingData.amenities = [specialization, 'Edited Deliverables', 'Professional Gear'];
    } else if (category === 'studios') {
      listingData.area = area;
      listingData.capacity = capacity;
      listingData.amenities = amenities ? amenities.split(',').map(a => a.trim()) : ['AC', 'Lighting Setup'];
      listingData.features = ['Verified Venue'];
    } else if (category === 'models') {
      listingData.gender = gender;
      listingData.height = height;
      listingData.categories = modelCategories ? modelCategories.split(',').map(c => c.trim()) : ['Fashion'];
    } else if (category === 'gear') {
      listingData.category = gearCategory;
      listingData.specs = description;
      listingData.includes = includes;
    }

    onPublish(listingData);
    onClose();
  };

  return (
    <div className="profile-modal-overlay" style={{ zIndex: 99999 }} onClick={onClose}>
      <div className="profile-modal-body publish-listing-modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--primary)" />
            <h3 className="section-title-pro" style={{ margin: 0 }}>Promote Post to Job / Grid</h3>
          </div>
          <button className="close-modal-btn" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Post Preview Summary */}
        <div className="promoted-post-preview-summary">
          <img src={post.image} alt={post.title} className="preview-mini-img" />
          <div className="preview-mini-info">
            <span className="preview-label">POST REFERENCE</span>
            <h4 className="preview-title">{post.title}</h4>
            <span className="preview-category">{post.category || 'Portfolio Shot'}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="publish-listing-form">
          {/* Category Selector Grid */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontWeight: '700' }}>Target Section / Grid Category</label>
            <div className="category-pill-grid">
              <div 
                className={`category-selection-pill ${category === 'jobs' ? 'active' : ''}`}
                onClick={() => setCategory('jobs')}
              >
                <Briefcase size={14} />
                <span>Jobs & Gigs</span>
              </div>
              <div 
                className={`category-selection-pill ${category === 'services' ? 'active' : ''}`}
                onClick={() => setCategory('services')}
              >
                <Camera size={14} />
                <span>Shoot Services</span>
              </div>
              <div 
                className={`category-selection-pill ${category === 'studios' ? 'active' : ''}`}
                onClick={() => setCategory('studios')}
              >
                <Building2 size={14} />
                <span>Studios</span>
              </div>
              <div 
                className={`category-selection-pill ${category === 'models' ? 'active' : ''}`}
                onClick={() => setCategory('models')}
              >
                <User size={14} />
                <span>Models & Talent</span>
              </div>
              <div 
                className={`category-selection-pill ${category === 'gear' ? 'active' : ''}`}
                onClick={() => setCategory('gear')}
              >
                <Camera size={14} />
                <span>Gear Rentals</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Title & Location Row */}
            <div className="form-group-row">
              <div className="form-group">
                <label className="form-label">Listing Title <span style={{ color: 'var(--primary)' }}>*</span></label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="form-input-pro"
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={13} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    className="form-input-pro"
                    style={{ paddingLeft: '32px' }}
                  />
                </div>
              </div>
            </div>

            {/* Price & Unit Row */}
            <div className="form-group-row">
              <div className="form-group">
                <label className="form-label">Pricing / Rate (₹) <span style={{ color: 'var(--primary)' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '10px', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>₹</span>
                  <input 
                    type="number" 
                    placeholder="e.g. 5000" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    className="form-input-pro"
                    style={{ paddingLeft: '24px' }}
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Price Unit</label>
                <select 
                  value={priceUnit} 
                  onChange={(e) => setPriceUnit(e.target.value)} 
                  className="form-input-pro"
                >
                  <option value="hr">per Hour</option>
                  <option value="day">per Day</option>
                  <option value="session">per Session</option>
                  <option value="flat">Flat Package</option>
                  <option value="month">per Month (Job Salary)</option>
                </select>
              </div>
            </div>

            {/* Dynamic Inputs Based on Category Selection */}
            {category === 'jobs' && (
              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">Company / Brand Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. EditX Studios" 
                    value={company} 
                    onChange={(e) => setCompany(e.target.value)}
                    className="form-input-pro"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Required Skills (Comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Lightroom, Strobes, Color Grading" 
                    value={skills} 
                    onChange={(e) => setSkills(e.target.value)}
                    className="form-input-pro"
                  />
                </div>
              </div>
            )}

            {category === 'services' && (
              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">Specialization Category</label>
                  <select 
                    value={specialization} 
                    onChange={(e) => setSpecialization(e.target.value)} 
                    className="form-input-pro"
                  >
                    <option value="Wedding Photography">Wedding Photography</option>
                    <option value="Fashion Photography">Fashion Photography</option>
                    <option value="Product Shoot">Product Shoot</option>
                    <option value="Cinematography">Cinematography</option>
                    <option value="Event Coverage">Event Coverage</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Experience Level</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 3 years" 
                    value={experience} 
                    onChange={(e) => setExperience(e.target.value)}
                    className="form-input-pro"
                  />
                </div>
              </div>
            )}

            {category === 'studios' && (
              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">Studio Specs (Area / Capacity)</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="e.g. 1500 Sq.ft" 
                      value={area} 
                      onChange={(e) => setArea(e.target.value)}
                      className="form-input-pro"
                    />
                    <input 
                      type="text" 
                      placeholder="e.g. 15 Capacity" 
                      value={capacity} 
                      onChange={(e) => setCapacity(e.target.value)}
                      className="form-input-pro"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Amenities (Comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. AC, Backdrops, Changing Room" 
                    value={amenities} 
                    onChange={(e) => setAmenities(e.target.value)}
                    className="form-input-pro"
                  />
                </div>
              </div>
            )}

            {category === 'models' && (
              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">Gender & Height</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select 
                      value={gender} 
                      onChange={(e) => setGender(e.target.value)} 
                      className="form-input-pro"
                      style={{ flex: 1 }}
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Any">Any</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="e.g. 5ft 7in" 
                      value={height} 
                      onChange={(e) => setHeight(e.target.value)}
                      className="form-input-pro"
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Model Categories (Comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Fashion, Bridal, Editorial" 
                    value={modelCategories} 
                    onChange={(e) => setModelCategories(e.target.value)}
                    className="form-input-pro"
                  />
                </div>
              </div>
            )}

            {category === 'gear' && (
              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">Equipment Category</label>
                  <select 
                    value={gearCategory} 
                    onChange={(e) => setGearCategory(e.target.value)} 
                    className="form-input-pro"
                  >
                    <option value="Camera">Camera Body</option>
                    <option value="Lens">Lens</option>
                    <option value="Lights">Lighting Gear</option>
                    <option value="Audio">Audio / Mic</option>
                    <option value="Stabilizers">Gimbals & Stabilizers</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Included Accessories</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Charger, 2 Batteries, Case" 
                    value={includes} 
                    onChange={(e) => setIncludes(e.target.value)}
                    className="form-input-pro"
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Listing Description <span style={{ color: 'var(--primary)' }}>*</span></label>
              <textarea 
                rows="3" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="form-input-pro"
                style={{ resize: 'vertical' }}
                required 
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer-actions" style={{ marginTop: '20px' }}>
            <button type="button" className="modal-cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="pro-btn-primary theme-btn-photographer">
              <CheckCircle size={14} style={{ marginRight: '6px' }} />
              <span>Publish Listing Now</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishListingModal;
