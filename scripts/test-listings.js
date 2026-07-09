async function checkListings() {
  console.log('Fetching live Vercel listings endpoint...');
  try {
    const res = await fetch('https://pickmyshoot-phi.vercel.app/api/listings');
    console.log(`Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log('Response body:', text.slice(0, 500));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
checkListings();
