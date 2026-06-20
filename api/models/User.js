import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'client' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80' },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  rating: { type: String, default: '0' },
  isVerified: { type: Boolean, default: false },
  phone: { type: String, default: '' },
  shoots: { type: String, default: '0' },
  followers: { type: String, default: '0' },
  revenue: { type: String, default: '₹0' },
  success: { type: String, default: '100%' },
  views: { type: String, default: '0' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', userSchema);

