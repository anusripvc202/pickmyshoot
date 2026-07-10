import pg from 'pg';

const SUPABASE_DB_URL = 'postgresql://postgres:anusripvc202@db.ttjywwxethwoqgtcvzno.supabase.co:5432/postgres';

async function run() {
  const pgClient = new pg.Client({ connectionString: SUPABASE_DB_URL });
  await pgClient.connect();
  
  try {
    console.log('Connecting to Supabase PostgreSQL database...');
    
    // Fetch list of tables in public schema
    const tablesRes = await pgClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\n📦 Database Tables:');
    console.table(tablesRes.rows);

    // For each table, describe its columns
    for (const row of tablesRes.rows) {
      const tableName = row.table_name;
      const columnsRes = await pgClient.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position;
      `, [tableName]);
      
      console.log(`\n📋 Columns in "${tableName}":`);
      console.table(columnsRes.rows);
    }

  } catch (err) {
    console.error('Error listing tables:', err);
  } finally {
    await pgClient.end();
  }
}
run();
