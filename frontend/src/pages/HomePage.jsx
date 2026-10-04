import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { apiRequest, getInstagramLink } from '../utils/api';
import ProductCard from '../components/ProductCard';
import InstagramIcon from '../components/InstagramIcon';
import insta from '../assets/insta.png';
import web1 from '../assets/web1.png';
import web2 from '../assets/web2.png';
import web4 from '../assets/web4.png';
import flowers from '../assets/flowers.png';
import bow from '../assets/bow.png';
import bag from '../assets/bag.png';
import keychain from '../assets/keychain.png';
import custom from '../assets/custom.png';
import {
  Sparkles,
  Heart,
  ArrowRight,
  ShieldCheck,
  Feather,
  Flower2,
  Clock,
  Gift,
  Star,
  CheckCircle2,
} from 'lucide-react';

const heroSlides = [
  {
    image: web1,
    tag: 'Bestseller Creation',
    title: 'Pastel Tulip Symphony',
    desc: 'Hand-crocheted with 100% soft milk cotton',
  },
  {
    image: web2,
    tag: 'Artisan Floral Bouquet',
    title: 'Everlasting Stitched Blooms',
    desc: 'Timeless floral charm that brightens every corner',
  },
  {
    image: web4,
    tag: 'Handcrafted With Love',
    title: 'Bespoke Studio Treasures',
    desc: 'Crafted stitch-by-stitch for thoughtful gifting',
  },
];

export default function HomePage() {
  const { settings } = useSettings();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Auto-cycle hero images one after another every 2.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await apiRequest('/products?featured=true');
        setFeaturedProducts(data.slice(0, 6));
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Listen for product deletion
  useEffect(() => {
    const handleDeleted = (e) => {
      const deletedId = e.detail?.id;
      if (deletedId) {
        setFeaturedProducts((prev) => prev.filter((p) => p._id !== deletedId));
      }
    };
    window.addEventListener('product-deleted', handleDeleted);
    return () => window.removeEventListener('product-deleted', handleDeleted);
  }, []);

  const categories = [
    {
      name: 'Flowers & Bouquets',
      category: 'Flowers',
      desc: 'Everlasting blooms that never wither',
      icon: '💐',
      image: flowers,
    },
    {
      name: 'cute handmade crochet creations',
      category: 'Amigurumi',
      desc: 'Cute cuddly crochet companions',
      icon: '🧸',
      image: bow,
    },
    {
      name: 'Artisan Bags',
      category: 'Bags',
      desc: 'Boho granny square totes & pouches',
      icon: '👜',
      image: bag,
    },
    {
      name: 'Keychains & Accessories',
      category: 'Accessories',
      desc: 'Delicate floral hairpins & charms',
      icon: '🌸',
      image: keychain,
    },
    {
      name: 'Curated Gifts',
      category: 'Gifts',
      desc: 'Thoughtful boxed bundles with cards',
      icon: '🎁',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Custom Order',
      category: 'Custom',
      desc: 'Your imagination, hand-crocheted',
      icon: '✨',
      image: custom,
    },
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Mindful Yarn Selection',
      desc: 'We select hypoallergenic combed milk cotton yarn known for supreme softness, vibrant tones, and long-lasting durability.',
    },
    {
      number: '02',
      title: 'Stitch by Stitch Hand-crafting',
      desc: 'Every single petal, leaf, and plushie limb is gently crocheted by hand using fine ergonomic hooks over hours of attentive focus.',
    },
    {
      number: '03',
      title: 'Delicate Shaping & Assembly',
      desc: 'Petals are shaped with bendable floral wires and amigurumi details are hand-embroidered with loving safety care.',
    },
    {
      number: '04',
      title: 'Eco-Artisan Gift Packaging',
      desc: 'Each creation is thoughtfully wrapped in recycled kraft paper, tied with rustic jute twine, and accompanied by a custom message card.',
    },
  ];

  const testimonials = [
    {
      name: 'Radhika S.',
      location: 'Bengaluru',
      quote:
        'The pastel tulip bouquet I ordered for my sister’s graduation was beyond stunning! The craftsmanship is unbelievable — they look so lifelike and will literally stay forever.',
      product: 'Eternal Pastel Tulip Bouquet',
      rating: 5,
    },
    {
      name: 'Meera & Tanmay',
      location: 'Pune',
      quote:
        'We ordered custom crochet daisies and lavender stems for our wedding table decor. Guests could not stop praising them and took them home as cherished souvenirs!',
      product: 'Custom Floral Arrangement',
      rating: 5,
    },
    {
      name: 'Arjun K.',
      location: 'New Delhi',
      quote:
        'The strawberry bunny plushie is even cuter in person. It feels so soft and premium. Fast response on WhatsApp and seamless order experience!',
      product: 'Strawberry Boba Bunny',
      rating: 5,
    },
  ];


  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
        {/* Soft background accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blush-100/50 via-cream-200/40 to-sage-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blush-100/90 border border-blush-200 text-warmbrown-800 text-xs font-semibold shadow-xs">
                <span className="text-sm">🧶</span>
                <span>Handmade with Love &amp; Care</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-warmbrown-900 tracking-tight leading-[1.15]">
                Everlasting blooms &amp; cozy stitches,{' '}
                <span className="italic font-normal text-blush-600 block sm:inline">
                  made specially for you.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-warmbrown-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {settings.shortIntro ||
                  'Discover timeless hand-crocheted floral bouquets, cuddly amigurumi, and artisanal accessories. Crafted stitch by stitch using premium milk cotton yarn.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-warmbrown-900 text-cream-50 font-semibold text-sm hover:bg-warmbrown-800 transition-all shadow-soft hover:shadow-soft-lg flex items-center justify-center gap-2 group"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/custom-orders"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-warmbrown-800 font-semibold text-sm border border-warmbrown-300 hover:bg-cream-100 hover:border-warmbrown-400 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-blush-500" />
                  <span>Custom Orders</span>
                </Link>
              </div>

              {/* Trust Micro-Badges */}
              <div className="pt-6 border-t border-cream-200/90 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 text-[11px] sm:text-xs text-warmbrown-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Handcrafted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Everlasting Florals</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Order Directly via WhatsApp</span>
                </div>
              </div>
            </div>

            {/* Right Visual Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Card with Auto-Rotating Images */}
                <div className="relative rounded-3xl overflow-hidden shadow-soft-xl border-4 border-white aspect-[4/5] max-w-[320px] sm:max-w-md mx-auto lg:max-w-none bg-cream-200">
                  {heroSlides.map((slide, idx) => (
                    <img
                      key={idx}
                      src={slide.image}
                      alt={`Crochet creation ${idx + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                        currentHeroIndex === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                      }`}
                    />
                  ))}

                  {/* Clean Minimalist Dots Indicator with generous tap zones */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2 z-10 py-1">
                    {heroSlides.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={() => setCurrentHeroIndex(dotIdx)}
                        className={`h-2 rounded-full transition-all duration-300 p-1.5 -m-1 ${
                          currentHeroIndex === dotIdx
                            ? 'w-7 bg-white shadow-xs'
                            : 'w-2 bg-white/70 hover:bg-white'
                        }`}
                        aria-label={`Show slide ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs uppercase tracking-widest text-blush-600 font-bold">
            Curated Categories
          </span>
          <h2 className="font-serif text-3xl font-bold text-warmbrown-900">
            Explore Handcrafted Treasures
          </h2>
          <p className="text-sm text-warmbrown-600">
            From everlasting floral stems to custom plushies, explore what we make with love.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.category}
              to={`/shop?category=${cat.category}`}
              className="group bg-white rounded-3xl p-3.5 border border-cream-200 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col text-center"
            >
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-cream-100 mb-3 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2 right-2 text-lg bg-white/90 rounded-full p-1 shadow-xs">
                  {cat.icon}
                </span>
              </div>
              <h3 className="font-serif text-sm font-bold text-warmbrown-900 group-hover:text-blush-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-warmbrown-500 line-clamp-1 mt-0.5">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-blush-600 font-bold">
              Artisan Picks
            </span>
            <h2 className="font-serif text-3xl font-bold text-warmbrown-900 mt-1">
              Featured Creations
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-warmbrown-800 hover:text-blush-600 transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-4 border border-cream-200 animate-pulse h-80 sm:h-96" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. WHY CHOOSE HANDMADE? */}
      <section className="bg-cream-200/50 py-16 border-y border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase tracking-widest text-blush-600 font-bold">
              Thoughtful Living
            </span>
            <h2 className="font-serif text-3xl font-bold text-warmbrown-900">
              Why Choose Handmade Crochet?
            </h2>
            <p className="text-sm text-warmbrown-600">
              In a world of fast mass-production, here is why a handmade piece carries real warmth and soul.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blush-100 text-blush-600 flex items-center justify-center">
                <Flower2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-warmbrown-900">Everlasting Blooms</h3>
              <p className="text-xs text-warmbrown-600 leading-relaxed">
                Unlike real flowers that wither in a few days, crochet flowers keep their vivid charm for years without watering or sunlight.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sage-100 text-sage-600 flex items-center justify-center">
                <Feather className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-warmbrown-900">100% Gentle Cotton</h3>
              <p className="text-xs text-warmbrown-600 leading-relaxed">
                Crafted with skin-friendly combed milk cotton yarn. Hypoallergenic, odorless, and soft to touch for you and your loved ones.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-warmbrown-100 text-warmbrown-700 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-warmbrown-900">Hand-hooked with Love</h3>
              <p className="text-xs text-warmbrown-600 leading-relaxed">
                Each product takes 3 to 12 hours of mindful manual crocheting. No machines, no shortcuts — every single stitch is genuine.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-butter-100 text-warmbrown-800 flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-warmbrown-900">Custom &amp; Personal</h3>
              <p className="text-xs text-warmbrown-600 leading-relaxed">
                Add personalized greeting notes, change petal palettes, or design custom pet plushies tailored specially for your memorable moments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HANDMADE PROCESS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs uppercase tracking-widest text-blush-600 font-bold">
            Behind the Stitches
          </span>
          <h2 className="font-serif text-3xl font-bold text-warmbrown-900">
            How Your Crochet Piece is Made
          </h2>
          <p className="text-sm text-warmbrown-600">
            A quiet peek into our cozy studio where yarn turns into smiles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {processSteps.map((step, idx) => (
            <div
              key={step.number}
              className="relative bg-white rounded-3xl p-6 border border-cream-200 shadow-soft flex flex-col justify-between"
            >
              <div>
                <span className="font-serif text-3xl font-bold text-blush-300 block mb-2">
                  {step.number}
                </span>
                <h3 className="font-serif text-lg font-bold text-warmbrown-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-warmbrown-600 leading-relaxed">{step.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-cream-100 flex items-center gap-1.5 text-[11px] font-semibold text-blush-600">
                <Sparkles className="w-3 h-3" />
                <span>Step {idx + 1} of 4</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CUSTOMER LOVE / TESTIMONIALS */}
      <section className="bg-blush-50/60 py-16 border-y border-blush-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase tracking-widest text-blush-600 font-bold">
              Customer Love
            </span>
            <h2 className="font-serif text-3xl font-bold text-warmbrown-900">
              Heartfelt Words from Crochet Lovers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-cream-200 shadow-soft space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-warmbrown-700 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>
                <div className="pt-3 border-t border-cream-100">
                  <h4 className="text-sm font-bold text-warmbrown-900">{t.name}</h4>
                  <p className="text-xs text-warmbrown-500">
                    {t.location} • <span className="text-blush-600 font-medium">{t.product}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 7. INSTAGRAM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left">
          <div>
            <span className="text-xs uppercase tracking-widest text-blush-600 font-bold">
              Follow Our Journey
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-warmbrown-900 mt-1">
              Join Our Instagram Community
            </h2>
            <p className="text-sm text-warmbrown-600">
              @{settings.instagramHandle || 'crochet.by.naina_'}
            </p>
          </div>
          <a
            href={getInstagramLink(settings.instagramHandle || 'crochet.by.naina_')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-blush-500 text-white font-semibold text-xs sm:text-sm hover:bg-blush-600 transition-colors shadow-soft w-full sm:w-auto"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Follow on Instagram</span>
          </a>
        </div>

        <div className="flex justify-center">
          <a
            href={getInstagramLink(settings.instagramHandle || 'crochet.by.naina_')}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-3xl overflow-hidden border border-cream-200 shadow-soft-lg block max-w-xs sm:max-w-sm transition-transform duration-300 hover:scale-[1.02]"
          >
            <img
              src={insta}
              alt={`Follow @${settings.instagramHandle || 'crochet.by.naina_'} on Instagram`}
              className="w-full h-auto object-contain"
            />
            <div className="absolute inset-0 bg-warmbrown-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-semibold text-sm gap-2 backdrop-blur-[2px]">
              <InstagramIcon className="w-5 h-5 text-blush-300" />
              <span>Tap to Open Profile</span>
            </div>
          </a>
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-warmbrown-900 text-cream-50 p-8 sm:p-12 md:p-16 overflow-hidden shadow-soft-xl">
          <div className="relative z-10 max-w-2xl space-y-4 text-center sm:text-left">
            <span className="text-xs uppercase tracking-widest text-blush-300 font-bold">
              Bespoke Requests Welcome
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream-50 leading-tight">
              Have a special custom crochet dream in mind?
            </h2>
            <p className="text-sm sm:text-base text-warmbrown-200 leading-relaxed">
              Whether it’s a bouquet matching your room colors, an amigurumi replica of your pet, or unique favors for an intimate wedding, let’s hand-stitch it together.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Link
                to="/custom-orders"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-blush-500 hover:bg-blush-600 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Request Custom Order</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-warmbrown-800 hover:bg-warmbrown-700 text-cream-100 font-semibold text-sm transition-colors text-center"
              >
                Contact the Studio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
