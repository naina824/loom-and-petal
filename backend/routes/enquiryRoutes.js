import express from 'express';
import Enquiry from '../models/Enquiry.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/enquiries
// @desc    Submit a new enquiry or custom order request
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      contactMethod,
      contactInfo,
      productName,
      productSku,
      productPrice,
      productId,
      quantity,
      selectedColor,
      customizationDetails,
      customType,
      notes,
    } = req.body;

    if (!customerName || !contactInfo) {
      return res.status(400).json({ message: 'Customer name and contact details are required.' });
    }

    const enquiry = new Enquiry({
      customerName: customerName.trim(),
      contactMethod: contactMethod || 'WhatsApp',
      contactInfo: contactInfo.trim(),
      productName: productName || 'Custom Crochet Request',
      productSku: productSku || '',
      productPrice: productPrice ? Number(productPrice) : 0,
      productId: productId || null,
      quantity: quantity ? Number(quantity) : 1,
      selectedColor: selectedColor || '',
      customizationDetails: customizationDetails || '',
      customType: customType || 'Standard Order',
      notes: notes || '',
      status: 'New',
    });

    const savedEnquiry = await enquiry.save();
    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! We will get in touch with you shortly.',
      enquiry: savedEnquiry,
    });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    res.status(400).json({ message: 'Failed to submit enquiry', error: error.message });
  }
});

// @route   GET /api/enquiries
// @desc    Get all enquiries with filtering & stats
// @access  Private (Admin only)
router.get('/', protectAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'All') {
      filter.status = status;
    }

    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });

    // Calculate quick stats
    const totalCount = await Enquiry.countDocuments();
    const newCount = await Enquiry.countDocuments({ status: 'New' });
    const contactedCount = await Enquiry.countDocuments({ status: 'Contacted' });
    const confirmedCount = await Enquiry.countDocuments({ status: 'Confirmed' });
    const completedCount = await Enquiry.countDocuments({ status: 'Completed' });

    res.json({
      enquiries,
      stats: {
        total: totalCount,
        new: newCount,
        contacted: contactedCount,
        confirmed: confirmedCount,
        completed: completedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch enquiries', error: error.message });
  }
});

// @route   PUT /api/enquiries/:id/status
// @desc    Update enquiry status
// @access  Private (Admin only)
router.put('/:id/status', protectAdmin, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    if (status) enquiry.status = status;
    if (notes !== undefined) enquiry.notes = notes;

    const updated = await enquiry.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update enquiry status', error: error.message });
  }
});

// @route   DELETE /api/enquiries/:id
// @desc    Delete an enquiry
// @access  Private (Admin only)
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Enquiry deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete enquiry', error: error.message });
  }
});

export default router;
