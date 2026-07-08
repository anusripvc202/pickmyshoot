import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../api/models/User.js';
import Listing from '../api/models/Listing.js';
import Booking from '../api/models/Booking.js';
import Photographer from '../api/models/Photographer.js';

const MONGODB_URI = process.env.MONGODB_URI;

const defaultUsers = [
  {
    _id: '6a380b1e73c0e340a6bf3a41',
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
    _id: '6a380b8173c0e340a6bf3a42',
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
    _id: '6a380bd273c0e340a6bf3a43',
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
    _id: '6a39140ec8fbd2d7e85f0d91',
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
    _id: '6a391527c8fbd2d7e85f0d92',
    id: '6a391527c8fbd2d7e85f0d92',
    name: 'Jaideepvarma',
    role: 'photographer',
    email: 'anusripvc204@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    bio: 'Wedding cinematographer and event shooter.',
    location: 'Hyderabad, TS',
    phone: '+91 66666 55555',
    isVerified: false
  },
  {
    _id: '6a3920c7454a6492befc0840',
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

const defaultPhotographers = [
  {
    _id: '6a4dde26b7e83c1231fd9230',
    name: 'Nikhil',
    slug: 'nikhil-9589',
    location: 'Hyderabad, TS',
    isVerified: true,
    code: 'PMS-4043',
    status: 'Active',
    email: 'nikhiljai1215@gmail.com'
  },
  {
    _id: '6a4dde26b7e83c1231fd9231',
    name: 'Jaideepvarma',
    slug: 'jaideepvarma-8525',
    location: 'Hyderabad, TS',
    isVerified: false,
    code: 'No Code',
    status: 'Active',
    email: 'anusripvc204@gmail.com'
  }
];

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    // 1. Clear bookings
    console.log('Clearing Bookings collection...');
    await Booking.deleteMany({});
    console.log('Bookings cleared.');

    // 2. Clear listings
    console.log('Clearing Listings collection...');
    await Listing.deleteMany({});
    console.log('Listings cleared.');

    // 3. Clear and re-seed Users
    console.log('Clearing Users collection...');
    await User.deleteMany({});
    console.log('Seeding default Users...');
    await User.insertMany(defaultUsers);
    console.log('Users re-seeded successfully.');

    // 4. Clear and re-seed Photographers
    console.log('Clearing Photographers collection...');
    await Photographer.deleteMany({});
    console.log('Seeding default Photographers...');
    await Photographer.insertMany(defaultPhotographers);
    console.log('Photographers re-seeded successfully.');

    console.log('🎉 MongoDB database successfully cleared and reset to default seed data!');

  } catch (error) {
    console.error('Database reset failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

run();
