import pg from 'pg';

const SUPABASE_DB_URL = 'postgresql://postgres:anusripvc202@db.ttjywwxethwoqgtcvzno.supabase.co:5432/postgres';

async function run() {
  const pgClient = new pg.Client({ connectionString: SUPABASE_DB_URL });
  await pgClient.connect();
  
  try {
    const bookingsRes = await pgClient.query('SELECT _id, title, "clientId", "creatorId", status, "clientEmail" FROM bookings ORDER BY _id DESC LIMIT 10');
    console.log('\n--- LATEST BOOKINGS ---');
    console.table(bookingsRes.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await pgClient.end();
  }
}
run();
