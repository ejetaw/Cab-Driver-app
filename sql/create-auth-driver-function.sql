-- Create a function to increment driver trips (for your RLS policies)
CREATE OR REPLACE FUNCTION increment_driver_trips(driver_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE drivers 
  SET total_trips = COALESCE(total_trips, 0) + 1,
      updated_at = NOW()
  WHERE email = driver_email;
END;
$$;

-- Create a function to automatically create a driver profile when a user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO drivers (
    id,
    name,
    email,
    phone,
    profile_image,
    rating,
    total_trips,
    member_since,
    status,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Driver'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    5.0,
    0,
    TO_CHAR(NOW(), 'Mon YYYY'),
    'offline',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create driver profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update your existing RLS policies to work with the new auth system
-- (Your existing policies should work, but let's make sure they're correct)

-- Ensure drivers can read their own data (using auth.uid() directly)
DROP POLICY IF EXISTS "Drivers can view their own data" ON drivers;
CREATE POLICY "Drivers can view their own data" ON drivers 
FOR SELECT 
USING (id = auth.uid());

-- Your existing update and insert policies should work fine
-- But let's recreate them to be sure:

DROP POLICY IF EXISTS "Drivers can update their own status" ON drivers;
CREATE POLICY "Drivers can update their own status" ON drivers 
FOR UPDATE 
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Drivers can insert their own records" ON drivers;
CREATE POLICY "Drivers can insert their own records" ON drivers 
FOR INSERT 
WITH CHECK (id = auth.uid());

-- Add policies for vehicles table
DROP POLICY IF EXISTS "Drivers can view their own vehicles" ON vehicles;
CREATE POLICY "Drivers can view their own vehicles" ON vehicles 
FOR SELECT 
USING (driver_id = auth.uid());

-- Add policies for bookings table  
DROP POLICY IF EXISTS "Drivers can view their own bookings" ON bookings;
CREATE POLICY "Drivers can view their own bookings" ON bookings 
FOR SELECT 
USING (driver_id = auth.uid());

DROP POLICY IF EXISTS "Drivers can update their own bookings" ON bookings;
CREATE POLICY "Drivers can update their own bookings" ON bookings 
FOR UPDATE 
USING (driver_id = auth.uid());

-- Add policies for earnings table
DROP POLICY IF EXISTS "Drivers can view their own earnings" ON earnings;
CREATE POLICY "Drivers can view their own earnings" ON earnings 
FOR SELECT 
USING (driver_id = auth.uid());
