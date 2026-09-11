export type ScreenType = 'site' | 'admin' | 'famille';

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  age: number;
  group: string; // e.g. "Écureuils (7-9 ans)" or "Aigles (10-13 ans)"
  allergies: string;
  swimmingCertificate: boolean;
  medicalSheetStatus: 'valid' | 'missing' | 'review';
  weeks: string[];
  photoUrl: string;
}

export interface Registration {
  id: string;
  reference: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childName: string;
  childAge: number;
  childGroup: string;
  weeks: string[];
  totalAmount: number;
  amountPaid: number;
  paymentMethod: 'CB' | 'Chèque' | 'Chèques Vacances ANCV' | 'Espèces' | 'Aide CCAS';
  paymentStatus: 'paid' | 'partial' | 'pending';
  dossierStatus: 'complete' | 'incomplete' | 'review';
  medicalDocSubmitted: boolean;
  insuranceSubmitted: boolean;
  camerounShoesDonated: number;
  dateCreated: string;
  notes?: string;
}

export interface Activity {
  id: string;
  title: string;
  category: 'Collectif' | 'Précision' | 'Aquatique' | 'Plein Air' | 'Découverte';
  ageRange: string;
  coach: string;
  description: string;
  location: string;
  iconName: string;
  imageUrl: string;
  intensity: 'Doux' | 'Moyen' | 'Dynamique';
}

export interface WeekProgram {
  id: string;
  label: string;
  dates: string;
  placesTotal: number;
  placesBooked: number;
  highlight: string;
  status: 'open' | 'few_left' | 'full';
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'all' | 'mathis' | 'lea' | 'piscine' | 'laser' | 'cameroun';
  date: string;
  imageUrl: string;
  childTagged?: string;
}

export interface VolunteerApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  bafaStatus: 'Titulaire' | 'Stagiaire' | 'Non titulaire' | 'BPJEPS';
  availableWeeks: string[];
  motivation: string;
  date: string;
}
