import pg from 'pg';

const SUPABASE_DB_URL = 'postgresql://postgres:anusripvc202@db.ttjywwxethwoqgtcvzno.supabase.co:5432/postgres';

async function run() {
  console.log('Connecting to database...');
  const pgClient = new pg.Client({ connectionString: SUPABASE_DB_URL });
  await pgClient.connect();
  console.log('Connected.');

  try {
    console.log('Altering "listings" table to add phone and social columns...');
    await pgClient.query(`
      ALTER TABLE "listings" 
      ADD COLUMN IF NOT EXISTS "phone" text,
      ADD COLUMN IF NOT EXISTS "webUrl" text,
      ADD COLUMN IF NOT EXISTS "gmbUrl" text,
      ADD COLUMN IF NOT EXISTS "fbUrl" text;
    `);
    console.log('Columns added successfully.');
  } catch (err) {
    console.error('Error altering table:', err);
  } finally {
    await pgClient.end();
    console.log('Database connection closed.');
  }
}

run();
