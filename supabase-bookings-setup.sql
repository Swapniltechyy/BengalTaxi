-- ==========================================================
-- Bengal Taxi: Bookings Table Setup for Supabase
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/kivlvfzhzmbiastygxea/sql/new
-- ==========================================================

-- 1. Create the bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    from_location TEXT NOT NULL,
    to_location TEXT NOT NULL,
    pickup_date TEXT,
    pickup_time TEXT,
    pax TEXT,
    vehicle TEXT,
    details TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Add columns if table already existed without them
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='bookings' AND column_name='email') THEN
        ALTER TABLE public.bookings ADD COLUMN email TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='bookings' AND column_name='vehicle') THEN
        ALTER TABLE public.bookings ADD COLUMN vehicle TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='bookings' AND column_name='pickup_time') THEN
        ALTER TABLE public.bookings ADD COLUMN pickup_time TEXT;
    END IF;
END $$;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies to prevent conflicts on re-run
DROP POLICY IF EXISTS "Allow public insert to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public delete bookings" ON public.bookings;

-- 5. RLS Policies
CREATE POLICY "Allow public insert to bookings"
ON public.bookings FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "Allow public view bookings"
ON public.bookings FOR SELECT TO public
USING (true);

CREATE POLICY "Allow public update bookings"
ON public.bookings FOR UPDATE TO public
USING (true);

CREATE POLICY "Allow public delete bookings"
ON public.bookings FOR DELETE TO public
USING (true);

-- 6. Index for fast descending sort by created_at
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);

-- 7. Index on status for admin dashboard filtering
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
