-- Fix driver insert RLS policy issue
-- This ensures authenticated users can create their own driver profile

-- Drop ALL existing policies on drivers table
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'drivers' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.drivers';
    END LOOP;
END $$;

-- Temporarily disable RLS to clean up
ALTER TABLE public.drivers DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- Create a permissive policy for INSERT that allows authenticated users to insert their own profile
CREATE POLICY "allow_authenticated_insert_own_profile"
ON public.drivers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Create a permissive policy for SELECT that allows authenticated users to view their own profile
CREATE POLICY "allow_authenticated_select_own_profile"
ON public.drivers
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Create a permissive policy for UPDATE that allows authenticated users to update their own profile
CREATE POLICY "allow_authenticated_update_own_profile"
ON public.drivers
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create a permissive policy for DELETE that allows authenticated users to delete their own profile
CREATE POLICY "allow_authenticated_delete_own_profile"
ON public.drivers
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Allow anonymous users to read all drivers (for public views and testing)
CREATE POLICY "allow_anon_select_all_drivers"
ON public.drivers
FOR SELECT
TO anon
USING (true);

-- Ensure proper grants
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.drivers TO authenticated;
GRANT SELECT ON public.drivers TO anon;

-- Verify the policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'drivers' 
AND schemaname = 'public'
ORDER BY policyname;
