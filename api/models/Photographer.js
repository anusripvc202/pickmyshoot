import mongoose from 'mongoose';

const photographerSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  slug:       { type: String, required: true, unique: true },
  location:   { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  code:       { type: String, default: 'No Code' },
  status:     { type: String, default: 'Active' },
  email:      { type: String, default: '' },
  createdAt:  { type: Date, default: Date.now },
});

export default mongoose.models.Photographer ||
  mongoose.model('Photographer', photographerSchema);
