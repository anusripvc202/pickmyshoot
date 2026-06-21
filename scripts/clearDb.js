import 'dotenv/config';
import mongoose from 'mongoose';

(async () => {
  try {
    console.log('🔌 Connecting to MongoDB…');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected.\n');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    if (collections.length === 0) {
      console.log('ℹ️  Database is already empty — nothing to clear.');
    } else {
      for (const col of collections) {
        await db.dropCollection(col.name);
        console.log(`🗑️  Dropped collection: ${col.name}`);
      }
      console.log(`\n✅ Done — ${collections.length} collection(s) cleared.`);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected.');
    process.exit(0);
  }
})();
