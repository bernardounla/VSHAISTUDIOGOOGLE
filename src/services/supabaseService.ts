import { getSupabase, isSupabaseConfigured, getSupabaseConfig } from '../lib/supabase';
import { Registration, UserSession, UserRole } from '../types';
import { INITIAL_REGISTRATIONS } from '../data/initialData';

export interface SupabaseHealthReport {
  isConfigured: boolean;
  connected: boolean;
  url: string;
  projectRef: string | null;
  message: string;
  error?: string;
  tablesCount?: {
    inscriptions: number;
    profiles: number;
  };
}

export const checkSupabaseConnection = async (): Promise<SupabaseHealthReport> => {
  const config = getSupabaseConfig();
  if (!config.isConfigured) {
    return {
      isConfigured: false,
      connected: false,
      url: config.url || 'Non configurée (VITE_SUPABASE_URL)',
      projectRef: null,
      message: 'Supabase n\'est pas encore lié. Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans vos variables d\'environnement pour activer la synchronisation cloud directe.',
    };
  }

  const client = getSupabase();
  if (!client) {
    return {
      isConfigured: false,
      connected: false,
      url: config.url,
      projectRef: config.projectRef,
      message: 'Impossible d\'initialiser le client Supabase.',
    };
  }

  try {
    // Ping the inscriptions table
    const { count, error } = await client
      .from('inscriptions')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return {
        isConfigured: true,
        connected: false,
        url: config.url,
        projectRef: config.projectRef,
        message: `Erreur d'accès à Supabase : ${error.message}. Assurez-vous d'avoir exécuté le script SQL fourni (/supabase/schema.sql) dans votre dashboard Supabase.`,
        error: error.message,
      };
    }

    return {
      isConfigured: true,
      connected: true,
      url: config.url,
      projectRef: config.projectRef,
      message: 'Connexion PostgreSQL Supabase active et fonctionnelle !',
      tablesCount: {
        inscriptions: count ?? 0,
        profiles: 0,
      },
    };
  } catch (err: any) {
    return {
      isConfigured: true,
      connected: false,
      url: config.url,
      projectRef: config.projectRef,
      message: `Erreur réseau Supabase : ${err?.message || 'Inconnue'}`,
      error: err?.message,
    };
  }
};

/**
 * Supabase Auth: Sign In
 */
export const supabaseSignIn = async (
  email: string,
  password?: string
): Promise<{ success: boolean; session?: UserSession; error?: string }> => {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase n\'est pas encore configuré. Renseignez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.',
    };
  }

  const client = getSupabase();
  if (!client) {
    return { success: false, error: 'Client Supabase introuvable' };
  }

  try {
    // If password provided, standard sign in
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password: password || 'HappySummer2026!',
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Utilisateur introuvable' };
    }

    // Retrieve profile to determine role
    const { data: profile } = await client
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const role: UserRole = profile?.role === 'admin' ? 'admin' : 'parent';

    const session: UserSession = {
      id: data.user.id,
      email: data.user.email || email,
      name: profile?.full_name || data.user.user_metadata?.full_name || 'Utilisateur',
      role,
      registrationRef: profile?.registration_ref || undefined,
    };

    return { success: true, session };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur d\'authentification' };
  }
};

/**
 * Supabase Auth: Sign Up
 */
export const supabaseSignUp = async (
  email: string,
  password: string,
  fullName: string,
  role: UserRole = 'parent'
): Promise<{ success: boolean; session?: UserSession; error?: string }> => {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase n\'est pas encore configuré. Renseignez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.',
    };
  }

  const client = getSupabase();
  if (!client) {
    return { success: false, error: 'Client Supabase non initialisé' };
  }

  try {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      const session: UserSession = {
        id: data.user.id,
        email: data.user.email || email,
        name: fullName,
        role,
      };
      return { success: true, session };
    }

    return { success: false, error: 'Aucun utilisateur retourné par Supabase' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur lors de la création du compte' };
  }
};

/**
 * Supabase Auth: Sign Out
 */
export const supabaseSignOut = async (): Promise<void> => {
  const client = getSupabase();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (e) {
      console.warn('Erreur déconnexion Supabase:', e);
    }
  }
};

/**
 * Inscriptions Data Layer
 */
export const fetchRegistrationsFromSupabase = async (): Promise<Registration[]> => {
  if (!isSupabaseConfigured()) {
    return INITIAL_REGISTRATIONS;
  }

  const client = getSupabase();
  if (!client) return INITIAL_REGISTRATIONS;

  try {
    const { data, error } = await client
      .from('inscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn('Supabase inscriptions non trouvées ou vides, utilisation des données locales:', error?.message);
      return INITIAL_REGISTRATIONS;
    }

    return data.map((item: any): Registration => ({
      id: item.id || item.reference,
      reference: item.reference,
      parentName: item.parent_name || 'Parent',
      parentEmail: item.parent_email || '',
      parentPhone: item.parent_phone || '',
      childName: item.child_name || 'Enfant',
      childAge: Number(item.child_age) || 9,
      childGroup: item.child_group || (Number(item.child_age) >= 10 ? 'Aigles (10-13 ans)' : 'Écureuils (7-9 ans)'),
      weeks: Array.isArray(item.weeks) ? item.weeks : ['s1'],
      totalAmount: Number(item.total_amount ?? item.total_price ?? 0),
      amountPaid: Number(item.amount_paid ?? item.paid_amount ?? 0),
      paymentMethod: item.payment_method || 'CB',
      paymentStatus: (item.payment_status as any) || 'pending',
      dossierStatus: (item.dossier_status as any) || (item.cerfa_valid ? 'complete' : 'incomplete'),
      medicalDocSubmitted: Boolean(item.medical_doc_submitted ?? item.cerfa_valid),
      insuranceSubmitted: Boolean(item.insurance_submitted ?? true),
      camerounShoesDonated: Number(item.cameroun_shoes_donated ?? item.shoes_donation_pledged ?? 0),
      dateCreated: item.date_created || (item.created_at ? new Date(item.created_at).toLocaleDateString('fr-FR') : '01/06/2026'),
      notes: item.notes || item.notes_admin || undefined,
    }));
  } catch (err) {
    console.error('Erreur lecture inscriptions Supabase:', err);
    return INITIAL_REGISTRATIONS;
  }
};

export const saveRegistrationToSupabase = async (
  reg: Registration
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured()) {
    // Handled in local state
    return { success: true };
  }

  const client = getSupabase();
  if (!client) return { success: false, error: 'Client non initialisé' };

  try {
    const { error } = await client.from('inscriptions').upsert({
      reference: reg.reference,
      child_name: reg.childName,
      child_age: reg.childAge,
      parent_name: reg.parentName,
      parent_email: reg.parentEmail,
      parent_phone: reg.parentPhone,
      weeks: reg.weeks,
      total_price: reg.totalAmount,
      paid_amount: reg.amountPaid,
      payment_status: reg.paymentStatus,
      health_record_status: reg.dossierStatus === 'complete' ? 'complet' : 'incomplet',
      cerfa_valid: reg.medicalDocSubmitted,
      dtp_vaccine_valid: reg.medicalDocSubmitted,
      shoes_donation_pledged: reg.camerounShoesDonated || 0,
      notes_admin: reg.notes || '',
    });

    if (error) {
      console.warn('Avertissement sauvegarde Supabase:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
};
