import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import Admin from './models/Admin.js';
import Settings from './models/Settings.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crochet_store';

// Middleware
app.use(cors({
  origin: '*', // Allow frontend requests
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Crochet Boutique API is blooming 🌸',
    timestamp: new Date().toISOString(),
  });
});

// Auto seed or sync default admin and settings
const initializeAdmin = async () => {
  try {
    const email = (process.env.ADMIN_EMAIL || 'dharmakkollanainarao@gmail.com').toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || 'Nainarao123';
    let admin = await Admin.findOne({ email });

    if (!admin) {
      // Check if any legacy admin exists
      admin = await Admin.findOne();
      if (admin) {
        admin.email = email;
        admin.password = password; // Will be hashed by pre-save hook
        admin.name = 'Naina Rao';
        await admin.save();
        console.log(`🌸 Updated existing admin to: ${email}`);
      } else {
        await Admin.create({
          name: 'Naina Rao',
          email,
          password,
          role: 'admin',
        });
        console.log(`🌸 Initialized default admin: ${email}`);
      }
    } else {
      // Ensure password matches ADMIN_PASSWORD
      const isMatch = await admin.matchPassword(password);
      if (!isMatch) {
        admin.password = password;
        await admin.save();
        console.log(`🌸 Updated admin password for: ${email}`);
      }
    }

    let settings = await Settings.findOne();
    if (!settings) {
      await Settings.create({
        brandName: process.env.BRAND_NAME || 'Loom & Petal Handmade',
        whatsappNumber: process.env.WHATSAPP_NUMBER || '919209622019',
        whatsappDisplay: '+91 92096 22019',
        instagramHandle: process.env.INSTAGRAM_HANDLE || 'crochet.by.naina_',
        contactEmail: email,
        makerName: 'Naina Rao',
      });
      console.log('🌸 Initialized default store settings');
    } else {
      let needsSave = false;
      const targetPhone = process.env.WHATSAPP_NUMBER || '919209622019';
      if (settings.whatsappNumber !== targetPhone || settings.whatsappDisplay !== '+91 92096 22019') {
        settings.whatsappNumber = targetPhone;
        settings.whatsappDisplay = '+91 92096 22019';
        needsSave = true;
      }
      if (process.env.INSTAGRAM_HANDLE && settings.instagramHandle !== process.env.INSTAGRAM_HANDLE) {
        settings.instagramHandle = process.env.INSTAGRAM_HANDLE;
        needsSave = true;
      }
      if (settings.contactEmail === 'hello@crochetboutique.com' || !settings.contactEmail) {
        settings.contactEmail = email;
        needsSave = true;
      }
      if (settings.makerName === 'Aanya Sharma' || !settings.makerName) {
        settings.makerName = 'Naina Rao';
        needsSave = true;
      }
      if (needsSave) {
        await settings.save();
        console.log('🌸 Synced store settings with environment configuration');
      }
    }
  } catch (error) {
    console.error('Error during initial admin/settings check:', error.message);
  }
};

// Database Connection
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('🧶 Connected to MongoDB successfully!');
    await initializeAdmin();
    app.listen(PORT, () => {
      console.log(`✨ Crochet Boutique Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    // Still start server so helpful error is reported
    app.listen(PORT, () => {
      console.log(`⚠️ Server started with DB error on http://localhost:${PORT}`);
    });
  });
