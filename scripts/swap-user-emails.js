import pg from 'pg';

const SUPABASE_DB_URL = 'postgresql://postgres:anusripvc202@db.ttjywwxethwoqgtcvzno.supabase.co:5432/postgres';

async function run() {
  const pgClient = new pg.Client({ connectionString: SUPABASE_DB_URL });
  await pgClient.connect();
  
  try {
    console.log('Swapping user emails in Supabase PostgreSQL...');
    
    // 1. Change Anusha's email temporarily to a different address
    await pgClient.query(`
      UPDATE "users" 
      SET "email" = 'anusripvc202+admin@gmail.com' 
      WHERE "name" = 'Anusha';
    `);
    
    // 2. Change Jaideepvarma's email to anusripvc202@gmail.com
    await pgClient.query(`
      UPDATE "users" 
      SET "email" = 'anusripvc202@gmail.com' 
      WHERE "name" = 'Jaideepvarma';
    `);

    // 3. Update photographers table for Jaideepvarma
    await pgClient.query(`
      UPDATE "photographers" 
      SET "email" = 'anusripvc202@gmail.com' 
      WHERE "name" = 'Jaideepvarma';
    `);
    
    console.log('Emails updated successfully!');
    
    const res = await pgClient.query('SELECT name, email, role FROM users');
    console.table(res.rows);

  } catch (err) {
    console.error('Error during email swap:', err);
  } finally {
    await pgClient.end();
  }
}
run();
