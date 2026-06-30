import dbConnect from './_utils/dbConnect.js';
import Photographer from './models/Photographer.js';
import User from './models/User.js';
import { sendVerificationCodeEmail } from './_utils/mailer.js';

// Seed data with real emails for developer verification testing
const SEED_PHOTOGRAPHERS = [
  { 
    name: "24 Frames Photography - South India's Leading Luxury Wedding Photography Brand", 
    slug: '24-frames-photography-south-india-s-leading-luxury-wedding-photography-brand', 
    location: 'Banjara Hills, Hyderabad',
    email: 'anusripvc202@gmail.com'
  },
  { 
    name: '24mm | Best Photography & Videography in Hyderabad | Wedding Photographers', 
    slug: '24mm-best-photography-videography-in-hyderabad-wedding-photographers', 
    location: 'Hitech City, Hyderabad',
    email: 'nikhiljai1215@gmail.com'
  },
  { 
    name: '24mm | Best Photography & Videography in Hyderabad | Wedding Photographers', 
    slug: '24mm-best-photography-videography-in-hyderabad-wedding-photographers-1', 
    location: 'Jubilee Hills, Hyderabad',
    email: 'pickmyshootnearme@gmail.com'
  },
  { 
    name: '5zaan photography', 
    slug: '5zaan-photography', 
    location: 'Banjara Hills, Hyderabad',
    email: 'anusripvc202@gmail.com'
  },
];

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  await dbConnect();

  // GET /api/photographers — list all, seed if empty, auto-sync registered users
  if (req.method === 'GET') {
    try {
      // Auto-sync all registered users with role: 'photographer'
      const registeredPhotographers = await User.find({ role: 'photographer' });
      for (const u of registeredPhotographers) {
        const exists = await Photographer.findOne({ email: u.email });
        if (!exists) {
          const baseSlug = slugify(u.name);
          const randSuffix = Math.floor(1000 + Math.random() * 9000);
          await Photographer.create({
            name: u.name,
            slug: `${baseSlug}-${randSuffix}`,
            location: u.location || 'Unknown',
            isVerified: u.isVerified || false,
            email: u.email,
            code: 'No Code',
            status: 'Active'
          });
        }
      }

      let photographers = await Photographer.find({}).sort({ createdAt: 1 });
      if (photographers.length === 0) {
        // Auto-seed on first load
        photographers = await Photographer.insertMany(SEED_PHOTOGRAPHERS);
      }
      return res.status(200).json(photographers);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch photographers', details: error.message });
    }
  }

  // POST /api/photographers — add new photographer
  if (req.method === 'POST') {
    try {
      const photographer = await Photographer.create(req.body);
      return res.status(201).json(photographer);
    } catch (error) {
      return res.status(400).json({ error: 'Failed to create photographer', details: error.message });
    }
  }

  // PATCH /api/photographers — update one photographer (verify, code, status)
  if (req.method === 'PATCH') {
    try {
      const { id, ...updates } = req.body;
      if (!id) return res.status(400).json({ error: 'id is required' });
      
      const updated = await Photographer.findByIdAndUpdate(id, updates, { new: true });
      if (!updated) return res.status(404).json({ error: 'Photographer not found' });

      // Sync verified status back to User collection if they exist
      if (updates.isVerified !== undefined && updated.email) {
        await User.findOneAndUpdate({ email: updated.email }, { isVerified: updates.isVerified });
      }

      // If a code was updated/generated, trigger verification email to creator
      if (updates.code && updates.code !== 'No Code' && updated.email) {
        await sendVerificationCodeEmail({
          photographerEmail: updated.email,
          photographerName: updated.name,
          code: updates.code
        });
      }

      return res.status(200).json(updated);
    } catch (error) {
      return res.status(400).json({ error: 'Failed to update photographer', details: error.message });
    }
  }

  // DELETE /api/photographers?id=xxx — remove one photographer
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'id query param required' });
      
      // Optional: if deleting photographer from directory, also delete corresponding User?
      // For now just remove from partner list
      await Photographer.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(400).json({ error: 'Failed to delete photographer', details: error.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
