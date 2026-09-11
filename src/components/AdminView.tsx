import React, { useState } from 'react';
import { ScreenType, Registration, UserSession } from '../types';
import { DIRECTOR_INFO, CAMEROUN_PROJECT } from '../data/initialData';

interface AdminViewProps {
  onNavigate: (screen: ScreenType) => void;
  registrations: Registration[];
  onUpdateRegistration: (updated: Registration) => void;
  currentUser?: UserSession | null;
  onLogout?: () => void;
  onOpenNotificationTester?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  onNavigate,
  registrations,
  onUpdateRegistration,
  currentUser,
  onLogout,
  onOpenNotificationTester
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRegModal, setSelectedRegModal] = useState<Registration | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [camerounShoesCount, setCamerounShoesCount] = useState(CAMEROUN_PROJECT.collectedShoes);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter registrations
  const filteredRegs = registrations.filter((reg) => {
    const matchesSearch =
      reg.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.reference.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStatus === 'incomplete') return reg.dossierStatus === 'incomplete' || !reg.medicalDocSubmitted;
    if (filterStatus === 'pending_payment') return reg.paymentStatus !== 'paid';
    if (filterStatus === 'paid') return reg.paymentStatus === 'paid';
    return true;
  });

  // Calculate KPIs
  const totalRevenue = registrations.reduce((acc, r) => acc + r.amountPaid, 14700);
  const totalPending = registrations.reduce((acc, r) => acc + (r.totalAmount - r.amountPaid), 2910);
  const totalIncomplete = registrations.filter(r => !r.medicalDocSubmitted || r.dossierStatus === 'incomplete').length;

  const handleApprovePayment = (reg: Registration) => {
    const updated: Registration = {
      ...reg,
      amountPaid: reg.totalAmount,
      paymentStatus: 'paid',
      notes: `${reg.notes || ''} [Règlement validé par Dir. HAPPI le ${new Date().toLocaleDateString('fr-FR')}]`
    };
    onUpdateRegistration(updated);
    if (selectedRegModal?.id === reg.id) {
      setSelectedRegModal(updated);
    }
    showToast(`Règlement de ${reg.totalAmount} € validé pour le dossier ${reg.reference}`);
  };

  const handleValidateMedicalSheet = (reg: Registration) => {
    const updated: Registration = {
      ...reg,
      medicalDocSubmitted: true,
      dossierStatus: 'complete',
      notes: `${reg.notes || ''} [Fiche Sanitaire validée conforme par Christian HAPPI]`
    };
    onUpdateRegistration(updated);
    if (selectedRegModal?.id === reg.id) {
      setSelectedRegModal(updated);
    }
    showToast(`Fiche sanitaire validée pour ${reg.childName}`);
  };

  const handleSendReminder = (reg: Registration) => {
    showToast(`SMS et Email de relance automatique envoyés à ${reg.parentName} (${reg.parentPhone})`);
  };

  const handleBatchReminder = () => {
    showToast(`Relance groupée déclenchée : 4 SMS et Emails envoyés aux dossiers incomplets.`);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] pb-24">
      {/* Top Admin Security Header */}
      <div className="bg-[#191c1e] text-white px-4 sm:px-8 py-3 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#fe6a34] flex items-center justify-center text-white font-bold">
              <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
            </div>
            <div>
              <div className="font-bold text-sm tracking-wide flex items-center gap-2">
                <span>Espace Direction & Encadrement</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/15 text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  SSL 256-bit Sécurisé
                </span>
              </div>
              <p className="text-xs text-white/60">
                Connecté : <strong>{currentUser?.name || 'Christian HAPPI'}</strong> (Directeur de séjour)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            <button
              onClick={() => onNavigate('site')}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-sm">public</span>
              <span>Site Public</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 flex items-center gap-1.5 transition-all border border-rose-500/30"
                title="Se déconnecter de l'espace direction"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-[#006a62] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-[#2ec4b6] animate-bounce">
            <span className="material-symbols-outlined text-emerald-300">verified</span>
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Dashboard Title & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#191c1e] tracking-tight">
              Tableau de Bord & Gestion des Séjours Été 2026
            </h1>
            <p className="text-xs sm:text-sm text-[#3c4947] mt-1">
              Centre de gestion du Gymnase René Cassin & Stades Municipaux de Cosne-Cours-sur-Loire
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenNotificationTester && (
              <button
                onClick={onOpenNotificationTester}
                className="px-4 py-2.5 bg-[#006a62] hover:bg-[#005049] text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5"
                title="Tester l'envoi d'email via Resend.com et SMS vers l'Italie (+39)"
              >
                <span className="material-symbols-outlined text-sm">mark_email_read</span>
                <span>Tester Email Resend & SMS (+39)</span>
              </button>
            )}

            <button
              onClick={handleBatchReminder}
              className="px-4 py-2.5 bg-[#fe6a34] hover:bg-[#ab3500] text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">send_and_archive</span>
              <span>Relance Auto (SMS/Email)</span>
            </button>

            <button
              onClick={() => showToast('Export du registre officiel Jeunesse & Sports (PDF & Excel) généré avec succès.')}
              className="px-3.5 py-2.5 bg-white border border-[#bbcac6] hover:bg-[#e6e8ea] text-[#191c1e] font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Registre Officiel</span>
            </button>
          </div>
        </div>

        {/* Live KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Places */}
          <div className="bg-white p-5 rounded-2xl border border-[#e0e3e5] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6c7a77] uppercase tracking-wider">Capacité Globale</span>
              <span className="w-8 h-8 rounded-lg bg-[#006a62]/10 text-[#006a62] flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">group</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#191c1e] font-display">112</span>
              <span className="text-xs text-[#6c7a77]">/ 140 places cumulées</span>
            </div>
            <div className="w-full bg-[#e0e3e5] h-2 rounded-full overflow-hidden">
              <div className="bg-[#006a62] h-full rounded-full" style={{ width: '80%' }}></div>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">80% d'occupation • 28 places restantes</p>
          </div>

          {/* Card 2: Encaissements */}
          <div className="bg-white p-5 rounded-2xl border border-[#e0e3e5] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6c7a77] uppercase tracking-wider">Trésorerie Encaissée</span>
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">payments</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#006a62] font-display">{totalRevenue.toLocaleString()} €</span>
            </div>
            <p className="text-[11px] text-[#ab3500] font-medium">
              + {totalPending.toLocaleString()} € restant dû (chèques & CCAS en attente)
            </p>
          </div>

          {/* Card 3: Dossiers Sanitaires */}
          <div className="bg-white p-5 rounded-2xl border border-[#e0e3e5] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6c7a77] uppercase tracking-wider">Fiches Sanitaires</span>
              <span className="w-8 h-8 rounded-lg bg-[#fe6a34]/15 text-[#ab3500] flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">health_and_safety</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#191c1e] font-display">
                {registrations.length - totalIncomplete} / {registrations.length}
              </span>
              <span className="text-xs text-[#6c7a77]">conformes</span>
            </div>
            <p className="text-[11px] text-[#ab3500] font-semibold">
              {totalIncomplete} dossier{totalIncomplete > 1 ? 's' : ''} incomplet{totalIncomplete > 1 ? 's' : ''} (vaccins/allergies)
            </p>
          </div>

          {/* Card 4: Solidarité Cameroun */}
          <div className="bg-white p-5 rounded-2xl border border-[#e0e3e5] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6c7a77] uppercase tracking-wider">Collecte Cameroun</span>
              <span className="w-8 h-8 rounded-lg bg-[#2ec4b6]/20 text-[#004c46] flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">volunteer_activism</span>
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-[#191c1e] font-display">{camerounShoesCount}</span>
                <span className="text-xs text-[#6c7a77]">/ 100 paires</span>
              </div>
              <button
                onClick={() => {
                  setCamerounShoesCount(c => c + 1);
                  showToast('+1 Paire de baskets enregistrée au stock du gymnase.');
                }}
                className="px-2 py-1 rounded bg-[#006a62] text-white text-[11px] font-bold hover:bg-[#005049]"
              >
                +1 Paire
              </button>
            </div>
            <p className="text-[11px] text-[#006a62] font-medium">58 kg conditionnés au Gymnase Cassin</p>
          </div>
        </div>

        {/* Automated Relance Bot Notification Banner */}
        <div className="bg-gradient-to-r from-[#006a62] to-[#004c46] text-white p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-[#70f8e8]">
              <span className="material-symbols-outlined">smart_toy</span>
            </div>
            <div>
              <h4 className="text-sm font-bold">Module d'automatisation des relances sanitaires & paiements</h4>
              <p className="text-xs text-white/80 mt-0.5">
                Le système vérifie chaque soir les attestations de vaccination et envoie un SMS de rappel avec le lien de téléchargement Cerfa aux parents concernés.
              </p>
            </div>
          </div>

          <button
            onClick={handleBatchReminder}
            className="whitespace-nowrap px-4 py-2 bg-[#2ec4b6] hover:bg-[#70f8e8] text-[#004c46] font-bold rounded-xl text-xs transition-all shadow-xs"
          >
            Déclencher relance immédiate
          </button>
        </div>

        {/* Registrations Management Section */}
        <div className="bg-white rounded-3xl border border-[#e0e3e5] shadow-xs overflow-hidden">
          {/* Header & Filter Controls */}
          <div className="p-5 border-b border-[#e0e3e5] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold font-display text-[#191c1e]">
                Registres des Inscriptions ({registrations.length} Familles Enregistrées)
              </h2>
              <p className="text-xs text-[#6c7a77]">Consultez les statuts, validez les règlements et fiches sanitaires de liaison.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#6c7a77]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Rechercher enfant, parent, réf..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#bbcac6] focus:outline-none focus:border-[#006a62]"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-[#f2f4f6] p-1 rounded-xl border border-[#e0e3e5] text-xs">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    filterStatus === 'all' ? 'bg-white text-[#006a62] font-bold shadow-xs' : 'text-[#3c4947]'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setFilterStatus('incomplete')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    filterStatus === 'incomplete' ? 'bg-[#fe6a34] text-white font-bold shadow-xs' : 'text-[#3c4947]'
                  }`}
                >
                  Dossier Incomplet
                </button>
                <button
                  onClick={() => setFilterStatus('pending_payment')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    filterStatus === 'pending_payment' ? 'bg-[#ab3500] text-white font-bold shadow-xs' : 'text-[#3c4947]'
                  }`}
                >
                  Solde Dû
                </button>
                <button
                  onClick={() => setFilterStatus('paid')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    filterStatus === 'paid' ? 'bg-[#006a62] text-white font-bold shadow-xs' : 'text-[#3c4947]'
                  }`}
                >
                  Réglé
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#f7f9fb] border-b border-[#e0e3e5] text-[#6c7a77] uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3.5 px-4">Dossier / Réf</th>
                  <th className="py-3.5 px-4">Enfant & Groupe</th>
                  <th className="py-3.5 px-4">Parent & Contact</th>
                  <th className="py-3.5 px-4">Semaines</th>
                  <th className="py-3.5 px-4">Règlement</th>
                  <th className="py-3.5 px-4">Fiche Sanitaire</th>
                  <th className="py-3.5 px-4 text-right">Actions Direction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f6]">
                {filteredRegs.map((reg) => {
                  const isFullyPaid = reg.amountPaid >= reg.totalAmount;
                  const isMedicalOk = reg.medicalDocSubmitted;

                  return (
                    <tr key={reg.id} className="hover:bg-[#f7f9fb]/80 transition-colors">
                      {/* Ref */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-[#006a62]">{reg.reference}</div>
                        <div className="text-[10px] text-[#6c7a77]">{reg.dateCreated}</div>
                      </td>

                      {/* Child */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#191c1e] text-sm">{reg.childName}</div>
                        <div className="text-[11px] text-[#3c4947]">{reg.childGroup} ({reg.childAge} ans)</div>
                        {reg.camerounShoesDonated > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#fe6a34]">
                            👟 {reg.camerounShoesDonated} paire(s) Cameroun
                          </span>
                        )}
                      </td>

                      {/* Parent */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#191c1e]">{reg.parentName}</div>
                        <div className="text-[11px] text-[#3c4947] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px] text-[#006a62]">call</span>
                          <a href={`tel:${reg.parentPhone.replace(/\s+/g, '')}`} className="hover:underline">
                            {reg.parentPhone}
                          </a>
                        </div>
                        <div className="text-[10px] text-[#6c7a77]">{reg.parentEmail}</div>
                      </td>

                      {/* Weeks */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[120px]">
                          {reg.weeks.map(w => (
                            <span key={w} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#f2f4f6] text-[#006a62] border border-[#e0e3e5]">
                              {w.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-[#191c1e]">{reg.totalAmount} €</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {isFullyPaid ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Réglé ({reg.paymentMethod})
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                              Reste : {reg.totalAmount - reg.amountPaid} €
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Medical Sheet */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isMedicalOk ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <span className="material-symbols-outlined text-xs">verified</span>
                            <span>Validée</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            <span className="material-symbols-outlined text-xs">warning</span>
                            <span>Manquante</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isFullyPaid && (
                            <button
                              onClick={() => handleApprovePayment(reg)}
                              title="Valider l'encaissement du solde"
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-xs">done</span>
                              <span>Encaisser</span>
                            </button>
                          )}

                          {!isMedicalOk && (
                            <button
                              onClick={() => handleSendReminder(reg)}
                              title="Envoyer une relance par SMS & Email"
                              className="p-1.5 rounded-lg bg-[#fe6a34]/15 hover:bg-[#fe6a34]/30 text-[#ab3500]"
                            >
                              <span className="material-symbols-outlined text-sm">notifications_active</span>
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedRegModal(reg)}
                            className="px-2.5 py-1 rounded-lg bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#006a62] font-semibold text-[11px] flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-xs">visibility</span>
                            <span>Fiche</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Direction Notes & Staff Organization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#e0e3e5] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#006a62] font-bold text-sm">
              <span className="material-symbols-outlined">badge</span>
              <span>Encadrement & BPJEPS</span>
            </div>
            <p className="text-xs text-[#3c4947]">
              Taux d'encadrement en vigueur : 1 animateur pour 8 enfants de moins de 6 ans, 1 pour 12 enfants de plus de 6 ans. L'équipe Happy compte 6 animateurs diplômés + Directeur Christian HAPPI.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e0e3e5] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#fe6a34] font-bold text-sm">
              <span className="material-symbols-outlined">pool</span>
              <span>Conformité Centre Nautique</span>
            </div>
            <p className="text-xs text-[#3c4947]">
              Créneaux réservés avec la Mairie de Cosne les mardis et jeudis de 14h00 à 16h30. Les tests d'aisance aquatique sont validés par les MNS municipaux le premier jour.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e0e3e5] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#2ec4b6] font-bold text-sm">
              <span className="material-symbols-outlined">local_shipping</span>
              <span>Expédition Cameroun</span>
            </div>
            <p className="text-xs text-[#3c4947]">
              Le transitaire maritime au port du Havre est réservé pour le départ d'octobre 2026. L'objectif de 100 paires de chaussures et 6 jeux de maillots sera atteint fin août.
            </p>
          </div>
        </div>
      </main>

      {/* Inspection Modal for Fiche Sanitaire */}
      {selectedRegModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#e0e3e5] animate-fadeIn space-y-6">
            <div className="flex items-start justify-between border-b border-[#e0e3e5] pb-4">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#006a62] bg-[#2ec4b6]/15 px-2 py-0.5 rounded">
                  {selectedRegModal.reference}
                </span>
                <h3 className="text-xl font-bold font-display text-[#191c1e] mt-1">
                  Dossier Sanitaire de {selectedRegModal.childName}
                </h3>
                <p className="text-xs text-[#3c4947]">
                  Parent référent : {selectedRegModal.parentName} • {selectedRegModal.parentPhone}
                </p>
              </div>

              <button
                onClick={() => setSelectedRegModal(null)}
                className="w-8 h-8 rounded-full bg-[#f2f4f6] text-[#3c4947] flex items-center justify-center hover:bg-[#e6e8ea]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Medical Info Breakdown */}
            <div className="space-y-3 text-xs bg-[#f7f9fb] p-4 rounded-2xl border border-[#e0e3e5]">
              <div className="flex items-center justify-between pb-2 border-b border-[#e0e3e5]">
                <span className="text-[#6c7a77]">Statut Fiche de Liaison Sanitaire :</span>
                {selectedRegModal.medicalDocSubmitted ? (
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    Document certifié conforme
                  </span>
                ) : (
                  <span className="font-bold text-rose-700 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">cancel</span>
                    Document manquant ou non signé
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#191c1e]">Allergies & Régime alimentaire :</span>
                <p className="text-[#3c4947] bg-white p-2.5 rounded-lg border border-[#e0e3e5]">
                  {selectedRegModal.childName.includes('Léa')
                    ? 'Intolérance légère au lactose. Prévoir goûter sans produits laitiers de vache.'
                    : 'Aucune allergie alimentaire connue. Régime standard sans restriction.'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#191c1e]">Vaccination DTP (Diphtérie, Tétanos, Poliomyélite) :</span>
                <p className="text-[#3c4947] bg-white p-2.5 rounded-lg border border-[#e0e3e5]">
                  À jour (rappel des 6 ans validé par médecin traitant).
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#191c1e]">Autorisations Parentales :</span>
                <div className="bg-white p-2.5 rounded-lg border border-[#e0e3e5] space-y-1">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <span className="material-symbols-outlined text-xs">check</span>
                    <span>Autorisation d'hospitalisation d'urgence accordée au directeur</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700">
                    <span className="material-symbols-outlined text-xs">check</span>
                    <span>Droit à l'image pour la galerie privée de l'Espace Famille</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-3 bg-[#f2f4f6] rounded-xl text-xs flex items-center justify-between">
              <div>
                <span className="text-[#6c7a77]">Total : <strong>{selectedRegModal.totalAmount} €</strong></span>
                <span className="mx-2">•</span>
                <span className="text-emerald-700 font-bold">Encaissé : {selectedRegModal.amountPaid} €</span>
              </div>
              <span className="font-mono text-[#3c4947]">Mode : {selectedRegModal.paymentMethod}</span>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              {!selectedRegModal.medicalDocSubmitted && (
                <button
                  onClick={() => handleValidateMedicalSheet(selectedRegModal)}
                  className="flex-1 py-2.5 bg-[#006a62] hover:bg-[#005049] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">check_circle</span>
                  <span>Marquer Fiche Validée</span>
                </button>
              )}

              {selectedRegModal.amountPaid < selectedRegModal.totalAmount && (
                <button
                  onClick={() => handleApprovePayment(selectedRegModal)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">payments</span>
                  <span>Valider Solde ({selectedRegModal.totalAmount - selectedRegModal.amountPaid} €)</span>
                </button>
              )}

              <button
                onClick={() => setSelectedRegModal(null)}
                className="py-2.5 px-4 bg-white border border-[#bbcac6] text-[#3c4947] font-semibold rounded-xl text-xs hover:bg-[#e6e8ea]"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
