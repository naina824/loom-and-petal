import React from 'react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { getWhatsAppCartOrderLink } from '../utils/api';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, clearCart, totalPrice, totalCount } = useCart();
  const { settings, formatPrice } = useSettings();

  if (!isOpen) return null;

  const whatsappCheckoutUrl = getWhatsAppCartOrderLink(
    settings.whatsappNumber,
    items,
    totalPrice,
    settings.currencySymbol
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-warmbrown-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream-50 shadow-soft-xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-cream-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blush-100 flex items-center justify-center text-blush-600">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-warmbrown-900">Your Shopping Bag</h3>
                <p className="text-xs text-warmbrown-500">{totalCount} item{totalCount !== 1 ? 's' : ''} selected</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-warmbrown-400 hover:text-warmbrown-800 rounded-full hover:bg-cream-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-warmbrown-400">
                <span className="text-4xl mb-3">🧺</span>
                <p className="font-serif text-lg text-warmbrown-700 font-semibold mb-1">Your bag is empty</p>
                <p className="text-xs text-warmbrown-500 max-w-xs mb-4">
                  Browse our handcrafted crochet bouquets, cozy amigurumi, and bags to find something special!
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 bg-warmbrown-800 text-cream-50 text-xs font-semibold rounded-full hover:bg-warmbrown-900 transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item._id}-${item.selectedColor}`}
                  className="flex gap-3 bg-white p-3.5 rounded-2xl border border-cream-200 shadow-xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-cream-100"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-warmbrown-900 truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item._id, item.selectedColor)}
                          className="text-warmbrown-400 hover:text-rose-500 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-warmbrown-500">
                        Color: <span className="font-medium text-warmbrown-700">{item.selectedColor}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-cream-100">
                      <div className="flex items-center gap-1.5 border border-cream-200 rounded-lg p-0.5 bg-cream-50">
                        <button
                          onClick={() => updateQuantity(item._id, item.selectedColor, -1)}
                          className="p-1 text-warmbrown-600 hover:bg-white rounded transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold px-1.5 text-warmbrown-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.selectedColor, 1)}
                          className="p-1 text-warmbrown-600 hover:bg-white rounded transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs sm:text-sm font-bold text-warmbrown-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / WhatsApp Checkout */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-cream-200 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-warmbrown-600 text-xs">
                  <span>Subtotal</span>
                  <span className="font-semibold text-warmbrown-800">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-warmbrown-600 text-xs">
                  <span>Estimated Shipping</span>
                  <span className="text-emerald-700 font-medium">Calculated upon order confirm</span>
                </div>
                <div className="pt-2 border-t border-cream-200 flex justify-between font-bold text-base text-warmbrown-900">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Order on WhatsApp Button */}
              <a
                href={whatsappCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-soft hover:shadow-soft-lg transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order Bag on WhatsApp</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </a>

              <div className="flex items-center justify-between text-[11px] text-warmbrown-400">
                <span>💬 Directly messages your curated order</span>
                <button
                  onClick={clearCart}
                  className="hover:text-rose-500 underline transition-colors"
                >
                  Clear Bag
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
