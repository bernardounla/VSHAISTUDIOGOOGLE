import React, { useState } from 'react';
import { ScreenType, GalleryPhoto } from '../types';
import { DIRECTOR_INFO, DUBOIS_FAMILY_CHILDREN, GALLERY_PHOTOS } from '../data/initialData';

interface FamilyViewProps {
  onNavigate: (screen: ScreenType) => void;
}

export const FamilyView: React.FC<FamilyViewProps> = ({ onNavigate }) => {
  const [selectedChildTab, setSelectedChildTab] = useState<'mathis' | 'lea'>('mathis');
  const [balanceDue, setBalanceDue] = useState<number>(80);
  const [paidAmount, setPaidAmount] = useState<number>(140);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentSuccessToast, setPaymentSuccessToast] = useState(false);

  // Gallery Filters
  const [photoFilter, setPhotoFilter] = useState<'all' | 'mathis' | 'lea' | 'piscine' | 'laser' | 'cameroun'>('all');
  const [viewingPhoto, setViewingPhoto] = useState<GalleryPhoto | null>(null);

  // Checklist for tomorrow
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Gourde d\'eau fraîche 1L marquée au prénom', checked: true },
    { id: 2, text: 'Casquette ou bob + Crème solaire 50+', checked: true },
    { id: 3, text: 'Maillot de bain & serviette (pour l\'après-midi piscine)', checked: false },
    { id: 4, text: 'Baskets de sport propres (gymnase Cassin)', checked: true },
    { id: 5, text: 'Paire de baskets de sport pour la collecte Cameroun', checked: false }
  ]);

  // Uploaded docs simulation
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: 'Fiche_Sanitaire_Dubois_Mathis.pdf', date: '14 Mai 2026', status: 'Conforme & Validée' },
    { name: 'Attestation_Nautique_Lea_Mathis.pdf', date: '15 Mai 2026', status: 'Validée MNS' },
    { name: 'Attestation_Assurance_Scolaire_2026.pdf', date: '14 Mai 2026', status: 'Validée' }
  ]);
  const [uploadToast, setUploadToast] = useState<string | null>(null);

  const toggleChecklistItem = (id: number) => {
    setChecklist(checklist.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaidAmount(prev => prev + balanceDue);
    setBalanceDue(0);
    setIsPaymentModalOpen(false);
    setPaymentSuccessToast(true);
    setTimeout(() => setPaymentSuccessToast(false), 4000);
  };

  const handleSimulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFiles(prev => [
        { name: file.name, date: 'Aujourd\'hui', status: 'En cours de validation' },
        ...prev
      ]);
      setUploadToast(`Fichier « ${file.name} » transmis avec succès au secrétariat.`);
      setTimeout(() => setUploadToast(null), 3500);
    }
  };

  const currentChild = DUBOIS_FAMILY_CHILDREN.find(c =>
    selectedChildTab === 'mathis' ? c.id === 'c-mathis' : c.id === 'c-lea'
  ) || DUBOIS_FAMILY_CHILDREN[0];

  const filteredPhotos = photoFilter === 'all'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter(p => p.category === photoFilter);

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] pb-24">
      {/* Top Urgent Day Banner */}
      <div className="bg-[#ab3500] text-white py-2.5 px-4 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base animate-pulse">emergency</span>
            <span className="font-bold">Ligne Directe Urgence Séjour :</span>
            <span>Christian HAPPI (Directeur) au</span>
            <a href={`tel:${DIRECTOR_INFO.phone.replace(/\s+/g, '')}`} className="font-bold underline tracking-wide">
              {DIRECTOR_INFO.phone}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/33630473041?text=Bonjour%20Christian,%20message%20de%20la%20Famille%20Dubois`}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 bg-white text-[#ab3500] hover:bg-white/90 rounded-md font-bold text-xs flex items-center gap-1 shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              <span>WhatsApp Direct</span>
            </a>
            <span className="text-white/60 hidden sm:inline">•</span>
            <span className="text-white/80 hidden sm:inline">Permanence Gymnase Cassin</span>
          </div>
        </div>
      </div>

      {/* Main Family Space Navigation Header */}
      <header className="bg-white border-b border-[#e0e3e5] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2ec4b6] to-[#006a62] flex items-center justify-center text-white font-bold shadow-xs">
              <span className="material-symbols-outlined text-xl">family_restroom</span>
            </div>
            <div>
              <div className="font-extrabold text-base sm:text-lg text-[#191c1e] font-display flex items-center gap-2">
                <span>Espace Famille Sécurisé</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2ec4b6]/20 text-[#004c46]">
                  Famille DUBOIS
                </span>
              </div>
              <p className="text-[11px] text-[#6c7a77]">Dossier n° VSH-26-042 • 2 Enfants Inscrits (Mathis & Léa)</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onNavigate('site')}
              className="px-3 py-1.5 rounded-lg bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#3c4947] text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span className="hidden sm:inline">Retour</span> Site Public
            </button>

            <button
              onClick={() => onNavigate('admin')}
              className="px-3 py-1.5 rounded-lg bg-[#fe6a34]/15 hover:bg-[#fe6a34]/25 text-[#ab3500] text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>Vue Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Messages */}
      {paymentSuccessToast && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl flex items-center justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600">verified</span>
              <span className="text-xs sm:text-sm font-semibold">
                Règlement de 80,00 € effectué par CB avec succès ! Votre dossier est désormais 100% soldé.
              </span>
            </div>
            <button onClick={() => setPaymentSuccessToast(false)} className="text-xs underline text-emerald-700">
              Fermer
            </button>
          </div>
        </div>
      )}

      {uploadToast && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="p-4 bg-teal-50 border border-teal-300 text-teal-800 rounded-2xl flex items-center gap-2 shadow-sm animate-fadeIn text-xs sm:text-sm font-semibold">
            <span className="material-symbols-outlined text-teal-600">cloud_done</span>
            <span>{uploadToast}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome & Account Summary Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e0e3e5] shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#191c1e]">
                  Bonjour Sophie & Marc
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  Dossier Homologué Jeunesse & Sports
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#3c4947] max-w-2xl">
                Retrouvez ici le planning quotidien de vos enfants, les attestations sanitaires validées, les photos sécurisées de leurs journées et les consignes pour les sacs du lendemain.
              </p>
            </div>

            {/* Financial Status Card */}
            <div className="w-full lg:w-auto bg-[#f7f9fb] p-4 sm:p-5 rounded-2xl border border-[#e0e3e5] flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6">
              <div className="space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#6c7a77]">État du Règlement</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-[#006a62] font-display">{paidAmount} €</span>
                  <span className="text-xs text-[#6c7a77]">payés / 220 € total</span>
                </div>
                {balanceDue > 0 ? (
                  <div className="text-xs font-bold text-[#ab3500]">
                    Solde restant : {balanceDue} € (à régler)
                  </div>
                ) : (
                  <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">check</span>
                    <span>Intégralement soldé</span>
                  </div>
                )}
              </div>

              {balanceDue > 0 && (
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="px-4 py-2.5 bg-[#006a62] hover:bg-[#005049] text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">credit_card</span>
                  <span>Régler {balanceDue} € par CB</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Children Tabs & Program */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6c7a77]">Enfants inscrits :</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedChildTab('mathis')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                    selectedChildTab === 'mathis'
                      ? 'bg-[#006a62] text-white shadow-xs'
                      : 'bg-white text-[#3c4947] border border-[#e0e3e5] hover:bg-[#f2f4f6]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Mathis (8 ans)</span>
                </button>

                <button
                  onClick={() => setSelectedChildTab('lea')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                    selectedChildTab === 'lea'
                      ? 'bg-[#006a62] text-white shadow-xs'
                      : 'bg-white text-[#3c4947] border border-[#e0e3e5] hover:bg-[#f2f4f6]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Léa (12 ans)</span>
                </button>
              </div>
            </div>

            <div className="text-xs text-[#3c4947]">
              Lieu de rassemblement chaque matin : <strong>Gymnase René Cassin à 9h00</strong>
            </div>
          </div>

          {/* Child Details Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e0e3e5] shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Profile & Health Info */}
              <div className="lg:col-span-4 space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={currentChild.photoUrl}
                    alt={currentChild.firstName}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-[#006a62] shadow-sm"
                  />
                  <div>
                    <h2 className="text-xl font-bold font-display text-[#191c1e]">
                      {currentChild.firstName} {currentChild.lastName}
                    </h2>
                    <p className="text-xs text-[#006a62] font-semibold">{currentChild.group}</p>
                    <p className="text-xs text-[#6c7a77]">Né(e) le {currentChild.birthDate} ({currentChild.age} ans)</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs bg-[#f7f9fb] p-4 rounded-2xl border border-[#e0e3e5]">
                  <div className="flex items-center justify-between pb-2 border-b border-[#e0e3e5]">
                    <span className="text-[#6c7a77]">Fiche Sanitaire :</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      Conforme & Validée
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-[#e0e3e5]">
                    <span className="text-[#6c7a77]">Aisance Aquatique 25m :</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">pool</span>
                      Certifié
                    </span>
                  </div>

                  <div>
                    <span className="text-[#6c7a77] block mb-1">Régime & Santé :</span>
                    <span className="font-semibold text-[#191c1e]">{currentChild.allergies}</span>
                  </div>
                </div>
              </div>

              {/* Weekly Schedule */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-display text-[#191c1e] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006a62]">event_note</span>
                    <span>Programme des Semaines Réservées</span>
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#f2f4f6] text-[#006a62]">
                    {currentChild.weeks.length} semaine{currentChild.weeks.length > 1 ? 's' : ''} au total
                  </span>
                </div>

                <div className="space-y-3">
                  {currentChild.id === 'c-mathis' ? (
                    <>
                      {/* Mathis Semaine 1 */}
                      <div className="p-4 rounded-2xl border border-[#006a62]/20 bg-[#006a62]/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#006a62] uppercase tracking-wider">
                            Semaine 1 : 06 au 10 Juillet 2026
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-white text-[#006a62] border border-[#006a62]/20">
                            En cours de confirmation
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#191c1e]">
                          Stage Multi-Sports, Flag Football & Sortie Laser Game
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#3c4947] pt-1">
                          <div>🏃 <strong>Matin (9h-12h) :</strong> Flag football sans contact, relais coordination, balle au prisonnier géante.</div>
                          <div>🎳 <strong>Après-midi (14h-17h) :</strong> Sortie Laser Game sécurisée + après-midi aquatique à la piscine de Cosne.</div>
                        </div>
                        <div className="text-[11px] text-[#6c7a77] pt-1 border-t border-[#006a62]/10">
                          Éducateur référent : <strong>Coach Kevin & Christian HAPPI</strong>
                        </div>
                      </div>

                      {/* Mathis Semaine 2 */}
                      <div className="p-4 rounded-2xl border border-[#e0e3e5] bg-white space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#6c7a77] uppercase tracking-wider">
                            Semaine 2 : 13 au 17 Juillet 2026
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#f2f4f6] text-[#3c4947]">
                            Confirmée
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#191c1e]">
                          Olympiades Nautiques & Initiation Roller
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#3c4947] pt-1">
                          <div>🛼 <strong>Matin :</strong> Parcours d'équilibre roller et jeux de précision au gymnase Cassin.</div>
                          <div>🏊 <strong>Après-midi :</strong> Olympiades aquatiques au Centre Nautique municipal.</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Léa Semaine 1 */
                    <div className="p-4 rounded-2xl border border-[#006a62]/20 bg-[#006a62]/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#006a62] uppercase tracking-wider">
                          Semaine 1 : 06 au 10 Juillet 2026
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-white text-[#006a62] border border-[#006a62]/20">
                          Confirmée
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#191c1e]">
                        Futsal Cup Aigles, Laser Game & Tir à l'arc
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#3c4947] pt-1">
                        <div>⚽ <strong>Matin (9h-12h) :</strong> Tournoi de futsal mixte avec arbitrage pédagogique fair-play.</div>
                        <div>🎯 <strong>Après-midi (14h-17h) :</strong> Tir à l'arc olympique (pelouse Giraux) et grand Laser Game.</div>
                      </div>
                      <div className="text-[11px] text-[#6c7a77] pt-1 border-t border-[#006a62]/10">
                        Éducateurs référents : <strong>Myriam (Brevet tir à l'arc) & Alexandre</strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trousseau & Consignes pour Demain (Interactive Checklist) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e0e3e5] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e0e3e5] pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#fe6a34] uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">backpack</span>
                <span>Trousseau & Préparation du Sac</span>
              </div>
              <h3 className="text-xl font-bold font-display text-[#191c1e] mt-1">
                La check-list pour la journée de demain
              </h3>
            </div>
            <span className="text-xs text-[#6c7a77]">
              Cochez les éléments avant le départ au gymnase
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                  item.checked
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-[#f7f9fb] border-[#e0e3e5] text-[#191c1e] hover:border-[#bbcac6]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => {}}
                  className="accent-emerald-600 rounded w-4 h-4"
                />
                <span className={`text-xs sm:text-sm font-medium ${item.checked ? 'line-through opacity-80' : ''}`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#f2f4f6] rounded-xl text-xs text-[#3c4947] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006a62]">info</span>
            <span>Rappel : Les goûters bio de 16h30 sont entièrement fournis par l'association. Les téléphones portables et bijoux de valeur restent sous la responsabilité des enfants.</span>
          </div>
        </div>

        {/* Medical & Justificatifs Section with Upload */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e0e3e5] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e0e3e5] pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006a62] uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">health_and_safety</span>
                <span>Pôle Santé & Règlementation</span>
              </div>
              <h3 className="text-xl font-bold font-display text-[#191c1e] mt-1">
                Justificatifs Médicaux & Autorisations Parentales
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="#download-cerfa"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Téléchargement simulé : Fiche Sanitaire de Liaison Cerfa 10008*02 (PDF).');
                }}
                className="px-3 py-2 bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#006a62] font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-sm">file_download</span>
                <span>Modèle Cerfa Vierge</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Upload Zone */}
            <div className="lg:col-span-5 border-2 border-dashed border-[#bbcac6] rounded-2xl p-6 text-center hover:border-[#006a62] transition-colors bg-[#f7f9fb] flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-white shadow-xs text-[#006a62] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">cloud_upload</span>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-[#191c1e]">Déposer un nouveau justificatif</div>
                <p className="text-[11px] text-[#6c7a77] mt-0.5">Certificat médical, ordonnance PAI, vaccin (PDF, JPG, PNG)</p>
              </div>

              <label className="cursor-pointer px-4 py-2 bg-[#006a62] text-white font-bold rounded-xl text-xs hover:bg-[#005049] transition-all">
                <span>Parcourir mes fichiers</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleSimulateFileUpload}
                />
              </label>
            </div>

            {/* List of active docs */}
            <div className="lg:col-span-7 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#6c7a77] mb-2">
                Documents Déposés au Dossier (3/3 Complets) :
              </div>
              {uploadedFiles.map((doc, idx) => (
                <div key={idx} className="p-3 bg-[#f7f9fb] rounded-xl border border-[#e0e3e5] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#006a62]">description</span>
                    <div>
                      <div className="font-semibold text-[#191c1e]">{doc.name}</div>
                      <div className="text-[10px] text-[#6c7a77]">Transmis le {doc.date}</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Private HD Photo Gallery */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e0e3e5] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e0e3e5] pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2ec4b6] uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">photo_camera</span>
                <span>Galerie Privée & Sécurisée</span>
              </div>
              <h3 className="text-xl font-bold font-display text-[#191c1e] mt-1">
                Les Souvenirs en Direct du Séjour (Été 2026)
              </h3>
              <p className="text-xs text-[#6c7a77]">Réservé aux parents inscrits • Photos téléchargeables en haute définition</p>
            </div>

            {/* Photo Filters */}
            <div className="flex flex-wrap gap-1 bg-[#f2f4f6] p-1 rounded-xl border border-[#e0e3e5] text-xs">
              {(['all', 'mathis', 'lea', 'piscine', 'laser', 'cameroun'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setPhotoFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                    photoFilter === cat
                      ? 'bg-white text-[#006a62] font-bold shadow-xs'
                      : 'text-[#3c4947] hover:text-[#191c1e]'
                  }`}
                >
                  {cat === 'all' ? 'Toutes (8)' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setViewingPhoto(photo)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-square bg-[#eceef0] border border-[#e0e3e5] shadow-xs"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
                  <span className="text-xs font-bold leading-tight">{photo.title}</span>
                  <div className="flex items-center justify-between text-[10px] text-white/80 mt-1">
                    <span>{photo.date}</span>
                    <span className="text-[#2ec4b6] font-semibold">{photo.childTagged}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Online Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#e0e3e5] animate-fadeIn space-y-6">
            <div className="flex items-start justify-between border-b border-[#e0e3e5] pb-4">
              <div>
                <span className="text-xs font-bold text-[#006a62] uppercase tracking-wider">Paiement Sécurisé SSL</span>
                <h3 className="text-xl font-bold font-display text-[#191c1e] mt-0.5">Règlement du Solde</h3>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f2f4f6] text-[#3c4947] flex items-center justify-center hover:bg-[#e6e8ea]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="p-4 bg-[#f7f9fb] rounded-2xl border border-[#e0e3e5] text-xs space-y-1">
              <div className="flex justify-between text-[#6c7a77]">
                <span>Dossier VSH-26-042 (Mathis & Léa) :</span>
                <span>220,00 €</span>
              </div>
              <div className="flex justify-between text-[#6c7a77]">
                <span>Déjà réglé par CB :</span>
                <span>- 140,00 €</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#006a62] pt-2 border-t border-[#e0e3e5]">
                <span>Montant à débiter :</span>
                <span>80,00 €</span>
              </div>
            </div>

            <form onSubmit={handleSimulatePayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#191c1e] mb-1">Titulaire de la carte</label>
                <input
                  type="text"
                  required
                  defaultValue="Sophie DUBOIS"
                  className="w-full px-3 py-2 rounded-xl border border-[#bbcac6] text-xs focus:outline-none focus:border-[#006a62]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#191c1e] mb-1">Numéro de carte bancaire</label>
                <input
                  type="text"
                  required
                  defaultValue="4970 •••• •••• 8291"
                  className="w-full px-3 py-2 rounded-xl border border-[#bbcac6] text-xs font-mono focus:outline-none focus:border-[#006a62]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#191c1e] mb-1">Date d'expiration</label>
                  <input
                    type="text"
                    required
                    defaultValue="08/28"
                    className="w-full px-3 py-2 rounded-xl border border-[#bbcac6] text-xs focus:outline-none focus:border-[#006a62]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#191c1e] mb-1">Cryptogramme CVC</label>
                  <input
                    type="text"
                    required
                    defaultValue="342"
                    className="w-full px-3 py-2 rounded-xl border border-[#bbcac6] text-xs focus:outline-none focus:border-[#006a62]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#006a62] hover:bg-[#005049] text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 mt-2"
              >
                <span className="material-symbols-outlined text-sm">lock</span>
                <span>Confirmer et régler 80,00 €</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Full Photo Modal */}
      {viewingPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-fadeIn">
            <div className="relative">
              <img
                src={viewingPhoto.imageUrl}
                alt={viewingPhoto.title}
                className="w-full max-h-[70vh] object-contain bg-black"
              />
              <button
                onClick={() => setViewingPhoto(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold font-display text-[#191c1e]">{viewingPhoto.title}</h4>
                <p className="text-xs text-[#6c7a77] mt-0.5">{viewingPhoto.date} • {viewingPhoto.childTagged}</p>
              </div>

              <button
                onClick={() => alert(`Téléchargement HD de « ${viewingPhoto.title} » lancé.`)}
                className="px-4 py-2 bg-[#006a62] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Télécharger en HD</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
