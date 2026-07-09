import pg from 'pg';

const SUPABASE_DB_URL = 'postgresql://postgres:anusripvc202@db.ttjywwxethwoqgtcvzno.supabase.co:5432/postgres';

async function run() {
  const pgClient = new pg.Client({ connectionString: SUPABASE_DB_URL });
  await pgClient.connect();
  
  try {
    const res = await pgClient.query('SELECT _id, id, title, type, "creatorId", "ownerId" FROM listings LIMIT 15');
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pgClient.end();
  }
}
run();
