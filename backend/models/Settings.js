import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      default: 'Loom & Petal Handmade',
    },
    tagline: {
      type: String,
      default: 'Handmade with Love • Everlasting Crochet Blooms & Keepsakes 🧶',
    },
    shortIntro: {
      type: String,
      default: 'Every loop, knot, and petal is mindfully hand-crocheted using ultra-soft milk cotton yarn to bring warm smiles that never fade.',
    },
    whatsappNumber: {
      type: String,
      default: '919209622019',
    },
    whatsappDisplay: {
      type: String,
      default: '+91 92096 22019',
    },
    instagramHandle: {
      type: String,
      default: 'crochet.by.naina_',
    },
    contactEmail: {
      type: String,
      default: 'hello@crochetboutique.com',
    },
    currencySymbol: {
      type: String,
      default: '₹',
    },
    announcementBar: {
      type: String,
      default: '🧶 Free custom greeting card on orders above ₹899 | Worldwide shipping available',
    },
    makerName: {
      type: String,
      default: 'Aanya Sharma',
    },
    makerBio: {
      type: String,
      default: 'Self-taught crochet artist crafting timeless blooms and snuggly amigurumi from my cozy sunlit corner studio.',
    },
    makerImage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Settings', settingsSchema);
