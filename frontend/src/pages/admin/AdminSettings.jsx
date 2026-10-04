import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/api';
import { useSettings } from '../../context/SettingsContext';
import { Save, CheckCircle2, Store, MessageCircle, Sparkles } from 'lucide-react';

export default function AdminSettings() {
  const { settings, refreshSettings } = useSettings();
  const [formData, setFormData] = useState({
    brandName: '',
    tagline: '',
    shortIntro: '',
    whatsappNumber: '',
    whatsappDisplay: '',
    instagramHandle: '',
    contactEmail: '',
    currencySymbol: '₹',
    announcementBar: '',
    makerName: '',
    makerBio: '',
    makerImage: '',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData({
        brandName: settings.brandName || 'Loom & Petal Handmade',
        tagline: settings.tagline || '',
        shortIntro: settings.shortIntro || '',
        whatsappNumber: settings.whatsappNumber || '',
        whatsappDisplay: settings.whatsappDisplay || '',
        instagramHandle: settings.instagramHandle || '',
        contactEmail: settings.contactEmail || '',
        currencySymbol: settings.currencySymbol || '₹',
        announcementBar: settings.announcementBar || '',
        makerName: settings.makerName || '',
        makerBio: settings.makerBio || '',
        makerImage: settings.makerImage || '',
      });
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await apiRequest('/settings', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });

      setSuccess(true);
      refreshSettings();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-warmbrown-900">
          Store &amp; Brand Settings
        </h1>
        <p className="text-xs sm:text-sm text-warmbrown-600">
          Configure your WhatsApp number, Instagram handle, and brand identity displayed across the website.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully! Website updated.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-cream-200 shadow-soft p-6 sm:p-8 space-y-6">
        {/* Brand Identity */}
        <div className="space-y-4">
          <h3 className="font-serif text-base font-bold text-warmbrown-900 flex items-center gap-2 border-b border-cream-100 pb-2">
            <Store className="w-4 h-4 text-blush-500" />
            <span>Brand Identity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">
                Brand Name
              </label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-warmbrown-800 mb-1">
              Brand Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-warmbrown-800 mb-1">
              Short Introduction
            </label>
            <textarea
              rows={2}
              value={formData.shortIntro}
              onChange={(e) => setFormData({ ...formData, shortIntro: e.target.value })}
              className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-warmbrown-800 mb-1">
              Top Announcement Bar Message
            </label>
            <input
              type="text"
              value={formData.announcementBar}
              onChange={(e) => setFormData({ ...formData, announcementBar: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
            />
          </div>
        </div>

        {/* WhatsApp & Social Media */}
        <div className="space-y-4 pt-4 border-t border-cream-100">
          <h3 className="font-serif text-base font-bold text-warmbrown-900 flex items-center gap-2 border-b border-cream-100 pb-2">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp Business &amp; Social Channels</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">
                WhatsApp Business Number (with country code, digits only)
              </label>
              <input
                type="text"
                placeholder="919876543210"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
              />
              <span className="text-[11px] text-warmbrown-500 mt-0.5 block">
                Customers clicking "Order on WhatsApp" will be redirected to this number.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">
                Instagram Handle
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warmbrown-400 text-xs">@</span>
                <input
                  type="text"
                  placeholder="crochet_boutique_handmade"
                  value={formData.instagramHandle}
                  onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value.replace('@', '') })}
                  className="w-full pl-7 pr-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-warmbrown-800 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
            />
          </div>
        </div>

        {/* Maker Profile Info */}
        <div className="space-y-4 pt-4 border-t border-cream-100">
          <h3 className="font-serif text-base font-bold text-warmbrown-900 flex items-center gap-2 border-b border-cream-100 pb-2">
            <Sparkles className="w-4 h-4 text-blush-500" />
            <span>Maker Profile (About Page)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">
                Artisan / Maker Name
              </label>
              <input
                type="text"
                value={formData.makerName}
                onChange={(e) => setFormData({ ...formData, makerName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">
                Maker Photo URL
              </label>
              <input
                type="url"
                value={formData.makerImage}
                onChange={(e) => setFormData({ ...formData, makerImage: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-cream-200 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-warmbrown-900 hover:bg-warmbrown-800 text-cream-50 font-bold text-xs sm:text-sm shadow-soft transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
