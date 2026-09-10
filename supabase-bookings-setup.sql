-- ==========================================================
-- Bengal Taxi: Bookings Table Setup for Supabase
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- Direct URL: https://supabase.com/dashboard/project/kivlvfzhzmbiastygxea/sql/new
-- ==========================================================

-- 1. Create the main bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    from_location TEXT NOT NULL,
    to_location TEXT NOT NULL,
    pickup_date TEXT,
    pax TEXT,
    vehicle TEXT,
    details TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Add columns if table already existed without them
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='email') THEN
        ALTER TABLE public.bookings ADD COLUMN email TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='vehicle') THEN
        ALTER TABLE public.bookings ADD COLUMN vehicle TEXT;
    END IF;
END $$;

-- 3. Create view/alias bt_local_bookings so queries targeting either name work seamlessly
CREATE OR REPLACE VIEW public.bt_local_bookings AS 
SELECT * FROM public.bookings;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Allow public insert to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public delete bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow authenticated delete bookings" ON public.bookings;

-- 6. Anyone (customers / public) can submit a new booking request
CREATE POLICY "Allow public insert to bookings"
ON public.bookings
FOR INSERT
TO public
WITH CHECK (true);

-- 7. Anyone can view bookings (allows Admin panel to load bookings reliably)
CREATE POLICY "Allow public view bookings"
ON public.bookings
FOR SELECT
TO public
USING (true);

-- 8. Allow updates (Admin panel status changes: pending -> confirmed -> completed)
CREATE POLICY "Allow public update bookings"
ON public.bookings
FOR UPDATE
TO public
USING (true);

-- 9. Allow deletes (Admin panel deleting bookings)
CREATE POLICY "Allow public delete bookings"
ON public.bookings
FOR DELETE
TO public
USING (true);

-- 10. Create index on created_at for fast descending sort
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);

