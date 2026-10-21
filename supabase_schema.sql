-- JobAllies Production Database Schema

-- 1. Users / Contractors Table
CREATE TABLE IF NOT EXISTS public.contractors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  trade TEXT,
  location TEXT,
  radius_miles INTEGER DEFAULT 25,
  phone TEXT,
  license_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Trusted Crew Table (Distinct per Contractor)
CREATE TABLE IF NOT EXISTS public.trusted_crew (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contractor_email TEXT NOT NULL,
  ally_name TEXT NOT NULL,
  ally_trade TEXT NOT NULL,
  ally_phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT,
  trade TEXT,
  town TEXT,
  budget TEXT,
  scope TEXT,
  client_name TEXT,
  client_contact TEXT,
  status TEXT DEFAULT 'New',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_crew ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
