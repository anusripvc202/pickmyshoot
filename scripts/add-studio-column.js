import pg from 'pg';

const SUPABASE_DB_URL = 'postgresql://postgres:anusripvc202@db.ttjywwxethwoqgtcvzno.supabase.co:5432/postgres';

async function run() {
  const pgClient = new pg.Client({ connectionString: SUPABASE_DB_URL });
  await pgClient.connect();
  
  try {
    console.log('Adding "studioName" column to "users" table...');
    await pgClient.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "studioName" TEXT;');
    await pgClient.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "studio_name" TEXT;');
    console.log('Column added successfully!');

    // Update existing mock photographer users with their default studio names
    console.log('Seeding default studio names for mock photographers...');
    await pgClient.query(`
      UPDATE "users" 
      SET "studioName" = 'Nikhil Jai Photography & Studios', "studio_name" = 'Nikhil Jai Photography & Studios'
      WHERE "email" = 'nikhiljai1215@gmail.com';
    `);
    await pgClient.query(`
      UPDATE "users" 
      SET "studioName" = 'Jaideep Varma Films & Studios', "studio_name" = 'Jaideep Varma Films & Studios'
      WHERE "email" = 'anusripvc204@gmail.com';
    `);
    console.log('Seeding completed!');

  } catch (err) {
    console.error('Error during migration:', err);
  } finally {
    await pgClient.end();
  }
}
run();
