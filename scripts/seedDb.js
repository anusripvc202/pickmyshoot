import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../api/models/User.js';
import Listing from '../api/models/Listing.js';
import Booking from '../api/models/Booking.js';
import { popularServices, studios, models, gearRentals, workshops, jobs } from '../src/data/mockData.js';

const MONGODB_URI = process.env.MONGODB_URI;

const defaultUsers = [
  {
    _id: new mongoose.Types.ObjectId('6a380b1e73c0e340a6bf3a41'),
    id: '6a380b1e73c0e340a6bf3a41',
    name: 'Anusha',
    role: 'admin',
    email: 'anusripvc202@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
    bio: 'Platform Security Control Center Administrator.',
    location: 'Hyderabad, TS',
    phone: '+91 99999 88888',
    isVerified: true
  },
  {
    _id: new mongoose.Types.ObjectId('6a380b8173c0e340a6bf3a42'),
    id: '6a380b8173c0e340a6bf3a42',
    name: 'Nikhil',
    role: 'photographer',
    email: 'nikhiljai1215@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    bio: 'Professional fashion and commercial photographer.',
    location: 'Hyderabad, TS',
    phone: '+91 98765 43210',
    isVerified: true
  },
  {
    _id: new mongoose.Types.ObjectId('6a380bd273c0e340a6bf3a43'),
    id: '6a380bd273c0e340a6bf3a43',
    name: 'Sri',
    role: 'client',
    email: 'ssrajuqc@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80',
    bio: 'Creative director looking for studios and photographer gear.',
    location: 'Hyderabad, TS',
    phone: '+91 88888 77777',
    isVerified: false
  },
  {
    _id: new mongoose.Types.ObjectId('6a39140ec8fbd2d7e85f0d91'),
    id: '6a39140ec8fbd2d7e85f0d91',
    name: 'Jaideep',
    role: 'client',
    email: 'anusripvc203@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    bio: 'Creative client seeking fashion and lookbook photographers.',
    location: 'Hyderabad, TS',
    phone: '+91 77777 66666',
    isVerified: false
  },
  {
    _id: new mongoose.Types.ObjectId('6a391527c8fbd2d7e85f0d92'),
    id: '6a391527c8fbd2d7e85f0d92',
    name: 'Jaideepvarma',
    role: 'photographer',
    email: 'anusripvc204@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    bio: 'Wedding cinematographer and event shooter.',
    location: 'Hyderabad, TS',
    phone: '+91 66666 55555',
    isVerified: true
  },
  {
    _id: new mongoose.Types.ObjectId('6a3920c7454a6492befc0840'),
    id: '6a3920c7454a6492befc0840',
    name: 'Maddiboina Lokesh',
    role: 'client',
    email: '2100030312@kluniversity.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    bio: 'E-commerce product visual manager.',
    location: 'Hyderabad, TS',
    phone: '+91 99999 00000',
    isVerified: false
  }
];

const defaultBookings = [
  {
    _id: new mongoose.Types.ObjectId('6a380cd2e8e2b5a210d86675'),
    listingId: 'st-1',
    clientId: '6a380bd273c0e340a6bf3a43',
    creatorId: '6a380b8173c0e340a6bf3a42',
    ownerId: '6a380b8173c0e340a6bf3a42',
    itemType: 'Studio',
    title: 'nikhil studio',
    date: '20 SUN',
    time: '11:00 AM',
    price: 2000,
    status: 'cancelled',
    clientName: 'Sri',
    clientEmail: 'ssrajuqc@gmail.com',
    clientPhone: '+91 88888 77777',
    item: { title: 'nikhil studio', price: 2000, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' }
  },
  {
    _id: new mongoose.Types.ObjectId('6a391482dba94297fcc9d223'),
    listingId: 'st-2',
    clientId: '6a39140ec8fbd2d7e85f0d91',
    creatorId: '6a380b8173c0e340a6bf3a42',
    ownerId: '6a380b8173c0e340a6bf3a42',
    itemType: 'Studio',
    title: "Jai's studio",
    date: '21 MON',
    time: '02:00 PM',
    price: 35000,
    status: 'pending',
    clientName: 'Jaideep',
    clientEmail: 'anusripvc203@gmail.com',
    clientPhone: '+91 77777 66666',
    item: { title: "Jai's studio", price: 35000, image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80' }
  },
  {
    _id: new mongoose.Types.ObjectId('6a3915cddba94297fcc9d224'),
    listingId: 'st-1',
    clientId: '6a39140ec8fbd2d7e85f0d91',
    creatorId: '6a391527c8fbd2d7e85f0d92',
    ownerId: '6a391527c8fbd2d7e85f0d92',
    itemType: 'Studio',
    title: 'nikhil studio',
    date: '22 TUE',
    time: '09:00 AM',
    price: 2000,
    status: 'cancelled',
    clientName: 'Jaideep',
    clientEmail: 'anusripvc203@gmail.com',
    clientPhone: '+91 77777 66666',
    item: { title: 'nikhil studio', price: 2000, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' }
  },
  {
    _id: new mongoose.Types.ObjectId('6a3b756d165e3aa7267b5db5'),
    listingId: 'ws-1',
    clientId: '6a380bd273c0e340a6bf3a43',
    creatorId: '6a380b1e73c0e340a6bf3a41',
    ownerId: '6a380b1e73c0e340a6bf3a41',
    itemType: 'Workshop',
    title: 'NID Ahmedabad',
    date: 'Immediate',
    time: 'Admissions Open',
    price: 'Free',
    status: 'pending',
    clientName: 'Sri',
    clientEmail: 'ssrajuqc@gmail.com',
    clientPhone: '+91 88888 77777',
    item: { title: 'NID Ahmedabad', price: 'Free', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80' }
  }
];

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected.');

    // 1. Clear database first
    console.log('🧹 Dropping existing collections...');
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Booking.deleteMany({});

    // 2. Insert Users
    console.log('👤 Seeding default users...');
    await User.insertMany(defaultUsers);
    console.log(`✅ Seeded ${defaultUsers.length} users.`);

    // 3. Insert Listings from mockData.js
    console.log('📂 Preparing listings catalog data...');
    const dbListings = [];

    popularServices.forEach(s => dbListings.push({ ...s, type: 'service', active: true }));
    studios.forEach(st => dbListings.push({ ...st, type: 'studio', active: true }));
    models.forEach(m => dbListings.push({ ...m, type: 'model', active: true }));
    gearRentals.forEach(g => dbListings.push({ ...g, type: 'gear', active: true }));
    workshops.forEach(w => dbListings.push({ ...w, type: 'workshop', active: true }));
    jobs.forEach(j => dbListings.push({ ...j, type: 'job', active: true }));

    // Assign owner/creator IDs where appropriate
    dbListings.forEach(item => {
      if (item.type === 'service') {
        item.ownerId = '6a380b8173c0e340a6bf3a42'; // Nikhil
        item.creatorId = '6a380b8173c0e340a6bf3a42';
      } else if (item.type === 'studio') {
        item.ownerId = '6a380b8173c0e340a6bf3a42'; // Nikhil
        item.creatorId = '6a380b8173c0e340a6bf3a42';
      }
    });

    console.log('🛍️ Seeding listings catalog into database...');
    await Listing.insertMany(dbListings);
    console.log(`✅ Seeded ${dbListings.length} listings catalog items.`);

    // 4. Insert Bookings
    console.log('📅 Seeding default bookings...');
    await Booking.insertMany(defaultBookings);
    console.log(`✅ Seeded ${defaultBookings.length} bookings.`);

    console.log('\n🌟 Database seeding completed successfully!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
    process.exit(0);
  }
}

seed();
