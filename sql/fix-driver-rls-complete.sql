-- COMPLETE FIX FOR DRIVER RLS POLICIES
-- Run this script in your Supabase SQL Editor to fix the driver profile creation issue

-- Step 1: Drop ALL existing policies on drivers table
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'drivers' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.drivers';
    END LOOP;
END $$;

-- Step 2: Temporarily disable RLS to ensure clean state
ALTER TABLE public.drivers DISABLE ROW LEVEL SECURITY;

-- Step 3: Re-enable RLS
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- Step 4: Create simple, permissive policies for authenticated users
-- Allow authenticated users to INSERT their own profile (uses auth.uid() = id check)
CREATE POLICY "drivers_insert_own"
ON public.drivers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow authenticated users to SELECT their own profile
CREATE POLICY "drivers_select_own"
ON public.drivers
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow authenticated users to UPDATE their own profile
CREATE POLICY "drivers_update_own"
ON public.drivers
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow authenticated users to DELETE their own profile
CREATE POLICY "drivers_delete_own"
ON public.drivers
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Allow anonymous users to read all drivers (for public views and testing)
CREATE POLICY "drivers_select_anon"
ON public.drivers
FOR SELECT
TO anon
USING (true);

-- Step 5: Grant necessary permissions explicitly
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL PRIVILEGES ON public.drivers TO authenticated;
GRANT SELECT ON public.drivers TO anon;

-- Step 6: Verify the policies were created successfully
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'drivers' 
AND schemaname = 'public'
ORDER BY policyname;
