import dbConnect from './_utils/dbConnect.js';
import Listing from './models/Listing.js';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      // Optional filtering by type or category
      const filter = {};
      if (req.query.type) filter.type = req.query.type;
      
      const listings = await Listing.find(filter).populate('creatorId', 'name avatar isVerified rating');
      res.status(200).json(listings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch listings' });
    }
  } else if (req.method === 'POST') {
    try {
      const listing = await Listing.create(req.body);
      res.status(201).json(listing);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create listing' });
    }
  } else if (req.method === 'PATCH' || req.method === 'PUT') {
    try {
      const { id, ...updateData } = req.body;
      const updatedListing = await Listing.findByIdAndUpdate(id, updateData, { new: true });
      res.status(200).json(updatedListing);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update listing' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      await Listing.findByIdAndDelete(id);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete listing' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
