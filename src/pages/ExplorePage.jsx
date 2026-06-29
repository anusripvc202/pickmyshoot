import React, { useState } from 'react';
import { Star, Heart, ChevronDown, ChevronUp, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ExplorePage = () => {
  const {
    services,
    studios,
    models,
    gear,
    workshops,
    jobs,
    searchQuery,
    setSearchQuery,
    exploreTab,
    setExploreTab,
    likedItems,
    toggleLike,
    openDetails
  } = useAppContext();

  // 1. Expanded/Collapsed state for left accordion filters
  const [expandedFilters, setExpandedFilters] = useState({
    categories: true,
    subtypes: true,
    context: true,
    price: true,
    ratings: true,
    location: true
  });

  // 2. Active filter states
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedSubtype, setSelectedSubtype] = useState(null);
  const [selectedContextTag, setSelectedContextTag] = useState(null); // contextual drill-down filter
  const [sortBy, setSortBy] = useState('popularity');
  
  // Mobile filter drawer visibility toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Contextual filters — shown when a specific subtype is selected
  const contextualFiltersMap = {
    // Photography Services
    'Product Photography':     { label: 'Shoot Style',      options: ['White Background', 'Lifestyle Setup', 'Flat Lay', 'Packaging', '360° Product'] },
    'Pre Wedding Shoot':       { label: 'Location Theme',   options: ['Outdoor / Nature', 'Indoor Studio', 'Beach', 'Garden', 'Mountains'] },
    'Wedding Shoot':           { label: 'Wedding Theme',    options: ['Traditional Ceremony', 'Candid Wedding', 'Reception Coverage', 'Bridal Portrait', 'Pre-Wedding Event'] },
    'Baby Photoshoot':         { label: 'Session Type',     options: ['Newborn (0–4 wks)', '3–6 Months', 'Cake Smash', 'Indoor Studio', 'Outdoor'] },
    'Real Estate Photography': { label: 'Property Type',   options: ['Apartment', 'Villa / Bungalow', 'Office Space', 'Commercial', 'Aerial HDR'] },
    'Reels & Social Media Shoot': { label: 'Platform',     options: ['Instagram Reels', 'TikTok', 'YouTube Shorts', 'LinkedIn'] },
    'Maternity Shoot':         { label: 'Session Style',   options: ['Studio', 'Outdoor Garden', 'Home Setup', 'Gown Session', 'Couple Shoot'] },
    'Corporate Shoot':         { label: 'Shoot Type',      options: ['Headshots', 'Team Group Photo', 'Office Culture', 'Event Coverage', 'Annual Report'] },
    'Birthday Shoot':          { label: 'Theme',           options: ["Kids' Party", 'Adult Milestone', 'Cake Smash', 'Outdoor Fun', 'Surprise Party'] },
    'Fashion Catalog Shoot':   { label: 'Fashion Style',   options: ['Ethnic / Traditional', 'Western', 'Bridal', 'Sportswear', 'Casual Lifestyle'] },
    'Food & Culinary Shoot':   { label: 'Purpose',         options: ['Restaurant Menu', 'Packaging Design', 'Social Media', 'Cookbook / Editorial'] },
    'Commercial Film Shoot':   { label: 'Video Type',      options: ['Brand Ad Film', 'Corporate Video', 'Client Testimonials', 'Product Demo'] },
    // Gear Rentals
    'Camera':  { label: 'Camera Type',  options: ['Full Frame Mirrorless', 'APS-C / Crop', 'Cinema / Film', 'Action Cam'] },
    'Lens':    { label: 'Lens Type',    options: ['Wide Angle', 'Standard Zoom', 'Telephoto', 'Macro', 'Prime / Fixed'] },
    'Lights':  { label: 'Light Type',   options: ['LED Continuous', 'Strobe / Flash', 'Ring Light', 'Softbox Panel'] },
    'Drones':  { label: 'Drone Use',    options: ['Aerial Photography', 'Video Mapping', 'Events & Weddings', 'Real Estate'] },
    'Gimbal':  { label: 'Gimbal Use',   options: ['Handheld Video', '3-Axis Motorized', 'Smartphone Mount', 'Run & Gun'] },
    // Studios & Locations
    'Daylight Studio':        { label: 'Lighting Theme', options: ['Natural Sunbeam', 'Overcast Soft', 'Golden Hour Props', 'Minimalist Shadows'] },
    'Cyclorama Studio':       { label: 'Cyc Backdrop',   options: ['Seamless White', 'Chroma Green', 'Controllable RGB', 'Studio Blackout'] },
    'Vintage & Retro Studio': { label: 'Props Theme',    options: ['1970s Neon', 'Royal Heritage', 'Bohemian Chic', 'Rustic Wooden'] },
    'Outdoor & Garden Space': { label: 'Natural Theme',  options: ['Lush Greenery', 'Floral Arch', 'Water Fountain', 'English Villa'] },
    // Models
    'Fashion':    { label: 'Model Style',   options: ['Editorial', 'Runway', 'Catalog Shoot', 'Lookbook'] },
    'Commercial': { label: 'Project Type',  options: ['E-commerce', 'Brand Campaign', 'Corporate', 'Print Ad'] },
    'Ethnic':     { label: 'Wear Type',     options: ['Saree / Lehenga', 'Salwar / Kurta', 'Bridal Jewelry', 'Indo-western'] },
    'Fitness':    { label: 'Fitness Type',  options: ['Gym / Athletic', 'Yoga', 'Outdoor Sports', 'Nutrition Brand'] },
    'Bridal':     { label: 'Bridal Style',  options: ['Hindu Wedding', 'Muslim Wedding', 'Christian Wedding', 'Mehendi / Pre-wedding'] },
    // Workshops
    'Cinematography Masterclass': { label: 'Format',  options: ['In-person Workshop', 'Online / Zoom', 'Weekend Batch', 'Hands-on Practicals'] },
    'Drone Photography Workshop': { label: 'Format',  options: ['In-person Workshop', 'Outdoor Flight Session', 'Beginner Friendly'] },
    'Video Editing with Premiere Pro': { label: 'Format', options: ['Online / Virtual', 'Evening Batch', 'One-on-One Mentoring'] },
    'Portrait Photography Bootcamp':   { label: 'Format', options: ['In-person Studio', 'Live Model Session', 'Weekend Bootcamp'] },
    'Reels Creation & IG Growth':       { label: 'Format', options: ['Virtual / Online', 'Evening Class', 'Live Q&A Included'] },
    'Wedding Photography Bootcamp':    { label: 'Format', options: ['In-person', 'Lightroom Editing Included', 'Certificate Course'] },
  };

  const toggleAccordion = (section) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearAllFilters = () => {
    setSelectedPrice(null);
    setSelectedRating(null);
    setSelectedLocation(null);
    setSelectedSubtype(null);
    setSelectedContextTag(null);
    setSearchQuery('');
  };

  const categoriesList = [
    { id: 'services', label: 'Photography Services' },
    { id: 'studios', label: 'Studios & Locations' },
    { id: 'models', label: 'Models & Talents' },
    { id: 'rentals', label: 'Gear Rentals' },
    { id: 'workshops', label: 'Workshops & Events' },
    { id: 'jobs', label: 'Jobs & Gigs' }
  ];

  const priceOptions = [
    { id: 'budget', label: 'Budget (Under ₹1,500)' },
    { id: 'mid', label: 'Mid-range (₹1,500 - ₹5,000)' },
    { id: 'premium', label: 'Premium (Over ₹5,000)' }
  ];

  const ratingOptions = [
    { id: 4.5, label: '4.5+ ★ Superhost' },
    { id: 4.0, label: '4.0+ ★ Top Rated' }
  ];

  const locationOptions = [
    { id: 'Banjara Hills', label: 'Banjara Hills' },
    { id: 'Madhapur', label: 'Madhapur' },
    { id: 'Jubilee Hills', label: 'Jubilee Hills' },
    { id: 'Gachibowli', label: 'Gachibowli' },
    { id: 'Begumpet', label: 'Begumpet' },
    { id: 'Remote', label: 'Remote / Online' }
  ];

  // Helper to determine the active array to display
  const getRawList = () => {
    switch (exploreTab) {
      case 'services': return services;
      case 'studios': return studios;
      case 'models': return models;
      case 'rentals': return gear;
      case 'workshops': return workshops;
      case 'jobs': return jobs;
      default: return [];
    }
  };

  // Helper to dynamically compile subtypes/subcategories from active listings
  const getSubtypes = () => {
    const list = getRawList();
    const subTypesSet = new Set();
    
    list.forEach(item => {
      if (exploreTab === 'services') {
        if (item.serviceType || item.title) subTypesSet.add(item.serviceType || item.title);
      } else if (exploreTab === 'studios') {
        if (item.studioType || item.title) subTypesSet.add(item.studioType || item.title);
      } else if (exploreTab === 'models') {
        if (Array.isArray(item.categories)) {
          item.categories.forEach(cat => subTypesSet.add(cat));
        } else if (item.type) {
          subTypesSet.add(item.type);
        }
      } else if (exploreTab === 'rentals') {
        if (item.category) subTypesSet.add(item.category);
      } else if (exploreTab === 'workshops') {
        if (item.workshopType || item.title) subTypesSet.add(item.workshopType || item.title);
      } else if (exploreTab === 'jobs') {
        if (Array.isArray(item.skills)) {
          item.skills.forEach(skill => subTypesSet.add(skill));
        }
      }
    });

    return Array.from(subTypesSet);
  };

  const subTypes = getSubtypes();

  // Helper to get the filter key for a given card item (used for click-to-filter)
  const getItemSubtype = (item) => {
    if (exploreTab === 'services') {
      return item.serviceType || item.title || null;
    }
    if (exploreTab === 'studios') {
      return item.studioType || item.title || null;
    }
    if (exploreTab === 'workshops') {
      return item.workshopType || item.title || null;
    }
    if (exploreTab === 'models') {
      if (Array.isArray(item.categories) && item.categories.length > 0) return item.categories[0];
      return item.type || null;
    }
    if (exploreTab === 'rentals') return item.category || null;
    if (exploreTab === 'jobs') {
      if (Array.isArray(item.skills) && item.skills.length > 0) return item.skills[0];
    }
    return null;
  };

  // Main filter and sorting calculator
  const getFilteredAndSortedList = () => {
    let list = [...getRawList()];

    // Exclude only explicitly inactive listings (active: false). Mock data has no active field — always show it.
    list = list.filter(item => item.active !== false);

    // Subtype/Subcategory Filter
    if (selectedSubtype) {
      list = list.filter(item => {
        if (exploreTab === 'services') {
          return (item.serviceType || item.title) === selectedSubtype;
        }
        if (exploreTab === 'studios') {
          return (item.studioType || item.title) === selectedSubtype;
        }
        if (exploreTab === 'models') {
          if (Array.isArray(item.categories)) {
            return item.categories.includes(selectedSubtype);
          }
          return item.type === selectedSubtype;
        }
        if (exploreTab === 'rentals') {
          return item.category === selectedSubtype;
        }
        if (exploreTab === 'workshops') {
          return (item.workshopType || item.title) === selectedSubtype;
        }
        if (exploreTab === 'jobs') {
          if (Array.isArray(item.skills)) {
            return item.skills.includes(selectedSubtype);
          }
          return false;
        }
        return true;
      });
    }

    // Contextual Tag Filter (Drill-down)
    if (selectedContextTag) {
      list = list.filter(item => {
        if (Array.isArray(item.tags) && item.tags.includes(selectedContextTag)) {
          return true;
        }
        if (item.description && item.description.toLowerCase().includes(selectedContextTag.toLowerCase())) {
          return true;
        }
        return false;
      });
    }



    // Search Query Filter
    if (searchQuery) {
      const queryLower = searchQuery.toLowerCase().trim();
      list = list.filter(item => {
        // 1. Direct match on title, description, location
        if (item.title.toLowerCase().includes(queryLower)) return true;
        if (item.description && item.description.toLowerCase().includes(queryLower)) return true;
        if (item.location && item.location.toLowerCase().includes(queryLower)) return true;

        // 2. Match on type/subtype
        const subtype = getItemSubtype(item);
        if (subtype && subtype.toLowerCase().includes(queryLower)) return true;

        // 3. Match on category
        if (item.category && item.category.toLowerCase().includes(queryLower)) return true;

        // 4. Match on tags
        if (Array.isArray(item.tags) && item.tags.some(tag => tag.toLowerCase().includes(queryLower))) return true;

        // 5. If the search query is very broad (e.g. "photography services", "studios & locations", "gear rentals") 
        // and matches the active tab label, let's keep all listings in the active tab
        const activeTabObj = categoriesList.find(c => c.id === exploreTab);
        if (activeTabObj && activeTabObj.label.toLowerCase().includes(queryLower)) return true;
        
        // 6. Split the search query into individual words and verify if they match active tab label or item fields
        const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2); // filter out tiny words
        if (queryWords.length > 0) {
          const labelLower = activeTabObj ? activeTabObj.label.toLowerCase() : '';
          const matchesWords = queryWords.every(word => 
            labelLower.includes(word) ||
            item.title.toLowerCase().includes(word) ||
            (item.description && item.description.toLowerCase().includes(word)) ||
            (subtype && subtype.toLowerCase().includes(word))
          );
          if (matchesWords) return true;
        }

        return false;
      });
    }

    // Price Filter
    if (selectedPrice) {
      list = list.filter(item => {
        const price = item.price;
        if (selectedPrice === 'budget') return price <= 1500;
        if (selectedPrice === 'mid') return price > 1500 && price <= 5000;
        if (selectedPrice === 'premium') return price > 5000;
        return true;
      });
    }

    // Rating Filter
    if (selectedRating) {
      list = list.filter(item => (item.rating || 0) >= selectedRating);
    }

    // Location Filter
    if (selectedLocation) {
      list = list.filter(item => {
        if (!item.location) return false;
        return item.location.toLowerCase().includes(selectedLocation.toLowerCase());
      });
    }

    // Sorting Calculator
    list.sort((a, b) => {
      if (sortBy === 'popularity') {
        return (b.reviews || 0) - (a.reviews || 0);
      }
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === 'price_asc') {
        return (a.price || 0) - (b.price || 0);
      }
      if (sortBy === 'price_desc') {
        return (b.price || 0) - (a.price || 0);
      }
      return 0;
    });

    return list;
  };

  const filteredItems = getFilteredAndSortedList();
  const currentTabLabel = categoriesList.find(c => c.id === exploreTab)?.label || 'Listings';

  // Render Accordion Filter Content
  const renderSidebarFilters = () => (
    <div className="explore-sidebar-inner">
      <div className="sidebar-header-row">
        <h3>Filters</h3>
        {(selectedPrice || selectedRating || selectedLocation || selectedSubtype || searchQuery) && (
          <button className="clear-all-btn-link" onClick={clearAllFilters}>Clear All</button>
        )}
      </div>

      {/* Accordion 1: Categories Selector */}
      <div className="filter-accordion">
        <button className="accordion-header" onClick={() => toggleAccordion('categories')}>
          <span>Categories</span>
          {expandedFilters.categories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {expandedFilters.categories && (
          <div className="accordion-content">
            <div className="filter-pills-wrap">
              {categoriesList.map(cat => (
                <button
                  key={cat.id}
                  className={`filter-pill-btn ${exploreTab === cat.id ? 'active' : ''}`}
                  onClick={() => {
                    setExploreTab(cat.id);
                    // Reset filter selections when changing tabs
                    setSelectedPrice(null);
                    setSelectedRating(null);
                    setSelectedLocation(null);
                    setSelectedSubtype(null);
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Accordion 1.5: Specific Types / Subcategories */}
      {subTypes.length > 0 && (
        <div className="filter-accordion">
          <button className="accordion-header" onClick={() => toggleAccordion('subtypes')}>
            <span>{exploreTab === 'services' ? 'Service Type' : 
                   exploreTab === 'studios' ? 'Studio Name' : 
                   exploreTab === 'models' ? 'Model Category' : 
                   exploreTab === 'rentals' ? 'Gear Category' : 
                   exploreTab === 'workshops' ? 'Workshop Topic' : 'Required Skills'}</span>
            {expandedFilters.subtypes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {expandedFilters.subtypes && (
            <div className="accordion-content">
              <div className="filter-pills-wrap">
                {subTypes.map(type => (
                  <button
                    key={type}
                    className={`filter-pill-btn ${selectedSubtype === type ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedSubtype(t => t === type ? null : type);
                      setSelectedContextTag(null); // reset contextual filter when subtype changes
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Accordion 1.75: Contextual drill-down filters (appear only when a subtype is selected) */}
      {selectedSubtype && contextualFiltersMap[selectedSubtype] && (
        <div className="filter-accordion context-filter-accordion">
          <button className="accordion-header" onClick={() => toggleAccordion('context')}>
            <span>🎯 {contextualFiltersMap[selectedSubtype].label}</span>
            {expandedFilters.context ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {expandedFilters.context && (
            <div className="accordion-content">
              <div className="filter-pills-wrap">
                {contextualFiltersMap[selectedSubtype].options.map(opt => (
                  <button
                    key={opt}
                    className={`filter-pill-btn context-pill ${selectedContextTag === opt ? 'active' : ''}`}
                    onClick={() => setSelectedContextTag(t => t === opt ? null : opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Accordion 2: Price Filters */}
      {exploreTab !== 'jobs' && (
        <div className="filter-accordion">
          <button className="accordion-header" onClick={() => toggleAccordion('price')}>
            <span>Price Range</span>
            {expandedFilters.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {expandedFilters.price && (
            <div className="accordion-content">
              <div className="filter-pills-wrap">
                {priceOptions.map(opt => (
                  <button
                    key={opt.id}
                    className={`filter-pill-btn ${selectedPrice === opt.id ? 'active' : ''}`}
                    onClick={() => setSelectedPrice(p => p === opt.id ? null : opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Accordion 3: Rating Filters */}
      {exploreTab !== 'jobs' && (
        <div className="filter-accordion">
          <button className="accordion-header" onClick={() => toggleAccordion('ratings')}>
            <span>Ratings</span>
            {expandedFilters.ratings ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {expandedFilters.ratings && (
            <div className="accordion-content">
              <div className="filter-pills-wrap">
                {ratingOptions.map(opt => (
                  <button
                    key={opt.id}
                    className={`filter-pill-btn ${selectedRating === opt.id ? 'active' : ''}`}
                    onClick={() => setSelectedRating(r => r === opt.id ? null : opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Accordion 4: Locations Filters */}
      <div className="filter-accordion">
        <button className="accordion-header" onClick={() => toggleAccordion('location')}>
          <span>Location</span>
          {expandedFilters.location ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {expandedFilters.location && (
          <div className="accordion-content">
            <div className="filter-pills-wrap">
              {locationOptions.map(opt => (
                <button
                  key={opt.id}
                  className={`filter-pill-btn ${selectedLocation === opt.id ? 'active' : ''}`}
                  onClick={() => setSelectedLocation(l => l === opt.id ? null : opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="explore-layout-wrapper">
      {/* 1. Desktop Left Sidebar Filters */}
      <aside className="explore-sidebar-filters">
        {renderSidebarFilters()}
      </aside>

      {/* 2. Right Side Result Listings Content */}
      <div className="explore-results-content">
        
        {/* Results Header (BMS style counts, sorting dropdown) */}
        <div className="explore-results-header">
          <div className="header-meta-info">
            <h1 className="explore-page-title">{currentTabLabel}</h1>
            <span className="results-count-label">
              {filteredItems.length} {filteredItems.length === 1 ? 'listing' : 'listings'} found
            </span>
          </div>

          <div className="header-controls-group">
            {/* Mobile Filter Toggle Button */}
            <button 
              className="mobile-filters-trigger-btn"
              onClick={() => setShowMobileFilters(true)}
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </button>

            {/* Sorting Dropdown */}
            <div className="sort-select-wrapper">
              <select 
                className="sort-dropdown-select" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popularity">Sort by: Popularity</option>
                <option value="rating">Sort by: High Ratings</option>
                {exploreTab !== 'jobs' && <option value="price_asc">Price: Low to High</option>}
                {exploreTab !== 'jobs' && <option value="price_desc">Price: High to Low</option>}
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Chips row */}
        {(selectedPrice || selectedRating || selectedLocation || selectedSubtype || selectedContextTag || searchQuery) && (
          <div className="active-filters-chips-row">
            <span className="active-chips-title">Active Filters:</span>
            <div className="active-chips-list">
              {searchQuery && (
                <span className="filter-active-chip">
                  Search: "{searchQuery}"
                  <button className="chip-remove-btn" onClick={() => setSearchQuery('')}><X size={10} /></button>
                </span>
              )}
              {selectedSubtype && (
                <span className="filter-active-chip">
                  Type: "{selectedSubtype}"
                  <button className="chip-remove-btn" onClick={() => { setSelectedSubtype(null); setSelectedContextTag(null); }}><X size={10} /></button>
                </span>
              )}
              {selectedContextTag && (
                <span className="filter-active-chip context-chip">
                  🎯 {selectedContextTag}
                  <button className="chip-remove-btn" onClick={() => setSelectedContextTag(null)}><X size={10} /></button>
                </span>
              )}
              {selectedPrice && (
                <span className="filter-active-chip">
                  {priceOptions.find(p => p.id === selectedPrice)?.label.split(' ')[0]} Price
                  <button className="chip-remove-btn" onClick={() => setSelectedPrice(null)}><X size={10} /></button>
                </span>
              )}
              {selectedRating && (
                <span className="filter-active-chip">
                  ★ {selectedRating}+
                  <button className="chip-remove-btn" onClick={() => setSelectedRating(null)}><X size={10} /></button>
                </span>
              )}
              {selectedLocation && (
                <span className="filter-active-chip">
                  📍 {selectedLocation}
                  <button className="chip-remove-btn" onClick={() => setSelectedLocation(null)}><X size={10} /></button>
                </span>
              )}
              <button className="clear-all-chips-link" onClick={clearAllFilters}>Clear All</button>
            </div>
          </div>
        )}

        {/* Card Grid list display */}
        {exploreTab !== 'jobs' ? (
          <div className="desktop-card-grid-4">
            {filteredItems.map(item => {
              // Calculate a simulated likes percentage based on rating (e.g. 4.8 / 5 -> 96%)
              const likesPercentage = Math.round((item.rating || 4.5) * 20);
              const itemSubtype = getItemSubtype(item);
              const isFilterSelected = selectedSubtype === itemSubtype;

              return (
                <div
                  key={item.id}
                  className={`explore-card-item bms-style ${isFilterSelected ? 'card-subtype-active' : ''}`}
                  onClick={() => {
                    // First click: apply the subtype filter to show related cards
                    if (itemSubtype && selectedSubtype !== itemSubtype) {
                      setSelectedSubtype(itemSubtype);
                      setSelectedContextTag(null); // reset contextual filter for new subtype
                    } else {
                      // Second click (or no subtype): open details modal
                      openDetails(item, exploreTab === 'rentals' ? 'gear' : exploreTab.slice(0, -1));
                    }
                  }}
                >
                  <div className="explore-img-wrap">
                    <img src={item.image} className="card-image" alt={item.title} />
                    
                    {/* Dark Translucent Rating Overlay Bar at the bottom of the poster */}
                    <div className="card-rating-overlay-bar">
                      <div className="rating-left">
                        <span className="rating-emoji">👍</span>
                        <span className="rating-percentage">{likesPercentage}%</span>
                      </div>
                      <span className="rating-votes-count">{item.reviews || 45} votes</span>
                    </div>

                    {/* BookMyShow Style Label tags on top */}
                    {item.category && (
                      <span className="explore-badge">{item.category}</span>
                    )}

                    <button 
                      className={`card-like-btn ${likedItems[item.id] ? 'liked' : ''}`}
                      onClick={(e) => toggleLike(item.id, e)}
                    >
                      <Heart size={14} fill={likedItems[item.id] ? 'var(--primary)' : 'none'} />
                    </button>
                  </div>
                  
                  {/* Card metadata beneath the poster */}
                  <div className="explore-info">
                    <span className="explore-title" title={item.title}>{item.title}</span>
                    <span className="explore-meta">
                      📍 {item.location?.split(',')[0] || 'Hyderabad'} • {item.distance || 'Premium'}
                    </span>
                    <div className="explore-footer">
                      <span className="explore-price">
                        ₹{item.price.toLocaleString('en-IN')}
                        <span className="price-unit-tag">
                          {item.priceUnit ? `/${item.priceUnit}` : ''}
                        </span>
                      </span>
                      <div className="card-rating-star-row">
                        <Star size={11} className="card-rating-star" />
                        <span>{item.rating || '4.5'}</span>
                      </div>
                    </div>
                    {/* View Details button — appears when this card's filter is already selected */}
                    {isFilterSelected && (
                      <button
                        className="card-view-details-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetails(item, exploreTab === 'rentals' ? 'gear' : exploreTab.slice(0, -1));
                        }}
                      >
                        View Details →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Jobs and Gigs layout (renders vertical job details cards) */
          <div className="desktop-card-grid-3">
            {filteredItems.map(job => (
              <div key={job.id} className="job-card-item" onClick={() => openDetails(job, 'job')}>
                <div className="job-header">
                  <div className="job-company-wrap">
                    <img src={job.image} className="job-company-logo" alt={job.company} />
                    <div className="job-title-meta">
                      <span className="job-name">{job.title}</span>
                      <span className="job-comp">{job.company}</span>
                    </div>
                  </div>
                  <span className="job-type-pill">{job.jobType || job.type}</span>
                </div>
                <div className="job-skills">
                  {job.skills.map((sk, idx) => (
                    <span key={idx} className="skill-tag">{sk}</span>
                  ))}
                </div>
                <div className="job-footer">
                  <span className="job-salary">{job.price}</span>
                  <span className="job-loc">{job.location}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty filter message */}
        {filteredItems.length === 0 && (
          <div className="empty-bookings">
            <span className="empty-bookings-title">No listings match your filter selections</span>
            <span className="empty-bookings-desc">Try clearing your filters or refine your search query.</span>
            <button className="clear-filters-cta-btn" onClick={clearAllFilters}>Reset Filters</button>
          </div>
        )}
      </div>

      {/* 3. Mobile Collapsible Filter Drawer Overlay */}
      {showMobileFilters && (
        <div className="mobile-filters-drawer-overlay" onClick={() => setShowMobileFilters(false)}>
          <div className="mobile-filters-drawer-body" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header-row">
              <h3>Filters</h3>
              <button className="close-drawer-btn" onClick={() => setShowMobileFilters(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="drawer-scroll-content">
              {renderSidebarFilters()}
            </div>
            <div className="drawer-footer-actions">
              <button className="drawer-reset-btn" onClick={() => { clearAllFilters(); setShowMobileFilters(false); }}>
                Reset All
              </button>
              <button className="drawer-apply-btn" onClick={() => setShowMobileFilters(false)}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
