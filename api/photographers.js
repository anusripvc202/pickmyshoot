import dbConnect from './_utils/dbConnect.js';
import Photographer from './models/Photographer.js';

// Seed data - used when DB is empty
const SEED_PHOTOGRAPHERS = [
  { name: "24 Frames Photography - South India's Leading Luxury Wedding Photography Brand", slug: '24-frames-photography-south-india-s-leading-luxury-wedding-photography-brand', location: 'Banjara Hills, Hyderabad' },
  { name: '24mm | Best Photography & Videography in Hyderabad | Wedding Photographers', slug: '24mm-best-photography-videography-in-hyderabad-wedding-photographers', location: 'Hitech City, Hyderabad' },
  { name: '24mm | Best Photography & Videography in Hyderabad | Wedding Photographers', slug: '24mm-best-photography-videography-in-hyderabad-wedding-photographers-1', location: 'Jubilee Hills, Hyderabad' },
  { name: '5zaan photography', slug: '5zaan-photography', location: 'Banjara Hills, Hyderabad' },
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  await dbConnect();

  // GET /api/photographers — list all, seed if empty
  if (req.method === 'GET') {
    try {
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
      await Photographer.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(400).json({ error: 'Failed to delete photographer', details: error.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
