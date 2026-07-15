import 'dotenv/config';
import mongoose from 'mongoose';
import Listing from '../api_old/models/Listing.js';

const MONGODB_URI = process.env.MONGODB_URI;

async function migrate() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    // Find documents to migrate
    const query = {
      $or: [
        { title: /studio/i },
        { type: 'service', title: { $in: ['anustudio', 'anusstudio'] } }
      ]
    };

    const listingsToMigrate = await Listing.find(query);
    console.log(`Found ${listingsToMigrate.length} listings to migrate:`);
    listingsToMigrate.forEach(l => {
      console.log(`- Title: "${l.title}" | Current Type: "${l.type}" | ID: ${l._id}`);
    });

    if (listingsToMigrate.length === 0) {
      console.log('No listings need migration.');
      return;
    }

    // Perform updates
    const result = await Listing.updateMany(query, { $set: { type: 'studio' } });
    console.log(`Successfully updated ${result.modifiedCount} listing(s) to type: "studio"!`);

    // Verify
    const updatedListings = await Listing.find({ type: 'studio' });
    console.log('All current Studio Space listings in DB:');
    updatedListings.forEach(l => {
      console.log(`- Title: "${l.title}" | Type: "${l.type}" | Location: "${l.location}"`);
    });

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

migrate();
