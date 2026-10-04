import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Admin from '../models/Admin.js';
import Enquiry from '../models/Enquiry.js';
import Settings from '../models/Settings.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crochet_store';

const sampleProducts = [
  {
    name: 'Eternal Pastel Tulip Bouquet (5 Stems)',
    sku: 'CR-FLW-001',
    price: 1299,
    originalPrice: 1599,
    category: 'Flowers',
    description: 'A breathtaking everlasting floral bouquet featuring 5 meticulously hand-crocheted tulips in gentle blush pink, buttercup yellow, lilac, and soft ivory. Wrapped in premium artisan Korean matte paper tied with rustic jute twine. Forever blooms that never wither.',
    images: [
      'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80',
    ],
    colors: ['Blush Pink & Lilac', 'Pastel Sunshine Mix', 'Soft Peach & Cream', 'Custom Palette'],
    size: 'Length: 35cm (Stem included), Bloom: 6cm width',
    materials: '100% Combed Milk Cotton Yarn, Flexible Floral Stem Wire, Eco-wrap',
    stockQuantity: 12,
    availability: 'In Stock',
    isFeatured: true,
    isCustomizable: true,
    customizationNote: 'Choose stem count (3, 5, 7, 9) and customized petal color combo via WhatsApp message.',
    tags: ['bouquet', 'tulips', 'everlasting', 'gift', 'bestseller'],
  },
  {
    name: 'Sunbeam Crochet Sunflower Pot',
    sku: 'CR-FLW-002',
    price: 649,
    originalPrice: 799,
    category: 'Flowers',
    description: 'A charming hand-crocheted happy sunflower resting inside a mini terracotta ceramic-style crocheted basket pot. Features double-layered golden petals and rich cocoa seed center with flexible green leaves.',
    images: [
      'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    ],
    colors: ['Golden Yellow & Earth Brown', 'Warm Amber', 'Vanilla Yellow'],
    size: 'Height: 18cm, Pot diameter: 8cm',
    materials: 'Hypoallergenic Milk Cotton Yarn, Eco-fiberfill stuffing',
    stockQuantity: 8,
    availability: 'In Stock',
    isFeatured: true,
    isCustomizable: true,
    customizationNote: 'Can add custom embroidered initials on the pot rim.',
    tags: ['sunflower', 'desk decor', 'cute', 'gifts'],
  },
  {
    name: 'Daisy Meadow Pocket Tote Bag',
    sku: 'CR-BAG-001',
    price: 1899,
    originalPrice: 2299,
    category: 'Bags',
    description: 'An ethereal bohemian granny-square tote bag meticulously handcrafted with 24 individual floral squares. Stitched in warm cream cotton yarn with soft buttercup daisies and sage green borders. Lined with organic cotton canvas and sturdy reinforced straps.',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    ],
    colors: ['Warm Cream & Sage Green', 'Earthy Mocha & Daisy', 'Soft Lilac & Cream'],
    size: 'Width: 32cm, Height: 34cm, Strap drop: 26cm',
    materials: 'Thick combed cotton yarn, inner organic canvas lining, magnetic clasp',
    stockQuantity: 4,
    availability: 'In Stock',
    isFeatured: true,
    isCustomizable: true,
    customizationNote: 'Strap length and color palette can be personalized upon request.',
    tags: ['tote bag', 'granny square', 'boho', 'cottagecore'],
  },
  {
    name: 'Strawberry Boba Bunny Amigurumi',
    sku: 'CR-AMI-001',
    price: 899,
    originalPrice: 1099,
    category: 'Amigurumi',
    description: 'The sweetest plush handmade bunny holding a tiny crocheted strawberry boba cup! Features floppy ears, embroidered blushing cheeks, and safety lock eyes. Extremely snuggly and perfect for gifting to little ones or crochet collectors.',
    images: [
      'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?auto=format&fit=crop&w=800&q=80',
    ],
    colors: ['Strawberry Cream Pink', 'Oatmeal Bunny', 'Lavender Bunny'],
    size: 'Height: 20cm (including ears)',
    materials: 'Ultra-soft baby acrylic & milk cotton blend, anti-allergy polyfill',
    stockQuantity: 6,
    availability: 'In Stock',
    isFeatured: true,
    isCustomizable: true,
    customizationNote: 'Can customize bunny outfit color or add a tiny hand-crocheted letter charm.',
    tags: ['amigurumi', 'bunny', 'plushie', 'kids', 'cute'],
  },
  {
    name: 'Cosy Sloth On A Branch Amigurumi',
    sku: 'CR-AMI-002',
    price: 949,
    originalPrice: 1199,
    category: 'Amigurumi',
    description: 'A whimsical sleepy sloth with tiny magnetic paws that cuddle around a handmade textured crochet branch with green leaves. Brings a calming, mindful, slow-living vibe to your study desk or car rearview mirror.',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=800&q=80',
    ],
    colors: ['Oatmeal Brown', 'Ash Grey', 'Honey Caramel'],
    size: 'Length: 14cm',
    materials: '100% Textured Cotton Yarn, Embedded gentle snap buttons',
    stockQuantity: 5,
    availability: 'In Stock',
    isFeatured: false,
    isCustomizable: true,
    customizationNote: 'Available as hanging decor or standalone desk plushie.',
    tags: ['sloth', 'amigurumi', 'desk decor', 'mindful'],
  },
  {
    name: 'Vintage Floral Granny Headband / Bandana',
    sku: 'CR-ACC-001',
    price: 499,
    originalPrice: 599,
    category: 'Accessories',
    description: 'A nostalgic cottagecore crochet hair kerchief / bandana featuring openwork lace stitch and delicate scalloped borders. Comes with comfortable tie strings that fit all head shapes effortlessly without slipping.',
    images: [
      'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80',
    ],
    colors: ['Ivory Daisy', 'Sage & Olive', 'Terracotta Rose', 'Sky Blue'],
    size: 'Width: 42cm + 25cm braided ties on each side',
    materials: '100% Breathable Combed Cotton',
    stockQuantity: 15,
    availability: 'In Stock',
    isFeatured: false,
    isCustomizable: true,
    customizationNote: 'Choice of solid colors or two-tone floral motif.',
    tags: ['bandana', 'headband', 'hair accessory', 'cottagecore'],
  },
  {
    name: 'Blooming Lily of the Valley Car Charm & Keychain',
    sku: 'CR-ACC-002',
    price: 399,
    originalPrice: 499,
    category: 'Accessories',
    description: 'Charming bell-shaped white crochet blossoms with soft green foliage and a delicate brass bell that gives a pleasant subtle chime. Perfect as a car mirror hanging charm, backpack accent, or keychain.',
    images: [
      'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    ],
    colors: ['Pure White & Forest Green', 'Pastel Pink & Sage', 'Baby Blue & Mint'],
    size: 'Total hanging length: 22cm',
    materials: 'Fine Mercerized Cotton Yarn, Antique Golden Lobster Claw Ring',
    stockQuantity: 20,
    availability: 'In Stock',
    isFeatured: true,
    isCustomizable: true,
    customizationNote: 'Available with car hanging loop or metal keychain ring.',
    tags: ['keychain', 'car charm', 'lily of the valley', 'gift idea'],
  },
  {
    name: 'Artisan Celebration Gift Hamper (Flowers + Plushie + Note)',
    sku: 'CR-GFT-001',
    price: 2499,
    originalPrice: 2999,
    category: 'Gifts',
    description: 'Our most loved luxury crochet gift bundle! Includes 1 mini Rose & Lavender bouquet, 1 handmade mini amigurumi bear, 1 floral keychain, and a hand-lettered calligraphy message card, beautifully nestled in a recycled kraft box with shredded paper and satin ribbon.',
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=80',
    ],
    colors: ['Blush Rose Romance', 'Cozy Earth Tones', 'Lavender Dream'],
    size: 'Hamper Box: 28 x 20 x 10 cm',
    materials: 'Premium Milk Cotton Creations, Kraft Gift Box, Silk Ribbon',
    stockQuantity: 7,
    availability: 'In Stock',
    isFeatured: true,
    isCustomizable: true,
    customizationNote: 'Personalized calligraphy card text and choice of bouquet flowers included for free.',
    tags: ['gift box', 'hamper', 'anniversary', 'birthday', 'special'],
  },
  {
    name: 'Bespoke Custom Crochet Creation (Customized to Order)',
    sku: 'CR-CUS-001',
    price: 1499,
    originalPrice: null,
    category: 'Custom',
    description: 'Have a dream crochet design in mind? Whether it is a portrait amigurumi of your beloved pet, a personalized wedding bouquet matching your saree/dress, or a custom colorway tote bag, we bring your vision to life stitch by stitch.',
    images: [
      'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    ],
    colors: ['Custom Colors (Over 60 shades available)'],
    size: 'Custom Made to Your Specifications',
    materials: 'Selected based on project (Premium Cotton, Velvet Chenille, or Bamboo Yarn)',
    stockQuantity: 10,
    availability: 'Made to Order',
    isFeatured: true,
    isCustomizable: true,
    customizationNote: 'Discuss your reference photos, preferred dimensions, and delivery timeline directly on WhatsApp or Instagram.',
    tags: ['custom order', 'personalized', 'bespoke', 'pet portrait', 'wedding'],
  },
];

const sampleEnquiries = [
  {
    customerName: 'Priya Mehta',
    contactMethod: 'WhatsApp',
    contactInfo: '+91 98201 12345',
    productName: 'Eternal Pastel Tulip Bouquet (5 Stems)',
    productSku: 'CR-FLW-001',
    productPrice: 1299,
    quantity: 1,
    selectedColor: 'Blush Pink & Lilac',
    customizationDetails: 'Can you please add a custom greeting card saying "Happy 25th Birthday Rhea!"',
    customType: 'Personalized Gift',
    notes: 'Customer asked for delivery by next Friday in Mumbai.',
    status: 'Confirmed',
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    customerName: 'Sneha Deshmukh',
    contactMethod: 'Instagram',
    contactInfo: '@sneha_stitches_love',
    productName: 'Daisy Meadow Pocket Tote Bag',
    productSku: 'CR-BAG-001',
    productPrice: 1899,
    quantity: 1,
    selectedColor: 'Warm Cream & Sage Green',
    customizationDetails: 'Requested 5cm longer shoulder strap.',
    customType: 'Custom Size',
    notes: 'Sent photo preview on Instagram DM, customer loved the progress!',
    status: 'Contacted',
    orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    customerName: 'Aarav Kapoor',
    contactMethod: 'WhatsApp',
    contactInfo: '+91 98110 54321',
    productName: 'Artisan Celebration Gift Hamper',
    productSku: 'CR-GFT-001',
    productPrice: 2499,
    quantity: 2,
    selectedColor: 'Lavender Dream',
    customizationDetails: 'Need 2 hampers for anniversary gifts.',
    customType: 'Bulk/Event Favors',
    notes: 'Paid 50% advance on WhatsApp UPI.',
    status: 'Completed',
    orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    customerName: 'Ananya Roy',
    contactMethod: 'Direct Web',
    contactInfo: 'ananya.roy@example.com',
    productName: 'Bespoke Custom Crochet Creation',
    productSku: 'CR-CUS-001',
    productPrice: 1499,
    quantity: 1,
    selectedColor: 'Golden Retriever shades',
    customizationDetails: 'Want a miniature crochet replica of my dog Bruno holding a tiny bone.',
    customType: 'Custom Design',
    notes: 'Reference photos sent via WhatsApp.',
    status: 'New',
    orderDate: new Date(),
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🧶 Connected to MongoDB for seeding...');

    // Clear existing products and enquiries for fresh seed
    await Product.deleteMany({});
    await Enquiry.deleteMany({});

    console.log('🌱 Cleared old products and enquiries.');

    // Seed products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✨ Successfully seeded ${insertedProducts.length} handmade crochet products!`);

    // Seed enquiries
    const insertedEnquiries = await Enquiry.insertMany(sampleEnquiries);
    console.log(`✨ Successfully seeded ${insertedEnquiries.length} sample customer enquiries!`);

    // Ensure Admin exists
    const email = (process.env.ADMIN_EMAIL || 'dharmakkollanainarao@gmail.com').toLowerCase();
    const existingAdmin = await Admin.findOne({ email });
    if (!existingAdmin) {
      await Admin.create({
        name: 'Crochet Artisan Admin',
        email,
        password: process.env.ADMIN_PASSWORD || 'Nainarao123',
        role: 'admin',
      });
      console.log(`✨ Created admin account: ${email}`);
    } else {
      console.log(`✨ Admin account already verified: ${email}`);
    }

    // Ensure Settings exist
    let settings = await Settings.findOne();
    if (!settings) {
      await Settings.create({
        brandName: process.env.BRAND_NAME || 'Loom & Petal Handmade',
        whatsappNumber: process.env.WHATSAPP_NUMBER || '919209622019',
        instagramHandle: process.env.INSTAGRAM_HANDLE || 'crochet.by.naina_',
      });
      console.log('✨ Seeded default store settings.');
    }

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seedDatabase();
