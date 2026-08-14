-- ====================================================================
-- PLACEMENT PULSE - SUPABASE DATABASE SCHEMA MIGRATION SCRIPT
-- Copy and paste this script into your Supabase Dashboard -> SQL Editor
-- ====================================================================

-- 1. Create Companies Table
CREATE TABLE IF NOT EXISTS public.companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  priority_category TEXT NOT NULL DEFAULT 'Top Priority',
  status TEXT NOT NULL DEFAULT 'Uncontacted',
  is_done BOOLEAN NOT NULL DEFAULT FALSE,
  ctc_package TEXT,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create HR Contacts Table (Multiple HRs per Company)
CREATE TABLE IF NOT EXISTS public.hr_contacts (
  id TEXT PRIMARY KEY,
  company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  designation TEXT,
  email TEXT,
  phone TEXT,
  linkedin TEXT,
  status TEXT NOT NULL DEFAULT 'Not Contacted',
  notes TEXT,
  last_contacted_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Reminders Table
CREATE TABLE IF NOT EXISTS public.reminders (
  id TEXT PRIMARY KEY,
  company_id TEXT REFERENCES public.companies(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  hr_id TEXT,
  hr_name TEXT,
  title TEXT NOT NULL,
  due_date_time TIMESTAMPTZ NOT NULL,
  notes TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  priority TEXT NOT NULL DEFAULT 'High',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS) & Allow Full Public Access for Team Collaboration
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public full access to companies" ON public.companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access to hr_contacts" ON public.hr_contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access to reminders" ON public.reminders FOR ALL USING (true) WITH CHECK (true);

-- 5. Enable Realtime Publications for Live Instant Sync Across Connected Devices
ALTER PUBLICATION supabase_realtime ADD TABLE public.companies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.hr_contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reminders;
