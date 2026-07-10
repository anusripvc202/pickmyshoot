// debug-baby-picnic.js
// Inspect the DB listing for Outdoor Garden Baby Picnic
const PROD_API = 'https://ttjywwxethwoqgtcvzno.supabase.co/functions/v1/api';

async function run() {
  const res = await fetch(`${PROD_API}/listings`);
  const listings = await res.json();

  const matches = listings.filter(l => l.title && l.title.toLowerCase().includes('baby'));
  console.log('🔍 All baby-related listings in DB:\n');
  matches.forEach(l => {
    console.log('Title   :', l.title);
    console.log('ID      :', l.id || l._id);
    console.log('Image   :', l.image);
    console.log('Active  :', l.active);
    console.log('Type    :', l.type);
    console.log('---');
  });

  if (matches.length === 0) console.log('None found.');
}

run().catch(console.error);
