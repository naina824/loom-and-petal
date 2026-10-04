import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, X, Sparkles } from 'lucide-react';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');

  const categories = ['All', 'Flowers', 'Bags', 'Amigurumi', 'Accessories', 'Gifts', 'Custom'];

  // Sync category state if URL parameter changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && categories.includes(cat)) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Listen for product deletion to instantly update catalog
  useEffect(() => {
    const handleDeleted = (e) => {
      const deletedId = e.detail?.id;
      if (deletedId) {
        setProducts((prev) => prev.filter((p) => p._id !== deletedId));
      }
    };
    window.addEventListener('product-deleted', handleDeleted);
    return () => window.removeEventListener('product-deleted', handleDeleted);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory !== 'All') {
          queryParams.append('category', selectedCategory);
        }
        if (searchQuery.trim()) {
          queryParams.append('search', searchQuery.trim());
        }
        if (availabilityFilter !== 'All') {
          queryParams.append('availability', availabilityFilter);
        }
        if (sortBy) {
          queryParams.append('sort', sortBy);
        }

        const data = await apiRequest(`/products?${queryParams.toString()}`);
        setProducts(data);
      } catch (err) {
        console.error('Failed to load shop products', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProducts, 200);
    return () => clearTimeout(debounce);
  }, [selectedCategory, searchQuery, sortBy, availabilityFilter]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('featured');
    setAvailabilityFilter('All');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-blush-600 font-bold">
          Artisanal Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-warmbrown-900">
          Handmade Crochet Collection
        </h1>
        <p className="text-sm text-warmbrown-600">
          Hand-stitched blooms, sweet amigurumi, aesthetic bags, and accessories made with pure milk cotton.
        </p>
      </div>

      {/* Search and Category Filter Section */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-cream-200 shadow-soft space-y-4">
        {/* Top Controls: Search Bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warmbrown-400" />
            <input
              type="text"
              placeholder="Search by name, SKU (e.g. CR001), flowers, bags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-cream-50 border border-cream-200 text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-warmbrown-400 hover:text-warmbrown-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="w-full sm:w-auto flex items-center gap-2">
            <span className="text-xs text-warmbrown-500 whitespace-nowrap hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-800 font-medium focus:outline-none focus:ring-2 focus:ring-blush-300"
            >
              <option value="featured">Featured / Bestsellers</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
            </select>

            {/* Availability Filter */}
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-800 font-medium focus:outline-none focus:ring-2 focus:ring-blush-300"
            >
              <option value="All">All Stock</option>
              <option value="In Stock">In Stock Only</option>
              <option value="Made to Order">Made to Order</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-warmbrown-900 text-cream-50 shadow-xs'
                  : 'bg-cream-100/90 text-warmbrown-700 hover:bg-cream-200 active:bg-cream-300'
              }`}
            >
              {cat === 'All' ? 'All Collections' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter Indicators & Count */}
      <div className="flex items-center justify-between text-xs text-warmbrown-500 px-1">
        <span>
          Showing <strong className="text-warmbrown-800">{products.length}</strong> creations
          {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>

        {(selectedCategory !== 'All' || searchQuery || availabilityFilter !== 'All') && (
          <button
            onClick={handleClearFilters}
            className="text-blush-600 hover:underline font-semibold flex items-center gap-1"
          >
            <span>Reset filters</span>
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Products Grid - 2 cols on mobile, 3 cols on tablet, 4 cols on desktop */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-4 border border-cream-200 animate-pulse h-72 sm:h-80" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-cream-200 p-12 text-center max-w-md mx-auto space-y-4">
          <span className="text-5xl block">🧶</span>
          <h3 className="font-serif text-xl font-bold text-warmbrown-900">
            No matching crochet creations
          </h3>
          <p className="text-xs text-warmbrown-600 leading-relaxed">
            We couldn't find any creations matching your search criteria. Try resetting filters or request a custom order!
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={handleClearFilters}
              className="px-5 py-2.5 rounded-full bg-warmbrown-800 text-cream-50 text-xs font-semibold hover:bg-warmbrown-900 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
