import pg from 'pg';

const SUPABASE_DB_URL = 'postgresql://postgres:anusripvc202@db.ttjywwxethwoqgtcvzno.supabase.co:5432/postgres';

async function run() {
  const pgClient = new pg.Client({ connectionString: SUPABASE_DB_URL });
  await pgClient.connect();
  
  try {
    console.log('Resetting verification status for nikhiljai1215@gmail.com...');

    // Reset users table
    const userRes = await pgClient.query(`
      UPDATE users 
      SET "isVerified" = false 
      WHERE email = 'nikhiljai1215@gmail.com'
      RETURNING name, email, "isVerified";
    `);
    console.log('Users update results:');
    console.table(userRes.rows);

    // Reset photographers table
    const photoRes = await pgClient.query(`
      UPDATE photographers 
      SET "isVerified" = false, "code" = 'No Code'
      WHERE email = 'nikhiljai1215@gmail.com'
      RETURNING name, email, "isVerified", code;
    `);
    console.log('Photographers update results:');
    console.table(photoRes.rows);

    console.log('Reset completed successfully! You can now test the verification code entry flow.');

  } catch (err) {
    console.error('Error resetting verification status:', err);
  } finally {
    await pgClient.end();
  }
}
run();
