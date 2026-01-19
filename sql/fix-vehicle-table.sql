-- Fix the vehicles table to include the missing driver_id column
-- This addresses the specific error: column vehicles.driver_id does not exist

-- 1. Add the missing driver_id column to vehicles table
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE;

-- 2. If there are existing vehicles without driver_id, we need to handle them
-- First, let's see if we have any vehicles without driver_id
-- UPDATE vehicles SET driver_id = '550e8400-e29b-41d4-a716-446655440000' WHERE driver_id IS NULL;

-- 3. Add other missing columns that the app expects
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 4. Ensure the test vehicle has the correct driver_id
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
) ON CONFLICT (id) DO UPDATE SET
  driver_id = EXCLUDED.driver_id,
  make = EXCLUDED.make,
  model = EXCLUDED.model,
  year = EXCLUDED.year,
  color = EXCLUDED.color,
  license_plate = EXCLUDED.license_plate,
  image = EXCLUDED.image,
  updated_at = NOW();

-- 5. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_vehicles_driver_id ON vehicles(driver_id);

-- 6. Ensure RLS policy allows reading vehicles
DROP POLICY IF EXISTS "Allow all operations" ON vehicles;
CREATE POLICY "Allow all operations" ON vehicles FOR ALL USING (true) WITH CHECK (true);

-- 7. Verify the fix worked
SELECT 'Vehicles with driver_id' as check_name, count(*) as count 
FROM vehicles 
WHERE driver_id = '550e8400-e29b-41d4-a716-446655440000';
