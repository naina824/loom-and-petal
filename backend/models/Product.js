import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'Please provide a product SKU/code (e.g. CR001)'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Flowers', 'Bags', 'Amigurumi', 'Accessories', 'Gifts', 'Custom'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one product image'],
      validate: [val => val.length > 0, 'Must have at least one image'],
    },
    colors: {
      type: [String],
      default: ['As Shown'],
    },
    size: {
      type: String,
      default: 'Standard Handmade Size',
      trim: true,
    },
    materials: {
      type: String,
      default: '100% Premium Milk Cotton Yarn, Hypoallergenic Fiberfill',
      trim: true,
    },
    stockQuantity: {
      type: Number,
      default: 5,
      min: 0,
    },
    availability: {
      type: String,
      enum: ['In Stock', 'Made to Order', 'Out of Stock'],
      default: 'In Stock',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isCustomizable: {
      type: Boolean,
      default: true,
    },
    customizationNote: {
      type: String,
      default: 'Custom shades, bouquet wrap color, and greeting notes available upon request via WhatsApp.',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Virtual index for fast search
productSchema.index({ name: 'text', description: 'text', category: 'text', sku: 'text' });

export default mongoose.model('Product', productSchema);
