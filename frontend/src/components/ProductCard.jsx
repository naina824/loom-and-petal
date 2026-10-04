import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useCart } from '../context/CartContext';
import { getWhatsAppOrderLink } from '../utils/api';
import { MessageCircle, Eye, ShoppingBag, Sparkles } from 'lucide-react';

export default function ProductCard({ product }) {
  const { settings, formatPrice } = useSettings();
  const { addToCart } = useCart();

  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80';
  
  const whatsappUrl = getWhatsAppOrderLink(settings.whatsappNumber, product, {
    currencySymbol: settings.currencySymbol,
  });

  const isOutOfStock = product.availability === 'Out of Stock';

  return (
    <div className="group bg-white rounded-3xl p-3 sm:p-4 border border-cream-200/90 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col h-full relative">
      {/* Image Container */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-cream-100 mb-3.5">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 items-start max-w-[70%]">
          <span className="bg-cream-50/95 backdrop-blur-sm text-warmbrown-800 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full border border-cream-200 shadow-xs truncate">
            {product.category}
          </span>
          {product.isFeatured && (
            <span className="bg-blush-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Bestseller</span>
            </span>
          )}
        </div>

        {/* Stock Status Pill */}
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5">
          <span
            className={`text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm shadow-xs ${
              product.availability === 'In Stock'
                ? 'bg-emerald-50/90 text-emerald-700 border border-emerald-200'
                : product.availability === 'Made to Order'
                ? 'bg-amber-50/90 text-amber-700 border border-amber-200'
                : 'bg-rose-50/90 text-rose-700 border border-rose-200'
            }`}
          >
            {product.availability}
          </span>
        </div>

        {/* Quick Add To Bag Overlay Button on Desktop */}
        {!isOutOfStock && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="hidden sm:flex absolute bottom-3 right-3 bg-white/95 text-warmbrown-800 hover:text-blush-600 hover:bg-white p-2.5 rounded-full shadow-md transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
            title="Add to bag"
            aria-label="Add to bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow">
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-warmbrown-500 mb-1">
          <span className="font-mono text-[10px] sm:text-[11px]">{product.sku}</span>
          {product.isCustomizable && (
            <span className="text-[10px] sm:text-[11px] text-blush-600 font-medium">Customizable</span>
          )}
        </div>

        <Link
          to={`/product/${product._id}`}
          className="font-serif text-sm sm:text-lg font-semibold text-warmbrown-900 hover:text-blush-600 transition-colors line-clamp-1 mb-1"
          title={product.name}
        >
          {product.name}
        </Link>

        <p className="text-[11px] sm:text-xs text-warmbrown-500 line-clamp-2 mb-2 sm:mb-3 leading-relaxed">
          {product.description}
        </p>

        {/* Price & Action Buttons */}
        <div className="mt-auto pt-2 border-t border-cream-100">
          <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <span className="text-base sm:text-lg font-bold text-warmbrown-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-warmbrown-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {/* View Details Button */}
            <Link
              to={`/product/${product._id}`}
              className="w-full inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs font-semibold text-warmbrown-700 bg-cream-100 hover:bg-cream-200 active:bg-cream-300 transition-colors"
              title="View product details"
            >
              <Eye className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              <span>Details</span>
            </Link>

            {/* Quick Order on WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-xs transition-colors"
              title="Order on WhatsApp"
            >
              <MessageCircle className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              <span>Order</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
