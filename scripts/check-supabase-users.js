import pg from 'pg';

const SUPABASE_DB_URL = 'postgresql://postgres:anusripvc202@db.ttjywwxethwoqgtcvzno.supabase.co:5432/postgres';

async function run() {
  const pgClient = new pg.Client({ connectionString: SUPABASE_DB_URL });
  await pgClient.connect();
  
  try {
    const usersRes = await pgClient.query('SELECT _id, id, name, email, role FROM users');
    console.log('\n--- USERS ---');
    console.table(usersRes.rows);

    const listingsRes = await pgClient.query('SELECT _id, title, type, "creatorId" FROM listings LIMIT 5');
    console.log('\n--- LISTINGS (First 5) ---');
    console.table(listingsRes.rows);

    const bookingsRes = await pgClient.query('SELECT _id, "listingId", "clientId", "creatorId", status FROM bookings LIMIT 5');
    console.log('\n--- BOOKINGS (First 5) ---');
    console.table(bookingsRes.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await pgClient.end();
  }
}
run();
