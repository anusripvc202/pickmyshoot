async function run() {
  const url = 'https://pickmyshoot-phi.vercel.app/api/bookings';
  console.log(`Fetching bookings from: ${url}`);
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('Bookings fetched count:', data.length);
    if (data.length > 0) {
      console.log('First booking keys:', Object.keys(data[0]));
      console.log('First booking details:', {
        id: data[0].id,
        _id: data[0]._id,
        title: data[0].title,
        clientId: data[0].clientId,
        status: data[0].status
      });
    }
  } catch (err) {
    console.error('Fetch bookings failed:', err.message);
  }
}

run();
