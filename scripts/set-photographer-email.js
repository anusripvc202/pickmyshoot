import pg from 'pg';

const SUPABASE_DB_URL = 'postgresql://postgres:anusripvc202@db.ttjywwxethwoqgtcvzno.supabase.co:5432/postgres';

async function run() {
  const pgClient = new pg.Client({ connectionString: SUPABASE_DB_URL });
  await pgClient.connect();
  
  try {
    console.log('Updating Jaideepvarma\'s email to anusripvc202@gmail.com in Supabase...');
    
    // Update users table
    await pgClient.query(`
      UPDATE "users" 
      SET "email" = 'anusripvc202@gmail.com' 
      WHERE "name" = 'Jaideepvarma';
    `);
    
    // Update photographers table
    await pgClient.query(`
      UPDATE "photographers" 
      SET "email" = 'anusripvc202@gmail.com' 
      WHERE "name" = 'Jaideepvarma';
    `);
    
    console.log('Update completed successfully!');

    // Show updated list of photographer emails
    const res = await pgClient.query('SELECT name, email, role FROM users WHERE role = \'photographer\'');
    console.table(res.rows);

  } catch (err) {
    console.error('Error during email update:', err);
  } finally {
    await pgClient.end();
  }
}
run();
