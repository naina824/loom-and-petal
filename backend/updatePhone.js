import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crochet_store';

async function run() {
  await mongoose.connect(MONGO_URI);
  const Settings = mongoose.model('Settings', new mongoose.Schema({}, { strict: false }));
  const result = await Settings.updateMany(
    {},
    {
      $set: {
        whatsappNumber: '919209622019',
        whatsappDisplay: '+91 92096 22019',
      },
    }
  );
  console.log('Successfully updated settings in DB:', result);
  await mongoose.disconnect();
}

run().catch(console.error);
