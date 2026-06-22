import dbConnect from './_utils/dbConnect.js';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  try {
    await dbConnect();
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const state = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      mongodb: {
        connected: state === 1,
        state: states[state] || 'unknown'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      mongodb: {
        connected: false,
        error: error.message
      }
    });
  }
}
