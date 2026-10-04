import express from 'express';
import { upload } from '../middleware/upload.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/upload
// @desc    Upload multiple product images
// @access  Private (Admin only)
router.post('/', protectAdmin, upload.array('images', 8), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files uploaded' });
    }

    // Generate accessible URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrls = req.files.map((file) => `${baseUrl}/uploads/${file.filename}`);

    res.json({
      message: 'Images uploaded successfully',
      urls: fileUrls,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
});

// Single image upload
router.post('/single', protectAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.json({
      message: 'Image uploaded successfully',
      url: fileUrl,
    });
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
});

export default router;
