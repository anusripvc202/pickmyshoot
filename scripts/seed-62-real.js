import fs from 'fs';
import pg from 'pg';

const SUPABASE_DB_URL = 'postgresql://postgres:anusripvc202@db.ttjywwxethwoqgtcvzno.supabase.co:5432/postgres';

const excelRows = JSON.parse(fs.readFileSync('scratch/excel_data.json', 'utf8'));

// Load template listingsData from scripts/seed-new-listings.js
const jsFileContent = fs.readFileSync('scripts/seed-new-listings.js', 'utf8');
const startIdx = jsFileContent.indexOf('const listingsData = [');
const endIdx = jsFileContent.indexOf('];', startIdx);
const arrayCode = jsFileContent.substring(startIdx, endIdx + 2);
const evalFn = new Function(arrayCode + '; return listingsData;');
const jsListings = evalFn();

function cleanPhone(p) {
  if (!p) return '';
  return p.replace(/\D/g, '');
}

function cleanName(n) {
  if (!n) return '';
  return n.toLowerCase().replace(/\W+/g, '');
}

const defaultImages = {
  studio: [
    "https://images.unsplash.com/photo-1603566723801-ffeb5562725e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  ],
  service: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=800&q=80"
  ]
};

let studioImgIdx = 0;
let serviceImgIdx = 0;

const finalListings = [];
const seenNamesSet = new Set();

excelRows.forEach((er, index) => {
  const normName = er.name ? er.name.trim().toLowerCase() : '';
  if (!normName) return;
  if (seenNamesSet.has(normName)) {
    return; // Skip duplicate business names
  }
  seenNamesSet.add(normName);

  const erNameClean = cleanName(er.name);
  const erPhoneClean = cleanPhone(er.phone);
  
  // Find match
  let match = null;
  for (const jl of jsListings) {
    const jlTitleClean = cleanName(jl.title);
    const jlPhoneClean = cleanPhone(jl.phone);
    
    if (erNameClean === jlTitleClean || jlTitleClean.includes(erNameClean) || erNameClean.includes(jlTitleClean)) {
      match = jl;
      break;
    }
    if (erPhoneClean && jlPhoneClean && (erPhoneClean.endsWith(jlPhoneClean) || jlPhoneClean.endsWith(erPhoneClean))) {
      match = jl;
      break;
    }
  }
  
  let mapped = {};
  const listingId = `real-${index + 1}`;
  
  if (match) {
    mapped = {
      _id: listingId,
      id: listingId,
      title: er.name,
      type: match.type || 'service',
      price: match.price || 4000,
      priceUnit: match.priceUnit || 'hr',
      image: match.image || defaultImages[match.type || 'service'][0],
      description: match.description || `Professional ${match.type || 'service'} in ${er.area}, Hyderabad.`,
      location: er.address || er.area,
      rating: er.rating || 4.8,
      reviews: er.reviews || 10,
      creatorId: match.creatorId || `p-${listingId}`,
      ownerId: match.ownerId || `p-${listingId}`,
      active: true,
      isFeatured: match.isFeatured || false,
      studioType: match.studioType || null,
      capacity: match.capacity || null,
      area: match.area || null,
      category: match.category || null,
      serviceType: match.serviceType || null,
      phone: er.phone || null,
      webUrl: er.website || null,
      gmbUrl: match.gmbUrl || null,
      fbUrl: match.fbUrl || null
    };
  } else {
    const isStudio = erNameClean.includes('studio') && !erNameClean.includes('photo') && !erNameClean.includes('film') && !erNameClean.includes('media') && !erNameClean.includes('click');
    const type = isStudio ? 'studio' : 'service';
    
    let price = 4000;
    let priceUnit = 'hr';
    let image = '';
    let description = '';
    let category = '';
    let serviceType = null;
    let studioType = null;
    
    if (type === 'studio') {
      price = 2000;
      image = defaultImages.studio[studioImgIdx % defaultImages.studio.length];
      studioImgIdx++;
      description = `Premium studio rental space available for photography, videography, and creative productions in ${er.area}, Hyderabad. Features professional lighting and multiple backgrounds.`;
      category = 'Studios';
      studioType = 'Portrait Studio';
    } else {
      image = defaultImages.service[serviceImgIdx % defaultImages.service.length];
      serviceImgIdx++;
      category = 'Book Shoot';
      if (erNameClean.includes('baby') || erNameClean.includes('kids') || erNameClean.includes('munchkins')) {
        serviceType = 'Baby Photoshoot';
        price = 3000;
        description = `Capture the precious milestones of your little ones. Safe, creative setups and props for baby and toddler portrait shoots in ${er.area}.`;
      } else if (erNameClean.includes('wedding') || erNameClean.includes('marriage')) {
        serviceType = 'Wedding Shoot';
        price = 5000;
        description = `Luxury wedding photography and candid videography services in Hyderabad. High-end equipment, cinematic capture, and professional storytelling.`;
      } else {
        serviceType = 'Fashion Portfolio';
        description = `Editorial fashion portfolios, lookbooks, and high-fashion modeling shoot services in ${er.area}, Hyderabad.`;
      }
    }
    
    mapped = {
      _id: listingId,
      id: listingId,
      title: er.name,
      type: type,
      price: price,
      priceUnit: priceUnit,
      image: image,
      description: description,
      location: er.address || er.area,
      rating: er.rating || 4.8,
      reviews: er.reviews || 10,
      creatorId: `p-${listingId}`,
      ownerId: `p-${listingId}`,
      active: true,
      isFeatured: false,
      studioType: studioType,
      capacity: type === 'studio' ? '15 Capacity' : null,
      area: type === 'studio' ? '1200 Sq.ft' : null,
      category: category,
      serviceType: serviceType,
      phone: er.phone || null,
      webUrl: er.website || null,
      gmbUrl: null,
      fbUrl: null
    };
  }
  
  if (erNameClean.includes('tejastudio') || erNameClean.includes('tejaphoto') || erNameClean.includes('saiteja')) {
    mapped.image = '/teja_studios.png';
  }
  
  finalListings.push(mapped);
});

async function run() {
  console.log('Connecting to Supabase PostgreSQL...');
  const pgClient = new pg.Client({ connectionString: SUPABASE_DB_URL });
  await pgClient.connect();
  console.log('Successfully connected.');

  try {
    console.log('Clearing existing bookings...');
    await pgClient.query('DELETE FROM bookings;');
    console.log('Clearing existing listings...');
    await pgClient.query('DELETE FROM listings;');
    console.log('Clearing existing photographers...');
    await pgClient.query('DELETE FROM photographers;');
    console.log('Tables cleared.');

    console.log(`Inserting all ${finalListings.length} real listings with full metadata...`);
    for (const l of finalListings) {
      await pgClient.query(`
        INSERT INTO "listings" (
          "_id", "id", "title", "type", "price", "priceUnit", "image", "description", 
          "location", "rating", "reviews", "creatorId", "ownerId", "active", "isFeatured", 
          "studioType", "capacity", "area", "category", "serviceType", "phone", "webUrl", 
          "gmbUrl", "fbUrl", "createdAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, NOW())
      `, [
        l._id, l.id, l.title, l.type, JSON.stringify(l.price), l.priceUnit, l.image, l.description,
        l.location, JSON.stringify(l.rating), l.reviews, l.creatorId, l.ownerId, l.active, l.isFeatured,
        l.studioType || null, l.capacity || null, l.area || null, l.category || null, l.serviceType || null,
        l.phone || null, l.webUrl || null, l.gmbUrl || null, l.fbUrl || null
      ]);
    }
    console.log(`Successfully inserted ${finalListings.length} listings.`);

    console.log('Compiling photographer profiles directory...');
    const photographerProfiles = [
      { _id: '6a380b8173c0e340a6bf3a42', name: 'Nikhil photography', slug: 'nikhil-photography', location: 'Madhapur, Hyderabad', email: 'nikhiljai1215@gmail.com' }
    ];

    const seenNames = new Set(['nikhil photography']);
    const seenIds = new Set(['6a380b8173c0e340a6bf3a42']);
    finalListings.forEach(l => {
      // Split title to extract a base photographer name
      const baseName = l.title.split('|')[0].trim().toLowerCase();
      if (!seenNames.has(baseName) && !seenIds.has(l.ownerId)) {
        seenNames.add(baseName);
        seenIds.add(l.ownerId);
        photographerProfiles.push({
          _id: l.ownerId,
          name: l.title.split('|')[0].trim(),
          slug: l.id,
          location: l.location.split(',')[1]?.trim() || 'Hyderabad',
          email: `${l.id}@pickmyshoot-partner.com`
        });
      }
    });

    console.log(`Inserting ${photographerProfiles.length} photographer profiles...`);
    for (const p of photographerProfiles) {
      await pgClient.query(`
        INSERT INTO "photographers" (
          "_id", "name", "slug", "location", "isVerified", "code", "status", "email", "createdAt"
        ) VALUES ($1, $2, $3, $4, true, 'VERIFIED', 'Active', $5, NOW())
      `, [p._id, p.name, p.slug, p.location, p.email]);
    }
    console.log(`Successfully populated photographers directory.`);
    console.log('🎉 Seeding successfully completed!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await pgClient.end();
    console.log('Supabase connection closed.');
  }
}

run();
