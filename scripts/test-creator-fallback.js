import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../api/models/User.js';
import Photographer from '../api/models/Photographer.js';

async function testLookup(creatorId) {
  console.log(`\n🔍 Testing lookup for creatorId: "${creatorId}"`);
  
  // 1. Query User collection
  const photographerUser = await User.findOne({
    $or: [
      { _id: creatorId },
      { id: creatorId }
    ]
  }).lean().catch(() => null);

  let recipientEmail = photographerUser?.email;
  let recipientName = photographerUser?.name;
  let source = 'User Collection';

  // 2. Query Photographer collection if not found in User
  if (!recipientEmail && creatorId) {
    const photographerProfile = await Photographer.findOne({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(creatorId) ? creatorId : null },
        { slug: creatorId },
        { name: creatorId }
      ].filter(Boolean)
    }).lean().catch(() => null);

    if (photographerProfile) {
      recipientEmail = photographerProfile.email;
      recipientName = photographerProfile.name;
      source = 'Photographer Collection';
    }
  }

  // 3. Fallback to SMTP_EMAIL
  if (!recipientEmail) {
    recipientEmail = process.env.SMTP_EMAIL;
    recipientName = photographerUser?.name || 'Demo Photographer (Mock Profile)';
    source = 'Default Fallback (SMTP_EMAIL)';
  }

  console.log(`👉 Result: Name="${recipientName}", Email="${recipientEmail}" (Source: ${source})`);
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  // Test Case 1: Nikhil (User Collection)
  await testLookup('6a380b8173c0e340a6bf3a42');

  // Test Case 2: Jaideepvarma (Photographer Collection only)
  await testLookup('6a4dde26b7e83c1231fd9231');

  // Test Case 3: Missing/Desynced profile ID (Fallback to SMTP_EMAIL)
  await testLookup('prof-1783576365629');

  await mongoose.disconnect();
  console.log('\nDisconnected from DB. Test complete!');
}

run().catch(err => console.error('Test error:', err));
