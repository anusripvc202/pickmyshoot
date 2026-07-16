import pg from 'pg';

const SUPABASE_DB_URL = 'postgresql://postgres:anusripvc202@db.ttjywwxethwoqgtcvzno.supabase.co:5432/postgres';

async function run() {
  const pgClient = new pg.Client({ connectionString: SUPABASE_DB_URL });
  await pgClient.connect();
  
  try {
    console.log('Clearing bookings...');
    await pgClient.query('DELETE FROM bookings;');
    
    console.log('Clearing listings...');
    await pgClient.query('DELETE FROM listings;');
    
    console.log('Clearing photographers...');
    await pgClient.query('DELETE FROM photographers;');
    
    console.log('Clearing login_activities...');
    await pgClient.query('DELETE FROM login_activities;');
    
    console.log('Clearing users...');
    await pgClient.query('DELETE FROM users;');
    
    console.log('🎉 Supabase database successfully cleared!');
  } catch (err) {
    console.error('❌ Clearing failed:', err);
  } finally {
    await pgClient.end();
  }
}

run();
