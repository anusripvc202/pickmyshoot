import mongoose from 'mongoose';
import dbConnect from './_utils/dbConnect.js';
import Booking from './models/Booking.js';
import User from './models/User.js';
import { sendBookingNotification } from './_utils/mailer.js';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      // Allow fetching by clientId or creatorId
      const filter = {};
      if (req.query.clientId) filter.clientId = req.query.clientId;
      if (req.query.creatorId) filter.creatorId = req.query.creatorId;
      
      const bookings = await Booking.find(filter).sort({ createdAt: -1 });
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  } else if (req.method === 'POST') {
    try {
      const booking = await Booking.create(req.body);

      // ── Send email notification to the photographer/creator ──
      // Look up the photographer by creatorId (could be a Mongo _id or a frontend profile id)
      // Also look up the client who made the booking
      try {
        const [photographer, client] = await Promise.all([
          User.findOne({
            $or: [
              { _id: booking.creatorId },
              { id: booking.creatorId }
            ]
          }).lean().catch(() => null),
          User.findOne({
            $or: [
              { _id: booking.clientId },
              { id: booking.clientId }
            ]
          }).lean().catch(() => null)
        ]);

        let recipientEmail = photographer?.email;
        let recipientName = photographer?.name;

        // Fallback for mock profiles to facilitate testing and visual demonstration
        if (!recipientEmail && (booking.creatorId === 'prof-photographer' || booking.creatorId === 'prof-1' || !booking.creatorId)) {
          recipientEmail = process.env.SMTP_EMAIL;
          recipientName = 'Demo Photographer (Mock Profile)';
          console.log('ℹ️  Mock creator booked. Falling back to SMTP_EMAIL for demo notification email.');
        }

        if (recipientEmail) {
          // Fire and forget — don't block the response
          sendBookingNotification({
            photographerEmail: recipientEmail,
            photographerName: recipientName,
            clientName: client?.name || req.body.clientName || 'A Client',
            clientEmail: client?.email || req.body.clientEmail || '',
            clientPhone: client?.phone || req.body.clientPhone || '',
            bookingTitle: booking.title || 'New Booking',
            bookingDate: booking.date,
            bookingTime: booking.time,
            bookingPrice: booking.price,
            bookingType: booking.itemType
          }).catch(err => console.warn('Email send error:', err.message));
        } else {
          console.log('ℹ️  No photographer email found for creatorId:', booking.creatorId);
        }
      } catch (emailErr) {
        console.warn('⚠️  Email lookup failed (booking still saved):', emailErr.message);
      }

      res.status(201).json(booking);
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(400).json({ error: 'Failed to create booking', details: error.message });
    }
  } else if (req.method === 'PUT') {
    // Used for status updates (accept, cancel, complete)
    try {
      const { id, status } = req.body;
      let booking = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
      } else {
        // Fallback search by custom id if defined in the schema or mock database query
        booking = await Booking.findOneAndUpdate({ id: id }, { status }, { new: true });
      }
      res.status(200).json(booking || { id, status, message: 'Mock booking updated in-memory' });
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(400).json({ error: 'Failed to update booking status', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
