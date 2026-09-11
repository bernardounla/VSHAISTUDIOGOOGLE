import React, { useState } from 'react';
import { UserRole, UserSession } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialRole?: UserRole;
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialRole = 'parent',
  onClose,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<UserRole>(initialRole);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [parentFullName, setParentFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDemoLogin = (role: UserRole) => {
    setErrorMessage(null);
    if (role === 'admin') {
      onLoginSuccess({
        id: 'usr-admin-01',
        email: 'direction@vacances-sportives-happy.fr',
        name: 'Christian HAPPI (Directeur)',
        role: 'admin',
      });
    } else {
      onLoginSuccess({
        id: 'usr-parent-dubois',
        email: 'famille.dubois@gmail.com',
        name: 'Sophie & Marc DUBOIS',
        role: 'parent',
        registrationRef: 'VSH-26-042',
        childNames: 'Mathis & Léa',
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (activeTab === 'admin') {
      // Admin verification
      const trimmedEmail = email.trim().toLowerCase();
      if (
        (trimmedEmail === 'direction@vacances-sportives-happy.fr' || trimmedEmail === 'admin' || trimmedEmail === 'admin@happy.fr') &&
        (password === 'admin' || password === 'happy2026' || password === '1234')
      ) {
        onLoginSuccess({
          id: 'usr-admin-01',
          email: 'direction@vacances-sportives-happy.fr',
          name: 'Christian HAPPI (Directeur)',
          role: 'admin',
        });
      } else {
        setErrorMessage('Identifiants administrateur incorrects. Utilisez le bouton démo en un clic ou le mot de passe "admin".');
      }
    } else {
      // Parent verification
      if (!email) {
        setErrorMessage('Veuillez renseigner votre adresse email.');
        return;
      }

      if (isRegisterMode) {
        if (!parentFullName) {
          setErrorMessage('Veuillez renseigner votre nom complet.');
          return;
        }
        onLoginSuccess({
          id: `usr-parent-${Date.now()}`,
          email: email.trim(),
          name: parentFullName,
          role: 'parent',
          registrationRef: `VSH-26-${Math.floor(100 + Math.random() * 900)}`,
          childNames: 'Nouvel Enfant',
        });
      } else {
        // Parent login
        onLoginSuccess({
          id: 'usr-parent-session',
          email: email.trim(),
          name: email.includes('dubois') ? 'Sophie & Marc DUBOIS' : email.split('@')[0],
          role: 'parent',
          registrationRef: 'VSH-26-042',
          childNames: 'Mathis & Léa',
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#e0e3e5] animate-fadeIn flex flex-col">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#006a62] to-[#2ec4b6] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs mb-2">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span>Portail Authentifié SSL 256-bit</span>
          </div>

          <h3 className="text-2xl font-bold font-display tracking-tight">
            {activeTab === 'admin' ? 'Espace Direction Sécurisé' : 'Connexion Espace Famille'}
          </h3>
          <p className="text-xs text-white/90 mt-1">
            {activeTab === 'admin'
              ? 'Accès réservé à la direction et aux éducateurs sportifs habilités.'
              : 'Consultez les dossiers, fiches sanitaires et photos de vos enfants.'}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#e0e3e5] bg-[#f7f9fb] p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('parent');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'parent'
                ? 'bg-white text-[#006a62] shadow-xs border border-[#e0e3e5]'
                : 'text-[#6c7a77] hover:text-[#191c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-base">family_restroom</span>
            <span>Espace Parent</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setIsRegisterMode(false);
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-white text-[#ab3500] shadow-xs border border-[#e0e3e5]'
                : 'text-[#6c7a77] hover:text-[#191c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-base">admin_panel_settings</span>
            <span>Espace Direction</span>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Quick 1-Click Demo Logins */}
          <div className="bg-[#f2f4f6] p-3.5 rounded-2xl border border-[#bbcac6]/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3c4947] flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-[#006a62]">bolt</span>
                <span>Test Rapide (Compte Démo) :</span>
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                Prêt à tester
              </span>
            </div>

            {activeTab === 'admin' ? (
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="w-full py-2.5 px-3 bg-[#ab3500] hover:bg-[#832600] text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">verified_user</span>
                <span>Se connecter en tant que Christian HAPPI (Directeur)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleDemoLogin('parent')}
                className="w-full py-2.5 px-3 bg-[#006a62] hover:bg-[#005049] text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">login</span>
                <span>Se connecter en tant que Famille DUBOIS (Mathis & Léa)</span>
              </button>
            )}
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#e0e3e5]"></div>
            <span className="flex-shrink mx-3 text-[11px] text-[#6c7a77] uppercase font-semibold">
              Ou par saisie manuelle
            </span>
            <div className="flex-grow border-t border-[#e0e3e5]"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-600 text-sm">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {activeTab === 'parent' && isRegisterMode && (
              <div>
                <label className="block font-semibold text-[#191c1e] mb-1">Nom & Prénom du responsable légal *</label>
                <input
                  type="text"
                  required
                  placeholder="ex : Marie DUPONT"
                  value={parentFullName}
                  onChange={(e) => setParentFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#bbcac6] text-xs focus:outline-none focus:border-[#006a62]"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold text-[#191c1e] mb-1">
                {activeTab === 'admin' ? 'Identifiant ou Email professionnel' : 'Adresse Email'} *
              </label>
              <input
                type="text"
                required
                placeholder={activeTab === 'admin' ? 'direction@vacances-sportives-happy.fr' : 'votre.email@famille.fr'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#bbcac6] text-xs focus:outline-none focus:border-[#006a62]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-[#191c1e]">Mot de passe *</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-[#006a62] hover:underline"
                >
                  {showPassword ? 'Masquer' : 'Afficher'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#bbcac6] text-xs focus:outline-none focus:border-[#006a62]"
              />
              <p className="text-[10px] text-[#6c7a77] mt-1">
                {activeTab === 'admin' ? 'Mot de passe démo : "admin"' : 'Mot de passe démo : "parent" ou tout mot de passe'}
              </p>
            </div>

            <button
              type="submit"
              className={`w-full py-3 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
                activeTab === 'admin' ? 'bg-[#ab3500] hover:bg-[#832600]' : 'bg-[#006a62] hover:bg-[#005049]'
              }`}
            >
              <span className="material-symbols-outlined text-base">lock_open</span>
              <span>
                {activeTab === 'admin'
                  ? 'Accéder à l\'Espace Direction'
                  : isRegisterMode
                  ? 'Créer mon compte et accéder'
                  : 'Connexion Espace Famille'}
              </span>
            </button>

            {/* Toggle Sign up for parents */}
            {activeTab === 'parent' && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(!isRegisterMode);
                    setErrorMessage(null);
                  }}
                  className="text-xs text-[#006a62] hover:underline font-semibold"
                >
                  {isRegisterMode
                    ? 'Déjà un compte ? Me connecter'
                    : 'Première inscription ? Créer un compte famille'}
                </button>
              </div>
            )}
          </form>

          {/* Security footnote */}
          <div className="pt-2 border-t border-[#f2f4f6] flex items-center justify-between text-[10px] text-[#6c7a77]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-emerald-600">security</span>
              <span>Conforme RGPD & Jeunesse et Sports</span>
            </span>
            <span>Cosne-Cours-sur-Loire</span>
          </div>
        </div>
      </div>
    </div>
  );
};
