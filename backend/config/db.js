const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.log('No MONGODB_URI specified. Initializing mongodb-memory-server...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongod = await MongoMemoryServer.create();
        mongoUri = mongod.getUri();
        console.log(`[DB] InMemory MongoDB started: ${mongoUri}`);
      } catch (memErr) {
        console.warn('[DB] Could not launch mongodb-memory-server directly:', memErr.message);
        mongoUri = 'mongodb://127.0.0.1:27017/aura_apex_bank';
      }
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`[DB] MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[DB] Initial connection failed: ${error.message}`);
    if (!mongod) {
      try {
        console.log('[DB] Attempting fallback to in-memory MongoDB...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongod = await MongoMemoryServer.create();
        const fallbackUri = mongod.getUri();
        const conn = await mongoose.connect(fallbackUri);
        console.log(`[DB] Fallback InMemory MongoDB connected: ${fallbackUri}`);
        return conn;
      } catch (fbErr) {
        console.error('[DB] Fallback failed:', fbErr.message);
        process.exit(1);
      }
    }
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.error('[DB] Disconnect error:', err);
  }
};

module.exports = { connectDB, disconnectDB };
