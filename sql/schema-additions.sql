-- SQL Schema additions for existing database
-- Only run the parts you need based on your current schema

-- 1. Add missing columns to existing drivers table (if they don't exist)
-- Check your current drivers table structure first
ALTER TABLE drivers 
ADD COLUMN IF NOT EXISTS profile_image TEXT,
ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 5.0,
ADD COLUMN IF NOT EXISTS total_trips INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS member_since TEXT,
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('online', 'offline')) DEFAULT 'offline',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Add missing columns to existing vehicles table (if they don't exist)
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Add missing columns to existing bookings table (if they don't exist)
-- Adjust column names based on your existing schema
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
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 4. Create earnings table (only if it doesn't exist)
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

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_driver_id ON bookings(driver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_earnings_driver_id ON earnings(driver_id);
CREATE INDEX IF NOT EXISTS idx_earnings_date ON earnings(date);

-- 6. Update existing data (optional - adjust based on your needs)
-- Set default values for new columns if needed
UPDATE drivers SET 
  profile_image = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
WHERE profile_image IS NULL;

UPDATE drivers SET 
  member_since = 'Jan 2023'
WHERE member_since IS NULL;

UPDATE vehicles SET 
  image = 'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
WHERE image IS NULL;

-- 7. Enable Row Level Security (if not already enabled)
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;

-- 8. Create policies (adjust based on your auth requirements)
-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "Drivers can view own data" ON drivers;
DROP POLICY IF EXISTS "Drivers can update own data" ON drivers;
DROP POLICY IF EXISTS "Vehicles can be viewed by owner" ON vehicles;
DROP POLICY IF EXISTS "Vehicles can be updated by owner" ON vehicles;
DROP POLICY IF EXISTS "Bookings can be viewed by driver" ON bookings;
DROP POLICY IF EXISTS "Bookings can be updated by driver" ON bookings;
DROP POLICY IF EXISTS "Earnings can be viewed by driver" ON earnings;
DROP POLICY IF EXISTS "Earnings can be updated by driver" ON earnings;

CREATE POLICY "Drivers can view own data" ON drivers FOR SELECT USING (true);
CREATE POLICY "Drivers can update own data" ON drivers FOR UPDATE USING (true);
CREATE POLICY "Drivers can insert data" ON drivers FOR INSERT WITH CHECK (true);

CREATE POLICY "Vehicles can be viewed by owner" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Vehicles can be updated by owner" ON vehicles FOR UPDATE USING (true);
CREATE POLICY "Vehicles can be inserted by owner" ON vehicles FOR INSERT WITH CHECK (true);

CREATE POLICY "Bookings can be viewed by driver" ON bookings FOR SELECT USING (true);
CREATE POLICY "Bookings can be updated by driver" ON bookings FOR UPDATE USING (true);

CREATE POLICY "Earnings can be viewed by driver" ON earnings FOR SELECT USING (true);
CREATE POLICY "Earnings can be updated by driver" ON earnings FOR UPDATE USING (true);
CREATE POLICY "Earnings can be inserted by driver" ON earnings FOR INSERT WITH CHECK (true);

-- 9. Insert sample data with proper UUID format
-- Insert sample driver if it doesn't exist
INSERT INTO drivers (id, name, phone, email, profile_image, rating, total_trips, member_since, status)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'John Doe',
  '+1 (555) 123-4567',
  'john.doe@example.com',
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  4.8,
  1248,
  'Jan 2023',
  'offline'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample vehicle if it doesn't exist
INSERT INTO vehicles (id, driver_id, make, model, year, color, license_plate, image)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440000',
  'Toyota',
  'Camry',
  2020,
  'Silver',
  'ABC 123',
  'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample booking if it doesn't exist
INSERT INTO bookings (
  id, driver_id, passenger_id, passenger_name, passenger_rating, passenger_image, status, 
  pickup_address, pickup_latitude, pickup_longitude,
  dropoff_address, dropoff_latitude, dropoff_longitude, 
  distance, duration, base_fare, commission, final_fare, payment_method
)
VALUES (
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
  'card'
) ON CONFLICT (id) DO NOTHING;
