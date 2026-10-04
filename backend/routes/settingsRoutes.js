import express from 'express';
import Settings from '../models/Settings.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/settings
// @desc    Get store public settings (brand name, WhatsApp, Instagram, etc.)
// @access  Public
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        brandName: process.env.BRAND_NAME || 'Loom & Petal Handmade',
        whatsappNumber: process.env.WHATSAPP_NUMBER || '919209622019',
        instagramHandle: process.env.INSTAGRAM_HANDLE || 'crochet.by.naina_',
      });
    } else {
      let changed = false;
      if (process.env.INSTAGRAM_HANDLE && settings.instagramHandle !== process.env.INSTAGRAM_HANDLE) {
        settings.instagramHandle = process.env.INSTAGRAM_HANDLE;
        changed = true;
      }
      if (process.env.WHATSAPP_NUMBER && settings.whatsappNumber !== process.env.WHATSAPP_NUMBER) {
        settings.whatsappNumber = process.env.WHATSAPP_NUMBER;
        changed = true;
      }
      if (changed) {
        await settings.save();
      }
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving settings', error: error.message });
  }
});

// @route   PUT /api/settings
// @desc    Update store settings
// @access  Private (Admin only)
router.put('/', protectAdmin, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    const {
      brandName,
      tagline,
      shortIntro,
      whatsappNumber,
      whatsappDisplay,
      instagramHandle,
      contactEmail,
      currencySymbol,
      announcementBar,
      makerName,
      makerBio,
      makerImage,
    } = req.body;

    if (brandName) settings.brandName = brandName.trim();
    if (tagline) settings.tagline = tagline.trim();
    if (shortIntro) settings.shortIntro = shortIntro.trim();
    if (whatsappNumber) settings.whatsappNumber = whatsappNumber.replace(/[^0-9]/g, '');
    if (whatsappDisplay) settings.whatsappDisplay = whatsappDisplay.trim();
    if (instagramHandle) settings.instagramHandle = instagramHandle.replace('@', '').trim();
    if (contactEmail) settings.contactEmail = contactEmail.trim();
    if (currencySymbol) settings.currencySymbol = currencySymbol.trim();
    if (announcementBar !== undefined) settings.announcementBar = announcementBar.trim();
    if (makerName) settings.makerName = makerName.trim();
    if (makerBio) settings.makerBio = makerBio.trim();
    if (makerImage) settings.makerImage = makerImage.trim();

    const savedSettings = await settings.save();
    res.json(savedSettings);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update settings', error: error.message });
  }
});

export default router;
