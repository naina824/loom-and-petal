import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { apiRequest, getWhatsAppCustomOrderLink, getInstagramLink } from '../utils/api';
import InstagramIcon from '../components/InstagramIcon';
import {
  Palette,
  Ruler,
  Wand2,
  Gift,
  Boxes,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  Send,
} from 'lucide-react';

export default function CustomOrdersPage() {
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    customerName: '',
    contactMethod: 'WhatsApp',
    contactInfo: '',
    customType: 'Custom Design',
    preferredColors: '',
    dimensions: '',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const customizationPillars = [
    {
      icon: <Palette className="w-6 h-6 text-blush-500" />,
      title: 'Custom Color Palette',
      desc: 'Pick your dream palette from over 60+ shades of premium combed milk cotton yarn to match your room aesthetic, outfit, or event decor.',
    },
    {
      icon: <Ruler className="w-6 h-6 text-sage-600" />,
      title: 'Custom Size & Proportions',
      desc: 'Need a jumbo amigurumi plushie, mini car-mirror charm, or a customized length bag strap? We tailor exact measurements to your liking.',
    },
    {
      icon: <Wand2 className="w-6 h-6 text-amber-600" />,
      title: 'Bespoke Custom Designs',
      desc: 'Share a sketch, Pinterest inspiration, or a photo of your pet dog/cat. We turn your vision into a 3D hand-crocheted keepsake.',
    },
    {
      icon: <Gift className="w-6 h-6 text-blush-600" />,
      title: 'Personalized Gifts & Notes',
      desc: 'Add custom hand-embroidered initials, engraved wooden charms, custom wrapping paper, and hand-written calligraphy greeting cards.',
    },
    {
      icon: <Boxes className="w-6 h-6 text-warmbrown-700" />,
      title: 'Bulk & Wedding Favors',
      desc: 'Intimate event favors, corporate gift hampers, baby showers, or wedding bridesmaid gifts. Special tier pricing on bulk batches.',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await apiRequest('/enquiries', {
        method: 'POST',
        body: JSON.stringify({
          customerName: formData.customerName,
          contactMethod: formData.contactMethod,
          contactInfo: formData.contactInfo,
          customType: formData.customType,
          customizationDetails: `Colors: ${formData.preferredColors} | Size: ${formData.dimensions}`,
          notes: formData.notes,
        }),
      });

      setSuccessMsg('Your custom order request has been received! We will connect with you soon on your chosen contact method.');
      setFormData({
        customerName: '',
        contactMethod: 'WhatsApp',
        contactInfo: '',
        customType: 'Custom Design',
        preferredColors: '',
        dimensions: '',
        notes: '',
      });
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try messaging on WhatsApp directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappDirectUrl = getWhatsAppCustomOrderLink(settings.whatsappNumber, {
    customerName: formData.customerName,
    customType: formData.customType,
    colors: formData.preferredColors,
    size: formData.dimensions,
    notes: formData.notes,
  });

  const instagramUrl = getInstagramLink(settings.instagramHandle);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blush-100 text-blush-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blush-500" />
          <span>Made-to-Order Crafts</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warmbrown-900">
          Custom Crochet Orders
        </h1>
        <p className="text-sm sm:text-base text-warmbrown-600 leading-relaxed">
          Every imagination can be woven with yarn. Let’s create something truly personal, special, and memorable for you or your favorite human.
        </p>

        {/* Quick Contact Buttons Row */}
        <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md sm:max-w-none mx-auto">
          <a
            href={whatsappDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-soft hover:shadow-soft-lg transition-all"
          >
            <MessageCircle className="w-4 h-4 flex-shrink-0" />
            <span>Chat Custom Order on WhatsApp</span>
          </a>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-warmbrown-800 border border-cream-300 hover:bg-cream-100 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <InstagramIcon className="w-4 h-4 text-blush-500 flex-shrink-0" />
            <span>DM on Instagram</span>
          </a>
        </div>
      </div>

      {/* 5 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customizationPillars.map((pillar, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 border border-cream-200 shadow-soft space-y-3 hover:shadow-soft-lg transition-shadow"
          >
            <div className="w-12 h-12 rounded-2xl bg-cream-100 flex items-center justify-center">
              {pillar.icon}
            </div>
            <h3 className="font-serif text-lg font-bold text-warmbrown-900">{pillar.title}</h3>
            <p className="text-xs text-warmbrown-600 leading-relaxed">{pillar.desc}</p>
          </div>
        ))}

        {/* Process Box */}
        <div className="bg-gradient-to-br from-blush-100/70 to-cream-200/80 rounded-3xl p-6 border border-blush-200 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blush-700">How It Works</span>
            <h3 className="font-serif text-lg font-bold text-warmbrown-900 mt-1 mb-2">
              Simple 3-Step Process
            </h3>
            <ol className="text-xs text-warmbrown-700 space-y-2 list-decimal list-inside">
              <li>Share your reference photo or idea via the form or WhatsApp.</li>
              <li>We finalize yarn shades, price quote, and timeline together.</li>
              <li>We crochet your bespoke piece, send WIP photos, and ship it safely!</li>
            </ol>
          </div>
          <div className="pt-3 text-[11px] text-warmbrown-600 font-medium">
            ⏱ Typical handmade turnaround: 4 to 8 business days
          </div>
        </div>
      </div>

      {/* Custom Order Request Form */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-soft-lg p-6 sm:p-10 max-w-3xl mx-auto">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs uppercase tracking-widest text-blush-600 font-bold">
            Direct Studio Enquiry
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-warmbrown-900">
            Submit Your Custom Order Request
          </h2>
          <p className="text-xs sm:text-sm text-warmbrown-600">
            Fill in your thoughts below and we will follow up with you directly on your chosen messaging platform.
          </p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="e.g. Radhika Sharma"
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">
                Preferred Contact Method *
              </label>
              <select
                value={formData.contactMethod}
                onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
              >
                <option value="WhatsApp">WhatsApp (Recommended)</option>
                <option value="Instagram">Instagram DM</option>
                <option value="Email">Email</option>
                <option value="Phone">Phone Call</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-warmbrown-800 mb-1">
              Contact Details (Phone Number / WhatsApp / Instagram Handle) *
            </label>
            <input
              type="text"
              required
              value={formData.contactInfo}
              onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
              placeholder="e.g. +91 98765 43210 or @your_instagram_handle"
              className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">
                Custom Type
              </label>
              <select
                value={formData.customType}
                onChange={(e) => setFormData({ ...formData, customType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
              >
                <option value="Custom Design">Custom Design / Pet Amigurumi</option>
                <option value="Custom Color">Color Palette Modification</option>
                <option value="Custom Size">Size / Proportion Customization</option>
                <option value="Personalized Gift">Personalized Keepsake & Gift</option>
                <option value="Bulk/Event Favors">Bulk Order / Wedding Favors</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">
                Preferred Color Palette
              </label>
              <input
                type="text"
                value={formData.preferredColors}
                onChange={(e) => setFormData({ ...formData, preferredColors: e.target.value })}
                placeholder="e.g. Pastel peach, cream, lavender, sage"
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-warmbrown-800 mb-1">
              Desired Dimensions / Size (Optional)
            </label>
            <input
              type="text"
              value={formData.dimensions}
              onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
              placeholder="e.g. Height around 25cm, 7 stems bouquet"
              className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-warmbrown-800 mb-1">
              Description &amp; Specific Wishes
            </label>
            <textarea
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Describe what you have in mind! You can also mention any required delivery date or occasion (birthday, anniversary, etc.)."
              className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300 resize-none"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-warmbrown-900 hover:bg-warmbrown-800 text-cream-50 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting Enquiry...' : 'Submit Custom Request'}</span>
            </button>

            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct WhatsApp Message</span>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
