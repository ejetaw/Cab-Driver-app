-- Complete fix for driver RLS policies
-- This script ensures authenticated users can create and manage their own driver profile

-- First, drop ALL existing policies on drivers table
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'drivers') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON drivers';
    END LOOP;
END $$;

-- Ensure RLS is enabled
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

-- Create simple, permissive policies for authenticated users
-- Allow authenticated users to INSERT their own profile
CREATE POLICY "auth_insert_own_driver"
ON drivers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow authenticated users to SELECT their own profile
CREATE POLICY "auth_select_own_driver"
ON drivers
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow authenticated users to UPDATE their own profile
CREATE POLICY "auth_update_own_driver"
ON drivers
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow authenticated users to DELETE their own profile
CREATE POLICY "auth_delete_own_driver"
ON drivers
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Allow anonymous users to read all drivers (for testing and public views)
CREATE POLICY "anon_select_drivers"
ON drivers
FOR SELECT
TO anon
USING (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON drivers TO authenticated;
GRANT SELECT ON drivers TO anon;
