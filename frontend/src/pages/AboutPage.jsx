import React from 'react';
import nainaweb from '../assets/nainaweb.png';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { Sparkles, Heart, Feather, ShieldCheck, ArrowRight, Camera } from 'lucide-react';

export default function AboutPage() {
  const { settings } = useSettings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-blush-600 font-bold">
          Our Artisan Journey
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warmbrown-900">
          The Story Behind the Stitches
        </h1>
        <p className="text-sm sm:text-base text-warmbrown-600 leading-relaxed">
          How a ball of yarn, a simple ergonomic hook, and a deep love for mindful slow-living blossomed into {settings.brandName || 'Loom & Petal'}.
        </p>
      </div>

      {/* Brand Story Section with Maker Photo Space */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Maker Photo / Portrait Space (User can later replace photo) */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-cream-200 border-4 border-white shadow-soft-lg group">
            <img
              src={nainaweb}
              alt="Artisan Maker"
              className="w-full h-full object-cover"
            />
            {/* Subtle note indicating photo replacement area */}
            <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-cream-200 text-center shadow-xs">
              <span className="font-serif text-xs font-bold text-warmbrown-900 block">
                {settings.makerName || 'The Artisan Behind Loom & Petal'}
              </span>
              <span className="text-[10px] text-warmbrown-500">
                Founder, Designer &amp; Crochet Artist
              </span>
            </div>
          </div>
        </div>

        {/* Story Text */}
        <div className="lg:col-span-7 space-y-5 text-warmbrown-700 text-sm sm:text-base leading-relaxed">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cream-200/80 text-warmbrown-800 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-blush-500 fill-blush-400" />
            <span>Handcrafted with Heart</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-warmbrown-900">
            The Story Behind Loom &amp; Petal
          </h2>

          <p className="text-sm sm:text-base font-medium text-warmbrown-900 leading-snug">
            A little yarn, a lot of creativity, and something made with heart. 🧶🌸
          </p>

          <p>
            Hi, I’m Naina, the creator behind Loom &amp; Petal Handmade. What started as a love for crochet and handmade crafts slowly grew into a little creative space where I can turn simple yarn into something meaningful.
          </p>

          <p>
            I love creating pieces that feel personal—from crochet flowers and everlasting bouquets to cute accessories, bags, keychains, gifts, and custom creations. Every piece is carefully handmade, stitch by stitch, with patience and attention to detail.
          </p>

          <p>
            For me, crochet isn't just about making beautiful things. It's about creating something that carries a little piece of the time, creativity, and love that went into making it.
          </p>

          <p>
            At Loom &amp; Petal, every creation is handmade, every stitch has a story, and every piece is made with love. 💕
          </p>

          <div className="p-4 rounded-2xl bg-cream-100/90 border border-cream-200/80 text-warmbrown-800 font-serif italic text-sm sm:text-base flex items-center gap-2.5 shadow-xs">
            <Sparkles className="w-4 h-4 text-blush-500 shrink-0 not-italic" />
            <span>“Handmade crochet creations, made slowly, thoughtfully &amp; with love.” 🧶✨</span>
          </div>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="px-6 py-3 rounded-full bg-warmbrown-900 hover:bg-warmbrown-800 text-cream-50 font-semibold text-xs transition-colors shadow-soft"
            >
              Explore Our Creations
            </Link>
            <Link
              to="/custom-orders"
              className="px-6 py-3 rounded-full bg-white text-warmbrown-800 border border-warmbrown-300 hover:bg-cream-100 font-semibold text-xs transition-colors"
            >
              Request a Custom Piece
            </Link>
          </div>
        </div>
      </div>

      {/* Quality & Care Philosophy */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-cream-200 shadow-soft space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-blush-600 font-bold">
            Uncompromising Standards
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-warmbrown-900">
            Quality &amp; Care in Every Stitch
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3 p-5 rounded-2xl bg-cream-50 border border-cream-200">
            <div className="w-10 h-10 rounded-xl bg-blush-100 text-blush-600 flex items-center justify-center font-bold">
              100%
            </div>
            <h4 className="font-serif text-base font-bold text-warmbrown-900">
              Premium Combed Milk Cotton
            </h4>
            <p className="text-xs text-warmbrown-600 leading-relaxed">
              We exclusively source gentle, pill-resistant, non-allergenic milk cotton yarn that holds vivid color saturation for years without fading.
            </p>
          </div>

          <div className="space-y-3 p-5 rounded-2xl bg-cream-50 border border-cream-200">
            <div className="w-10 h-10 rounded-xl bg-sage-100 text-sage-600 flex items-center justify-center font-bold">
              🌿
            </div>
            <h4 className="font-serif text-base font-bold text-warmbrown-900">
              Zero Chemical Preservatives
            </h4>
            <p className="text-xs text-warmbrown-600 leading-relaxed">
              Unlike dried or chemical-stabilized flowers, our crochet flora emit zero harsh fumes or allergens, making them safe for kids, nurseries, and sensitive homes.
            </p>
          </div>

          <div className="space-y-3 p-5 rounded-2xl bg-cream-50 border border-cream-200">
            <div className="w-10 h-10 rounded-xl bg-warmbrown-100 text-warmbrown-800 flex items-center justify-center font-bold">
              🎁
            </div>
            <h4 className="font-serif text-base font-bold text-warmbrown-900">
              Heirloom Gift Presentation
            </h4>
            <p className="text-xs text-warmbrown-600 leading-relaxed">
              Wrapped in eco-conscious Korean bouquet paper, rustic kraft boxes, and handwritten calligraphic cards — ready to create unforgettable unboxing memories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
