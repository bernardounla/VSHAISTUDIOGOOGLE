import { Activity, WeekProgram, Registration, Child, GalleryPhoto } from '../types';

export const DIRECTOR_INFO = {
  name: 'Christian HAPPI',
  title: 'Directeur & Fondateur Diplômé d\'État (BEES / BPJEPS)',
  phone: '06 30 47 30 41',
  email: 'contact@vacances-sportives-happy.fr',
  address: 'Gymnase René Cassin & Complexe Sportif, 58200 Cosne-Cours-sur-Loire',
  association: 'Association Vacances Sportives Happy (Loi 1901)',
  siret: '849 201 942 00018',
  jeunesseSportsNum: '058ORG0219'
};

export const INITIAL_WEEKS: WeekProgram[] = [
  {
    id: 's1',
    label: 'Semaine 1 : 06 au 10 Juillet 2026',
    dates: '06/07 - 10/07',
    placesTotal: 30,
    placesBooked: 27,
    highlight: 'Grand Tournoi Multi-Sports & Sortie Laser Game',
    status: 'few_left'
  },
  {
    id: 's2',
    label: 'Semaine 2 : 13 au 17 Juillet 2026',
    dates: '13/07 - 17/07',
    placesTotal: 30,
    placesBooked: 29,
    highlight: 'Stage Flag Football & Olympiades Nautiques',
    status: 'few_left'
  },
  {
    id: 's3',
    label: 'Semaine 3 : 20 au 24 Juillet 2026',
    dates: '20/07 - 24/07',
    placesTotal: 30,
    placesBooked: 22,
    highlight: 'Raid Aventure Loire & Bowling Cosnois',
    status: 'open'
  },
  {
    id: 's4',
    label: 'Semaine 4 : 27 au 31 Juillet 2026',
    dates: '27/07 - 31/07',
    placesTotal: 30,
    placesBooked: 24,
    highlight: 'Initiation Kin-Ball & Bivouac des Champions',
    status: 'open'
  },
  {
    id: 's5',
    label: 'Semaine 5 : 03 au 07 Août 2026',
    dates: '03/08 - 07/08',
    placesTotal: 20,
    placesBooked: 10,
    highlight: 'Grande Kermesse Solidaire & Match de Gala',
    status: 'open'
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'flag-football',
    title: 'Flag Football Américain',
    category: 'Collectif',
    ageRange: '7 - 16 ans',
    coach: 'Coach Kevin & Christian',
    description: 'Découverte sans contact violent : agilité, passes tactiques, sprints et esprit d\'équipe avec ceintures à flags scratch.',
    location: 'Stade Raphaël Giraux',
    iconName: 'sports_football',
    imageUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=800&q=80',
    intensity: 'Dynamique'
  },
  {
    id: 'futsal-foot',
    title: 'Futsal & Football Cup',
    category: 'Collectif',
    ageRange: '7 - 16 ans',
    coach: 'Christian HAPPI',
    description: 'Ateliers techniques, gestes réflexes, mini-championnat fair-play et apprentissage du respect de l\'arbitrage.',
    location: 'Gymnase René Cassin',
    iconName: 'sports_soccer',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    intensity: 'Dynamique'
  },
  {
    id: 'piscine-aquatique',
    title: 'Piscine & Jeux Aquatiques',
    category: 'Aquatique',
    ageRange: '7 - 16 ans (selon niveau)',
    coach: 'MNS Ville de Cosne & Animateurs',
    description: 'Baignade surveillée, parcours ludiques, relais aquatiques et perfectionnement flottabilité dans le bassin extérieur.',
    location: 'Centre Aquatique Cosnois',
    iconName: 'pool',
    imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80',
    intensity: 'Moyen'
  },
  {
    id: 'laser-game',
    title: 'Laser Game Tactique',
    category: 'Précision',
    ageRange: '8 - 16 ans',
    coach: 'Équipe Happy',
    description: 'Stratégie de groupe en arène sécurisée, coordination, communication silencieuse et dépassement de soi.',
    location: 'Salle Polyvalente Aménagée',
    iconName: 'target',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    intensity: 'Moyen'
  },
  {
    id: 'bowling',
    title: 'Bowling Cosnois',
    category: 'Précision',
    ageRange: '7 - 16 ans',
    coach: 'Coach Myriam',
    description: 'Techniques de lancer, calcul des points, convivialité inter-tranches d\'âge et maîtrise des émotions.',
    location: 'Bowling de Cosne',
    iconName: 'sports_volleyball',
    imageUrl: 'https://images.unsplash.com/photo-1538592116847-115384969fec?auto=format&fit=crop&w=800&q=80',
    intensity: 'Doux'
  },
  {
    id: 'roller-skate',
    title: 'Roller & Glisse Urbaine',
    category: 'Plein Air',
    ageRange: '7 - 14 ans',
    coach: 'Coach Alexandre',
    description: 'Équilibre, freinage d\'urgence, slalom chronométré et parcours d\'obstacles avec casques et protections intégrales fournies.',
    location: 'Plateau Extérieur Cassin',
    iconName: 'skateboarding',
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
    intensity: 'Dynamique'
  },
  {
    id: 'kin-ball',
    title: 'Kin-Ball Omnikin',
    category: 'Collectif',
    ageRange: '7 - 16 ans',
    coach: 'Christian HAPPI',
    description: 'Le sport coopératif mondial par excellence avec balle géante de 1m22 : aucune exclusion, 3 équipes simultanées.',
    location: 'Gymnase René Cassin',
    iconName: 'sports',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    intensity: 'Dynamique'
  },
  {
    id: 'tir-arc',
    title: 'Tir à l\'Arc & Flèche Ventouse',
    category: 'Précision',
    ageRange: '8 - 16 ans',
    coach: 'Coach Myriam (Brevet Fédéral)',
    description: 'Respiration, concentration absolue, posture olympique et challenges cibles à différentes distances.',
    location: 'Stade Raphaël Giraux (Pelouse)',
    iconName: 'adjust',
    imageUrl: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=800&q=80',
    intensity: 'Doux'
  },
  {
    id: 'olympiades-loire',
    title: 'Raid Nature en Bords de Loire',
    category: 'Plein Air',
    ageRange: 'Tous âges',
    coach: 'Toute l\'équipe pédagogique',
    description: 'Course d\'orientation par énigmes, sensibilisation à la faune fluviale protégée, relais et goûter zéro déchet.',
    location: 'Île de Cosne & Berge de Loire',
    iconName: 'forest',
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
    intensity: 'Moyen'
  }
];

export const DUBOIS_FAMILY_CHILDREN: Child[] = [
  {
    id: 'c-mathis',
    firstName: 'Mathis',
    lastName: 'DUBOIS',
    birthDate: '14/05/2018',
    age: 8,
    group: 'Écureuils (7 - 9 ans)',
    allergies: 'Aucune allergie connue (Régime standard)',
    swimmingCertificate: true,
    medicalSheetStatus: 'valid',
    weeks: ['s1', 's2'],
    photoUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'c-lea',
    firstName: 'Léa',
    lastName: 'DUBOIS',
    birthDate: '22/09/2014',
    age: 12,
    group: 'Aigles (10 - 13 ans)',
    allergies: 'Légère intolérance au lactose (gourde perso)',
    swimmingCertificate: true,
    medicalSheetStatus: 'valid',
    weeks: ['s1'],
    photoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80'
  }
];

export const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: 'REG-2026-001',
    reference: 'VSH-26-042',
    parentName: 'Sophie & Marc DUBOIS',
    parentEmail: 'famille.dubois@gmail.com',
    parentPhone: '06 12 34 56 78',
    childName: 'Mathis & Léa DUBOIS',
    childAge: 8,
    childGroup: 'Écureuils & Aigles',
    weeks: ['s1', 's2'],
    totalAmount: 220,
    amountPaid: 140,
    paymentMethod: 'CB',
    paymentStatus: 'partial',
    dossierStatus: 'complete',
    medicalDocSubmitted: true,
    insuranceSubmitted: true,
    camerounShoesDonated: 2,
    dateCreated: '14/05/2026',
    notes: 'Acompte versé par CB. Solde de 80€ prévu par chèque le 1er jour.'
  },
  {
    id: 'REG-2026-002',
    reference: 'VSH-26-043',
    parentName: 'Nadia BENALI',
    parentEmail: 'nadia.benali58@orange.fr',
    parentPhone: '06 77 88 99 00',
    childName: 'Ilyes BENALI',
    childAge: 10,
    childGroup: 'Aigles (10-13 ans)',
    weeks: ['s2', 's3'],
    totalAmount: 160,
    amountPaid: 160,
    paymentMethod: 'Chèques Vacances ANCV',
    paymentStatus: 'paid',
    dossierStatus: 'complete',
    medicalDocSubmitted: true,
    insuranceSubmitted: true,
    camerounShoesDonated: 1,
    dateCreated: '18/05/2026',
    notes: 'Dossier 100% complet avec attestation nautique 25m.'
  },
  {
    id: 'REG-2026-003',
    reference: 'VSH-26-044',
    parentName: 'Thomas MOREAU',
    parentEmail: 't.moreau@nevers-bat.fr',
    parentPhone: '06 44 22 11 33',
    childName: 'Clément MOREAU',
    childAge: 7,
    childGroup: 'Écureuils (7-9 ans)',
    weeks: ['s1'],
    totalAmount: 90,
    amountPaid: 0,
    paymentMethod: 'Chèque',
    paymentStatus: 'pending',
    dossierStatus: 'incomplete',
    medicalDocSubmitted: false,
    insuranceSubmitted: true,
    camerounShoesDonated: 0,
    dateCreated: '22/05/2026',
    notes: 'Manque la fiche sanitaire signée avec le carnet de vaccination.'
  },
  {
    id: 'REG-2026-004',
    reference: 'VSH-26-045',
    parentName: 'Fatoumata DIALLO',
    parentEmail: 'f.diallo@laposte.net',
    parentPhone: '07 55 66 77 88',
    childName: 'Aminata DIALLO',
    childAge: 14,
    childGroup: 'Titans (14-16 ans)',
    weeks: ['s3', 's4'],
    totalAmount: 160,
    amountPaid: 160,
    paymentMethod: 'Aide CCAS',
    paymentStatus: 'paid',
    dossierStatus: 'complete',
    medicalDocSubmitted: true,
    insuranceSubmitted: true,
    camerounShoesDonated: 3,
    dateCreated: '25/05/2026',
    notes: 'Prise en charge validée par le CCAS de Cosne.'
  },
  {
    id: 'REG-2026-005',
    reference: 'VSH-26-046',
    parentName: 'Julien & Émilie LEROY',
    parentEmail: 'leroy.famille@sfr.fr',
    parentPhone: '06 99 11 22 44',
    childName: 'Hugo LEROY',
    childAge: 11,
    childGroup: 'Aigles (10-13 ans)',
    weeks: ['s1', 's2', 's3'],
    totalAmount: 230,
    amountPaid: 230,
    paymentMethod: 'CB',
    paymentStatus: 'paid',
    dossierStatus: 'review',
    medicalDocSubmitted: true,
    insuranceSubmitted: false,
    camerounShoesDonated: 1,
    dateCreated: '29/05/2026',
    notes: 'Attestation assurance scolaire à renouveler.'
  }
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'p1',
    title: 'Entraînement Flag Football sur pelouse',
    category: 'mathis',
    date: '10 Juillet 2026',
    imageUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=800&q=80',
    childTagged: 'Mathis (8 ans)'
  },
  {
    id: 'p2',
    title: 'Tournoi de Futsal au gymnase Cassin',
    category: 'lea',
    date: '08 Juillet 2026',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    childTagged: 'Léa (12 ans)'
  },
  {
    id: 'p3',
    title: 'Après-midi grand plongeon à la piscine',
    category: 'piscine',
    date: '09 Juillet 2026',
    imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80',
    childTagged: 'Mathis & Léa'
  },
  {
    id: 'p4',
    title: 'Partie endiablée au Laser Game',
    category: 'laser',
    date: '07 Juillet 2026',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    childTagged: 'Groupe Aigles'
  },
  {
    id: 'p5',
    title: 'Tir à l\'arc : dans le mille !',
    category: 'lea',
    date: '10 Juillet 2026',
    imageUrl: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=800&q=80',
    childTagged: 'Léa (12 ans)'
  },
  {
    id: 'p6',
    title: 'Collecte Cameroun : tri des baskets solidaires',
    category: 'cameroun',
    date: '11 Juillet 2026',
    imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80',
    childTagged: 'Action Solidaire'
  },
  {
    id: 'p7',
    title: 'Session glisse roller & parcours slalom',
    category: 'mathis',
    date: '06 Juillet 2026',
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
    childTagged: 'Mathis (8 ans)'
  },
  {
    id: 'p8',
    title: 'Goûter frais & fruits de saison en bord de Loire',
    category: 'all',
    date: '08 Juillet 2026',
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
    childTagged: 'Tous les groupes'
  }
];

export const CAMEROUN_PROJECT = {
  title: 'Solidarité Internationale : Des Baskets pour le Cameroun',
  subheading: 'Opération humanitaire portée par Christian HAPPI et les jeunes de Cosne',
  collectedShoes: 74,
  targetShoes: 100,
  weightTotalKg: 58,
  destination: 'Écoles et clubs d\'athlétisme de Yaoundé & Bafoussam (Cameroun)',
  departureDate: 'Novembre 2026',
  dropOffPoint: 'Gymnase René Cassin, 58200 Cosne-Cours-sur-Loire',
  description: 'Chaque paire de baskets de sport propre et encore utilisable donnée par nos familles cosnoises est étiquetée, nettoyée avec les enfants et expédiée gratuitement pour équiper des jeunes passionnés de sport en Afrique.'
};
