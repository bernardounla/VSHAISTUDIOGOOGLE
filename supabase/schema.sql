-- ==============================================================================
-- VACANCES SPORTIVES HAPPY - SCHEMA POSTGRESQL SUPABASE
-- Gymnase René Cassin & Stades Municipaux de Cosne-Cours-sur-Loire
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE PROFILES (Utilisateurs : Parents & Direction Admin)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'parent' CHECK (role IN ('admin', 'parent')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLE ENFANTS
CREATE TABLE IF NOT EXISTS public.enfants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_date DATE,
  age INTEGER NOT NULL,
  category TEXT, -- 'Mini-Champions (7-9 ans)', 'Espoirs (10-12 ans)', 'Élite & Cadets (13-17 ans)'
  allergies TEXT,
  emergency_contact TEXT,
  doctor_name TEXT,
  doctor_phone TEXT,
  swimming_certificate BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLE INSCRIPTIONS (Dossiers de séjours Été 2026)
CREATE TABLE IF NOT EXISTS public.inscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reference TEXT UNIQUE NOT NULL, -- Ex: VSH-2026-089
  child_name TEXT NOT NULL,
  child_age INTEGER NOT NULL,
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  weeks TEXT[] NOT NULL DEFAULT '{}',
  total_price NUMERIC NOT NULL DEFAULT 0,
  paid_amount NUMERIC NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'en_attente' CHECK (payment_status IN ('paye', 'acompte', 'en_attente')),
  health_record_status TEXT NOT NULL DEFAULT 'a_fournir' CHECK (health_record_status IN ('complet', 'incomplet', 'a_fournir')),
  cerfa_valid BOOLEAN NOT NULL DEFAULT false,
  dtp_vaccine_valid BOOLEAN NOT NULL DEFAULT false,
  allergies TEXT,
  dietary_notes TEXT,
  shoes_donation_pledged INTEGER DEFAULT 0,
  notes_admin TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLE COLLECTE SOLIDAIRE CAMEROUN (Chaussures de foot & basket)
CREATE TABLE IF NOT EXISTS public.collecte_cameroun (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collected_shoes INTEGER NOT NULL DEFAULT 74,
  target_shoes INTEGER NOT NULL DEFAULT 100,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. AUTOMATIC TRIGGER: Profile creation on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Parent'),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'parent')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    role = COALESCE(EXCLUDED.role, profiles.role);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enfants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collecte_cameroun ENABLE ROW LEVEL SECURITY;

-- Helper function: Is current user an admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles read" ON public.profiles;
CREATE POLICY "Public profiles read" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- Inscriptions Policies
DROP POLICY IF EXISTS "Admins can do everything on inscriptions" ON public.inscriptions;
CREATE POLICY "Admins can do everything on inscriptions" ON public.inscriptions
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Parents can view their own inscriptions" ON public.inscriptions;
CREATE POLICY "Parents can view their own inscriptions" ON public.inscriptions
  FOR SELECT USING (
    auth.uid() = user_id OR
    parent_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Anyone can insert an inscription" ON public.inscriptions;
CREATE POLICY "Anyone can insert an inscription" ON public.inscriptions
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Parents can update their own inscription" ON public.inscriptions;
CREATE POLICY "Parents can update their own inscription" ON public.inscriptions
  FOR UPDATE USING (
    auth.uid() = user_id OR
    parent_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
  );

-- Enfants Policies
DROP POLICY IF EXISTS "Admins manage all enfants" ON public.enfants;
CREATE POLICY "Admins manage all enfants" ON public.enfants
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Parents manage their enfants" ON public.enfants;
CREATE POLICY "Parents manage their enfants" ON public.enfants
  FOR ALL USING (parent_id = auth.uid());

-- Collecte Cameroun Policies (Public Read, Admin Write)
DROP POLICY IF EXISTS "Anyone can view shoes count" ON public.collecte_cameroun;
CREATE POLICY "Anyone can view shoes count" ON public.collecte_cameroun
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update shoes count" ON public.collecte_cameroun;
CREATE POLICY "Admins can update shoes count" ON public.collecte_cameroun
  FOR ALL USING (public.is_admin());

-- 8. INITIAL SEED DATA
INSERT INTO public.collecte_cameroun (collected_shoes, target_shoes)
VALUES (74, 100)
ON CONFLICT DO NOTHING;

INSERT INTO public.inscriptions (
  reference, child_name, child_age, parent_name, parent_email, parent_phone,
  weeks, total_price, paid_amount, payment_status, health_record_status,
  cerfa_valid, dtp_vaccine_valid, allergies, shoes_donation_pledged
)
VALUES
  ('VSH-2026-001', 'Lucas Martin', 11, 'Sophie Martin', 'sophie.martin@email.fr', '06 12 34 56 78', ARRAY['S1 (6-10 juil)', 'S2 (13-17 juil)'], 370, 370, 'paye', 'complet', true, true, 'Aucune allergie connue', 1),
  ('VSH-2026-002', 'Emma Leroy', 9, 'Thomas Leroy', 'thomas.leroy@email.fr', '06 98 76 54 32', ARRAY['S1 (6-10 juil)'], 190, 100, 'acompte', 'incomplet', true, false, 'Arachides (Pai PAI établi)', 0),
  ('VSH-2026-003', 'Yanis Benali', 14, 'Fatima Benali', 'fatima.benali@email.fr', '07 45 12 89 00', ARRAY['S3 (20-24 juil)', 'S4 (27-31 juil)'], 370, 0, 'en_attente', 'a_fournir', false, false, 'Intolérance lactose', 2),
  ('VSH-2026-004', 'Léa Dubois', 8, 'Marc Dubois', 'marc.dubois@email.fr', '06 33 22 11 00', ARRAY['S2 (13-17 juil)'], 190, 190, 'paye', 'complet', true, true, 'Aucune', 1),
  ('VSH-2026-005', 'Matteo Rossi', 12, 'Giulia Rossi', 'giulia.rossi@email.it', '+39 347 891 2345', ARRAY['S1 (6-10 juil)', 'S3 (20-24 juil)'], 370, 370, 'paye', 'incomplet', false, true, 'Graminées / Pollen', 1)
ON CONFLICT (reference) DO NOTHING;
