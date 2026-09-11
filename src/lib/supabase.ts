import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials safely across environments
const metaEnv = (import.meta as any).env || {};
const supabaseUrl = (metaEnv.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (metaEnv.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20 &&
    !supabaseUrl.includes('your-project')
  );
};

export const getSupabaseConfig = () => {
  return {
    url: supabaseUrl,
    isConfigured: isSupabaseConfigured(),
    projectRef: supabaseUrl ? supabaseUrl.replace('https://', '').split('.')[0] : null,
  };
};

// Safe lazy initialization of Supabase client to prevent app crash if credentials are not yet set
let clientInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!clientInstance) {
    try {
      clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (err) {
      console.warn('Erreur initialisation client Supabase:', err);
      return null;
    }
  }

  return clientInstance;
};

export const supabase = getSupabase();
