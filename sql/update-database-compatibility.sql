-- Update database to be compatible with the mobile app
-- This script ensures the app works with existing drivers from web and mobile

-- 1. Ensure the vehicles table has the driver_id column for compatibility
-- (Keep operator_id as the primary foreign key, but add driver_id as an alias)
ALTER TABLE vehicles 
ADD COLUMN IF NOT EXISTS driver_id UUID;

-- Update driver_id to match operator_id for existing records
UPDATE vehicles 
SET driver_id = operator_id 
WHERE driver_id IS NULL AND operator_id IS NOT NULL;

-- 2. Create a function to keep driver_id and operator_id in sync
CREATE OR REPLACE FUNCTION sync_vehicle_driver_id()
RETURNS trigger AS $$
BEGIN
  -- When operator_id is updated, update driver_id too
  IF TG_OP = 'UPDATE' AND OLD.operator_id IS DISTINCT FROM NEW.operator_id THEN
    NEW.driver_id = NEW.operator_id;
  END IF;
  
  -- When inserting, ensure driver_id matches operator_id
  IF TG_OP = 'INSERT' THEN
    NEW.driver_id = COALESCE(NEW.driver_id, NEW.operator_id);
    NEW.operator_id = COALESCE(NEW.operator_id, NEW.driver_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to keep the columns in sync
DROP TRIGGER IF EXISTS sync_vehicle_driver_id_trigger ON vehicles;
CREATE TRIGGER sync_vehicle_driver_id_trigger
  BEFORE INSERT OR UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION sync_vehicle_driver_id();

-- 3. Add missing columns to drivers table if they don't exist
ALTER TABLE drivers 
ADD COLUMN IF NOT EXISTS profile_image TEXT,
ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 5.0,
ADD COLUMN IF NOT EXISTS total_trips INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS member_since TEXT;

-- 4. Update member_since for existing drivers
UPDATE drivers 
SET member_since = TO_CHAR(created_at, 'Mon YYYY')
WHERE member_since IS NULL AND created_at IS NOT NULL;

-- 5. Set default profile image for drivers without one
UPDATE drivers 
SET profile_image = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
WHERE profile_image IS NULL;

-- 6. Set default vehicle image for vehicles without one
UPDATE vehicles 
SET image = 'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
WHERE image IS NULL;

-- 7. Ensure all drivers have a default status
UPDATE drivers 
SET status = 'offline'
WHERE status IS NULL;

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicles_driver_id ON vehicles(driver_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_operator_id ON vehicles(operator_id);
CREATE INDEX IF NOT EXISTS idx_drivers_email ON drivers(email);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);

-- 9. Update RLS policies to work with the new structure
-- Drop existing policies
DROP POLICY IF EXISTS "Drivers can view their own data" ON drivers;
DROP POLICY IF EXISTS "Drivers can update their own status" ON drivers;
DROP POLICY IF EXISTS "Drivers can insert their own records" ON drivers;

-- Create new policies that work with auth
CREATE POLICY "Drivers can view their own data" ON drivers 
FOR SELECT 
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Drivers can update their own data" ON drivers 
FOR UPDATE 
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()))
WITH CHECK (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Drivers can insert their own records" ON drivers 
FOR INSERT 
WITH CHECK (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Vehicle policies
DROP POLICY IF EXISTS "Drivers can view their own vehicles" ON vehicles;
CREATE POLICY "Drivers can view their own vehicles" ON vehicles 
FOR SELECT 
USING (
  operator_id IN (SELECT id FROM drivers WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  OR 
  driver_id IN (SELECT id FROM drivers WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
);

-- Booking policies (if bookings table exists)
DROP POLICY IF EXISTS "Drivers can view their own bookings" ON bookings;
CREATE POLICY "Drivers can view their own bookings" ON bookings 
FOR SELECT 
USING (driver_id IN (SELECT id FROM drivers WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())));

DROP POLICY IF EXISTS "Drivers can update their own bookings" ON bookings;
CREATE POLICY "Drivers can update their own bookings" ON bookings 
FOR UPDATE 
USING (driver_id IN (SELECT id FROM drivers WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())));

-- 10. Create a view that shows driver and vehicle information together for easier querying
CREATE OR REPLACE VIEW driver_vehicle_info AS
SELECT 
  d.*,
  v.make as vehicle_make_actual,
  v.model as vehicle_model_actual,
  v.year as vehicle_year_actual,
  v.color as vehicle_color_actual,
  v.registration_number,
  v.license_number as vehicle_license,
  v.image as vehicle_image,
  v.insurance_expiry,
  v.mot_expiry,
  v.status as vehicle_status
FROM drivers d
LEFT JOIN vehicles v ON d.id = v.operator_id OR d.id = v.driver_id;

-- 11. Verify the setup
SELECT 
  'Drivers' as table_name, 
  count(*) as total_count,
  count(CASE WHEN email IS NOT NULL THEN 1 END) as with_email,
  count(CASE WHEN status IS NOT NULL THEN 1 END) as with_status
FROM drivers
UNION ALL
SELECT 
  'Vehicles' as table_name, 
  count(*) as total_count,
  count(CASE WHEN operator_id IS NOT NULL THEN 1 END) as with_operator_id,
  count(CASE WHEN driver_id IS NOT NULL THEN 1 END) as with_driver_id
FROM vehicles;
