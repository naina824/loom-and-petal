import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import nainaweb from '../assets/nainaweb.png';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    brandName: 'Loom & Petal Handmade',
    tagline: 'Handmade with Love • Everlasting Blooms & Cozy Keepsakes 🧶',
    shortIntro: 'Every loop, knot, and petal is mindfully hand-crocheted using ultra-soft milk cotton yarn to bring warm smiles that never fade.',
    whatsappNumber: '919209622019',
    whatsappDisplay: '+91 92096 22019',
    instagramHandle: 'crochet.by.naina_',
    contactEmail: 'hello@crochetboutique.com',
    currencySymbol: '₹',
    announcementBar: '🧶 Free custom greeting card on orders above ₹899 | Pan-India & Worldwide shipping',
    makerName: 'Naina Rao',
    makerBio: 'Self-taught crochet artist crafting timeless blooms and snuggly amigurumi from my cozy sunlit studio.',
    makerImage: nainaweb,
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await apiRequest('/settings');
      if (data) {
        setSettings(prev => ({
          ...prev,
          ...data,
          makerImage: (data.makerImage && !data.makerImage.includes('images.unsplash.com')) ? data.makerImage : nainaweb,
        }));
      }
    } catch (err) {
      console.warn('Could not fetch remote settings, using defaults:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const formatPrice = (amount) => {
    if (amount === undefined || amount === null) return '';
    return `${settings.currencySymbol}${Number(amount).toLocaleString('en-IN')}`;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings: fetchSettings,
        formatPrice,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
