-- Fix database issues and create proper test data

-- 1. First, let's ensure the driver table has the right structure
-- Check if license_number column exists and make it nullable if it's required
ALTER TABLE drivers 
ALTER COLUMN license_number DROP NOT NULL;

-- Or add it if it doesn't exist
ALTER TABLE drivers 
ADD COLUMN IF NOT EXISTS license_number TEXT;

-- 2. Drop and recreate RLS policies to ensure proper access
DROP POLICY IF EXISTS "Allow all reads" ON drivers;
DROP POLICY IF EXISTS "Allow all updates" ON drivers;
DROP POLICY IF EXISTS "Allow all inserts" ON drivers;

CREATE POLICY "Allow all reads" ON drivers FOR SELECT USING (true);
CREATE POLICY "Allow all updates" ON drivers FOR UPDATE USING (true);
CREATE POLICY "Allow all inserts" ON drivers FOR INSERT WITH CHECK (true);

-- 3. Same for other tables
DROP POLICY IF EXISTS "Allow all reads" ON vehicles;
DROP POLICY IF EXISTS "Allow all updates" ON vehicles;
DROP POLICY IF EXISTS "Allow all inserts" ON vehicles;

CREATE POLICY "Allow all reads" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Allow all updates" ON vehicles FOR UPDATE USING (true);
CREATE POLICY "Allow all inserts" ON vehicles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all reads" ON bookings;
DROP POLICY IF EXISTS "Allow all updates" ON bookings;
DROP POLICY IF EXISTS "Allow all inserts" ON bookings;

CREATE POLICY "Allow all reads" ON bookings FOR SELECT USING (true);
CREATE POLICY "Allow all updates" ON bookings FOR UPDATE USING (true);
CREATE POLICY "Allow all inserts" ON bookings FOR INSERT WITH CHECK (true);

-- 4. Create earnings table if it doesn't exist
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

-- Enable RLS on earnings
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all reads" ON earnings;
DROP POLICY IF EXISTS "Allow all updates" ON earnings;
DROP POLICY IF EXISTS "Allow all inserts" ON earnings;

CREATE POLICY "Allow all reads" ON earnings FOR SELECT USING (true);
CREATE POLICY "Allow all updates" ON earnings FOR UPDATE USING (true);
CREATE POLICY "Allow all inserts" ON earnings FOR INSERT WITH CHECK (true);

-- 5. Delete existing test data and recreate with proper UUIDs
DELETE FROM bookings WHERE driver_id = '550e8400-e29b-41d4-a716-446655440000';
DELETE FROM vehicles WHERE driver_id = '550e8400-e29b-41d4-a716-446655440000';
DELETE FROM earnings WHERE driver_id = '550e8400-e29b-41d4-a716-446655440000';
DELETE FROM drivers WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- 6. Insert test driver with all required fields
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

-- 7. Insert test vehicle
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

-- 8. Insert test bookings
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

-- 9. Insert test earnings data
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

-- 10. Verify the data was inserted correctly
SELECT 'Drivers' as table_name, count(*) as count FROM drivers WHERE id = '550e8400-e29b-41d4-a716-446655440000'
UNION ALL
SELECT 'Vehicles' as table_name, count(*) as count FROM vehicles WHERE driver_id = '550e8400-e29b-41d4-a716-446655440000'
UNION ALL
SELECT 'Bookings' as table_name, count(*) as count FROM bookings WHERE driver_id = '550e8400-e29b-41d4-a716-446655440000'
UNION ALL
SELECT 'Earnings' as table_name, count(*) as count FROM earnings WHERE driver_id = '550e8400-e29b-41d4-a716-446655440000';
