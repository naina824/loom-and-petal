import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../utils/api';
import { useSettings } from '../../context/SettingsContext';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  X,
} from 'lucide-react';

export default function AdminProducts() {
  const { formatPrice } = useSettings();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [deleteModal, setDeleteModal] = useState({ open: false, product: null });
  const [deleting, setDeleting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const categories = ['All', 'Flowers', 'Bags', 'Amigurumi', 'Accessories', 'Gifts', 'Custom'];

  const fetchProducts = async () => {
    try {
      const data = await apiRequest('/products');
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!deleteModal.product) return;
    setDeleting(true);
    try {
      await apiRequest(`/products/${deleteModal.product._id}`, {
        method: 'DELETE',
      });
      setFeedbackMsg(`"${deleteModal.product.name}" deleted successfully.`);
      setDeleteModal({ open: false, product: null });
      fetchProducts();
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err) {
      alert(`Failed to delete product: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesSearch =
      search.trim() === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-warmbrown-900">
            Product Management
          </h1>
          <p className="text-xs sm:text-sm text-warmbrown-600">
            Add, update, or remove crochet items. Changes appear immediately on the customer shop.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-warmbrown-900 hover:bg-warmbrown-800 text-cream-50 font-semibold text-xs sm:text-sm shadow-soft transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <span>{feedbackMsg}</span>
          <button onClick={() => setFeedbackMsg('')}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-warmbrown-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-xs text-warmbrown-500 whitespace-nowrap hidden sm:inline">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm font-semibold text-warmbrown-800 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-warmbrown-400 text-xs animate-pulse">
            Loading products catalog...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-warmbrown-500 text-xs space-y-2">
            <span className="text-4xl block">🧺</span>
            <p className="font-bold text-sm text-warmbrown-800">No products found</p>
            <p>Try clearing your search filter or add your first creation.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-50 text-warmbrown-800 font-bold border-b border-cream-200">
                <tr>
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-3">SKU</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Price</th>
                  <th className="py-3.5 px-3">Stock &amp; Availability</th>
                  <th className="py-3.5 px-3">Badges</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100 text-warmbrown-800">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-cream-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || '/placeholder.jpg'}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-cream-100 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/product/${p._id}`}
                            target="_blank"
                            className="font-bold text-warmbrown-900 hover:text-blush-600 transition-colors flex items-center gap-1 truncate"
                            title={p.name}
                          >
                            <span>{p.name}</span>
                            <ExternalLink className="w-3 h-3 opacity-60 flex-shrink-0" />
                          </Link>
                          <span className="text-[11px] text-warmbrown-500 block truncate">
                            {p.size}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono text-[11px] font-semibold text-warmbrown-600">
                      {p.sku}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-full bg-cream-100 text-warmbrown-800 font-semibold text-[11px]">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-bold text-warmbrown-900">
                        {formatPrice(p.price)}
                      </div>
                      {p.originalPrice && (
                        <div className="text-[10px] text-warmbrown-400 line-through">
                          {formatPrice(p.originalPrice)}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          p.availability === 'In Stock'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : p.availability === 'Made to Order'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {p.availability} ({p.stockQuantity} qty)
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex flex-col gap-1 items-start text-[10px]">
                        {p.isFeatured && (
                          <span className="bg-blush-100 text-blush-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-blush-600" />
                            Featured
                          </span>
                        )}
                        {p.isCustomizable && (
                          <span className="text-warmbrown-500 font-medium">Customizable</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/edit/${p._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-warmbrown-800 bg-cream-100 hover:bg-cream-200 border border-cream-200 shadow-xs transition-colors"
                          title="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-warmbrown-700" />
                          <span>Edit</span>
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ open: true, product: p })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 shadow-xs transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && deleteModal.product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warmbrown-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-cream-200 shadow-soft-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-serif text-lg font-bold text-warmbrown-900">
                Delete Product?
              </h3>
              <p className="text-xs text-warmbrown-600">
                Are you sure you want to delete <strong className="text-warmbrown-900">"{deleteModal.product.name}"</strong>? This will remove it from the customer shop page immediately.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteModal({ open: false, product: null })}
                className="flex-1 py-2.5 rounded-xl border border-cream-300 text-warmbrown-700 font-semibold text-xs hover:bg-cream-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
