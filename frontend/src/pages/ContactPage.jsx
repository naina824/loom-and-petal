import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { apiRequest, getInstagramLink } from '../utils/api';
import InstagramIcon from '../components/InstagramIcon';
import {
  MessageCircle,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export default function ContactPage() {
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const whatsappUrl = `https://wa.me/${(settings.whatsappNumber || '919209622019').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi! 🧶 I would like to get in touch with Loom & Petal Crochet Studio.')}`;
  const instagramUrl = getInstagramLink(settings.instagramHandle);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      await apiRequest('/enquiries', {
        method: 'POST',
        body: JSON.stringify({
          customerName: formData.name,
          contactMethod: 'Direct Web',
          contactInfo: formData.emailOrPhone,
          productName: formData.subject || 'General Enquiry',
          notes: formData.message,
        }),
      });

      setSuccess(true);
      setFormData({ name: '', emailOrPhone: '', subject: '', message: '' });
    } catch (err) {
      setError(err.message || 'Failed to submit message. Please reach out via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'How long does a crochet order take to make and deliver?',
      a: 'Ready-to-ship items are dispatched within 24 to 48 hours. Custom bouquets and amigurumi usually require 4 to 8 business days for meticulous hand-crocheting and assembly before courier dispatch.',
    },
    {
      q: 'How do I pay for my order?',
      a: 'We accept all major UPI apps (Google Pay, PhonePe, Paytm), bank transfers, and secure payment links provided during our WhatsApp or Instagram checkout confirmation.',
    },
    {
      q: 'Do you offer custom greeting cards for gifts?',
      a: 'Yes! Every gift order includes a free handcrafted floral tag card. Simply tell us your desired message on WhatsApp or during checkout.',
    },
    {
      q: 'Can crochet flowers get dusty or dirty?',
      a: 'Crochet flowers can be gently cleaned using a soft cosmetic powder brush or a hair dryer on a cool, gentle air setting. They last for years looking just like the day they were stitched!',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-blush-600 font-bold">
          Get in Touch
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warmbrown-900">
          We’d Love to Hear From You
        </h1>
        <p className="text-sm sm:text-base text-warmbrown-600 leading-relaxed">
          Have a question about a product, custom colors, or want to discuss a bulk celebration order? Reach out anytime!
        </p>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* WhatsApp Business Card */}
        <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-soft flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-warmbrown-900">WhatsApp Business</h3>
            <p className="text-xs text-warmbrown-600 leading-relaxed">
              Fastest response! Chat directly with our artisan team to confirm custom shades, check availability, or place an order.
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span>{settings.whatsappDisplay || '+91 92096 22019'}</span>
          </a>
        </div>

        {/* Instagram DM Card */}
        <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-soft flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blush-100 text-blush-600 flex items-center justify-center">
              <InstagramIcon className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-warmbrown-900">Instagram Direct</h3>
            <p className="text-xs text-warmbrown-600 leading-relaxed">
              Follow our daily studio stories, see behind-the-scenes progress clips, and send us a direct message with reference pictures.
            </p>
          </div>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-blush-500 hover:bg-blush-600 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span>@{settings.instagramHandle || 'crochet.by.naina_'}</span>
          </a>
        </div>

        {/* Email & Studio Info Card */}
        <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-soft flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-warmbrown-100 text-warmbrown-800 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-warmbrown-900">Email Studio</h3>
            <p className="text-xs text-warmbrown-600 leading-relaxed">
              For corporate partnerships, workshop collaborations, or long-term consignment enquiries.
            </p>
          </div>
          {settings.contactEmail ? (
            <a
              href={`mailto:${settings.contactEmail}`}
              className="w-full py-2.5 px-4 rounded-xl bg-warmbrown-800 hover:bg-warmbrown-900 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>{settings.contactEmail}</span>
            </a>
          ) : (
            <div className="text-xs text-warmbrown-500 text-center py-2.5">Available via WhatsApp</div>
          )}
        </div>
      </div>

      {/* Contact Form & Studio Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-soft space-y-5">
          <div>
            <h3 className="font-serif text-xl font-bold text-warmbrown-900">Send a Note</h3>
            <p className="text-xs text-warmbrown-500">We usually reply within a couple of hours.</p>
          </div>

          {success && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Thank you! Your message has been sent. We'll be in touch soon.</span>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Maya Iyer"
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">
                WhatsApp Number or Email *
              </label>
              <input
                type="text"
                required
                value={formData.emailOrPhone}
                onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                placeholder="Where should we reply to you?"
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Question about Tulip Bouquet or Custom Order"
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-warmbrown-800 mb-1">Your Message *</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us how we can help you..."
                className="w-full p-3 rounded-xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-warmbrown-900 focus:outline-none focus:ring-2 focus:ring-blush-300 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-warmbrown-900 hover:bg-warmbrown-800 text-cream-50 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        </div>

        {/* FAQs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-warmbrown-800 font-serif text-lg font-bold">
            <HelpCircle className="w-5 h-5 text-blush-500" />
            <span>Frequently Asked Questions</span>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-cream-200 shadow-xs space-y-1.5">
                <h4 className="text-xs sm:text-sm font-bold text-warmbrown-900">{faq.q}</h4>
                <p className="text-xs text-warmbrown-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
