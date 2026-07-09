async function check() {
  console.log('Testing clever-action health...');
  try {
    const res = await fetch('https://ttjywwxethwoqgtcvzno.supabase.co/functions/v1/clever-action/health');
    console.log(`Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log('Response body:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
check();
