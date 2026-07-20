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

const imagePools = {
  studio: [
    "photo-1603566723801-ffeb5562725e",
    "photo-1516035069371-29a1b244cc32",
    "photo-1616486338812-3dadae4b4ace",
    "photo-1600585154340-be6161a56a0c",
    "photo-1600585154526-990dced4db0d",
    "photo-1618221195710-dd6b41faaea6",
    "photo-1616486038856-3c648435363b",
    "photo-1617806118233-18e1db207f62",
    "photo-1615529182904-14819c35db37",
    "photo-1586023492125-27b2c045efd7",
    "photo-1598928506311-c55ded91a20c",
    "photo-1585412727339-54e4bae3bbf9",
    "photo-1505691938895-1758d7feb511",
    "photo-1554995207-c18c203602cb",
    "photo-1560448204-e02f11c3d0e2",
    "photo-1505693416388-ac5ce068fe85",
    "photo-1513694203232-719a280e022f",
    "photo-1583847268964-b28dc8f51f92",
    "photo-1524758631624-e2822e304c36",
    "photo-1502672260266-1c1ef2d93688"
  ],
  wedding: [
    "photo-1519741497674-611481863552",
    "photo-1511285560929-80b456fea0bc",
    "photo-1542038784456-1ea8e935640e",
    "photo-1504196606672-aef5c9cefc92",
    "photo-1606800052052-a08af7148866",
    "photo-1583939003579-730e3918a45a",
    "photo-1519225495810-7517c5a69076",
    "photo-1532712938310-34cb3982ef74",
    "photo-1465495976207-36b7295287f6",
    "photo-1520854221256-13d6beee112f",
    "photo-1515934751635-c81c6bc9a2d8",
    "photo-1472653525502-ff55eb065c8b",
    "photo-1470134956277-722e9cb14ee4",
    "photo-1537907690979-ee8e01276184",
    "photo-1507504038482-762ef9524197",
    "photo-1607190074257-dd4b7af0309f",
    "photo-1511795409834-ef04bbd61622",
    "photo-1522673607200-164d1b6ce486",
    "photo-1505232458627-d6ad7d610471",
    "photo-1519671482749-fd09be7ccebf"
  ],
  baby: [
    "photo-1504196606672-aef5c9cefc92",
    "photo-1537907690979-ee8e01276184",
    "photo-1598488035139-bdbb2231ce04",
    "photo-1524055988636-436cfa46e59e",
    "photo-1519689680058-324335c77eb2",
    "photo-1502086223501-7ea6ecd79368",
    "photo-1488521787991-ed7bbaae773c",
    "photo-1503454537195-1dcabb73ffb9",
    "photo-1555252333-d3463337906d",
    "photo-1516627145497-ae6968895b74",
    "photo-1471286174240-a53d2d74b31e",
    "photo-1566004100-c081219b52a5",
    "photo-1596464716127-f2a82984de30",
    "photo-1544005313-94ddf0286df2",
    "photo-1515488042361-404e9250afef",
    "photo-1505784043888-aa97d62ef4b2",
    "photo-1531746020798-e6953c6e8e04",
    "photo-1510154221590-ff63e90a136f",
    "photo-1546162908-4ee1d9dfa502",
    "photo-1559251606-c623743a6d76"
  ],
  fashion: [
    "photo-1492691527719-9d1e07e534b4",
    "photo-1554080353-a576cf803bda",
    "photo-1560066984-138dadb4c035",
    "photo-1508214751196-bcfd4ca60f91",
    "photo-1509631179647-0177331693ae",
    "photo-1534528741775-53994a69daeb",
    "photo-1506794778202-cad84cf45f1d",
    "photo-1507003211169-0a1dd7228f2d",
    "photo-1488426862026-3ee34a7d66df",
    "photo-1524504388940-b1c1722653e1",
    "photo-1531746020798-e6953c6e8e04",
    "photo-1544005313-94ddf0286df2",
    "photo-1500648767791-00dcc994a43e",
    "photo-1539571696357-5a69c17a67c6",
    "photo-1494790108377-be9c29b29330",
    "photo-1522075469751-3a6694fb2f61",
    "photo-1506794778202-cad84cf45f1d",
    "photo-1517841905240-472988babdf9",
    "photo-1539571696357-5a69c17a67c6",
    "photo-1501196354995-cbb51c65aaea"
  ]
};

function getDeterministicImage(title, type, serviceType, loopIndex) {
  let hash = 0;
  const str = (title || '') + (type || '') + (loopIndex || '0');
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash);
  const sig = (index + (loopIndex || 0)) % 10000;

  if (type === 'studio') {
    return `https://images.unsplash.com/featured/800x600/?sig=${sig}&studio,interior,decor`;
  } else {
    const sType = (serviceType || '').toLowerCase();
    if (sType.includes('baby') || sType.includes('kids') || sType.includes('munchkins')) {
      return `https://images.unsplash.com/featured/800x600/?sig=${sig}&baby,kids,newborn`;
    } else if (sType.includes('wedding') || sType.includes('marriage')) {
      return `https://images.unsplash.com/featured/800x600/?sig=${sig}&wedding,bride,couple`;
    } else {
      return `https://images.unsplash.com/featured/800x600/?sig=${sig}&fashion,model,portrait`;
    }
  }
}

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
      image: (match.image && !match.image.includes('photo-1519741497674-611481863552') && !match.image.includes('photo-1511285560929-80b456fea0bc') && !match.image.includes('photo-1542038784456-1ea8e935640e') && !match.image.includes('photo-1504196606672-aef5c9cefc92'))
        ? match.image
        : getDeterministicImage(er.name, match.type || 'service', match.serviceType, index),
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
    let description = '';
    let category = '';
    let serviceType = null;
    let studioType = null;
    
    if (type === 'studio') {
      price = 2000;
      description = `Premium studio rental space available for photography, videography, and creative productions in ${er.area}, Hyderabad. Features professional lighting and multiple backgrounds.`;
      category = 'Studios';
      studioType = 'Portrait Studio';
    } else {
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
    
    const image = getDeterministicImage(er.name, type, serviceType, index);
    
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
  
  // Custom professional photography shoot overrides (focusing on scenery, gear, and decor - NO persons/faces)
  if (erNameClean.includes('lorven')) {
    mapped.image = 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80';
  } else if (erNameClean.includes('shriyak')) {
    mapped.image = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80';
  } else if (erNameClean.includes('satyasai')) {
    mapped.image = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80';
  } else if (erNameClean.includes('photoshilpi')) {
    mapped.image = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80';
  } else if (erNameClean.includes('pixelnew')) {
    mapped.image = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80';
  } else if (erNameClean.includes('tendertots')) {
    mapped.image = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80';
  } else if (erNameClean.includes('weddingstories')) {
    mapped.image = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';
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
