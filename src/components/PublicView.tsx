import React, { useState } from 'react';
import { ScreenType, WeekProgram, Activity } from '../types';
import { DIRECTOR_INFO, INITIAL_WEEKS, INITIAL_ACTIVITIES, CAMEROUN_PROJECT } from '../data/initialData';

interface PublicViewProps {
  onNavigate: (screen: ScreenType) => void;
  onNewRegistration?: (registrationData: any) => void;
}

export const PublicView: React.FC<PublicViewProps> = ({ onNavigate, onNewRegistration }) => {
  // Activity Filter State
  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const [selectedActivityModal, setSelectedActivityModal] = useState<Activity | null>(null);

  // Live Calculator State
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState<number>(9);
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>(['s1']);
  const [hasFratrie, setHasFratrie] = useState(false);
  const [hasGarderie, setHasGarderie] = useState(false);
  const [camerounDonation, setCamerounDonation] = useState<number>(5);
  const [camerounPairsToGive, setCamerounPairsToGive] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<'CB' | 'Chèque' | 'Chèques Vacances ANCV' | 'Aide CCAS'>('CB');

  // Confirmation Modal
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdRef, setCreatedRef] = useState('');

  // Cameroun Counter
  const [collectedShoesCount, setCollectedShoesCount] = useState<number>(CAMEROUN_PROJECT.collectedShoes);
  const [shoeDonationToast, setShoeDonationToast] = useState(false);

  // Price Calculation Math
  const getBaseWeekPrice = (count: number) => {
    switch (count) {
      case 0: return 0;
      case 1: return 90;
      case 2: return 160;
      case 3: return 230;
      case 4: return 300;
      case 5: return 360;
      default: return count * 80;
    }
  };

  const weekPrice = getBaseWeekPrice(selectedWeeks.length);
  const garderiePrice = hasGarderie ? selectedWeeks.length * 15 : 0;
  const subtotal = weekPrice + garderiePrice;
  const fratrieDiscount = hasFratrie ? Math.round(subtotal * 0.1) : 0;
  const grandTotal = Math.max(0, subtotal - fratrieDiscount + camerounDonation);

  const toggleWeek = (id: string) => {
    if (selectedWeeks.includes(id)) {
      if (selectedWeeks.length > 1) {
        setSelectedWeeks(selectedWeeks.filter(w => w !== id));
      }
    } else {
      setSelectedWeeks([...selectedWeeks, id]);
    }
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName || !childName || selectedWeeks.length === 0) {
      alert('Veuillez renseigner le nom du parent, de l\'enfant et au moins une semaine.');
      return;
    }

    const ref = `VSH-26-${Math.floor(100 + Math.random() * 900)}`;
    setCreatedRef(ref);

    if (onNewRegistration) {
      onNewRegistration({
        id: `REG-${Date.now()}`,
        reference: ref,
        parentName,
        parentEmail: parentEmail || 'contact.famille@email.fr',
        parentPhone: parentPhone || '06 00 00 00 00',
        childName,
        childAge,
        childGroup: childAge < 10 ? 'Écureuils (7-9 ans)' : (childAge < 14 ? 'Aigles (10-13 ans)' : 'Titans (14-16 ans)'),
        weeks: selectedWeeks,
        totalAmount: grandTotal,
        amountPaid: paymentMethod === 'CB' ? grandTotal : 0,
        paymentMethod,
        paymentStatus: paymentMethod === 'CB' ? 'paid' : 'pending',
        dossierStatus: 'complete',
        medicalDocSubmitted: false,
        insuranceSubmitted: true,
        camerounShoesDonated: camerounPairsToGive,
        dateCreated: 'Aujourd\'hui',
        notes: `Pré-inscription effectuée en ligne via le simulateur.`
      });
    }

    if (camerounPairsToGive > 0) {
      setCollectedShoesCount(prev => prev + camerounPairsToGive);
    }

    setIsSubmitted(true);
  };

  const filteredActivities = activeCategory === 'Tous'
    ? INITIAL_ACTIVITIES
    : INITIAL_ACTIVITIES.filter(a => a.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] pb-24">
      {/* Top Emergency / Info Bar */}
      <div className="bg-[#006a62] text-white text-xs sm:text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#2ec4b6] text-[#004c46]">
              ÉTÉ 2026
            </span>
            <span>Inscriptions ouvertes du 06 Juillet au 07 Août • Cosne-Cours-sur-Loire (58)</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a
              href={`tel:${DIRECTOR_INFO.phone.replace(/\s+/g, '')}`}
              className="hover:underline flex items-center gap-1 font-semibold text-white/95"
            >
              <span className="material-symbols-outlined text-sm">phone_in_talk</span>
              <span>{DIRECTOR_INFO.phone}</span>
            </a>
            <span className="text-white/40 hidden sm:inline">•</span>
            <span className="text-white/80 hidden sm:inline">Agrément Jeunesse & Sports n° {DIRECTOR_INFO.jeunesseSportsNum}</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#e0e3e5] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#006a62] to-[#2ec4b6] flex items-center justify-center text-white font-bold text-xl shadow-md">
              <span className="material-symbols-outlined text-2xl">sports_volleyball</span>
            </div>
            <div>
              <div className="font-extrabold text-lg sm:text-xl tracking-tight text-[#191c1e] font-display leading-tight flex items-center gap-2">
                <span>Vacances Sportives Happy</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#e6e8ea] text-[#3c4947]">
                  Cosne (58)
                </span>
              </div>
              <p className="text-xs text-[#3c4947] hidden sm:block">Séjours d'été sportifs, humains & solidaires • 7 à 16 ans</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#3c4947]">
            <a href="#activites" className="hover:text-[#006a62] transition-colors">Activités</a>
            <a href="#tarifs" className="hover:text-[#006a62] transition-colors">Tarifs & Aides</a>
            <a href="#cameroun" className="hover:text-[#006a62] transition-colors flex items-center gap-1">
              <span>Projet Cameroun</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#fe6a34]/15 text-[#ab3500] text-[10px] font-bold">
                {collectedShoesCount}/100
              </span>
            </a>
            <a href="#inscription" className="hover:text-[#006a62] transition-colors">Simulateur</a>
            <a href="#contact" className="hover:text-[#006a62] transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="header-nav-famille"
              onClick={() => onNavigate('famille')}
              className="px-3 py-2 text-xs sm:text-sm font-medium text-[#006a62] bg-[#2ec4b6]/15 hover:bg-[#2ec4b6]/25 rounded-lg transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">family_restroom</span>
              <span className="hidden sm:inline">Espace</span> Famille
            </button>

            <button
              id="header-nav-admin"
              onClick={() => onNavigate('admin')}
              className="px-3 py-2 text-xs sm:text-sm font-medium text-[#ab3500] bg-[#fe6a34]/10 hover:bg-[#fe6a34]/20 rounded-lg transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">lock</span>
              <span className="hidden sm:inline">Espace</span> Admin
            </button>

            <a
              href="#inscription"
              className="px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-[#006a62] hover:bg-[#005049] rounded-lg shadow-sm transition-all flex items-center gap-1"
            >
              <span>Inscrire</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f2f4f6] to-[#f7f9fb] pt-10 pb-16 border-b border-[#e0e3e5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#bbcac6] text-xs font-semibold text-[#006a62] shadow-xs">
                <span className="material-symbols-outlined text-sm text-[#fe6a34]">local_fire_department</span>
                <span>Du 06 Juillet au 07 Août 2026 à Cosne-Cours-sur-Loire</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-[#191c1e] leading-[1.1]">
                L'été où vos enfants grandissent par le <span className="text-[#006a62]">sport</span>, le <span className="text-[#fe6a34]">respect</span> & la <span className="text-[#2ec4b6]">solidarité</span>.
              </h1>

              <p className="text-base sm:text-lg text-[#3c4947] leading-relaxed max-w-2xl font-normal">
                Flag football, futsal, piscine, laser game, tir à l'arc, bowling et olympiades en bord de Loire. Encadrement bienveillant par des éducateurs diplômés d'État dirigés par <strong>Christian HAPPI</strong>.
              </p>

              {/* Badges and Guarantees */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-white rounded-xl border border-[#e0e3e5] flex items-center gap-2.5 shadow-xs">
                  <span className="material-symbols-outlined text-[#006a62] text-2xl">verified_user</span>
                  <div>
                    <div className="text-xs font-bold text-[#191c1e]">Agréé Jeunesse & Sports</div>
                    <div className="text-[11px] text-[#3c4947]">N° 058ORG0219</div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#e0e3e5] flex items-center gap-2.5 shadow-xs">
                  <span className="material-symbols-outlined text-[#fe6a34] text-2xl">payments</span>
                  <div>
                    <div className="text-xs font-bold text-[#191c1e]">Aides CCAS & ANCV</div>
                    <div className="text-[11px] text-[#3c4947]">Chèques vacances pris</div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#e0e3e5] flex items-center gap-2.5 shadow-xs col-span-2 sm:col-span-1">
                  <span className="material-symbols-outlined text-[#2ec4b6] text-2xl">volunteer_activism</span>
                  <div>
                    <div className="text-xs font-bold text-[#191c1e]">Projet Cameroun</div>
                    <div className="text-[11px] text-[#3c4947]">Collecte de baskets</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <a
                  href="#inscription"
                  className="px-6 py-3.5 bg-[#006a62] hover:bg-[#005049] text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-sm sm:text-base"
                >
                  <span className="material-symbols-outlined">edit_calendar</span>
                  <span>Calculer le tarif & Inscrire</span>
                </a>

                <a
                  href={`https://wa.me/33630473041?text=Bonjour%20Christian,%20je%20souhaite%20des%20renseignements%20sur%20les%20stages%20d'été%20Vacances%20Sportives%20Happy`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2 text-sm"
                >
                  <span className="material-symbols-outlined text-lg">chat</span>
                  <span>WhatsApp Directeur</span>
                </a>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80"
                  alt="Enfants souriants au stage de sport"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fe6a34] text-white text-xs font-bold w-fit mb-2">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span>Places restantes limitées</span>
                  </div>
                  <h3 className="text-xl font-bold font-display">Semaines 1 à 5 : Remplissage à 80%</h3>
                  <p className="text-xs text-white/90 mt-1">
                    Gymnase Cassin, Stade Raphaël Giraux et Centre Nautique de Cosne.
                  </p>
                  <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#2ec4b6]">check_circle</span>
                      Goûters bio & sorties inclus
                    </span>
                    <span className="font-bold text-[#70f8e8]">Dès 80€ / semaine</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Partners Banner */}
      <section className="py-6 bg-white border-b border-[#e0e3e5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-[#6c7a77] uppercase tracking-wider mb-4">
            Avec le soutien officiel et en partenariat avec les institutions de Cosne-Cours-sur-Loire
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 opacity-80">
            <div className="flex items-center gap-2 text-[#3c4947] font-bold text-sm">
              <span className="material-symbols-outlined text-xl text-[#006a62]">account_balance</span>
              <span>Ville de Cosne-Cours-sur-Loire</span>
            </div>
            <div className="flex items-center gap-2 text-[#3c4947] font-bold text-sm">
              <span className="material-symbols-outlined text-xl text-[#006a62]">sports</span>
              <span>Service des Sports & Gymnase Cassin</span>
            </div>
            <div className="flex items-center gap-2 text-[#3c4947] font-bold text-sm">
              <span className="material-symbols-outlined text-xl text-[#006a62]">family_restroom</span>
              <span>CCAS & Aides Familiales</span>
            </div>
            <div className="flex items-center gap-2 text-[#3c4947] font-bold text-sm">
              <span className="material-symbols-outlined text-xl text-[#006a62]">card_membership</span>
              <span>ANCV Chèques-Vacances</span>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Grid */}
      <section id="activites" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#006a62] uppercase tracking-wider px-3 py-1 rounded-full bg-[#2ec4b6]/15">
            Programme Pluridisciplinaire 7-16 ans
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#191c1e] mt-3">
            9 Activités Sportives & Plein Air à Découvrir
          </h2>
          <p className="text-sm sm:text-base text-[#3c4947] mt-2">
            Chaque jour alterne grands jeux collectifs, précision, fraîcheur aquatique et cohésion d'équipe.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {['Tous', 'Collectif', 'Précision', 'Aquatique', 'Plein Air'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-[#006a62] text-white shadow-xs'
                    : 'bg-white text-[#3c4947] hover:bg-[#e6e8ea] border border-[#e0e3e5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#e0e3e5] shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={act.imageUrl}
                  alt={act.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-[#006a62] flex items-center gap-1 shadow-xs">
                  <span className="material-symbols-outlined text-sm">{act.iconName}</span>
                  <span>{act.category}</span>
                </div>
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-semibold text-white">
                  {act.ageRange}
                </div>
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-[#ab3500]">
                  {act.intensity}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-lg font-bold font-display text-[#191c1e]">{act.title}</h3>
                  <p className="text-xs text-[#3c4947] mt-1.5 line-clamp-2 leading-relaxed">
                    {act.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#f2f4f6] flex items-center justify-between text-xs text-[#6c7a77]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-[#006a62]">person</span>
                    <span>{act.coach}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-[#fe6a34]">pin_drop</span>
                    <span>{act.location}</span>
                  </span>
                </div>

                <button
                  onClick={() => setSelectedActivityModal(act)}
                  className="w-full py-2 bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#006a62] font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">info</span>
                  <span>Détails & Équipement fourni</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cameroon Solidarity Section */}
      <section id="cameroun" className="py-16 bg-gradient-to-br from-[#fe6a34]/10 via-white to-[#2ec4b6]/10 border-y border-[#e0e3e5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#fe6a34]/30 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fe6a34]/15 text-[#ab3500] text-xs font-bold">
                  <span className="material-symbols-outlined text-sm">volunteer_activism</span>
                  <span>Action Solidaire & Humaine Internationale</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-[#191c1e]">
                  {CAMEROUN_PROJECT.title}
                </h2>

                <p className="text-sm sm:text-base text-[#3c4947] leading-relaxed">
                  {CAMEROUN_PROJECT.description}
                </p>

                {/* Counter and Progress Bar */}
                <div className="bg-[#f7f9fb] p-5 rounded-2xl border border-[#e0e3e5] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#006a62] font-display">
                        {collectedShoesCount}
                      </span>
                      <span className="text-sm text-[#3c4947] font-semibold"> / {CAMEROUN_PROJECT.targetShoes} paires collectées</span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#006a62] text-white">
                      {Math.round((collectedShoesCount / CAMEROUN_PROJECT.targetShoes) * 100)}% de l'objectif
                    </span>
                  </div>

                  <div className="w-full bg-[#e0e3e5] h-3.5 rounded-full overflow-hidden p-0.5">
                    <div
                      className="bg-gradient-to-r from-[#2ec4b6] to-[#006a62] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (collectedShoesCount / CAMEROUN_PROJECT.targetShoes) * 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs text-[#6c7a77] pt-1">
                    <span>📦 Départ prévu en container : <strong>{CAMEROUN_PROJECT.departureDate}</strong></span>
                    <span>📍 Dépôt : <strong>Gymnase Cassin (Cosne)</strong></span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => {
                      setCollectedShoesCount(prev => prev + 1);
                      setShoeDonationToast(true);
                      setTimeout(() => setShoeDonationToast(false), 3500);
                    }}
                    className="px-5 py-2.5 bg-[#fe6a34] hover:bg-[#ab3500] text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">add_circle</span>
                    <span>J'apporte 1 paire de baskets au gymnase (+1)</span>
                  </button>

                  <a
                    href="#inscription"
                    className="px-4 py-2.5 bg-white hover:bg-[#f2f4f6] text-[#006a62] border border-[#006a62] font-semibold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-1"
                  >
                    <span>Ajouter un don lors de l'inscription</span>
                  </a>
                </div>

                {shoeDonationToast && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-medium rounded-xl animate-fadeIn flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600">volunteer_activism</span>
                    <span>Merci pour votre générosité ! Le compteur a été mis à jour (+1 paire enregistrée pour le Cameroun).</span>
                  </div>
                )}
              </div>

              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80"
                    alt="Baskets collectées pour le Cameroun"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                    <p className="text-xs font-medium text-white/90">
                      « Donner une seconde vie sportive à nos chaussures pour faire courir la jeunesse de Yaoundé & Bafoussam. »
                    </p>
                    <p className="text-[11px] font-bold text-[#70f8e8] mt-1">
                      — Christian HAPPI, Directeur
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Transparency Section */}
      <section id="tarifs" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#006a62] uppercase tracking-wider px-3 py-1 rounded-full bg-[#2ec4b6]/15">
            Tarifs Accessibles & Transparents
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#191c1e] mt-3">
            Des Vacances Sportives pour Toutes les Familles
          </h2>
          <p className="text-sm sm:text-base text-[#3c4947] mt-2">
            Tarifs dégressifs par semaine, réduction fratrie de -10% et prise en charge intégrale possible via les aides CCAS de Cosne et CAF.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 Semaine */}
          <div className="bg-white rounded-2xl p-6 border border-[#e0e3e5] shadow-xs flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-[#f2f4f6] text-[#3c4947]">
                DÉCOUVERTE
              </span>
              <h3 className="text-xl font-bold font-display text-[#191c1e] mt-2">1 Semaine Complète</h3>
              <div className="my-4">
                <span className="text-4xl font-extrabold text-[#006a62] font-display">90 €</span>
                <span className="text-xs text-[#6c7a77]"> / enfant (5 jours)</span>
              </div>
              <ul className="space-y-2 text-xs text-[#3c4947]">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a62] text-sm">check_circle</span>
                  <span>Du lundi au vendredi de 9h à 17h</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a62] text-sm">check_circle</span>
                  <span>Toutes les activités & matériel fournis</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a62] text-sm">check_circle</span>
                  <span>Goûter bio de l'après-midi inclus</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a62] text-sm">check_circle</span>
                  <span>Assurance responsabilité civile incluse</span>
                </li>
              </ul>
            </div>
            <a
              href="#inscription"
              className="mt-6 w-full py-2.5 text-center font-bold text-xs bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#006a62] rounded-xl transition-all"
            >
              Sélectionner 1 Semaine
            </a>
          </div>

          {/* Card 2 Semaines - Populaires */}
          <div className="bg-white rounded-2xl p-6 border-2 border-[#006a62] shadow-md flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#006a62] text-white px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide shadow-xs">
              Formule la plus demandée
            </div>
            <div>
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-[#2ec4b6]/20 text-[#004c46]">
                IMMERSION
              </span>
              <h3 className="text-xl font-bold font-display text-[#191c1e] mt-2">2 Semaines (au choix)</h3>
              <div className="my-4">
                <span className="text-4xl font-extrabold text-[#006a62] font-display">160 €</span>
                <span className="text-xs text-[#6c7a77]"> soit 80 € / semaine</span>
              </div>
              <ul className="space-y-2 text-xs text-[#3c4947]">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a62] text-sm">check_circle</span>
                  <span>Économisez 20 € par rapport au tarif 1 sem.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a62] text-sm">check_circle</span>
                  <span>2 sorties spéciales incluses (Laser & Nautique)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a62] text-sm">check_circle</span>
                  <span>Possibilité de régler en 2x ou Chèques ANCV</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a62] text-sm">check_circle</span>
                  <span>T-shirt officiel Happy offert</span>
                </li>
              </ul>
            </div>
            <a
              href="#inscription"
              className="mt-6 w-full py-2.5 text-center font-bold text-xs bg-[#006a62] hover:bg-[#005049] text-white rounded-xl shadow-xs transition-all"
            >
              Sélectionner 2 Semaines
            </a>
          </div>

          {/* Card 3+ Semaines */}
          <div className="bg-white rounded-2xl p-6 border border-[#e0e3e5] shadow-xs flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-[#fe6a34]/15 text-[#ab3500]">
                GRAND ÉTÉ
              </span>
              <h3 className="text-xl font-bold font-display text-[#191c1e] mt-2">3 Semaines ou Tout l'Été</h3>
              <div className="my-4">
                <span className="text-4xl font-extrabold text-[#006a62] font-display">230 €</span>
                <span className="text-xs text-[#6c7a77]"> pour 3 sem. (76€/sem.)</span>
              </div>
              <ul className="space-y-2 text-xs text-[#3c4947]">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a62] text-sm">check_circle</span>
                  <span>Tarif maximum dégressif</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a62] text-sm">check_circle</span>
                  <span>Remboursement garanti si certificat médical</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a62] text-sm">check_circle</span>
                  <span>Garderie matin/soir à tarif préférentiel</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a62] text-sm">check_circle</span>
                  <span>Réduction fratrie -10% cumulable</span>
                </li>
              </ul>
            </div>
            <a
              href="#inscription"
              className="mt-6 w-full py-2.5 text-center font-bold text-xs bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#006a62] rounded-xl transition-all"
            >
              Sélectionner 3+ Semaines
            </a>
          </div>
        </div>

        {/* Aide Box */}
        <div className="bg-[#f2f4f6] rounded-2xl p-4 sm:p-6 border border-[#bbcac6] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#006a62] text-3xl">help</span>
            <div className="text-xs sm:text-sm">
              <span className="font-bold text-[#191c1e]">Besoin d'un dossier CCAS ou CAF ?</span>
              <p className="text-[#3c4947]">Nous fournissons les attestations de présence et les devis pour prise en charge directe par votre assistante sociale.</p>
            </div>
          </div>
          <a
            href={`tel:${DIRECTOR_INFO.phone.replace(/\s+/g, '')}`}
            className="whitespace-nowrap px-4 py-2 bg-white text-[#006a62] border border-[#006a62] font-semibold rounded-lg text-xs hover:bg-[#e6e8ea] transition-all"
          >
            Contacter Christian HAPPI
          </a>
        </div>
      </section>

      {/* Interactive Booking Simulator & Registration Form */}
      <section id="inscription" className="py-16 bg-[#eceef0] border-y border-[#e0e3e5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#e0e3e5]">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-bold text-[#006a62] uppercase tracking-wider px-3 py-1 rounded-full bg-[#2ec4b6]/20">
                Formulaire Officiel 2026
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#191c1e] mt-2">
                Simulateur & Pré-Inscription en Ligne
              </h2>
              <p className="text-xs sm:text-sm text-[#3c4947] mt-1">
                Calculez le montant exact en temps réel et validez la place de votre enfant.
              </p>
            </div>

            <form onSubmit={handleSubmitRegistration} className="space-y-8">
              {/* Parent Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#006a62] flex items-center gap-2 pb-2 border-b border-[#f2f4f6]">
                  <span className="material-symbols-outlined text-base">person</span>
                  <span>1. Coordonnées du Responsable Légal</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#191c1e] mb-1">Nom & Prénom du Parent *</label>
                    <input
                      type="text"
                      required
                      placeholder="ex : Sophie Dubois"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#bbcac6] focus:outline-none focus:border-[#006a62] focus:ring-1 focus:ring-[#006a62]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#191c1e] mb-1">Email pour confirmation *</label>
                    <input
                      type="email"
                      required
                      placeholder="ex : famille.dubois@gmail.com"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#bbcac6] focus:outline-none focus:border-[#006a62] focus:ring-1 focus:ring-[#006a62]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#191c1e] mb-1">Téléphone d'urgence *</label>
                    <input
                      type="tel"
                      required
                      placeholder="ex : 06 12 34 56 78"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#bbcac6] focus:outline-none focus:border-[#006a62] focus:ring-1 focus:ring-[#006a62]"
                    />
                  </div>
                </div>
              </div>

              {/* Child Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#006a62] flex items-center gap-2 pb-2 border-b border-[#f2f4f6]">
                  <span className="material-symbols-outlined text-base">child_care</span>
                  <span>2. Enfant à Inscrire</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-8">
                    <label className="block text-xs font-semibold text-[#191c1e] mb-1">Prénom & Nom de l'enfant *</label>
                    <input
                      type="text"
                      required
                      placeholder="ex : Mathis Dubois"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#bbcac6] focus:outline-none focus:border-[#006a62] focus:ring-1 focus:ring-[#006a62]"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold text-[#191c1e] mb-1">Âge de l'enfant (7 à 16 ans) : {childAge} ans</label>
                    <input
                      type="range"
                      min={7}
                      max={16}
                      value={childAge}
                      onChange={(e) => setChildAge(parseInt(e.target.value))}
                      className="w-full accent-[#006a62]"
                    />
                    <div className="text-[11px] text-[#006a62] font-semibold mt-1">
                      Groupe attribué : {childAge < 10 ? 'Écureuils (7-9 ans)' : (childAge < 14 ? 'Aigles (10-13 ans)' : 'Titans (14-16 ans)')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Weeks Selection */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#006a62] flex items-center justify-between pb-2 border-b border-[#f2f4f6]">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">calendar_month</span>
                    <span>3. Sélection des Semaines Souhaitées</span>
                  </span>
                  <span className="text-xs font-normal text-[#3c4947]">
                    {selectedWeeks.length} semaine{selectedWeeks.length > 1 ? 's' : ''} cochée{selectedWeeks.length > 1 ? 's' : ''}
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {INITIAL_WEEKS.map((w) => {
                    const isChecked = selectedWeeks.includes(w.id);
                    return (
                      <div
                        key={w.id}
                        onClick={() => toggleWeek(w.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                          isChecked
                            ? 'bg-[#006a62]/10 border-[#006a62] shadow-xs'
                            : 'bg-white border-[#e0e3e5] hover:border-[#bbcac6]'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="accent-[#006a62] rounded"
                            />
                            <span className="text-xs sm:text-sm font-bold text-[#191c1e]">{w.label}</span>
                          </div>
                          <p className="text-xs text-[#3c4947] pl-5">{w.highlight}</p>
                          <div className="text-[11px] text-[#6c7a77] pl-5">
                            Places restantes : <strong>{w.placesTotal - w.placesBooked}</strong> / {w.placesTotal}
                          </div>
                        </div>

                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-white text-[#006a62] border border-[#e0e3e5]">
                          {w.dates}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Options & Discounts */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#006a62] flex items-center gap-2 pb-2 border-b border-[#f2f4f6]">
                  <span className="material-symbols-outlined text-base">tune</span>
                  <span>4. Options & Solidarité Cameroun</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Fratrie */}
                  <label className="p-3.5 bg-[#f7f9fb] rounded-xl border border-[#e0e3e5] flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasFratrie}
                      onChange={(e) => setHasFratrie(e.target.checked)}
                      className="mt-0.5 accent-[#006a62]"
                    />
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#191c1e]">Réduction Fratrie (-10%)</div>
                      <p className="text-[11px] text-[#3c4947]">Applicable si vous inscrivez au moins 2 enfants de la même famille.</p>
                    </div>
                  </label>

                  {/* Garderie */}
                  <label className="p-3.5 bg-[#f7f9fb] rounded-xl border border-[#e0e3e5] flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasGarderie}
                      onChange={(e) => setHasGarderie(e.target.checked)}
                      className="mt-0.5 accent-[#006a62]"
                    />
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#191c1e]">Garderie Horaires Élargis (+15€ / sem)</div>
                      <p className="text-[11px] text-[#3c4947]">Accueil dès 8h00 le matin et départ jusqu'à 18h00 le soir au gymnase.</p>
                    </div>
                  </label>

                  {/* Cameroun Donation */}
                  <div className="p-3.5 bg-[#fe6a34]/10 rounded-xl border border-[#fe6a34]/30 sm:col-span-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#fe6a34]">volunteer_activism</span>
                        <span className="text-xs sm:text-sm font-bold text-[#191c1e]">Soutien au Projet Solidaire Cameroun</span>
                      </div>
                      <span className="text-xs text-[#ab3500] font-bold">Expédition de chaussures de sport</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[#3c4947] mb-1 font-medium">Don financier pour les frais d'envoi maritime :</label>
                        <select
                          value={camerounDonation}
                          onChange={(e) => setCamerounDonation(parseInt(e.target.value))}
                          className="w-full p-2 bg-white rounded-lg border border-[#bbcac6]"
                        >
                          <option value={0}>Pas de don financier</option>
                          <option value={5}>+ 5 € (Aide fret colis)</option>
                          <option value={10}>+ 10 € (Équipement complet d'un jeune)</option>
                          <option value={20}>+ 20 € (Parrain solidaire)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#3c4947] mb-1 font-medium">Nombre de paires de baskets que j'apporterai au gymnase :</label>
                        <select
                          value={camerounPairsToGive}
                          onChange={(e) => setCamerounPairsToGive(parseInt(e.target.value))}
                          className="w-full p-2 bg-white rounded-lg border border-[#bbcac6]"
                        >
                          <option value={0}>0 paire</option>
                          <option value={1}>1 paire de baskets de sport propres</option>
                          <option value={2}>2 paires de baskets</option>
                          <option value={3}>3 paires ou plus</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method & Total Recap */}
              <div className="p-5 bg-[#f7f9fb] rounded-2xl border border-[#006a62]/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6c7a77]">Mode de règlement envisagé</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(['CB', 'Chèque', 'Chèques Vacances ANCV', 'Aide CCAS'] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            paymentMethod === method
                              ? 'bg-[#006a62] text-white shadow-xs'
                              : 'bg-white text-[#3c4947] border border-[#bbcac6] hover:bg-[#e6e8ea]'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary math */}
                  <div className="text-right sm:border-l sm:border-[#e0e3e5] sm:pl-6">
                    <div className="text-xs text-[#6c7a77]">
                      {selectedWeeks.length} semaine(s) : {weekPrice} €
                      {hasGarderie && ` + garderie (${garderiePrice} €)`}
                      {hasFratrie && ` - fratrie (-${fratrieDiscount} €)`}
                      {camerounDonation > 0 && ` + don (${camerounDonation} €)`}
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#006a62] font-display mt-1">
                      Total : {grandTotal} €
                    </div>
                    <div className="text-[11px] text-[#3c4947]">
                      {paymentMethod === 'CB' ? 'Règlement en ligne ou en plusieurs fois possible' : 'Règlement différé le 1er jour'}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#e0e3e5] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-[#6c7a77]">
                    <span className="material-symbols-outlined text-sm text-[#006a62]">lock</span>
                    <span>Formulaire chiffré et conforme à la réglementation jeunesse & sports</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#006a62] hover:bg-[#005049] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">how_to_reg</span>
                    <span>Valider ma pré-inscription ({grandTotal} €)</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Volunteer and Sponsor Section */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e0e3e5] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#2ec4b6]/20 text-[#006a62] flex items-center justify-center">
              <span className="material-symbols-outlined">handshake</span>
            </div>
            <h3 className="text-xl font-bold font-display text-[#191c1e]">Devenir Bénévole ou Animateur BAFA</h3>
            <p className="text-xs sm:text-sm text-[#3c4947] leading-relaxed">
              Vous avez plus de 18 ans, le BAFA ou le sens de l'animation sportive ? Rejoignez l'équipe de Christian HAPPI pour encadrer nos activités et faire vivre une aventure inoubliable aux jeunes de Cosne.
            </p>
            <a
              href={`mailto:${DIRECTOR_INFO.email}?subject=Candidature%20Animation%20Happy%202026`}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#006a62] hover:underline pt-2"
            >
              <span>Envoyer votre candidature (CV + motivation)</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e0e3e5] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#fe6a34]/20 text-[#ab3500] flex items-center justify-center">
              <span className="material-symbols-outlined">store</span>
            </div>
            <h3 className="text-xl font-bold font-display text-[#191c1e]">Entreprises & Commerçants Cosnois</h3>
            <p className="text-xs sm:text-sm text-[#3c4947] leading-relaxed">
              Devenez mécène de notre association Loi 1901. Vos dons financiers ou matériels bénéficient d'une réduction d'impôt de 66% (Cerfa fiscal) et financent l'envoi du container solidaire pour le Cameroun.
            </p>
            <a
              href={`tel:${DIRECTOR_INFO.phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#ab3500] hover:underline pt-2"
            >
              <span>Échanger avec le Directeur du séjour</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        </div>
      </section>

      {/* Direct Contact Footer */}
      <footer id="contact" className="bg-[#191c1e] text-white pt-12 pb-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-[#2ec4b6] flex items-center justify-center text-[#004c46] font-bold">
                  <span className="material-symbols-outlined text-lg">sports_volleyball</span>
                </div>
                <span className="font-bold text-lg font-display">Vacances Sportives Happy</span>
              </div>
              <p className="text-xs text-white/70 max-w-sm leading-relaxed">
                Association déclarée Loi 1901 • SIRET : {DIRECTOR_INFO.siret} • Agréée Jeunesse et Sports n° {DIRECTOR_INFO.jeunesseSportsNum}. Organisation des séjours sportifs et solidaires de Cosne-Cours-sur-Loire.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('famille')}
                  className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium"
                >
                  Accès Espace Famille
                </button>
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-xs px-3 py-1.5 rounded-lg bg-[#fe6a34]/30 hover:bg-[#fe6a34]/40 text-[#ffb59d] font-medium"
                >
                  Accès Espace Direction
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs text-white/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2ec4b6]">Direction & Accueil</h4>
              <p><strong>Directeur :</strong> {DIRECTOR_INFO.name}</p>
              <p><strong>Téléphone :</strong> {DIRECTOR_INFO.phone}</p>
              <p><strong>Email :</strong> {DIRECTOR_INFO.email}</p>
              <p><strong>Lieu d'accueil :</strong> Gymnase René Cassin, 58200 Cosne</p>
            </div>

            <div className="space-y-2 text-xs text-white/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2ec4b6]">Horaires des Stages</h4>
              <p>Accueil matinal : dès 8h00 (option garderie)</p>
              <p>Début des activités : 9h00 précises</p>
              <p>Fin de journée : 17h00 (ou 18h00 garderie)</p>
              <p>Permanence samedi matin au gymnase</p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/50">
            <span>© 2026 Vacances Sportives Happy. Tous droits réservés.</span>
            <span>Cosne-Cours-sur-Loire (Nièvre - Bourgogne-Franche-Comté)</span>
          </div>
        </div>
      </footer>

      {/* Activity Details Modal */}
      {selectedActivityModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-fadeIn">
            <div className="relative h-48">
              <img
                src={selectedActivityModal.imageUrl}
                alt={selectedActivityModal.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedActivityModal(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/95 text-[#006a62] font-bold text-xs">
                {selectedActivityModal.category} • {selectedActivityModal.ageRange}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold font-display text-[#191c1e]">{selectedActivityModal.title}</h3>
                <p className="text-xs text-[#3c4947] mt-2 leading-relaxed">{selectedActivityModal.description}</p>
              </div>

              <div className="space-y-2 text-xs bg-[#f7f9fb] p-3 rounded-xl border border-[#e0e3e5]">
                <div className="flex items-center justify-between">
                  <span className="text-[#6c7a77]">Encadrant référent :</span>
                  <span className="font-bold text-[#191c1e]">{selectedActivityModal.coach}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6c7a77]">Lieu :</span>
                  <span className="font-bold text-[#191c1e]">{selectedActivityModal.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6c7a77]">Matériel fourni :</span>
                  <span className="font-bold text-emerald-700">100% fourni par l'association</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedActivityModal(null)}
                className="w-full py-2.5 bg-[#006a62] text-white font-bold text-xs rounded-xl"
              >
                Fermer la fiche
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pre-registration Confirmation Modal */}
      {isSubmitted && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-200 animate-fadeIn text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>

            <h3 className="text-2xl font-bold font-display text-[#191c1e]">
              Pré-Inscription Enregistrée !
            </h3>

            <p className="text-xs sm:text-sm text-[#3c4947]">
              Félicitations <strong>{parentName}</strong>, la pré-inscription de <strong>{childName}</strong> a bien été transmise à Christian HAPPI.
            </p>

            <div className="p-3 bg-[#f7f9fb] rounded-xl border border-[#e0e3e5] text-xs space-y-1">
              <div className="text-[#6c7a77]">Référence du dossier :</div>
              <div className="text-lg font-mono font-bold text-[#006a62]">{createdRef}</div>
              <div className="text-[11px] text-[#3c4947]">Montant total : <strong>{grandTotal} €</strong> ({paymentMethod})</div>
            </div>

            <p className="text-xs text-[#6c7a77]">
              Un email de confirmation a été simulé. Vous pouvez dès à présent consulter votre dossier dans l'<strong>Espace Famille</strong> ou vérifier la vue direction dans l'<strong>Espace Admin</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  onNavigate('famille');
                }}
                className="flex-1 py-2.5 bg-[#2ec4b6] hover:bg-[#006a62] text-[#004c46] hover:text-white font-bold rounded-xl text-xs transition-all"
              >
                Ouvrir l'Espace Famille
              </button>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  onNavigate('admin');
                }}
                className="flex-1 py-2.5 bg-[#ab3500] hover:bg-[#832600] text-white font-bold rounded-xl text-xs transition-all"
              >
                Voir dans l'Espace Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
