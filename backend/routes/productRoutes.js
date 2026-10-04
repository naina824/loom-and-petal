import express from 'express';
import Product from '../models/Product.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering, search, and sorting
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, availability, sort } = req.query;

    const query = {};

    // Filter by Category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by Featured
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Filter by Availability
    if (availability && availability !== 'All') {
      query.availability = availability;
    }

    // Search query
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { sku: searchRegex },
        { category: searchRegex },
        { tags: searchRegex },
      ];
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'price-asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'name-asc') {
      sortOptions = { name: 1 };
    } else if (sort === 'featured') {
      sortOptions = { isFeatured: -1, createdAt: -1 };
    }

    const products = await Product.find(query).sort(sortOptions);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID or SKU
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }

    if (!product) {
      product = await Product.findOne({ sku: id.toUpperCase() });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Admin only)
router.post('/', protectAdmin, async (req, res) => {
  try {
    const {
      name,
      sku,
      price,
      originalPrice,
      category,
      description,
      images,
      colors,
      size,
      materials,
      stockQuantity,
      availability,
      isFeatured,
      isCustomizable,
      customizationNote,
      tags,
    } = req.body;

    // Check SKU uniqueness
    const existingSku = await Product.findOne({ sku: sku.toUpperCase().trim() });
    if (existingSku) {
      return res.status(400).json({ message: `SKU '${sku}' is already in use. Please choose a unique SKU.` });
    }

    const product = new Product({
      name: name.trim(),
      sku: sku.toUpperCase().trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      category,
      description: description.trim(),
      images: Array.isArray(images) && images.length > 0 ? images : ['/placeholder-crochet.jpg'],
      colors: Array.isArray(colors) ? colors : (typeof colors === 'string' ? colors.split(',').map(s => s.trim()) : ['As Shown']),
      size: size || 'Standard Handmade Size',
      materials: materials || '100% Combed Milk Cotton Yarn',
      stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : 5,
      availability: availability || 'In Stock',
      isFeatured: Boolean(isFeatured),
      isCustomizable: isCustomizable !== undefined ? Boolean(isCustomizable) : true,
      customizationNote: customizationNote || 'Custom shades and greeting notes available upon request.',
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(s => s.trim()) : []),
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: 'Failed to create product', error: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update an existing product
// @access  Private (Admin only)
router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      name,
      sku,
      price,
      originalPrice,
      category,
      description,
      images,
      colors,
      size,
      materials,
      stockQuantity,
      availability,
      isFeatured,
      isCustomizable,
      customizationNote,
      tags,
    } = req.body;

    if (sku && sku.toUpperCase() !== product.sku) {
      const existingSku = await Product.findOne({ sku: sku.toUpperCase().trim() });
      if (existingSku) {
        return res.status(400).json({ message: `SKU '${sku}' is already in use by another product.` });
      }
      product.sku = sku.toUpperCase().trim();
    }

    if (name) product.name = name.trim();
    if (price !== undefined) product.price = Number(price);
    if (originalPrice !== undefined) product.originalPrice = originalPrice ? Number(originalPrice) : null;
    if (category) product.category = category;
    if (description) product.description = description;
    if (images && images.length > 0) product.images = images;
    if (colors !== undefined) {
      product.colors = Array.isArray(colors) ? colors : colors.split(',').map(s => s.trim());
    }
    if (size !== undefined) product.size = size;
    if (materials !== undefined) product.materials = materials;
    if (stockQuantity !== undefined) product.stockQuantity = Number(stockQuantity);
    if (availability) product.availability = availability;
    if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);
    if (isCustomizable !== undefined) product.isCustomizable = Boolean(isCustomizable);
    if (customizationNote !== undefined) product.customizationNote = customizationNote;
    if (tags !== undefined) {
      product.tags = Array.isArray(tags) ? tags : tags.split(',').map(s => s.trim());
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ message: 'Failed to update product', error: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Admin only)
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

export default router;
