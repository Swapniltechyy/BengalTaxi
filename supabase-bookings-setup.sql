-- ==========================================================
-- Bengal Taxi: Bookings Table Setup for Supabase
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    from_location TEXT NOT NULL,
    to_location TEXT NOT NULL,
    pickup_date TEXT,
    pax TEXT,
    details TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to prevent conflicts
DROP POLICY IF EXISTS "Allow public insert to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated delete bookings" ON public.bookings;

-- 1. Anyone (public / customers) can submit a new booking request
CREATE POLICY "Allow public insert to bookings"
ON public.bookings
FOR INSERT
TO public
WITH CHECK (true);

-- 2. Authenticated users (Admin) can view all bookings
CREATE POLICY "Allow authenticated view bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (true);

-- 3. Authenticated users (Admin) can update bookings (status, etc.)
CREATE POLICY "Allow authenticated update bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (true);

-- 4. Authenticated users (Admin) can delete bookings
CREATE POLICY "Allow authenticated delete bookings"
ON public.bookings
FOR DELETE
TO authenticated
USING (true);

-- Optional: Allow public read if you want anon read during development
-- CREATE POLICY "Allow public view bookings" ON public.bookings FOR SELECT TO public USING (true);

-- Create index on created_at for fast descending sort
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);
