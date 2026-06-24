import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String, required: true },
  type: { type: String, default: 'studio' },
  price: { type: Number, required: true },
  priceUnit: { type: String, default: 'hr' },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  location: { type: String, default: 'Hyderabad, TS' },
  rating: { type: mongoose.Schema.Types.Mixed, default: 0 },
  reviews: { type: Number, default: 0 },
  creatorId: { type: String, default: '' },
  ownerId: { type: String, default: '' },
  active: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  
  // Type-specific optional fields
  amenities: [String], // for studio
  features: [String],  // for studio
  capacity: String,    // for studio
  area: String,        // for studio
  
  categories: [String], // for models
  gender: String,       // for models
  height: String,       // for models
  
  category: String,     // for gear
  specs: String,        // for gear/studio
  includes: String,     // for gear/studio
  
  skills: [String],     // for jobs
  company: String,      // for jobs
  
  instructor: String,   // for workshops
  date: String,         // for workshops
  timing: String,       // for workshops
  
  // Photography-specific fields
  specialization: String, // e.g. Wedding Photography, Fashion Photography
  experience: String,     // e.g. "5 years"
  portfolio: String,      // portfolio or Instagram URL
  
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Listing || mongoose.model('Listing', listingSchema);
