import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    contactMethod: {
      type: String,
      enum: ['WhatsApp', 'Instagram', 'Email', 'Phone', 'Direct Web'],
      default: 'WhatsApp',
    },
    contactInfo: {
      type: String,
      required: [true, 'Phone number, WhatsApp, or Instagram handle is required'],
      trim: true,
    },
    productName: {
      type: String,
      default: 'General / Custom Enquiry',
    },
    productSku: {
      type: String,
      default: '',
    },
    productPrice: {
      type: Number,
      default: 0,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    selectedColor: {
      type: String,
      default: '',
    },
    customizationDetails: {
      type: String,
      default: '',
    },
    customType: {
      type: String,
      enum: ['Standard Order', 'Custom Color', 'Custom Size', 'Custom Design', 'Personalized Gift', 'Bulk/Event Favors'],
      default: 'Standard Order',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'New',
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Enquiry', enquirySchema);
