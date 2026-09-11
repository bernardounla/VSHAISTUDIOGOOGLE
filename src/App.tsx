/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ScreenType, Registration } from './types';
import { INITIAL_REGISTRATIONS } from './data/initialData';
import { PublicView } from './components/PublicView';
import { AdminView } from './components/AdminView';
import { FamilyView } from './components/FamilyView';
import { ScreenSwitcher } from './components/ScreenSwitcher';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('site');
  const [registrations, setRegistrations] = useState<Registration[]>(INITIAL_REGISTRATIONS);

  const handleNewRegistration = (newReg: Registration) => {
    setRegistrations((prev) => [newReg, ...prev]);
  };

  const handleUpdateRegistration = (updated: Registration) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans antialiased relative">
      {/* Screen Views */}
      {currentScreen === 'site' && (
        <PublicView
          onNavigate={setCurrentScreen}
          onNewRegistration={handleNewRegistration}
        />
      )}

      {currentScreen === 'famille' && (
        <FamilyView onNavigate={setCurrentScreen} />
      )}

      {currentScreen === 'admin' && (
        <AdminView
          onNavigate={setCurrentScreen}
          registrations={registrations}
          onUpdateRegistration={handleUpdateRegistration}
        />
      )}

      {/* Persistent floating switcher to toggle across all 3 screens */}
      <ScreenSwitcher
        currentScreen={currentScreen}
        onSelectScreen={setCurrentScreen}
      />
    </div>
  );
}

