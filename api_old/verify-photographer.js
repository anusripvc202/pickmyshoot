import dbConnect from './_utils/dbConnect.js';
import Photographer from './models/Photographer.js';
import User from './models/User.js';

/**
 * POST /api/verify-photographer
 * Body: { email, code }
 * Validates the code the photographer received by email.
 * On success: marks them as isVerified in both Photographer and User collections.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await dbConnect();

  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: 'email and code are required' });
    }

    // Find photographer by email
    const photographer = await Photographer.findOne({ email: email.toLowerCase().trim() });
    if (!photographer) {
      return res.status(404).json({ error: 'No photographer found with this email address.' });
    }

    // Check if they are already verified
    if (photographer.isVerified) {
      return res.status(200).json({ success: true, alreadyVerified: true, message: 'Your profile is already verified!' });
    }

    // Check code match (case-insensitive)
    if (!photographer.code || photographer.code === 'No Code') {
      return res.status(400).json({ error: 'No verification code has been issued for this profile yet. Please ask the admin to generate and send your code.' });
    }

    if (photographer.code.trim().toUpperCase() !== code.trim().toUpperCase()) {
      return res.status(401).json({ error: 'Incorrect verification code. Please check your email and try again.' });
    }

    // Code matches — mark as verified in Photographer collection
    await Photographer.findByIdAndUpdate(photographer._id, { isVerified: true });

    // Sync to User collection as well
    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { isVerified: true },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Your PickMyShoot Partner profile is now verified!',
      user: updatedUser
    });

  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ error: 'Verification failed', details: error.message });
  }
}
