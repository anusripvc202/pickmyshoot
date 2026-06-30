import mongoose from 'mongoose';

const loginActivitySchema = new mongoose.Schema({
  userId:    { type: String, required: true },
  name:      { type: String, required: true },
  email:     { type: String, required: true },
  role:      { type: String, required: true },
  avatar:    { type: String },
  loginTime: { type: Date, default: Date.now },
});

loginActivitySchema.index({ loginTime: -1 });

export default mongoose.models.LoginActivity ||
  mongoose.model('LoginActivity', loginActivitySchema);

