async function check() {
  console.log('Fetching live Vercel health endpoint...');
  try {
    const res = await fetch('https://pickmyshoot-phi.vercel.app/api/health');
    console.log(`Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log('Response body:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
check();
