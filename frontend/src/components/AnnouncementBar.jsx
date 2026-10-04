import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Sparkles, Heart } from 'lucide-react';

export default function AnnouncementBar() {
  const { settings } = useSettings();

  if (!settings.announcementBar) return null;

  return (
    <div className="bg-blush-100 text-warmbrown-800 text-xs sm:text-sm py-2 px-4 border-b border-blush-200/60 font-medium">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center">
        <Sparkles className="w-3.5 h-3.5 text-blush-500 animate-pulse flex-shrink-0" />
        <span className="truncate">{settings.announcementBar}</span>
        <Heart className="w-3.5 h-3.5 text-blush-500 fill-blush-400 flex-shrink-0" />
      </div>
    </div>
  );
}
