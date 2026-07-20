import fs from 'fs';

const categories = {
  studio: ['studio', 'interior', 'decor', 'room'],
  wedding: ['wedding', 'marriage', 'bride', 'groom', 'couple'],
  baby: ['baby', 'infant', 'newborn', 'kids', 'toddler'],
  fashion: ['fashion', 'model', 'portrait', 'glamour']
};

async function fetchFromUnsplash(query, page = 1) {
  try {
    const res = await fetch(`https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=30&page=${page}`);
    if (!res.ok) return [];
    const json = await res.json();
    return (json.results || []).map(r => r.urls?.regular || r.urls?.small).filter(Boolean);
  } catch (e) {
    console.error(`Failed to fetch ${query}:`, e);
    return [];
  }
}

async function run() {
  const result = {};

  for (const [catName, keywords] of Object.entries(categories)) {
    console.log(`Fetching IDs for category: ${catName}...`);
    const idSet = new Set();
    
    for (const kw of keywords) {
      for (let page = 1; page <= 3; page++) {
        const ids = await fetchFromUnsplash(kw, page);
        ids.forEach(id => idSet.add(id));
        await new Promise(r => setTimeout(r, 100));
      }
    }
    
    result[catName] = Array.from(idSet);
    console.log(`Category ${catName}: found ${result[catName].length} unique IDs.`);
  }

  // Save to src/data/uniqueImages.json
  fs.writeFileSync('src/data/uniqueImages.json', JSON.stringify(result, null, 2));
  console.log('🎉 Successfully saved Unsplash photo IDs pools to src/data/uniqueImages.json!');
}

run();
