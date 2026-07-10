async function testBooking() {
  console.log("🚀 Testing live booking endpoint...");
  
  const payload = {
    _id: `test-bk-${Date.now()}`,
    title: "Test Pre-Wedding Shoot",
    itemType: "service",
    price: 5000,
    priceUnit: "hr",
    date: "2026-08-15",
    time: "10:00 AM",
    clientName: "Test User",
    clientEmail: "nikhiljai1215@gmail.com", // Send client email to yourself
    clientId: "6a380bd273c0e340a6bf3a43", // Sri's ID (Client)
    ownerId: "6a380b8173c0e340a6bf3a42", // Nikhil's ID (Photographer)
    creatorId: "6a380b8173c0e340a6bf3a42",
    status: "pending"
  };

  try {
    const res = await fetch('https://pickmyshoot-phi.vercel.app/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log(`Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log("Response body:");
    console.log(text);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

testBooking();
