import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Import API handlers
import usersHandler from './api/users.js';
import listingsHandler from './api/listings.js';
import bookingsHandler from './api/bookings.js';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Route each handler — mirrors the Vercel /api/* serverless function routing
app.all('/api/users', (req, res) => usersHandler(req, res));
app.all('/api/listings', (req, res) => listingsHandler(req, res));
app.all('/api/bookings', (req, res) => bookingsHandler(req, res));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🚀 PickMyShoot API Server running at http://localhost:${PORT}`);
  console.log(`📡 API endpoints available:`);
  console.log(`   GET/POST     http://localhost:${PORT}/api/users`);
  console.log(`   GET/POST     http://localhost:${PORT}/api/listings`);
  console.log(`   GET/POST/PUT http://localhost:${PORT}/api/bookings`);
  console.log(`   GET          http://localhost:${PORT}/api/health`);
  console.log(`\n   MongoDB URI: ${process.env.MONGODB_URI ? '✅ Configured' : '❌ Missing'}\n`);
});
