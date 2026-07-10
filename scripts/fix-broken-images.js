// fix-broken-images.js
// Finds listings in the DB with known-broken image URLs and patches them.
const PROD_API = 'https://ttjywwxethwoqgtcvzno.supabase.co/functions/v1/api';

// Map of broken Unsplash IDs → replacement URLs
const REPLACEMENTS = {
  'photo-1471286174240-e67f25be2477': 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=500&q=80',
};

async function run() {
  console.log('📦 Fetching all listings from DB...');
  const res = await fetch(`${PROD_API}/listings`);
  if (!res.ok) { console.error('Failed to fetch listings:', res.status); process.exit(1); }
  const listings = await res.json();
  console.log(`   Found ${listings.length} listings total.\n`);

  const toFix = listings.filter(l => {
    if (!l.image) return false;
    return Object.keys(REPLACEMENTS).some(badId => l.image.includes(badId));
  });

  if (toFix.length === 0) {
    console.log('✅ No broken images found in DB!');
    return;
  }

  console.log(`🔧 Found ${toFix.length} listing(s) with broken images:\n`);
  for (const item of toFix) {
    const id = item.id || item._id;
    const badKey = Object.keys(REPLACEMENTS).find(k => item.image.includes(k));
    const newImage = REPLACEMENTS[badKey];

    console.log(`   Listing: "${item.title}" (id: ${id})`);
    console.log(`   Old: ${item.image}`);
    console.log(`   New: ${newImage}`);

    const patchRes = await fetch(`${PROD_API}/listings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, image: newImage }),
    });

    if (patchRes.ok) {
      console.log(`   ✅ Patched successfully!\n`);
    } else {
      const err = await patchRes.text();
      console.error(`   ❌ Patch failed: ${err}\n`);
    }
  }
}

run().catch(err => { console.error('Script error:', err); process.exit(1); });
