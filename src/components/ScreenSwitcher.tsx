import React from 'react';
import { ScreenType, UserSession } from '../types';

interface ScreenSwitcherProps {
  currentScreen: ScreenType;
  currentUser?: UserSession | null;
  onSelectScreen: (screen: ScreenType) => void;
  onOpenAuthModal?: (target: 'admin' | 'parent') => void;
}

export const ScreenSwitcher: React.FC<ScreenSwitcherProps> = ({
  currentScreen,
  currentUser,
  onSelectScreen,
  onOpenAuthModal,
}) => {
  const handleSelect = (screen: ScreenType) => {
    if (screen === 'admin' && currentUser?.role !== 'admin') {
      if (onOpenAuthModal) {
        onOpenAuthModal('admin');
        return;
      }
    }
    if (screen === 'famille' && !currentUser) {
      if (onOpenAuthModal) {
        onOpenAuthModal('parent');
        return;
      }
    }
    onSelectScreen(screen);
  };

  return (
    <nav aria-label="Sélecteur d'écran" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[#191c1e]/95 text-white backdrop-blur-md px-3 py-2 rounded-full shadow-2xl border border-white/10 flex items-center gap-1 sm:gap-2">
      <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-white/60 font-medium border-r border-white/10 mr-1 hidden sm:flex">
        <span className="material-symbols-outlined text-sm text-[#2ec4b6]">visibility</span>
        <span>Aperçu Écrans :</span>
      </div>

      <button
        id="btn-switch-site"
        onClick={() => onSelectScreen('site')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
          currentScreen === 'site'
            ? 'bg-[#006a62] text-white shadow-md'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        <span className="material-symbols-outlined text-base">public</span>
        <span>1. Site Public</span>
      </button>

      <button
        id="btn-switch-famille"
        onClick={() => handleSelect('famille')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
          currentScreen === 'famille'
            ? 'bg-[#2ec4b6] text-[#004c46] shadow-md'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        <span className="material-symbols-outlined text-base">
          {!currentUser ? 'lock' : 'family_restroom'}
        </span>
        <span>2. Espace Famille</span>
        {currentUser?.role === 'parent' && (
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        )}
      </button>

      <button
        id="btn-switch-admin"
        onClick={() => handleSelect('admin')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
          currentScreen === 'admin'
            ? 'bg-[#ab3500] text-white shadow-md'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        <span className="material-symbols-outlined text-base">
          {currentUser?.role !== 'admin' ? 'lock' : 'admin_panel_settings'}
        </span>
        <span>3. Espace Admin</span>
        {currentUser?.role === 'admin' && (
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        )}
      </button>
    </nav>
  );
};

