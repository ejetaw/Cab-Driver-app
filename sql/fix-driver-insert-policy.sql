-- Fix RLS policy to allow authenticated users to insert their own driver profile

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

-- Create new policies that allow authenticated users to manage their own profile
CREATE POLICY "Authenticated users can insert own profile" 
ON drivers 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Authenticated users can view own profile" 
ON drivers 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Authenticated users can update own profile" 
ON drivers 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Also allow anon access for the test data (you can remove this in production)
CREATE POLICY "Allow anonymous read access" 
ON drivers 
FOR SELECT 
TO anon
USING (true);

-- Verify RLS is enabled
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

-- Update vehicles table policies to reference drivers correctly
DROP POLICY IF EXISTS "Allow all operations" ON vehicles;
DROP POLICY IF EXISTS "Allow all reads" ON vehicles;
DROP POLICY IF EXISTS "Allow all updates" ON vehicles;
DROP POLICY IF EXISTS "Allow all inserts" ON vehicles;
DROP POLICY IF EXISTS "Vehicles can be viewed by owner" ON vehicles;
DROP POLICY IF EXISTS "Vehicles can be updated by owner" ON vehicles;
DROP POLICY IF EXISTS "Vehicles can be inserted by owner" ON vehicles;

CREATE POLICY "Users can manage own vehicles"
ON vehicles
FOR ALL
TO authenticated
USING (driver_id = auth.uid())
WITH CHECK (driver_id = auth.uid());

CREATE POLICY "Allow anonymous read vehicles"
ON vehicles
FOR SELECT
TO anon
USING (true);

-- Update bookings table policies
DROP POLICY IF EXISTS "Allow all operations" ON bookings;
DROP POLICY IF EXISTS "Allow all reads" ON bookings;
DROP POLICY IF EXISTS "Allow all updates" ON bookings;
DROP POLICY IF EXISTS "Allow all inserts" ON bookings;
DROP POLICY IF EXISTS "Bookings can be viewed by driver" ON bookings;
DROP POLICY IF EXISTS "Bookings can be updated by driver" ON bookings;

CREATE POLICY "Users can view own bookings"
ON bookings
FOR SELECT
TO authenticated
USING (driver_id = auth.uid());

CREATE POLICY "Users can update own bookings"
ON bookings
FOR UPDATE
TO authenticated
USING (driver_id = auth.uid())
WITH CHECK (driver_id = auth.uid());

CREATE POLICY "Allow anonymous read bookings"
ON bookings
FOR SELECT
TO anon
USING (true);

-- Update earnings table policies
DROP POLICY IF EXISTS "Allow all operations" ON earnings;
DROP POLICY IF EXISTS "Allow all reads" ON earnings;
DROP POLICY IF EXISTS "Allow all updates" ON earnings;
DROP POLICY IF EXISTS "Allow all inserts" ON earnings;
DROP POLICY IF EXISTS "Earnings can be viewed by driver" ON earnings;

CREATE POLICY "Users can view own earnings"
ON earnings
FOR SELECT
TO authenticated
USING (driver_id = auth.uid());

CREATE POLICY "Users can insert own earnings"
ON earnings
FOR INSERT
TO authenticated
WITH CHECK (driver_id = auth.uid());

CREATE POLICY "Allow anonymous read earnings"
ON earnings
FOR SELECT
TO anon
USING (true);

-- Ensure RLS is enabled on all tables
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;
