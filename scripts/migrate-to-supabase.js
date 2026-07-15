import 'dotenv/config';
import mongoose from 'mongoose';
import pg from 'pg';
import User from '../api_old/models/User.js';
import Listing from '../api_old/models/Listing.js';
import Booking from '../api_old/models/Booking.js';
import Photographer from '../api_old/models/Photographer.js';
import LoginActivity from '../api_old/models/LoginActivity.js';

const MONGODB_URI = process.env.MONGODB_URI;
const SUPABASE_DB_URL = 'postgresql://postgres:anusripvc202@db.ttjywwxethwoqgtcvzno.supabase.co:5432/postgres';

async function migrate() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Successfully connected to MongoDB.');

  console.log('Connecting to Supabase PostgreSQL...');
  const pgClient = new pg.Client({ connectionString: SUPABASE_DB_URL });
  await pgClient.connect();
  console.log('Successfully connected to Supabase PostgreSQL.');

  try {
    // ── Drop existing tables ──
    console.log('\nCleaning up old tables in Supabase...');
    await pgClient.query('DROP TABLE IF EXISTS "login_activities";');
    await pgClient.query('DROP TABLE IF EXISTS "bookings";');
    await pgClient.query('DROP TABLE IF EXISTS "listings";');
    await pgClient.query('DROP TABLE IF EXISTS "photographers";');
    await pgClient.query('DROP TABLE IF EXISTS "users";');
    console.log('Old tables cleaned.');

    // ── Create tables ──
    console.log('\nCreating new tables in Supabase...');
    await pgClient.query(`
      CREATE TABLE "users" (
        "_id" TEXT PRIMARY KEY,
        "id" TEXT,
        "name" TEXT NOT NULL,
        "email" TEXT UNIQUE NOT NULL,
        "role" TEXT DEFAULT 'client',
        "avatar" TEXT,
        "bio" TEXT,
        "location" TEXT,
        "rating" TEXT,
        "isVerified" BOOLEAN DEFAULT FALSE,
        "phone" TEXT,
        "shoots" TEXT,
        "followers" TEXT,
        "revenue" TEXT,
        "success" TEXT,
        "views" TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await pgClient.query(`
      CREATE TABLE "photographers" (
        "_id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "slug" TEXT UNIQUE NOT NULL,
        "location" TEXT,
        "isVerified" BOOLEAN DEFAULT FALSE,
        "code" TEXT DEFAULT 'No Code',
        "status" TEXT DEFAULT 'Active',
        "email" TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await pgClient.query(`
      CREATE TABLE "listings" (
        "_id" TEXT PRIMARY KEY,
        "id" TEXT,
        "title" TEXT NOT NULL,
        "type" TEXT DEFAULT 'studio',
        "price" JSONB NOT NULL,
        "priceUnit" TEXT DEFAULT 'hr',
        "image" TEXT,
        "description" TEXT,
        "location" TEXT,
        "rating" JSONB,
        "reviews" INTEGER DEFAULT 0,
        "creatorId" TEXT,
        "ownerId" TEXT,
        "active" BOOLEAN DEFAULT TRUE,
        "isFeatured" BOOLEAN DEFAULT FALSE,
        "amenities" JSONB,
        "features" JSONB,
        "capacity" TEXT,
        "area" TEXT,
        "studioType" TEXT,
        "categories" JSONB,
        "gender" TEXT,
        "height" TEXT,
        "category" TEXT,
        "specs" TEXT,
        "includes" TEXT,
        "skills" JSONB,
        "company" TEXT,
        "jobType" TEXT,
        "instructor" TEXT,
        "date" TEXT,
        "timing" TEXT,
        "workshopType" TEXT,
        "specialization" TEXT,
        "experience" TEXT,
        "portfolio" TEXT,
        "serviceType" TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await pgClient.query(`
      CREATE TABLE "bookings" (
        "_id" TEXT PRIMARY KEY,
        "listingId" TEXT,
        "clientId" TEXT NOT NULL,
        "creatorId" TEXT NOT NULL,
        "itemType" TEXT,
        "title" TEXT,
        "date" TEXT NOT NULL,
        "time" TEXT,
        "price" JSONB NOT NULL,
        "status" TEXT DEFAULT 'pending',
        "item" JSONB,
        "ownerId" TEXT,
        "clientName" TEXT,
        "clientEmail" TEXT,
        "clientPhone" TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await pgClient.query(`
      CREATE TABLE "login_activities" (
        "_id" TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "role" TEXT NOT NULL,
        "avatar" TEXT,
        "loginTime" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('Tables created successfully.');

    // ── Migrate Users ──
    console.log('\nMigrating Users...');
    const mongoUsers = await User.find({}).lean();
    for (const u of mongoUsers) {
      await pgClient.query(`
        INSERT INTO "users" (
          "_id", "id", "name", "email", "role", "avatar", "bio", "location", 
          "rating", "isVerified", "phone", "shoots", "followers", "revenue", 
          "success", "views", "createdAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      `, [
        u._id.toString(), u.id || u._id.toString(), u.name, u.email, u.role, u.avatar, u.bio, u.location,
        u.rating, u.isVerified, u.phone, u.shoots, u.followers, u.revenue,
        u.success, u.views, u.createdAt
      ]);
    }
    console.log(`Migrated ${mongoUsers.length} Users.`);

    // ── Migrate Photographers ──
    console.log('\nMigrating Photographers...');
    const mongoPhotographers = await Photographer.find({}).lean();
    for (const p of mongoPhotographers) {
      await pgClient.query(`
        INSERT INTO "photographers" (
          "_id", "name", "slug", "location", "isVerified", "code", "status", "email", "createdAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        p._id.toString(), p.name, p.slug, p.location, p.isVerified, p.code, p.status, p.email, p.createdAt
      ]);
    }
    console.log(`Migrated ${mongoPhotographers.length} Photographers.`);

    // ── Migrate Listings ──
    console.log('\nMigrating Listings...');
    const mongoListings = await Listing.find({}).lean();
    for (const l of mongoListings) {
      await pgClient.query(`
        INSERT INTO "listings" (
          "_id", "id", "title", "type", "price", "priceUnit", "image", "description", 
          "location", "rating", "reviews", "creatorId", "ownerId", "active", "isFeatured", 
          "amenities", "features", "capacity", "area", "studioType", "categories", 
          "gender", "height", "category", "specs", "includes", "skills", "company", 
          "jobType", "instructor", "date", "timing", "workshopType", "specialization", 
          "experience", "portfolio", "serviceType", "createdAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38)
      `, [
        l._id.toString(), l.id || l._id.toString(), l.title, l.type, JSON.stringify(l.price), l.priceUnit, l.image, l.description,
        l.location, JSON.stringify(l.rating), l.reviews, l.creatorId, l.ownerId, l.active, l.isFeatured,
        JSON.stringify(l.amenities), JSON.stringify(l.features), l.capacity, l.area, l.studioType, JSON.stringify(l.categories),
        l.gender, l.height, l.category, l.specs, l.includes, JSON.stringify(l.skills), l.company,
        l.jobType, l.instructor, l.date, l.timing, l.workshopType, l.specialization,
        l.experience, l.portfolio, l.serviceType, l.createdAt
      ]);
    }
    console.log(`Migrated ${mongoListings.length} Listings.`);

    // ── Migrate Bookings ──
    console.log('\nMigrating Bookings...');
    const mongoBookings = await Booking.find({}).lean();
    for (const b of mongoBookings) {
      await pgClient.query(`
        INSERT INTO "bookings" (
          "_id", "listingId", "clientId", "creatorId", "itemType", "title", "date", 
          "time", "price", "status", "item", "ownerId", "clientName", "clientEmail", "clientPhone", "createdAt"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      `, [
        b._id.toString(), b.listingId, b.clientId, b.creatorId, b.itemType, b.title, b.date,
        b.time, JSON.stringify(b.price), b.status, JSON.stringify(b.item), b.ownerId, b.clientName, b.clientEmail, b.clientPhone, b.createdAt
      ]);
    }
    console.log(`Migrated ${mongoBookings.length} Bookings.`);

    // ── Migrate Login Activities ──
    console.log('\nMigrating Login Activities...');
    const mongoLoginActivity = await LoginActivity.find({}).lean();
    for (const la of mongoLoginActivity) {
      await pgClient.query(`
        INSERT INTO "login_activities" (
          "_id", "userId", "name", "email", "role", "avatar", "loginTime"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        la._id.toString(), la.userId, la.name, la.email, la.role, la.avatar, la.loginTime
      ]);
    }
    console.log(`Migrated ${mongoLoginActivity.length} Login Activities.`);

    console.log('\n🎉 Database migration successfully completed!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await pgClient.end();
    await mongoose.disconnect();
  }
}

migrate();
