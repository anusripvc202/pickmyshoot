const fs = require('fs');

const path = 'src/pages/HomePage.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add gear, models to useAppContext
if (!content.includes('    gear,\n    models\n  } = useAppContext();')) {
  content = content.replace(
    '    setExploreTab\n  } = useAppContext();',
    '    setExploreTab,\n    gear,\n    models\n  } = useAppContext();'
  );
}

// 2. Increase icon sizes
content = content.replace(/width="28" height="28"/g, 'width="36" height="36"');

// 3. Update the Studios section to include gear
if (!content.includes('const studiosAndGear = [...studios, ...gear];')) {
  // Let's add a variable for studiosAndGear right after activeSlideData
  content = content.replace(
    'const activeSlideData = heroSlides[currentSlide];',
    'const activeSlideData = heroSlides[currentSlide];\n\n  const studiosAndGear = React.useMemo(() => [...studios, ...gear], [studios, gear]);'
  );
  
  // Replace studios.map with studiosAndGear.map
  content = content.replace(
    /studios\.map\(studio => \(/g,
    'studiosAndGear.map(studio => ('
  );
}

// 4. Add Models section
const modelsSection = `
      {/* Trending Models */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Trending Models</h2>
          <span className="section-link" onClick={() => handleCategoryClick('models')}>
            See All Models <ChevronRight size={14} />
          </span>
        </div>
        <div className="desktop-card-grid-5 mobile-scroll-row">
          {models.slice(0, 5).map(model => (
            <div key={model.id} className="near-you-card" onClick={() => { setExploreTab('models'); navigate('/explore'); }}>
              <div className="near-you-img-wrap">
                <img src={model.image} className="card-image" alt={model.title} />
                <button 
                  className={\`card-like-btn \${likedItems[model.id] ? 'liked' : ''}\`}
                  onClick={(e) => toggleLike(model.id, e)}
                >
                  <Heart size={15} fill={likedItems[model.id] ? 'var(--primary)' : 'none'} />
                </button>
              </div>
              <div className="near-you-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="near-you-title">{model.title}</span>
                  <div className="card-rating-row" style={{ marginTop: 0 }}>
                    <Star size={11} className="card-rating-star" />
                    <span>{model.rating}</span>
                  </div>
                </div>
                <span className="near-you-loc">📍 {model.location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
`;

if (!content.includes('Trending Models')) {
  // Insert it before the Top Institutes section
  content = content.replace(
    '{/* Top Institutes & Courses */}',
    modelsSection + '\n      {/* Top Institutes & Courses */}'
  );
}

fs.writeFileSync(path, content, 'utf8');
console.log('HomePage updated successfully');
