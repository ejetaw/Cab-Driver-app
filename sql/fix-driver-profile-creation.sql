-- Fix driver profile creation issue
-- This ensures authenticated users can create their own driver profiles

-- First, check if there's a typo in table name (error showed "drives" instead of "drivers")
-- Drop the wrong table if it exists
DROP TABLE IF EXISTS drives CASCADE;

-- Drop all existing policies on drivers table
DROP POLICY IF EXISTS "authenticated_insert_own_driver" ON drivers;
DROP POLICY IF EXISTS "authenticated_select_own_driver" ON drivers;
DROP POLICY IF EXISTS "authenticated_update_own_driver" ON drivers;
DROP POLICY IF EXISTS "authenticated_delete_own_driver" ON drivers;
DROP POLICY IF EXISTS "anon_select_all_drivers" ON drivers;
DROP POLICY IF EXISTS "Allow all operations" ON drivers;
DROP POLICY IF EXISTS "Allow all reads" ON drivers;
DROP POLICY IF EXISTS "Allow all updates" ON drivers;
DROP POLICY IF EXISTS "Allow all inserts" ON drivers;
DROP POLICY IF EXISTS "Drivers can view own data" ON drivers;
DROP POLICY IF EXISTS "Drivers can update own data" ON drivers;
DROP POLICY IF EXISTS "Drivers can insert data" ON drivers;
DROP POLICY IF EXISTS "Authenticated users can insert own profile" ON drivers;
DROP POLICY IF EXISTS "Authenticated users can view own profile" ON drivers;
DROP POLICY IF EXISTS "Authenticated users can update own profile" ON drivers;
DROP POLICY IF EXISTS "Allow anonymous read access" ON drivers;

-- Enable RLS
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies for authenticated users
CREATE POLICY "auth_users_insert_own_driver"
ON drivers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "auth_users_select_own_driver"
ON drivers
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "auth_users_update_own_driver"
ON drivers
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "auth_users_delete_own_driver"
ON drivers
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Allow anonymous users to read drivers (for testing/display purposes)
CREATE POLICY "anon_read_drivers"
ON drivers
FOR SELECT
TO anon
USING (true);

-- Grant necessary permissions
GRANT ALL ON drivers TO authenticated;
GRANT SELECT ON drivers TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
