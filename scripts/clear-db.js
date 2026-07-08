import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../api/models/User.js';
import Listing from '../api/models/Listing.js';
import Booking from '../api/models/Booking.js';
import Photographer from '../api/models/Photographer.js';
import { 
  popularServices, 
  studios, 
  gearRentals, 
  models, 
  workshops, 
  jobs, 
  institutes 
} from '../src/data/mockData.js';

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

// Map imported frontend mocks to MongoDB Listing schema format
const mappedServices = popularServices.map((s, idx) => ({
  _id: `6a5dde26b7e83c1231fd9${300 + idx}`,
  id: s.id,
  title: s.title,
  type: 'service',
  price: s.price,
  priceUnit: 'hr',
  image: s.image,
  description: s.description || '',
  location: 'Hyderabad, TS',
  rating: s.rating || 4.8,
  reviews: s.reviews || 10,
  ownerId: '6a380b8173c0e340a6bf3a42', // Nikhil (Photographer)
  creatorId: '6a380b8173c0e340a6bf3a42',
  active: true,
  isFeatured: idx % 3 === 0,
  serviceType: s.serviceType
}));

const mappedStudios = studios.map((s, idx) => ({
  _id: `6a5dde26b7e83c1231fd9${400 + idx}`,
  id: s.id,
  title: s.title,
  type: 'studio',
  price: s.price,
  priceUnit: s.priceUnit || 'hr',
  image: s.image,
  description: s.description || '',
  location: s.location || 'Hyderabad, TS',
  rating: s.rating || 4.8,
  reviews: s.reviews || 10,
  ownerId: '6a380b8173c0e340a6bf3a42', // Nikhil (Photographer)
  creatorId: '6a380b8173c0e340a6bf3a42',
  active: true,
  isFeatured: s.isFeatured || false,
  amenities: s.amenities || [],
  features: s.features || [],
  capacity: s.capacity,
  area: s.area,
  studioType: s.studioType
}));

const mappedGear = gearRentals.map((g, idx) => ({
  _id: `6a5dde26b7e83c1231fd9${500 + idx}`,
  id: g.id,
  title: g.title,
  type: 'gear',
  price: g.price,
  priceUnit: g.priceUnit || 'day',
  image: g.image,
  description: g.description || '',
  location: g.location || 'Hyderabad, TS',
  rating: g.rating || 4.8,
  reviews: g.reviews || 10,
  ownerId: '6a380b8173c0e340a6bf3a42', // Nikhil (Photographer)
  creatorId: '6a380b8173c0e340a6bf3a42',
  active: true,
  isFeatured: g.isFeatured || false,
  category: g.category,
  specs: g.specs || '',
  includes: g.includes || ''
}));

const mappedModels = models.map((m, idx) => ({
  _id: `6a5dde26b7e83c1231fd9${600 + idx}`,
  id: m.id,
  title: m.title,
  type: 'model',
  price: m.price,
  priceUnit: m.priceUnit || 'day',
  image: m.image,
  description: m.description || '',
  location: m.location || 'Hyderabad, TS',
  rating: m.rating || 4.8,
  reviews: m.reviews || 10,
  ownerId: `6a5dde26b7e83c1231fd9${600 + idx}`, // self owned for demo
  creatorId: `6a5dde26b7e83c1231fd9${600 + idx}`,
  active: true,
  isFeatured: idx % 2 === 0,
  categories: m.categories || [],
  gender: m.gender,
  height: m.height
}));

const mappedWorkshops = workshops.map((w, idx) => ({
  _id: `6a5dde26b7e83c1231fd9${700 + idx}`,
  id: w.id,
  title: w.title,
  type: 'workshop',
  price: w.price,
  priceUnit: 'ticket',
  image: w.image,
  description: w.description || '',
  location: w.location || 'Hyderabad, TS',
  rating: w.rating || 4.8,
  reviews: w.reviews || 10,
  ownerId: '6a380b1e73c0e340a6bf3a41', // Admin
  creatorId: '6a380b1e73c0e340a6bf3a41',
  active: true,
  isFeatured: w.isFeatured || false,
  instructor: w.instructor,
  date: w.date,
  timing: w.timing,
  workshopType: w.workshopType
}));

const mappedJobs = jobs.map((j, idx) => ({
  _id: `6a5dde26b7e83c1231fd9${800 + idx}`,
  id: j.id,
  title: j.title,
  type: 'job',
  price: j.price,
  priceUnit: 'month',
  image: j.image,
  description: j.description || '',
  location: j.location || 'Hyderabad, TS',
  rating: j.rating || 4.8,
  reviews: j.reviews || 10,
  ownerId: '6a380b1e73c0e340a6bf3a41', // Admin
  creatorId: '6a380b1e73c0e340a6bf3a41',
  active: true,
  isFeatured: false,
  skills: j.skills || [],
  company: j.company,
  jobType: j.type
}));

const mappedInstitutes = institutes.map((i, idx) => ({
  _id: `6a5dde26b7e83c1231fd9${900 + idx}`,
  id: i.id,
  title: i.title,
  type: 'institute',
  price: 'Admissions Open',
  priceUnit: 'course',
  image: i.image,
  description: i.description || '',
  location: i.location || 'Mumbai',
  rating: i.rating || 4.8,
  reviews: i.reviews || 10,
  ownerId: '6a380b1e73c0e340a6bf3a41', // Admin
  creatorId: '6a380b1e73c0e340a6bf3a41',
  active: true,
  isFeatured: false,
  company: i.title
}));

// Compile all mapped listings in a single list
const allListings = [
  ...mappedServices,
  ...mappedStudios,
  ...mappedGear,
  ...mappedModels,
  ...mappedWorkshops,
  ...mappedJobs,
  ...mappedInstitutes
];

// Seed realistic bookings across all roles
const defaultBookings = [
  {
    _id: '6a6dde26b7e83c1231fd9401',
    listingId: 'ps-1',
    clientId: '6a380bd273c0e340a6bf3a43', // Sri
    creatorId: '6a380b8173c0e340a6bf3a42', // Nikhil (Photographer)
    ownerId: '6a380b8173c0e340a6bf3a42',
    itemType: 'Service',
    title: 'Scenic Outdoor Pre-Wedding Shoot',
    date: '15 Jul 2026',
    time: '10:00 AM',
    price: 12999,
    status: 'pending',
    clientName: 'Sri',
    clientEmail: 'ssrajuqc@gmail.com',
    clientPhone: '+91 88888 77777'
  },
  {
    _id: '6a6dde26b7e83c1231fd9402',
    listingId: 'st-1',
    clientId: '6a3920c7454a6492befc0840', // Maddiboina Lokesh
    creatorId: '6a380b8173c0e340a6bf3a42', // Nikhil
    ownerId: '6a380b8173c0e340a6bf3a42',
    itemType: 'Studio',
    title: 'The Loft Studio',
    date: '20 Jul 2026',
    time: '02:00 PM',
    price: 1500,
    status: 'confirmed',
    clientName: 'Maddiboina Lokesh',
    clientEmail: '2100030312@kluniversity.in',
    clientPhone: '+91 99999 00000'
  },
  {
    _id: '6a6dde26b7e83c1231fd9403',
    listingId: 'gr-1',
    clientId: '6a380bd273c0e340a6bf3a43', // Sri
    creatorId: '6a380b8173c0e340a6bf3a42', // Nikhil
    ownerId: '6a380b8173c0e340a6bf3a42',
    itemType: 'Gear',
    title: 'Canon R6 Mark II',
    date: '28 Jul 2026',
    time: '09:00 AM',
    price: 2000,
    status: 'completed',
    clientName: 'Sri',
    clientEmail: 'ssrajuqc@gmail.com',
    clientPhone: '+91 88888 77777'
  },
  {
    _id: '6a6dde26b7e83c1231fd9404',
    listingId: 'ps-1-2',
    clientId: '6a39140ec8fbd2d7e85f0d91', // Jaideep
    creatorId: '6a380b8173c0e340a6bf3a42', // Nikhil
    ownerId: '6a380b8173c0e340a6bf3a42',
    itemType: 'Service',
    title: 'Royal Palace Indoor Pre-Wedding',
    date: '02 Aug 2026',
    time: '11:00 AM',
    price: 19999,
    status: 'pending',
    clientName: 'Jaideep',
    clientEmail: 'anusripvc203@gmail.com',
    clientPhone: '+91 77777 66666'
  },
  {
    _id: '6a6dde26b7e83c1231fd9405',
    listingId: 'md-1',
    clientId: '6a39140ec8fbd2d7e85f0d91', // Jaideep
    creatorId: '6a5dde26b7e83c1231fd9600', // Ananya Singh (Model ID)
    ownerId: '6a5dde26b7e83c1231fd9600',
    itemType: 'Model',
    title: 'Ananya Singh',
    date: '10 Aug 2026',
    time: '08:00 AM',
    price: 6000,
    status: 'confirmed',
    clientName: 'Jaideep',
    clientEmail: 'anusripvc203@gmail.com',
    clientPhone: '+91 77777 66666'
  },
  {
    _id: '6a6dde26b7e83c1231fd9406',
    listingId: 'ps-w1',
    clientId: '6a39140ec8fbd2d7e85f0d91', // Jaideep
    creatorId: '6a380b8173c0e340a6bf3a42', // Nikhil
    ownerId: '6a380b8173c0e340a6bf3a42',
    itemType: 'Service',
    title: 'Royal Traditional Wedding Coverage',
    date: '18 Aug 2026',
    time: '06:00 AM',
    price: 49999,
    status: 'completed',
    clientName: 'Jaideep',
    clientEmail: 'anusripvc203@gmail.com',
    clientPhone: '+91 77777 66666'
  },
  {
    _id: '6a6dde26b7e83c1231fd9407',
    listingId: 'st-2',
    clientId: '6a380bd273c0e340a6bf3a43', // Sri
    creatorId: '6a380b8173c0e340a6bf3a42', // Nikhil
    ownerId: '6a380b8173c0e340a6bf3a42',
    itemType: 'Studio',
    title: 'Infinity Studio',
    date: '22 Aug 2026',
    time: '04:00 PM',
    price: 2000,
    status: 'cancelled',
    clientName: 'Sri',
    clientEmail: 'ssrajuqc@gmail.com',
    clientPhone: '+91 88888 77777'
  }
];

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    // 1. Clear and seed Bookings
    console.log('Clearing Bookings collection...');
    await Booking.deleteMany({});
    console.log('Seeding bulk dummy Bookings...');
    await Booking.insertMany(defaultBookings);
    console.log(`🎉 ${defaultBookings.length} Bookings seeded.`);

    // 2. Clear and seed listings
    console.log('Clearing Listings collection...');
    await Listing.deleteMany({});
    console.log('Seeding bulk dummy Listings...');
    await Listing.insertMany(allListings);
    console.log(`🎉 ${allListings.length} Listings seeded.`);

    // 3. Clear and seed Users
    console.log('Clearing Users collection...');
    await User.deleteMany({});
    console.log('Seeding default Users...');
    await User.insertMany(defaultUsers);
    console.log(`🎉 ${defaultUsers.length} Users seeded.`);

    // 4. Clear and seed Photographers
    console.log('Clearing Photographers collection...');
    await Photographer.deleteMany({});
    console.log('Seeding default Photographers...');
    await Photographer.insertMany(defaultPhotographers);
    console.log(`🎉 ${defaultPhotographers.length} Photographers seeded.`);

    console.log('🎉 MongoDB database successfully cleared and re-seeded with massive mock dummy data for all collections!');

  } catch (error) {
    console.error('Database reset failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

run();
