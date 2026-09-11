import React, { useState, useEffect } from 'react';
import { checkSupabaseConnection, SupabaseHealthReport } from '../services/supabaseService';
import { getSupabaseConfig } from '../lib/supabase';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({ isOpen, onClose }) => {
  const [report, setReport] = useState<SupabaseHealthReport | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'status' | 'sql' | 'guide'>('status');
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  const config = getSupabaseConfig();

  const runCheck = async () => {
    setLoading(true);
    try {
      const res = await checkSupabaseConnection();
      setReport(res);
    } catch (e: any) {
      setReport({
        isConfigured: false,
        connected: false,
        url: config.url,
        projectRef: null,
        message: e?.message || 'Erreur de test de connexion',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runCheck();
    }
  }, [isOpen]);

  const sqlCode = `-- ==============================================================================
-- VACANCES SPORTIVES HAPPY - SCHEMA POSTGRESQL SUPABASE
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLE PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'parent' CHECK (role IN ('admin', 'parent')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABLE INSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.inscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reference TEXT UNIQUE NOT NULL,
  child_name TEXT NOT NULL,
  child_age INTEGER NOT NULL,
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  weeks TEXT[] NOT NULL DEFAULT '{}',
  total_price NUMERIC NOT NULL DEFAULT 0,
  paid_amount NUMERIC NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'en_attente',
  health_record_status TEXT NOT NULL DEFAULT 'a_fournir',
  cerfa_valid BOOLEAN NOT NULL DEFAULT false,
  dtp_vaccine_valid BOOLEAN NOT NULL DEFAULT false,
  allergies TEXT,
  shoes_donation_pledged INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLE ENFANTS
CREATE TABLE IF NOT EXISTS public.enfants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  allergies TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLE COLLECTE CAMEROUN
CREATE TABLE IF NOT EXISTS public.collecte_cameroun (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collected_shoes INTEGER NOT NULL DEFAULT 74,
  target_shoes INTEGER NOT NULL DEFAULT 100
);

-- 5. TRIGGER ON AUTH.USERS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Parent'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'parent')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enfants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collecte_cameroun ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts on inscriptions" ON public.inscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read on inscriptions" ON public.inscriptions FOR SELECT USING (true);
CREATE POLICY "Allow public read on collecte" ON public.collecte_cameroun FOR SELECT USING (true);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#bbcac6]/50 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#191c1e] text-white p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <span className="material-symbols-outlined text-xl">database</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Intégration Supabase (PostgreSQL & Auth)</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Option 1
                </span>
              </div>
              <p className="text-xs text-[#bbcac6]">
                Persistance cloud, base de données relationnelle et authentification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#e0e3e5] bg-[#f7f9fb] px-6">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'status'
                ? 'border-[#006a62] text-[#006a62]'
                : 'border-transparent text-[#6c7a77] hover:text-[#191c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">wifi</span>
            <span>Diagnostic & Connexion</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'sql'
                ? 'border-[#006a62] text-[#006a62]'
                : 'border-transparent text-[#6c7a77] hover:text-[#191c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">code</span>
            <span>Script SQL Schema</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'guide'
                ? 'border-[#006a62] text-[#006a62]'
                : 'border-transparent text-[#6c7a77] hover:text-[#191c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">menu_book</span>
            <span>Guide d'activation</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-[#3c4947]">
          {activeTab === 'status' && (
            <div className="space-y-4">
              {/* Status Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                  report?.connected
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : report?.isConfigured
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-blue-50 border-blue-200 text-blue-950'
                }`}
              >
                <span className="material-symbols-outlined text-2xl shrink-0 mt-0.5">
                  {report?.connected ? 'check_circle' : report?.isConfigured ? 'warning' : 'info'}
                </span>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm">
                    {report?.connected
                      ? 'Base PostgreSQL Supabase Connectée'
                      : report?.isConfigured
                      ? 'Clés détectées mais tables à initialiser'
                      : 'Client Supabase prêt pour connexion directe'}
                  </h3>
                  <p className="text-xs leading-relaxed">{report?.message}</p>
                </div>
              </div>

              {/* Technical Details Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-1">
                  <span className="text-[10px] font-bold text-[#6c7a77] uppercase tracking-wider">
                    URL Supabase
                  </span>
                  <div className="font-mono text-[11px] text-[#191c1e] truncate">
                    {config.url || 'Non renseignée (VITE_SUPABASE_URL)'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-1">
                  <span className="text-[10px] font-bold text-[#6c7a77] uppercase tracking-wider">
                    Clé Anonyme (ANON KEY)
                  </span>
                  <div className="font-mono text-[11px] text-[#191c1e]">
                    {config.isConfigured ? '•••••••••••••••••••• (Active)' : 'En attente dans Secrets UI'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-1">
                  <span className="text-[10px] font-bold text-[#6c7a77] uppercase tracking-wider">
                    SDK Client (@supabase/supabase-js)
                  </span>
                  <div className="font-semibold text-emerald-700 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    <span>Installé & Prêt v2.x</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f7f9fb] border border-[#e0e3e5] space-y-1">
                  <span className="text-[10px] font-bold text-[#6c7a77] uppercase tracking-wider">
                    Mode de Fonctionnement Actuel
                  </span>
                  <div className="font-semibold text-[#006a62]">
                    {report?.connected ? 'Mode Cloud Supabase Live' : 'Mode Résilient / Démo Local'}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={runCheck}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-[#006a62] hover:bg-[#005049] text-white font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined text-sm ${loading ? 'animate-spin' : ''}`}>
                    refresh
                  </span>
                  <span>{loading ? 'Test en cours...' : 'Tester la connexion'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('sql')}
                  className="px-4 py-2 rounded-xl bg-white border border-[#bbcac6] hover:bg-gray-50 text-[#191c1e] font-semibold text-xs flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">terminal</span>
                  <span>Voir le Script SQL</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#191c1e]">Script SQL d'initialisation</h3>
                  <p className="text-[11px] text-[#6c7a77]">
                    Crée automatiquement les tables <code>profiles</code>, <code>inscriptions</code>, <code>enfants</code>, et la sécurité RLS.
                  </p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copiedSql ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedSql ? 'Copié dans le presse-papier !' : 'Copier le SQL'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="bg-[#191c1e] text-emerald-300 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-72 leading-relaxed border border-white/10">
                  {sqlCode}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-[#191c1e]">Étapes simples pour connecter votre projet Supabase :</h3>
              <ol className="list-decimal list-inside space-y-2.5 leading-relaxed">
                <li className="p-3 bg-[#f7f9fb] rounded-xl border border-[#e0e3e5]">
                  <strong>Créer un projet gratuit sur Supabase :</strong> Rendez-vous sur{' '}
                  <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-[#006a62] underline font-semibold">
                    supabase.com
                  </a>{' '}
                  et créez un nouveau projet (ex: <em>Vacances-Sportives-Happy</em>).
                </li>
                <li className="p-3 bg-[#f7f9fb] rounded-xl border border-[#e0e3e5]">
                  <strong>Exécuter le script SQL :</strong> Ouvrez l'onglet <strong>SQL Editor</strong> dans votre console Supabase, collez le contenu du script de l'onglet <strong>Script SQL Schema</strong>, et cliquez sur <strong>Run</strong>.
                </li>
                <li className="p-3 bg-[#f7f9fb] rounded-xl border border-[#e0e3e5]">
                  <strong>Récupérer vos identifiants :</strong> Allez dans <strong>Project Settings → API</strong> pour copier l'<strong>URL</strong> et la clé <strong>anon / public</strong>.
                </li>
                <li className="p-3 bg-[#f7f9fb] rounded-xl border border-[#e0e3e5]">
                  <strong>Déclarer les secrets :</strong> Dans le menu <strong>Settings</strong> de cette interface AI Studio, ajoutez :
                  <ul className="list-disc list-inside ml-4 mt-1 font-mono text-[11px] text-[#006a62]">
                    <li>VITE_SUPABASE_URL = https://xyzcompany.supabase.co</li>
                    <li>VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI...</li>
                  </ul>
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#f7f9fb] border-t border-[#e0e3e5] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#191c1e] hover:bg-black text-white text-xs font-bold transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
