import dbConnect from './_utils/dbConnect.js';
import User from './models/User.js';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  } else if (req.method === 'POST') {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create user' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, ...updateData } = req.body;
      const query = { $or: [{ id: id }] };
      if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
        query.$or.push({ _id: id });
      }
      const user = await User.findOneAndUpdate(query, updateData, { new: true });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Failed to update user:', error);
      res.status(400).json({ error: 'Failed to update user', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
