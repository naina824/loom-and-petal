import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useCart } from '../context/CartContext';
import { getInstagramLink, handleInstagramClick } from '../utils/api';
import InstagramIcon from './InstagramIcon';
import {
  ShoppingBag,
  Menu,
  X,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSettings();
  const { totalCount, setIsOpen } = useCart();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Custom Orders', path: '/custom-orders' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const whatsappUrl = `https://wa.me/${(settings.whatsappNumber || '919209622019').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi! 🧶 I have an enquiry about your handmade crochet creations.')}`;
  const instagramUrl = getInstagramLink(settings.instagramHandle);
  const rawBrand = settings.brandName || 'Loom & Petal Handmade';
  const hasHandmade = /handmade/i.test(rawBrand);
  const primaryName = hasHandmade ? rawBrand.replace(/\s*handmade/i, '').trim() || 'Loom & Petal' : rawBrand;
  const secondaryName = hasHandmade ? 'Handmade' : '';

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur-md border-b border-cream-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo / Brand Name */}
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none min-w-0"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-blush-200 to-cream-200 flex items-center justify-center text-lg sm:text-xl shadow-soft group-hover:scale-105 transition-transform flex-shrink-0">
                🧶
              </div>
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="font-serif text-base sm:text-xl md:text-2xl font-bold tracking-tight text-warmbrown-900 group-hover:text-blush-600 transition-colors whitespace-nowrap">
                  {primaryName}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-warmbrown-500 font-medium -mt-0.5">
                  {secondaryName || 'Handmade'}
                  <span className="hidden md:inline"> Crochet Studio</span>
                </span>
              </div>
            </Link>

            {/* Desktop & Tablet Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-2.5 lg:px-3.5 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-medium transition-all duration-200 whitespace-nowrap ${isActive
                      ? 'bg-warmbrown-100 text-warmbrown-900 font-semibold shadow-xs'
                      : 'text-warmbrown-600 hover:text-warmbrown-900 hover:bg-cream-200/60'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-1 sm:space-x-2.5 flex-shrink-0">
              {/* Instagram Link (Desktop / Tablet) */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleInstagramClick(e, settings.instagramHandle)}
                aria-label="Instagram profile"
                className="hidden md:flex w-9 h-9 sm:w-10 sm:h-10 rounded-full text-warmbrown-600 hover:text-blush-600 hover:bg-cream-200 items-center justify-center transition-colors"
                title="Visit Instagram"
              >
                <InstagramIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>

              {/* WhatsApp Link (Desktop / Tablet) */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="hidden md:flex w-9 h-9 sm:w-10 sm:h-10 rounded-full text-warmbrown-600 hover:text-emerald-600 hover:bg-cream-200 items-center justify-center transition-colors"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>

              {/* Cart / Bag Button (Desktop / Tablet) */}
              <button
                onClick={() => setIsOpen(true)}
                aria-label="Shopping Bag"
                className="hidden md:flex relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cream-200/80 hover:bg-blush-100 text-warmbrown-800 items-center justify-center transition-colors"
                title="View Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-warmbrown-700" />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blush-500 text-white text-[10px] sm:text-[11px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-xs animate-gentle">
                    {totalCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative md:hidden w-10 h-10 rounded-xl text-warmbrown-700 hover:bg-cream-200 flex items-center justify-center focus:outline-none transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                {totalCount > 0 && !mobileMenuOpen && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blush-500 rounded-full ring-2 ring-cream-50" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu with Backdrop */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-cream-50 border-b border-cream-200 px-4 pt-3 pb-6 space-y-3 animate-drawer-down shadow-soft-lg">
            {/* Shopping Bag Quick Action in Mobile Menu */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsOpen(true);
              }}
              className="w-full px-4 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between bg-cream-100 border border-cream-200 text-warmbrown-900 hover:bg-cream-200 active:bg-cream-300"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-warmbrown-700" />
                <span>Shopping Bag</span>
              </div>
              {totalCount > 0 ? (
                <span className="bg-blush-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  {totalCount} {totalCount === 1 ? 'item' : 'items'}
                </span>
              ) : (
                <span className="text-xs text-warmbrown-500">0 items</span>
              )}
            </button>

            {/* Navigation Links */}
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${isActive
                      ? 'bg-warmbrown-900 text-cream-50 shadow-xs'
                      : 'text-warmbrown-700 hover:bg-cream-200 active:bg-cream-300'
                    }`
                  }
                >
                  <span>{link.name}</span>
                  <span className="text-xs opacity-50">→</span>
                </NavLink>
              ))}
            </div>

            {/* Social & Contact Actions */}
            <div className="pt-3 border-t border-cream-200 flex items-center justify-around gap-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleInstagramClick(e, settings.instagramHandle)}
                className="flex-1 flex items-center justify-center gap-2 text-xs text-warmbrown-800 font-semibold py-2.5 px-3 rounded-xl bg-white border border-cream-200 shadow-xs hover:bg-cream-100"
              >
                <InstagramIcon className="w-4 h-4 text-blush-500" />
                <span>Instagram</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 text-xs text-white font-semibold py-2.5 px-3 rounded-xl bg-emerald-600 shadow-xs hover:bg-emerald-700"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-warmbrown-900/30 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
