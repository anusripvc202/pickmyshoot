import mongoose from 'mongoose';
import dbConnect from './_utils/dbConnect.js';
import Booking from './models/Booking.js';
import User from './models/User.js';
import Photographer from './models/Photographer.js';
import { sendBookingNotification, sendClientBookingConfirmation } from './_utils/mailer.js';

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

        // Secondary lookup in Photographer collection if not found in User
        if (!recipientEmail && booking.creatorId) {
          const photographerProfile = await Photographer.findOne({
            $or: [
              { _id: mongoose.Types.ObjectId.isValid(booking.creatorId) ? booking.creatorId : null },
              { slug: booking.creatorId },
              { name: booking.creatorId }
            ].filter(Boolean)
          }).lean().catch(() => null);

          if (photographerProfile) {
            recipientEmail = photographerProfile.email;
            recipientName = photographerProfile.name;
          }
        }

        // Fallback for mock profiles or unregistered/unmapped creator IDs to facilitate testing and visual demonstration
        if (!recipientEmail) {
          recipientEmail = process.env.SMTP_EMAIL;
          recipientName = photographer?.name || 'Demo Photographer (Mock Profile)';
          console.log(`ℹ️  No creator found for ID "${booking.creatorId}" — falling back to SMTP_EMAIL (${process.env.SMTP_EMAIL}) for demo notification.`);
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
        }

        const clientEmailAddress = client?.email || req.body.clientEmail;
        if (clientEmailAddress) {
          sendClientBookingConfirmation({
            clientEmail: clientEmailAddress,
            clientName: client?.name || req.body.clientName || 'Valued Customer',
            bookingTitle: booking.title || 'New Booking',
            bookingDate: booking.date,
            bookingTime: booking.time,
            bookingPrice: booking.price,
            bookingType: booking.itemType,
            photographerName: recipientName || 'Creator'
          }).catch(err => console.warn('Client confirmation email send error:', err.message));
        } else {
          console.log('ℹ️  No client email found for clientId:', booking.clientId);
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
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (mongoose.Types.ObjectId.isValid(id)) {
        await Booking.findByIdAndDelete(id);
      } else {
        await Booking.findOneAndDelete({ id: id });
      }
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete booking' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
