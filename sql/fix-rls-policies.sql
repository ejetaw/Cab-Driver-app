-- Complete RLS policy fix for all tables
-- This script drops all existing policies and creates new ones that allow proper authentication

-- ============================================
-- DRIVERS TABLE POLICIES
-- ============================================

-- Drop all existing policies on drivers table
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

-- Enable RLS on drivers table
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own profile
CREATE POLICY "authenticated_insert_own_driver"
ON drivers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow authenticated users to view their own profile
CREATE POLICY "authenticated_select_own_driver"
ON drivers
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow authenticated users to update their own profile
CREATE POLICY "authenticated_update_own_driver"
ON drivers
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow authenticated users to delete their own profile
CREATE POLICY "authenticated_delete_own_driver"
ON drivers
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Allow anonymous users to read all drivers (for testing)
CREATE POLICY "anon_select_all_drivers"
ON drivers
FOR SELECT
TO anon
USING (true);

-- ============================================
-- VEHICLES TABLE POLICIES
-- ============================================

-- Drop all existing policies on vehicles table
DROP POLICY IF EXISTS "Allow all operations" ON vehicles;
DROP POLICY IF EXISTS "Allow all reads" ON vehicles;
DROP POLICY IF EXISTS "Allow all updates" ON vehicles;
DROP POLICY IF EXISTS "Allow all inserts" ON vehicles;
DROP POLICY IF EXISTS "Vehicles can be viewed by owner" ON vehicles;
DROP POLICY IF EXISTS "Vehicles can be updated by owner" ON vehicles;
DROP POLICY IF EXISTS "Vehicles can be inserted by owner" ON vehicles;
DROP POLICY IF EXISTS "Users can manage own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Allow anonymous read vehicles" ON vehicles;

-- Enable RLS on vehicles table
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage their own vehicles
CREATE POLICY "authenticated_all_own_vehicles"
ON vehicles
FOR ALL
TO authenticated
USING (driver_id = auth.uid())
WITH CHECK (driver_id = auth.uid());

-- Allow anonymous users to read all vehicles (for testing)
CREATE POLICY "anon_select_all_vehicles"
ON vehicles
FOR SELECT
TO anon
USING (true);

-- ============================================
-- BOOKINGS TABLE POLICIES
-- ============================================

-- Drop all existing policies on bookings table
DROP POLICY IF EXISTS "Allow all operations" ON bookings;
DROP POLICY IF EXISTS "Allow all reads" ON bookings;
DROP POLICY IF EXISTS "Allow all updates" ON bookings;
DROP POLICY IF EXISTS "Allow all inserts" ON bookings;
DROP POLICY IF EXISTS "Bookings can be viewed by driver" ON bookings;
DROP POLICY IF EXISTS "Bookings can be updated by driver" ON bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
DROP POLICY IF EXISTS "Allow anonymous read bookings" ON bookings;

-- Enable RLS on bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own bookings
CREATE POLICY "authenticated_select_own_bookings"
ON bookings
FOR SELECT
TO authenticated
USING (driver_id = auth.uid());

-- Allow authenticated users to update their own bookings
CREATE POLICY "authenticated_update_own_bookings"
ON bookings
FOR UPDATE
TO authenticated
USING (driver_id = auth.uid())
WITH CHECK (driver_id = auth.uid());

-- Allow authenticated users to insert bookings for themselves
CREATE POLICY "authenticated_insert_own_bookings"
ON bookings
FOR INSERT
TO authenticated
WITH CHECK (driver_id = auth.uid());

-- Allow anonymous users to read all bookings (for testing)
CREATE POLICY "anon_select_all_bookings"
ON bookings
FOR SELECT
TO anon
USING (true);

-- Allow anonymous users to insert bookings (for testing - system can create bookings)
CREATE POLICY "anon_insert_bookings"
ON bookings
FOR INSERT
TO anon
WITH CHECK (true);

-- ============================================
-- EARNINGS TABLE POLICIES
-- ============================================

-- Drop all existing policies on earnings table
DROP POLICY IF EXISTS "Allow all operations" ON earnings;
DROP POLICY IF EXISTS "Allow all reads" ON earnings;
DROP POLICY IF EXISTS "Allow all updates" ON earnings;
DROP POLICY IF EXISTS "Allow all inserts" ON earnings;
DROP POLICY IF EXISTS "Earnings can be viewed by driver" ON earnings;
DROP POLICY IF EXISTS "Users can view own earnings" ON earnings;
DROP POLICY IF EXISTS "Users can insert own earnings" ON earnings;
DROP POLICY IF EXISTS "Allow anonymous read earnings" ON earnings;

-- Enable RLS on earnings table
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own earnings
CREATE POLICY "authenticated_select_own_earnings"
ON earnings
FOR SELECT
TO authenticated
USING (driver_id = auth.uid());

-- Allow authenticated users to insert their own earnings
CREATE POLICY "authenticated_insert_own_earnings"
ON earnings
FOR INSERT
TO authenticated
WITH CHECK (driver_id = auth.uid());

-- Allow authenticated users to update their own earnings
CREATE POLICY "authenticated_update_own_earnings"
ON earnings
FOR UPDATE
TO authenticated
USING (driver_id = auth.uid())
WITH CHECK (driver_id = auth.uid());

-- Allow anonymous users to read all earnings (for testing)
CREATE POLICY "anon_select_all_earnings"
ON earnings
FOR SELECT
TO anon
USING (true);

-- ============================================
-- FARE SETTINGS TABLE POLICIES
-- ============================================

-- Drop all existing policies on fare_settings table if it exists
DROP POLICY IF EXISTS "Allow all operations" ON fare_settings;
DROP POLICY IF EXISTS "Allow all reads" ON fare_settings;

-- Enable RLS on fare_settings table if it exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'fare_settings') THEN
        ALTER TABLE fare_settings ENABLE ROW LEVEL SECURITY;
        
        -- Allow everyone to read fare settings
        EXECUTE 'CREATE POLICY "public_read_fare_settings" ON fare_settings FOR SELECT USING (true)';
    END IF;
END $$;
