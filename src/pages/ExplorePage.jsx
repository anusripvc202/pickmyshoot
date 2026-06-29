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
    price: true,
    ratings: true,
    location: true
  });

  // 2. Active filter states
  const [selectedPrice, setSelectedPrice] = useState(null); // null, 'budget', 'mid', 'premium'
  const [selectedRating, setSelectedRating] = useState(null); // null, 4.5, 4.0
  const [selectedLocation, setSelectedLocation] = useState(null); // null, string
  const [selectedSubtype, setSelectedSubtype] = useState(null); // dynamic sub-category type filter
  const [sortBy, setSortBy] = useState('popularity'); // 'popularity', 'price_asc', 'price_desc', 'rating'
  
  // Mobile filter drawer visibility toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
        if (item.title) subTypesSet.add(item.title);
      } else if (exploreTab === 'studios') {
        if (item.title) subTypesSet.add(item.title);
      } else if (exploreTab === 'models') {
        if (Array.isArray(item.categories)) {
          item.categories.forEach(cat => subTypesSet.add(cat));
        } else if (item.type) {
          subTypesSet.add(item.type);
        }
      } else if (exploreTab === 'rentals') {
        if (item.category) subTypesSet.add(item.category);
      } else if (exploreTab === 'workshops') {
        if (item.title) subTypesSet.add(item.title);
      } else if (exploreTab === 'jobs') {
        if (Array.isArray(item.skills)) {
          item.skills.forEach(skill => subTypesSet.add(skill));
        }
      }
    });

    return Array.from(subTypesSet);
  };

  const subTypes = getSubtypes();

  // Main filter and sorting calculator
  const getFilteredAndSortedList = () => {
    let list = [...getRawList()];

    // Exclude only explicitly inactive listings (active: false). Mock data has no active field — always show it.
    list = list.filter(item => item.active !== false);

    // Subtype/Subcategory Filter
    if (selectedSubtype) {
      list = list.filter(item => {
        if (exploreTab === 'services') {
          return item.title === selectedSubtype;
        }
        if (exploreTab === 'studios') {
          return item.title === selectedSubtype;
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
          return item.title === selectedSubtype;
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


    // Search Query Filter
    if (searchQuery) {
      list = list.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
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
                    onClick={() => setSelectedSubtype(t => t === type ? null : type)}
                  >
                    {type}
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
        {(selectedPrice || selectedRating || selectedLocation || selectedSubtype || searchQuery) && (
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
                  <button className="chip-remove-btn" onClick={() => setSelectedSubtype(null)}><X size={10} /></button>
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
              
              return (
                <div key={item.id} className="explore-card-item bms-style" onClick={() => openDetails(item, exploreTab === 'rentals' ? 'gear' : exploreTab.slice(0, -1))}>
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
