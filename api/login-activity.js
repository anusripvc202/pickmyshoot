import dbConnect from './_utils/dbConnect.js';
import LoginActivity from './models/LoginActivity.js';

export default async function handler(req, res) {
  // Allow cross-origin from Vercel front-end
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  await dbConnect();

  // POST /api/login-activity — record a login event
  if (req.method === 'POST') {
    try {
      const { userId, name, email, role, avatar } = req.body;
      if (!userId || !name || !email || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const activity = await LoginActivity.create({ userId, name, email, role, avatar });
      // Trim old records: keep only latest 200
      const count = await LoginActivity.countDocuments();
      if (count > 200) {
        const oldest = await LoginActivity.find().sort({ loginTime: 1 }).limit(count - 200);
        const ids = oldest.map(d => d._id);
        await LoginActivity.deleteMany({ _id: { $in: ids } });
      }
      return res.status(201).json(activity);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to record login activity', details: error.message });
    }
  }

  // GET /api/login-activity?role=photographer&limit=50 — fetch activity log
  if (req.method === 'GET') {
    try {
      const { role, limit = 50 } = req.query;
      const filter = role ? { role } : {};
      const activities = await LoginActivity.find(filter)
        .sort({ loginTime: -1 })
        .limit(parseInt(limit, 10));
      return res.status(200).json(activities);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch login activity' });
    }
  }

  // DELETE /api/login-activity — clear all activity logs (admin only)
  if (req.method === 'DELETE') {
    try {
      await LoginActivity.deleteMany({});
      return res.status(200).json({ message: 'Login activity cleared.' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to clear login activity' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'OPTIONS']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
