import 'dotenv/config';
import mongoose from 'mongoose';
import Photographer from '../api/models/Photographer.js';
import User from '../api/models/User.js';
import Listing from '../api/models/Listing.js';

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  const listings = await Listing.find({}).lean();
  console.log('\n--- LISTINGS IN DB ---');
  listings.forEach(l => {
    console.log(`Title: ${l.title}, Type: ${l.type}, ownerId: ${l.ownerId}, creatorId: ${l.creatorId}`);
  });

  const photographers = await Photographer.find({}).lean();
  console.log('\n--- PHOTOGRAPHERS IN DB ---');
  photographers.forEach(p => {
    console.log(`Name: ${p.name}, Email: ${p.email}, _id: ${p._id}, code: ${p.code}`);
  });

  const users = await User.find({}).lean();
  console.log('\n--- USERS IN DB ---');
  users.forEach(u => {
    console.log(`Name: ${u.name}, Email: ${u.email}, id: ${u.id}, _id: ${u._id}, role: ${u.role}`);
  });

  await mongoose.disconnect();
}

run();
