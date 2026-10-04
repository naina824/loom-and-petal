import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { getInstagramLink } from '../utils/api';
import InstagramIcon from './InstagramIcon';
import {
  Heart,
  MessageCircle,
  Mail,
  Sparkles,
  Lock,
} from 'lucide-react';

export default function Footer() {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  const whatsappUrl = `https://wa.me/${(settings.whatsappNumber || '919209622019').replace(/[^0-9]/g, '')}`;
  const instagramUrl = getInstagramLink(settings.instagramHandle);

  return (
    <footer className="bg-warmbrown-900 text-cream-100 pt-16 pb-10 border-t border-warmbrown-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-warmbrown-800/80">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧶</span>
              <span className="font-serif text-2xl font-bold tracking-tight text-cream-50">
                {settings.brandName || 'Loom & Petal'}
              </span>
            </div>
            <p className="text-warmbrown-200 text-sm leading-relaxed max-w-md">
              {settings.shortIntro ||
                'Handcrafted with love, patience, and 100% premium milk cotton yarn. We create everlasting crochet blooms, snuggly amigurumi companions, and personalized keepsakes that stay vibrant forever.'}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-warmbrown-800 hover:bg-blush-500 hover:text-white flex items-center justify-center transition-colors text-cream-200"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-warmbrown-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors text-cream-200"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              {settings.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  aria-label="Email"
                  className="w-9 h-9 rounded-full bg-warmbrown-800 hover:bg-warmbrown-700 hover:text-white flex items-center justify-center transition-colors text-cream-200"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-cream-100 uppercase tracking-wider text-xs">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-warmbrown-200">
              <li>
                <Link to="/" className="hover:text-blush-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-blush-300 transition-colors">
                  Shop Collection
                </Link>
              </li>
              <li>
                <Link to="/custom-orders" className="hover:text-blush-300 transition-colors">
                  Custom Orders
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blush-300 transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blush-300 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Handmade Promise */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-cream-100 uppercase tracking-wider text-xs">
              Handmade Promise
            </h4>
            <div className="bg-warmbrown-800/60 rounded-2xl p-4 border border-warmbrown-700/50 space-y-2 text-xs text-warmbrown-200">
              <div className="flex items-center gap-2 text-blush-300 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero Plastic Blooms</span>
              </div>
              <p className="leading-relaxed">
                Every single piece is individually crocheted by hand. No machines, no mass factory assembly. Pure artisanal care in every loop.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-warmbrown-400 gap-4">
          <p className="flex items-center gap-1 text-center sm:text-left">
            <span>© {currentYear} {settings.brandName || 'Loom & Petal'}. Made with</span>
            <Heart className="w-3 h-3 text-blush-400 fill-blush-400 inline" />
            <span>&amp; milk cotton yarn. All rights reserved.</span>
          </p>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-warmbrown-400">Order via WhatsApp &amp; Instagram</span>
            {/* Discreet Admin Login Link */}
            <Link
              to="/admin/login"
              className="text-warmbrown-500 hover:text-warmbrown-300 flex items-center gap-1 transition-colors"
              title="Studio Portal"
            >
              <Lock className="w-3 h-3 opacity-60" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
