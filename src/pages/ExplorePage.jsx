import React from 'react';
import { Star, Heart } from 'lucide-react';
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

  // Filter lists based on Search Query
  const getFilteredItems = (list) => {
    if (!searchQuery) return list;
    return list.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const getExploreTabCount = (tabName) => {
    switch (tabName) {
      case 'services': return getFilteredItems(services).length;
      case 'studios': return getFilteredItems(studios).length;
      case 'models': return getFilteredItems(models).length;
      case 'rentals': return getFilteredItems(gear).length;
      case 'workshops': return getFilteredItems(workshops).length;
      case 'jobs': return getFilteredItems(jobs).length;
      default: return 0;
    }
  };

  return (
    <>
      {/* Header category selector */}
      <div className="explore-top-section">
        <div className="explore-filter-tabs">
          <button 
            className={`tab-pill ${exploreTab === 'services' ? 'active' : ''}`}
            onClick={() => setExploreTab('services')}
          >
            Services ({getExploreTabCount('services')})
          </button>
          <button 
            className={`tab-pill ${exploreTab === 'studios' ? 'active' : ''}`}
            onClick={() => setExploreTab('studios')}
          >
            Studios ({getExploreTabCount('studios')})
          </button>
          <button 
            className={`tab-pill ${exploreTab === 'models' ? 'active' : ''}`}
            onClick={() => setExploreTab('models')}
          >
            Models & Talents ({getExploreTabCount('models')})
          </button>
          <button 
            className={`tab-pill ${exploreTab === 'rentals' ? 'active' : ''}`}
            onClick={() => setExploreTab('rentals')}
          >
            Gear Rentals ({getExploreTabCount('rentals')})
          </button>
          <button 
            className={`tab-pill ${exploreTab === 'workshops' ? 'active' : ''}`}
            onClick={() => setExploreTab('workshops')}
          >
            Workshops ({getExploreTabCount('workshops')})
          </button>
          <button 
            className={`tab-pill ${exploreTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setExploreTab('jobs')}
          >
            Jobs & Gigs ({getExploreTabCount('jobs')})
          </button>
        </div>

        {searchQuery && (
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Filtered results for: "<strong>{searchQuery}</strong>" (
            <span 
              style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }} 
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </span>)
          </span>
        )}
      </div>

      {/* List results in a responsive grid */}
      {exploreTab !== 'jobs' ? (
        <div className="desktop-card-grid-4">
          {/* Services */}
          {exploreTab === 'services' && getFilteredItems(services).map(item => (
            <div key={item.id} className="explore-card-item" onClick={() => openDetails(item, 'service')}>
              <div className="explore-img-wrap">
                <img src={item.image} className="card-image" alt={item.title} />
                <button 
                  className={`card-like-btn ${likedItems[item.id] ? 'liked' : ''}`}
                  onClick={(e) => toggleLike(item.id, e)}
                >
                  <Heart size={14} fill={likedItems[item.id] ? 'var(--primary)' : 'none'} />
                </button>
              </div>
              <div className="explore-info">
                <span className="explore-title">{item.title}</span>
                <div className="explore-footer">
                  <span className="explore-price">₹{item.price.toLocaleString('en-IN')}</span>
                  <div className="card-rating-row">
                    <Star size={11} className="card-rating-star" />
                    <span>{item.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Studios */}
          {exploreTab === 'studios' && getFilteredItems(studios).map(item => (
            <div key={item.id} className="explore-card-item" onClick={() => openDetails(item, 'studio')}>
              <div className="explore-img-wrap">
                <img src={item.image} className="card-image" alt={item.title} />
                <span className="explore-badge">Studio</span>
                <button 
                  className={`card-like-btn ${likedItems[item.id] ? 'liked' : ''}`}
                  onClick={(e) => toggleLike(item.id, e)}
                >
                  <Heart size={14} fill={likedItems[item.id] ? 'var(--primary)' : 'none'} />
                </button>
              </div>
              <div className="explore-info">
                <span className="explore-title">{item.title}</span>
                <span className="explore-meta">📍 {item.location}</span>
                <div className="explore-footer">
                  <span className="explore-price">₹{item.price.toLocaleString('en-IN')}/{item.priceUnit}</span>
                  <div className="card-rating-row">
                    <Star size={11} className="card-rating-star" />
                    <span>{item.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Models */}
          {exploreTab === 'models' && getFilteredItems(models).map(item => (
            <div key={item.id} className="explore-card-item" onClick={() => openDetails(item, 'model')}>
              <div className="explore-img-wrap">
                <img src={item.image} className="card-image" alt={item.title} />
                <span className="explore-badge">Height: {item.height}</span>
                <button 
                  className={`card-like-btn ${likedItems[item.id] ? 'liked' : ''}`}
                  onClick={(e) => toggleLike(item.id, e)}
                >
                  <Heart size={14} fill={likedItems[item.id] ? 'var(--primary)' : 'none'} />
                </button>
              </div>
              <div className="explore-info">
                <span className="explore-title">{item.title}</span>
                <span className="explore-meta">{item.categories.join(' • ')}</span>
                <div className="explore-footer">
                  <span className="explore-price">₹{item.price.toLocaleString('en-IN')}/{item.priceUnit}</span>
                  <div className="card-rating-row">
                    <Star size={11} className="card-rating-star" />
                    <span>{item.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Rentals */}
          {exploreTab === 'rentals' && getFilteredItems(gear).map(item => (
            <div key={item.id} className="explore-card-item" onClick={() => openDetails(item, 'gear')}>
              <div className="explore-img-wrap">
                <img src={item.image} className="card-image" alt={item.title} />
                <span className="explore-badge">{item.category}</span>
                <button 
                  className={`card-like-btn ${likedItems[item.id] ? 'liked' : ''}`}
                  onClick={(e) => toggleLike(item.id, e)}
                >
                  <Heart size={14} fill={likedItems[item.id] ? 'var(--primary)' : 'none'} />
                </button>
              </div>
              <div className="explore-info">
                <span className="explore-title">{item.title}</span>
                <div className="explore-footer">
                  <span className="explore-price">₹{item.price.toLocaleString('en-IN')}/{item.priceUnit}</span>
                  <div className="card-rating-row">
                    <Star size={11} className="card-rating-star" />
                    <span>{item.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Workshops */}
          {exploreTab === 'workshops' && getFilteredItems(workshops).map(item => (
            <div key={item.id} className="explore-card-item" onClick={() => openDetails(item, 'workshop')}>
              <div className="explore-img-wrap">
                <img src={item.image} className="card-image" alt={item.title} />
                <span className="explore-badge" style={{ background: 'var(--primary)', color: 'white' }}>{item.date}</span>
              </div>
              <div className="explore-info">
                <span className="explore-title">{item.title}</span>
                <span className="explore-meta">By {item.instructor}</span>
                <div className="explore-footer">
                  <span className="explore-price">₹{item.price.toLocaleString('en-IN')}</span>
                  <div className="card-rating-row">
                    <Star size={11} className="card-rating-star" />
                    <span>{item.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Jobs and Gigs layout */
        <div className="desktop-card-grid-3">
          {getFilteredItems(jobs).map(job => (
            <div key={job.id} className="job-card-item" onClick={() => openDetails(job, 'job')}>
              <div className="job-header">
                <div className="job-company-wrap">
                  <img src={job.image} className="job-company-logo" alt={job.company} />
                  <div className="job-title-meta">
                    <span className="job-name">{job.title}</span>
                    <span className="job-comp">{job.company}</span>
                  </div>
                </div>
                <span className="job-type-pill">{job.type}</span>
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
      {getExploreTabCount(exploreTab) === 0 && (
        <div className="empty-bookings">
          <span className="empty-bookings-title">No listings match your selection</span>
          <span className="empty-bookings-desc">Try clearing your search filters or add a new space listing.</span>
        </div>
      )}
    </>
  );
};

export default ExplorePage;
