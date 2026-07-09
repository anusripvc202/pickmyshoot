async function testBoth() {
  const endpoints = [
    'https://ttjywwxethwoqgtcvzno.supabase.co/functions/v1/api/health',
    'https://ttjywwxethwoqgtcvzno.supabase.co/functions/v1/clever-action/health'
  ];

  for (const url of endpoints) {
    console.log(`\nTesting: ${url}`);
    try {
      const res = await fetch(url);
      console.log(`Status: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.log('Response body:', text);
    } catch (err) {
      console.error('Fetch error:', err.message);
    }
  }
}
testBoth();
