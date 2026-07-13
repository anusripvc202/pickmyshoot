import pg from 'pg';

const SUPABASE_DB_URL = 'postgresql://postgres:anusripvc202@db.ttjywwxethwoqgtcvzno.supabase.co:5432/postgres';

async function run() {
  const pgClient = new pg.Client({ connectionString: SUPABASE_DB_URL });
  await pgClient.connect();
  
  try {
    console.log('Creating "messages" table in Supabase...');

    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS "messages" (
        "_id" TEXT PRIMARY KEY,
        "sessionId" TEXT NOT NULL,
        "senderId" TEXT NOT NULL,
        "recipientId" TEXT NOT NULL,
        "text" TEXT NOT NULL,
        "time" TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log('✅ "messages" table created successfully or already exists!');

    // Show current tables structure
    const res = await pgClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('\nActive Public Tables:');
    console.table(res.rows);

  } catch (err) {
    console.error('❌ Error creating messages table:', err);
  } finally {
    await pgClient.end();
  }
}
run();
