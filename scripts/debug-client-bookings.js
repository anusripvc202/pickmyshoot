import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../api/models/User.js';
import Booking from '../api/models/Booking.js';

const MONGODB_URI = process.env.MONGODB_URI;

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');
    
    const users = await User.find({});
    const bookings = await Booking.find({});
    
    console.log('\n--- USERS IN DB ---');
    users.forEach(u => {
      console.log(`Name: ${u.name}, Email: ${u.email}, id: ${u.id}, _id: ${u._id}`);
    });
    
    console.log('\n--- BOOKINGS IN DB ---');
    bookings.forEach(b => {
      console.log(`Title: ${b.title}, clientId: ${b.clientId}, creatorId: ${b.creatorId}, status: ${b.status}`);
    });
    
    console.log('\n--- FILTERING SIMULATION ---');
    users.forEach(u => {
      const activeProfileId = u.id || u._id.toString();
      const currentUser = u;
      
      const filtered = bookings.filter(b => {
        const matchActiveProfile = b.clientId === activeProfileId;
        const matchCurrentUserId = currentUser && b.clientId === currentUser.id;
        const matchCurrentUserMongoId = currentUser && b.clientId === currentUser._id?.toString();
        
        return matchActiveProfile || matchCurrentUserId || matchCurrentUserMongoId;
      });
      
      console.log(`User: ${u.name} (${u.role}) -> matched ${filtered.length} bookings`);
      filtered.forEach(f => {
        console.log(`  - Matched booking: "${f.title}"`);
      });
    });
    
  } catch (err) {
    console.error('Failed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();
