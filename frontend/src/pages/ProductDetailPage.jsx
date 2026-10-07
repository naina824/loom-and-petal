import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useCart } from '../context/CartContext';
import { apiRequest, getWhatsAppOrderLink, getInstagramLink, handleInstagramClick } from '../utils/api';
import ProductCard from '../components/ProductCard';
import InstagramIcon from '../components/InstagramIcon';
import {
  MessageCircle,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  Heart,
  Share2,
  Check,
  Info,
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { settings, formatPrice } = useSettings();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await apiRequest(`/products/${id}`);
        setProduct(data);
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }

        // Fetch related products in same category
        if (data.category) {
          const related = await apiRequest(`/products?category=${data.category}`);
          setRelatedProducts(related.filter((p) => p._id !== data._id).slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-cream-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-6 bg-cream-200 rounded w-1/4" />
            <div className="h-10 bg-cream-200 rounded w-3/4" />
            <div className="h-8 bg-cream-200 rounded w-1/3" />
            <div className="h-28 bg-cream-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <span className="text-5xl block">🧶</span>
        <h2 className="font-serif text-2xl font-bold text-warmbrown-900">
          Product Not Found
        </h2>
        <p className="text-sm text-warmbrown-600">
          The requested crochet piece might have been moved or removed.
        </p>
        <Link
          to="/shop"
          className="inline-flex px-6 py-2.5 rounded-full bg-warmbrown-900 text-cream-50 text-xs font-semibold hover:bg-warmbrown-800 transition-colors"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80'];

  const whatsappUrl = getWhatsAppOrderLink(settings.whatsappNumber, product, {
    currencySymbol: settings.currencySymbol,
    selectedColor: selectedColor,
    customNote: customNote,
  });

  const instagramUrl = getInstagramLink(settings.instagramHandle);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12 sm:space-y-16 pb-24 sm:pb-16">
      {/* Back button */}
      <div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-warmbrown-600 hover:text-warmbrown-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Collection</span>
        </Link>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Gallery / Images (Left side: 6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-cream-100 border border-cream-200 shadow-soft">
            <img
              src={images[selectedImageIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {/* Category Badge */}
            <span className="absolute top-4 left-4 bg-cream-50/95 backdrop-blur-sm text-warmbrown-800 text-xs font-bold px-3 py-1 rounded-full border border-cream-200 shadow-xs">
              {product.category}
            </span>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-blush-500 ring-2 ring-blush-200'
                      : 'border-cream-200 hover:border-warmbrown-300 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions (Right side: 6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-warmbrown-500 bg-cream-200/80 px-2.5 py-0.5 rounded-md">
                ID: {product.sku}
              </span>
              <button
                onClick={handleShare}
                className="text-xs text-warmbrown-600 hover:text-warmbrown-900 inline-flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-cream-200 transition-colors"
                title="Copy product link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-warmbrown-900 leading-tight">
              {product.name}
            </h1>

            {/* Pricing & Stock */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-2xl sm:text-3xl font-bold text-warmbrown-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base text-warmbrown-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}

              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  product.availability === 'In Stock'
                    ? 'bg-emerald-100 text-emerald-800'
                    : product.availability === 'Made to Order'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {product.availability}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-warmbrown-700 leading-relaxed">
            {product.description}
          </p>

          {/* Specifications Pills */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-cream-50 border border-cream-200 text-xs">
            <div>
              <span className="text-warmbrown-500 block">Dimensions / Size:</span>
              <span className="font-semibold text-warmbrown-800">{product.size}</span>
            </div>
            <div>
              <span className="text-warmbrown-500 block">Yarn / Materials:</span>
              <span className="font-semibold text-warmbrown-800">{product.materials}</span>
            </div>
          </div>

          {/* Available Colors Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-warmbrown-800 uppercase tracking-wider">
                Select Shade / Color: <span className="text-blush-600 font-semibold">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedColor === color
                        ? 'bg-warmbrown-900 text-white shadow-xs'
                        : 'bg-cream-100 text-warmbrown-800 hover:bg-cream-200'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customization Details Note */}
          {product.isCustomizable && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-warmbrown-800">
                <Sparkles className="w-3.5 h-3.5 text-blush-500" />
                <span>Customization Request (Optional)</span>
              </div>
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. Custom wrap color, add hand-written birthday card, specific pastel shade..."
                rows={2}
                className="w-full p-3 rounded-2xl bg-cream-50 border border-cream-200 text-xs text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300 resize-none"
              />
              <p className="text-[11px] text-warmbrown-500">
                {product.customizationNote || 'We tailor each piece happily to your preferences!'}
              </p>
            </div>
          )}

          {/* PRIMARY ORDER ACTIONS */}
          <div className="space-y-3 pt-3 border-t border-cream-200">
            {/* ORDER ON WHATSAPP BUTTON (Required Primary) */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-soft hover:shadow-soft-lg transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Order on WhatsApp</span>
            </a>

            {/* SECONDARY ROW: ORDER VIA INSTAGRAM & ADD TO BAG */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* ORDER VIA INSTAGRAM BUTTON (Required) */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleInstagramClick(e, settings.instagramHandle)}
                className="w-full py-3 px-4 rounded-2xl bg-blush-100 hover:bg-blush-200 text-blush-900 border border-blush-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <InstagramIcon className="w-4 h-4 text-blush-600" />
                <span>Order via Instagram</span>
              </a>

              {/* ADD TO BAG BUTTON */}
              <button
                onClick={() => addToCart(product, quantity, selectedColor)}
                className="w-full py-3 px-4 rounded-2xl bg-cream-200 hover:bg-cream-300 text-warmbrown-900 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>
            </div>

            <p className="text-center text-[11px] text-warmbrown-500 pt-1">
              💬 Direct one-on-one conversation with the artisan. No login or account required!
            </p>
          </div>

          {/* Care Instructions Accordion / Info Box */}
          <div className="p-4 rounded-2xl bg-cream-100/70 border border-cream-200 space-y-2 text-xs text-warmbrown-700">
            <h4 className="font-semibold text-warmbrown-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-warmbrown-500" />
              <span>Handmade Care Guide</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-warmbrown-600 text-[11px] leading-relaxed">
              <li>Keep away from open flames and prolonged direct dampness.</li>
              <li>For dust, gently brush with a soft cosmetic brush or light blowdry on cool.</li>
              <li>Spot clean gently with cold water and mild baby detergent if needed. Lay flat to air dry.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-cream-200">
          <div className="text-center sm:text-left">
            <span className="text-xs uppercase tracking-widest text-blush-600 font-bold">
              More You'll Adore
            </span>
            <h3 className="font-serif text-2xl font-bold text-warmbrown-900 mt-1">
              Complementary Creations
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Order & Bag Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-cream-200 px-3 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] shadow-soft-xl flex items-center gap-2">
        <button
          onClick={() => addToCart(product, quantity, selectedColor)}
          className="flex-1 py-3 px-3 rounded-xl bg-cream-200 active:bg-cream-300 text-warmbrown-900 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add to Bag</span>
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-3 rounded-xl bg-emerald-600 active:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Order {formatPrice(product.price)}</span>
        </a>
      </div>
    </div>
  );
}
