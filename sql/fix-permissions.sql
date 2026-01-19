-- Fix all permission and database issues

-- 1. Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Allow all reads" ON drivers;
DROP POLICY IF EXISTS "Allow all updates" ON drivers;
DROP POLICY IF EXISTS "Allow all inserts" ON drivers;
DROP POLICY IF EXISTS "Drivers can view own data" ON drivers;
DROP POLICY IF EXISTS "Drivers can update own data" ON drivers;
DROP POLICY IF EXISTS "Drivers can insert data" ON drivers;

DROP POLICY IF EXISTS "Allow all reads" ON vehicles;
DROP POLICY IF EXISTS "Allow all updates" ON vehicles;
DROP POLICY IF EXISTS "Allow all inserts" ON vehicles;
DROP POLICY IF EXISTS "Vehicles can be viewed by owner" ON vehicles;
DROP POLICY IF EXISTS "Vehicles can be updated by owner" ON vehicles;
DROP POLICY IF EXISTS "Vehicles can be inserted by owner" ON vehicles;

DROP POLICY IF EXISTS "Allow all reads" ON bookings;
DROP POLICY IF EXISTS "Allow all updates" ON bookings;
DROP POLICY IF EXISTS "Allow all inserts" ON bookings;
DROP POLICY IF EXISTS "Bookings can be viewed by driver" ON bookings;
DROP POLICY IF EXISTS "Bookings can be updated by driver" ON bookings;

-- Drop earnings table policies if they exist
DROP POLICY IF EXISTS "Allow all reads" ON earnings;
DROP POLICY IF EXISTS "Allow all updates" ON earnings;
DROP POLICY IF EXISTS "Allow all inserts" ON earnings;
DROP POLICY IF EXISTS "Earnings can be viewed by driver" ON earnings;
DROP POLICY IF EXISTS "Earnings can be updated by driver" ON earnings;
DROP POLICY IF EXISTS "Earnings can be inserted by driver" ON earnings;

-- 2. Disable RLS temporarily to fix structure
ALTER TABLE drivers DISABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;

-- 3. Make sure all required columns exist and are nullable
ALTER TABLE drivers 
ADD COLUMN IF NOT EXISTS license_number TEXT,
ADD COLUMN IF NOT EXISTS profile_image TEXT,
ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 5.0,
ADD COLUMN IF NOT EXISTS total_trips INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS member_since TEXT,
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('online', 'offline')) DEFAULT 'offline',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Make license_number nullable if it's not
ALTER TABLE drivers ALTER COLUMN license_number DROP NOT NULL;

-- 4. Make sure vehicles table has all columns
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 5. Make sure bookings table has all columns
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS passenger_name TEXT,
ADD COLUMN IF NOT EXISTS passenger_rating DECIMAL(2,1) DEFAULT 5.0,
ADD COLUMN IF NOT EXISTS passenger_image TEXT,
ADD COLUMN IF NOT EXISTS pickup_latitude DECIMAL(10,8),
ADD COLUMN IF NOT EXISTS pickup_longitude DECIMAL(11,8),
ADD COLUMN IF NOT EXISTS dropoff_latitude DECIMAL(10,8),
ADD COLUMN IF NOT EXISTS dropoff_longitude DECIMAL(11,8),
ADD COLUMN IF NOT EXISTS distance DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS duration INTEGER,
ADD COLUMN IF NOT EXISTS base_fare DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS commission DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS final_fare DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'wallet')) DEFAULT 'card',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 6. Create earnings table if it doesn't exist
CREATE TABLE IF NOT EXISTS earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  trips_count INTEGER DEFAULT 0,
  total_amount DECIMAL(10,2) DEFAULT 0,
  commission_amount DECIMAL(10,2) DEFAULT 0,
  net_amount DECIMAL(10,2) DEFAULT 0,
  hours_worked DECIMAL(4,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(driver_id, date)
);

-- 7. Delete existing test data and recreate
DELETE FROM bookings WHERE driver_id = '550e8400-e29b-41d4-a716-446655440000';
DELETE FROM vehicles WHERE driver_id = '550e8400-e29b-41d4-a716-446655440000';
DELETE FROM earnings WHERE driver_id = '550e8400-e29b-41d4-a716-446655440000';
DELETE FROM drivers WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- 8. Insert test driver with all required fields
INSERT INTO drivers (
  id, 
  name, 
  phone, 
  email, 
  license_number,
  profile_image, 
  rating, 
  total_trips, 
  member_since, 
  status,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'John Doe',
  '+1 (555) 123-4567',
  'john.doe@example.com',
  'DL123456789',
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  4.8,
  1248,
  'Jan 2023',
  'offline',
  NOW(),
  NOW()
);

-- 9. Insert test vehicle
INSERT INTO vehicles (
  id, 
  driver_id, 
  make, 
  model, 
  year, 
  color, 
  license_plate, 
  image,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440000',
  'Toyota',
  'Camry',
  2020,
  'Silver',
  'ABC 123',
  'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  NOW(),
  NOW()
);

-- 10. Insert test bookings
INSERT INTO bookings (
  id, 
  driver_id, 
  passenger_id, 
  passenger_name, 
  passenger_rating, 
  passenger_image, 
  status, 
  pickup_address, 
  pickup_latitude, 
  pickup_longitude,
  dropoff_address, 
  dropoff_latitude, 
  dropoff_longitude, 
  distance, 
  duration, 
  base_fare, 
  commission, 
  final_fare, 
  fare,
  payment_method,
  created_at,
  updated_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440010', 
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440020',
  'Alice Smith', 
  4.7,
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'pending', 
  '123 Main St, Anytown', 
  37.7749, 
  -122.4194, 
  '456 Market St, Anytown', 
  37.7831, 
  -122.4039,
  3.2, 
  12, 
  20.00, 
  1.50, 
  18.50, 
  18.50,
  'card',
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440011', 
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440021',
  'Bob Johnson', 
  4.9,
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'completed', 
  '789 Oak Ave, Anytown', 
  37.7833, 
  -122.4167, 
  '101 Pine St, Anytown', 
  37.7923, 
  -122.4070,
  2.8, 
  10, 
  17.25, 
  1.50, 
  15.75, 
  15.75,
  'cash',
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '2 hours'
),
(
  '550e8400-e29b-41d4-a716-446655440012', 
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440022',
  'Carol Williams', 
  4.6,
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'completed', 
  '222 Elm St, Anytown', 
  37.7800, 
  -122.4200, 
  '333 Cedar Rd, Anytown', 
  37.7900, 
  -122.4100,
  4.5, 
  18, 
  23.75, 
  1.50, 
  22.25, 
  22.25,
  'card',
  NOW() - INTERVAL '4 hours',
  NOW() - INTERVAL '4 hours'
);

-- 11. Insert test earnings data
INSERT INTO earnings (
  id,
  driver_id,
  date,
  trips_count,
  total_amount,
  commission_amount,
  net_amount,
  hours_worked,
  created_at,
  updated_at
) VALUES 
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_DATE,
  8,
  126.00,
  12.00,
  124.50,
  6.5,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_DATE - INTERVAL '1 day',
  10,
  158.25,
  15.00,
  156.75,
  7.2,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_DATE - INTERVAL '2 days',
  7,
  99.75,
  9.50,
  98.25,
  5.0,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_DATE - INTERVAL '3 days',
  12,
  189.00,
  18.00,
  187.50,
  8.5,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_DATE - INTERVAL '4 days',
  9,
  143.75,
  13.50,
  142.25,
  6.8,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_DATE - INTERVAL '5 days',
  6,
  89.25,
  8.50,
  87.75,
  4.5,
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440000',
  CURRENT_DATE - INTERVAL '6 days',
  11,
  170.00,
  16.50,
  168.50,
  7.8,
  NOW(),
  NOW()
);

-- 12. Re-enable RLS with permissive policies
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;

-- 13. Create very permissive policies for testing
CREATE POLICY "Allow all operations" ON drivers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON vehicles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON earnings FOR ALL USING (true) WITH CHECK (true);

-- 14. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_driver_id ON bookings(driver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_vehicles_driver_id ON vehicles(driver_id);
CREATE INDEX IF NOT EXISTS idx_earnings_driver_id ON earnings(driver_id);
CREATE INDEX IF NOT EXISTS idx_earnings_date ON earnings(date);

-- 15. Verify the data was inserted correctly
SELECT 'Drivers' as table_name, count(*) as count FROM drivers WHERE id = '550e8400-e29b-41d4-a716-446655440000'
UNION ALL
SELECT 'Vehicles' as table_name, count(*) as count FROM vehicles WHERE driver_id = '550e8400-e29b-41d4-a716-446655440000'
UNION ALL
SELECT 'Bookings' as table_name, count(*) as count FROM bookings WHERE driver_id = '550e8400-e29b-41d4-a716-446655440000'
UNION ALL
SELECT 'Earnings' as table_name, count(*) as count FROM earnings WHERE driver_id = '550e8400-e29b-41d4-a716-446655440000';
