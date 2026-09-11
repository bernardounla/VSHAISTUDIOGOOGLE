/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ScreenType, Registration, UserSession, UserRole } from './types';
import { INITIAL_REGISTRATIONS } from './data/initialData';
import { PublicView } from './components/PublicView';
import { AdminView } from './components/AdminView';
import { FamilyView } from './components/FamilyView';
import { ScreenSwitcher } from './components/ScreenSwitcher';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('site');
  const [registrations, setRegistrations] = useState<Registration[]>(INITIAL_REGISTRATIONS);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalRole, setAuthModalRole] = useState<UserRole>('parent');
  const [toastNotification, setToastNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => setToastNotification(null), 4000);
  };

  const handleOpenAuth = (role: UserRole) => {
    setAuthModalRole(role);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (session: UserSession) => {
    setCurrentUser(session);
    setIsAuthModalOpen(false);
    showToast(`Connexion réussie : Bienvenue ${session.name} !`, 'success');
    if (session.role === 'admin') {
      setCurrentScreen('admin');
    } else {
      setCurrentScreen('famille');
    }
  };

  const handleLogout = () => {
    const previousName = currentUser?.name;
    setCurrentUser(null);
    setCurrentScreen('site');
    showToast(`Déconnexion effectuée. À bientôt ${previousName || ''} !`, 'info');
  };

  const handleProtectedNavigate = (targetScreen: ScreenType) => {
    if (targetScreen === 'admin') {
      if (currentUser?.role === 'admin') {
        setCurrentScreen('admin');
      } else {
        handleOpenAuth('admin');
      }
      return;
    }

    if (targetScreen === 'famille') {
      if (currentUser) {
        setCurrentScreen('famille');
      } else {
        handleOpenAuth('parent');
      }
      return;
    }

    setCurrentScreen('site');
  };

  const handleNewRegistration = (newReg: Registration) => {
    setRegistrations((prev) => [newReg, ...prev]);
    // Auto-create and log in as this new parent session
    const newSession: UserSession = {
      id: `usr-parent-${Date.now()}`,
      email: newReg.parentEmail,
      name: newReg.parentName,
      role: 'parent',
      registrationRef: newReg.reference,
      childNames: newReg.childName,
    };
    setCurrentUser(newSession);
    showToast(`Pré-inscription enregistrée (Réf: ${newReg.reference}) ! Espace famille activé.`, 'success');
    setCurrentScreen('famille');
  };

  const handleUpdateRegistration = (updated: Registration) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans antialiased relative">
      {/* Toast Notification Banner */}
      {toastNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#191c1e] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 animate-fadeIn">
          <span className={`material-symbols-outlined text-lg ${toastNotification.type === 'success' ? 'text-emerald-400' : 'text-[#2ec4b6]'}`}>
            {toastNotification.type === 'success' ? 'check_circle' : 'info'}
          </span>
          <span className="text-xs font-semibold">{toastNotification.message}</span>
          <button
            onClick={() => setToastNotification(null)}
            className="text-white/60 hover:text-white ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Screen Views */}
      {currentScreen === 'site' && (
        <PublicView
          onNavigate={handleProtectedNavigate}
          onNewRegistration={handleNewRegistration}
          currentUser={currentUser}
          onOpenAuthModal={handleOpenAuth}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'famille' && (
        <FamilyView
          onNavigate={handleProtectedNavigate}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'admin' && (
        <AdminView
          onNavigate={handleProtectedNavigate}
          registrations={registrations}
          onUpdateRegistration={handleUpdateRegistration}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* Floating View Switcher with Auth Guards */}
      <ScreenSwitcher
        currentScreen={currentScreen}
        currentUser={currentUser}
        onSelectScreen={handleProtectedNavigate}
        onOpenAuthModal={handleOpenAuth}
      />

      {/* Authentication Modal (Admin & Parent) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialRole={authModalRole}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}


