import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  listingId: { type: String },
  clientId: { type: String, required: true },
  creatorId: { type: String, required: true },
  itemType: { type: String },
  title: { type: String },
  date: { type: String, required: true },
  time: { type: String },
  price: { type: mongoose.Schema.Types.Mixed, required: true },
  status: { type: String, default: 'pending' },
  item: { type: mongoose.Schema.Types.Mixed },
  ownerId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

