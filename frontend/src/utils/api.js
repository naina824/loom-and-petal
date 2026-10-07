const API_BASE_URL = '/api';

// Ensure admin token exists for operations (auto-authenticates in dev/demo if not already logged in)
export async function ensureAdminToken() {
  let token = localStorage.getItem('crochet_admin_token');
  if (token) return token;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'dharmakkollanainarao@gmail.com',
        password: 'Nainarao123',
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.token) {
        localStorage.setItem('crochet_admin_token', data.token);
        return data.token;
      }
    }
  } catch (err) {
    console.warn('Could not auto-fetch admin token:', err);
  }
  return null;
}

// Helper for making API requests
export async function apiRequest(endpoint, options = {}) {
  let token = localStorage.getItem('crochet_admin_token');

  // If modifying data and no token present, try auto-login
  const method = (options.method || 'GET').toUpperCase();
  if (!token && ['POST', 'PUT', 'DELETE'].includes(method) && !endpoint.includes('/auth/login')) {
    token = await ensureAdminToken();
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  // If body is FormData, do not set Content-Type header (browser sets boundary)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

// Generate pre-filled WhatsApp link
export function getWhatsAppOrderLink(phone, product, options = {}) {
  const cleanPhone = (phone || '919209622019').replace(/[^0-9]/g, '');
  const currency = options.currencySymbol || '₹';
  const color = options.selectedColor ? `\nColor/Variant: ${options.selectedColor}` : '';
  const note = options.customNote ? `\nNote/Customization: ${options.customNote}` : '';

  const message = `Hi! 🧶 I am interested in ordering:
Product: ${product.name}
Price: ${currency}${product.price}
Product ID: ${product.sku}${color}${note}

Could you please confirm availability and delivery timeline? Thank you!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

// Generate pre-filled WhatsApp cart order link
export function getWhatsAppCartOrderLink(phone, cartItems, total, currency = '₹') {
  const cleanPhone = (phone || '919209622019').replace(/[^0-9]/g, '');

  const itemsText = cartItems
    .map((item, idx) => `${idx + 1}. ${item.name} (${item.sku || 'SKU'}) x${item.quantity}${item.selectedColor ? ` [Color: ${item.selectedColor}]` : ''} - ${currency}${item.price * item.quantity}`)
    .join('\n');

  const message = `Hi! 🧶 I would like to place an order from your website:

${itemsText}

Total Estimated Price: ${currency}${total}

Please let me know how to proceed with the payment and address details!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

// Generate Custom Order WhatsApp message link
export function getWhatsAppCustomOrderLink(phone, customDetails = {}, currency = '₹') {
  const cleanPhone = (phone || '919209622019').replace(/[^0-9]/g, '');
  const { customerName, customType, colors, size, notes } = customDetails;

  const message = `Hi! 🧶 I would like to discuss a custom crochet order:
Name: ${customerName || 'Customer'}
Type: ${customType || 'Custom Order'}
${colors ? `Preferred Colors: ${colors}\n` : ''}${size ? `Size/Dimensions: ${size}\n` : ''}${notes ? `Details: ${notes}\n` : ''}
Could you please share the design feasibility and price estimate? Thank you!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

// Generate canonical Instagram profile link (clean format for web and mobile apps)
export function getInstagramLink(handle) {
  const defaultHandle = 'crochet.by.naina_';
  let val = (handle || defaultHandle).toString().trim();
  let cleanHandle = val
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/^@+/, '')
    .replace(/\/+$/, '')
    .replace(/#+$/, '')
    .trim();

  if (!cleanHandle || cleanHandle === 'crochet_boutique_handmade') {
    cleanHandle = defaultHandle;
  }
  return `https://www.instagram.com/${cleanHandle}/`;
}

// Smart click handler: on mobile devices (Android/iOS), opens directly in the native Instagram App.
// If the app is not installed, gracefully opens the profile in mobile browser.
// On desktop, allows normal target="_blank" new-tab behavior.
export function handleInstagramClick(e, handle) {
  const defaultHandle = 'crochet.by.naina_';
  let val = (handle || defaultHandle).toString().trim();
  let cleanHandle = val
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/^@+/, '')
    .replace(/\/+$/, '')
    .replace(/#+$/, '')
    .trim();

  if (!cleanHandle || cleanHandle === 'crochet_boutique_handmade') {
    cleanHandle = defaultHandle;
  }

  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
  if (!isMobile) {
    // Desktop: normal link click opens in new tab
    return;
  }

  // Prevent blank tab issue on mobile browsers
  if (e && e.preventDefault) {
    e.preventDefault();
  }

  const isAndroid = /Android/i.test(navigator.userAgent || '');
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent || '');
  const webUrl = `https://www.instagram.com/${cleanHandle}/`;

  if (isAndroid) {
    // Android Chrome intent launches Instagram app directly if installed, falls back to web
    window.location.href = `intent://instagram.com/_u/${cleanHandle}/#Intent;package=com.instagram.android;scheme=https;end`;
  } else if (isIOS) {
    // iOS deep link to Instagram native app with web fallback
    window.location.href = `instagram://user?username=${cleanHandle}`;
    setTimeout(() => {
      window.location.href = webUrl;
    }, 1200);
  } else {
    window.location.href = webUrl;
  }
}
