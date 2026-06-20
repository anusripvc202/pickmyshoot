import dbConnect from './_utils/dbConnect.js';
import Booking from './models/Booking.js';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      // Allow fetching by clientId or creatorId
      const filter = {};
      if (req.query.clientId) filter.clientId = req.query.clientId;
      if (req.query.creatorId) filter.creatorId = req.query.creatorId;
      
      const bookings = await Booking.find(filter);
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  } else if (req.method === 'POST') {
    try {
      const booking = await Booking.create(req.body);
      res.status(201).json(booking);
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(400).json({ error: 'Failed to create booking', details: error.message });
    }
  } else if (req.method === 'PUT') {
    // Used for status updates (accept, cancel, complete)
    try {
      const { id, status } = req.body;
      const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
      res.status(200).json(booking);
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(400).json({ error: 'Failed to update booking status', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
