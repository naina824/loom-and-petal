import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../../utils/api';
import {
  ChevronLeft,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  Save,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    originalPrice: '',
    category: 'Flowers',
    description: '',
    images: [],
    colors: 'Blush Pink, Cream, Sage Green',
    size: 'Standard Handmade Size',
    materials: '100% Combed Milk Cotton Yarn',
    stockQuantity: '5',
    availability: 'In Stock',
    isFeatured: false,
    isCustomizable: true,
    customizationNote: 'Custom shades and greeting notes available upon request.',
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loadingInitial, setLoadingInitial] = useState(isEditing);

  const categories = ['Flowers', 'Bags', 'Amigurumi', 'Accessories', 'Gifts', 'Custom'];
  const availabilities = ['In Stock', 'Made to Order', 'Out of Stock'];

  // Load product if editing
  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          const data = await apiRequest(`/products/${id}`);
          setFormData({
            name: data.name || '',
            sku: data.sku || '',
            price: data.price !== undefined ? String(data.price) : '',
            originalPrice: data.originalPrice ? String(data.originalPrice) : '',
            category: data.category || 'Flowers',
            description: data.description || '',
            images: data.images || [],
            colors: Array.isArray(data.colors) ? data.colors.join(', ') : '',
            size: data.size || '',
            materials: data.materials || '',
            stockQuantity: data.stockQuantity !== undefined ? String(data.stockQuantity) : '5',
            availability: data.availability || 'In Stock',
            isFeatured: Boolean(data.isFeatured),
            isCustomizable: Boolean(data.isCustomizable),
            customizationNote: data.customizationNote || '',
          });
        } catch (err) {
          setErrorMsg('Failed to load product details: ' + err.message);
        } finally {
          setLoadingInitial(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditing]);

  // Handle image upload through backend Multer
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);
    setErrorMsg('');

    try {
      const uploadFormData = new FormData();
      for (let i = 0; i < files.length; i++) {
        uploadFormData.append('images', files[i]);
      }

      const res = await apiRequest('/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (res.urls && res.urls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...res.urls],
        }));
      }
    } catch (err) {
      setErrorMsg('Image upload failed: ' + err.message);
    } finally {
      setUploadingFiles(false);
    }
  };

  // Add external image URL
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()],
    }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (formData.images.length === 0) {
      setErrorMsg('Please upload or provide at least one product image.');
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        sku: formData.sku,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        category: formData.category,
        description: formData.description,
        images: formData.images,
        colors: formData.colors.split(',').map((c) => c.trim()).filter(Boolean),
        size: formData.size,
        materials: formData.materials,
        stockQuantity: Number(formData.stockQuantity),
        availability: formData.availability,
        isFeatured: formData.isFeatured,
        isCustomizable: formData.isCustomizable,
        customizationNote: formData.customizationNote,
      };

      if (isEditing) {
        await apiRequest(`/products/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setSuccessMsg('Product updated successfully! Customer store updated.');
      } else {
        await apiRequest('/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setSuccessMsg('Product created successfully and published to Shop!');
        setTimeout(() => navigate('/admin/products'), 1500);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Operation failed. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="p-12 text-center text-warmbrown-500 animate-pulse">
        Loading product information...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-warmbrown-600 hover:text-warmbrown-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-cream-200 shadow-soft p-6 sm:p-8 space-y-6 max-w-4xl">
        <div className="border-b border-cream-100 pb-4">
          <h1 className="font-serif text-2xl font-bold text-warmbrown-900">
            {isEditing ? `Edit Product: ${formData.name}` : 'Add New Crochet Creation'}
          </h1>
          <p className="text-xs text-warmbrown-500">
            Fill in the handcrafted item specifications. Once saved, this automatically publishes to the customer Shop page.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Eternal Pastel Tulip Bouquet (5 Stems)"
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">
                SKU / Product Code *
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                placeholder="e.g. CR-FLW-005"
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm font-mono text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300 uppercase"
              />
            </div>
          </div>

          {/* 2. Category & Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g. 1299"
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">
                Original Price (for discount strikethrough)
              </label>
              <input
                type="number"
                min="0"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="e.g. 1599"
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
              />
            </div>
          </div>

          {/* 3. Description */}
          <div>
            <label className="block text-xs font-bold text-warmbrown-800 mb-1">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the craft details, yarn texture, floral bouquet layout, or amigurumi features..."
              className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300 resize-none"
            />
          </div>

          {/* 4. Specifications: Colors, Size, Materials */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">
                Available Colors (comma separated)
              </label>
              <input
                type="text"
                value={formData.colors}
                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                placeholder="Blush Pink, Sage, Cream, Daisy Yellow"
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">
                Size / Dimensions
              </label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="e.g. Length: 35cm, Bloom: 6cm"
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">
                Materials Used
              </label>
              <input
                type="text"
                value={formData.materials}
                onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                placeholder="100% Combed Milk Cotton Yarn"
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
              />
            </div>
          </div>

          {/* 5. Inventory & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">
                Availability Status
              </label>
              <select
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
              >
                {availabilities.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 6. Product Images Management */}
          <div className="space-y-3 p-4 rounded-2xl bg-cream-50 border border-cream-200">
            <label className="block text-xs font-bold text-warmbrown-800 uppercase tracking-wider">
              Product Images ({formData.images.length}) *
            </label>

            {/* Upload File Button + URL Input */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-cream-300 hover:bg-cream-100 text-xs font-semibold text-warmbrown-800 transition-colors shadow-xs">
                <Upload className="w-4 h-4 text-blush-500" />
                <span>{uploadingFiles ? 'Uploading Files...' : 'Upload Image Files'}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploadingFiles}
                  className="hidden"
                />
              </label>

              <div className="flex-1 flex gap-2">
                <input
                  type="url"
                  placeholder="Or paste image URL (Unsplash, Cloudinary, etc.)..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl bg-white border border-cream-200 text-xs text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2 rounded-xl bg-warmbrown-800 text-cream-50 text-xs font-semibold hover:bg-warmbrown-900 transition-colors"
                >
                  Add URL
                </button>
              </div>
            </div>

            {/* Images Preview Grid */}
            {formData.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                {formData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border border-cream-300 group bg-white shadow-xs"
                  >
                    <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md opacity-80 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-warmbrown-900/80 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-warmbrown-400 text-xs border-2 border-dashed border-cream-200 rounded-xl">
                No images added yet. Upload from device or add image URLs above.
              </div>
            )}
          </div>

          {/* 7. Toggles: Featured & Customizable */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-cream-50 border border-cream-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded text-blush-600 focus:ring-blush-400"
              />
              <div>
                <span className="text-xs font-bold text-warmbrown-900 block">
                  Featured Product Toggle
                </span>
                <span className="text-[11px] text-warmbrown-500">
                  Highlight this product on the Homepage
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-cream-50 border border-cream-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isCustomizable}
                onChange={(e) => setFormData({ ...formData, isCustomizable: e.target.checked })}
                className="w-4 h-4 rounded text-blush-600 focus:ring-blush-400"
              />
              <div>
                <span className="text-xs font-bold text-warmbrown-900 block">
                  Customizable Product Toggle
                </span>
                <span className="text-[11px] text-warmbrown-500">
                  Allow customers to request custom colors/dimensions
                </span>
              </div>
            </label>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-cream-200 flex items-center justify-end gap-3">
            <Link
              to="/admin/products"
              className="px-6 py-2.5 rounded-xl border border-cream-300 text-warmbrown-700 font-semibold text-xs hover:bg-cream-100 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-warmbrown-900 hover:bg-warmbrown-800 text-cream-50 font-bold text-xs sm:text-sm shadow-soft transition-colors disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving Product...' : isEditing ? 'Update Product' : 'Add Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
