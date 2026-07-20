import pg from 'pg';
import { models, gearRentals, workshops, jobs } from '../src/data/mockData.js';

const SUPABASE_DB_URL = 'postgresql://postgres:anusripvc202@db.ttjywwxethwoqgtcvzno.supabase.co:5432/postgres';

async function run() {
  console.log('Connecting to database...');
  const pgClient = new pg.Client({ connectionString: SUPABASE_DB_URL });
  await pgClient.connect();
  console.log('Connected.');

  try {
    console.log('Clearing existing models, gear, workshops, and jobs...');
    await pgClient.query("DELETE FROM listings WHERE type IN ('model', 'gear', 'workshop', 'job');");
    console.log('Cleared.');

    // 1. Insert Models
    console.log(`Inserting ${models.length} models...`);
    for (const m of models) {
      await pgClient.query(`
        INSERT INTO "listings" (
          "_id", "id", "title", "type", "price", "priceUnit", "image", "description", 
          "location", "rating", "reviews", "gender", "height", "categories", "active", "createdAt"
        ) VALUES ($1, $2, $3, 'model', $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, true, NOW())
      `, [
        m.id, m.id, m.title, JSON.stringify(m.price), m.priceUnit, m.image, m.description,
        m.location, JSON.stringify(m.rating), m.reviews || 0, m.gender || null, m.height || null, JSON.stringify(m.categories || [])
      ]);
    }

    // 2. Insert Gear Rentals
    console.log(`Inserting ${gearRentals.length} gear items...`);
    for (const g of gearRentals) {
      await pgClient.query(`
        INSERT INTO "listings" (
          "_id", "id", "title", "type", "price", "priceUnit", "image", "description", 
          "rating", "reviews", "category", "specs", "active", "createdAt"
        ) VALUES ($1, $2, $3, 'gear', $4, $5, $6, $7, $8, $9, $10, $11, true, NOW())
      `, [
        g.id, g.id, g.title, JSON.stringify(g.price), g.priceUnit, g.image, g.description,
        JSON.stringify(g.rating), g.reviews || 0, g.category || null, g.specs || null
      ]);
    }

    // 3. Insert Workshops
    console.log(`Inserting ${workshops.length} workshops...`);
    for (const w of workshops) {
      await pgClient.query(`
        INSERT INTO "listings" (
          "_id", "id", "title", "type", "price", "image", "description", 
          "rating", "reviews", "instructor", "date", "timing", "location", "workshopType", "active", "createdAt"
        ) VALUES ($1, $2, $3, 'workshop', $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, true, NOW())
      `, [
        w.id, w.id, w.title, JSON.stringify(w.price), w.image, w.description,
        JSON.stringify(w.rating), w.reviews || 0, w.instructor || null, w.date || null, w.timing || null, w.location || null, w.workshopType || null
      ]);
    }

    // 4. Insert Jobs
    console.log(`Inserting ${jobs.length} jobs...`);
    for (const j of jobs) {
      await pgClient.query(`
        INSERT INTO "listings" (
          "_id", "id", "title", "type", "price", "image", "description", 
          "rating", "company", "location", "skills", "jobType", "active", "createdAt"
        ) VALUES ($1, $2, $3, 'job', $4, $5, $6, $7, $8, $9, $10, $11, true, NOW())
      `, [
        j.id, j.id, j.title, JSON.stringify(j.price), j.image, j.description,
        JSON.stringify(j.rating), j.company || null, j.location || null, JSON.stringify(j.skills || []), j.type || null
      ]);
    }

    console.log('🎉 Seeding of all empty categories successfully completed!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await pgClient.end();
    console.log('Database connection closed.');
  }
}

run();
