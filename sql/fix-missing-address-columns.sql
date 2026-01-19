-- Fix missing pickup_address and dropoff_address columns in bookings table
-- This addresses the error: column bookings.pickup_address does not exist

-- Add missing address columns to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS pickup_address TEXT,
ADD COLUMN IF NOT EXISTS dropoff_address TEXT;

-- Also ensure other commonly needed columns exist
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS pickup_latitude DECIMAL(10,8),
ADD COLUMN IF NOT EXISTS pickup_longitude DECIMAL(11,8),
ADD COLUMN IF NOT EXISTS dropoff_latitude DECIMAL(10,8),
ADD COLUMN IF NOT EXISTS dropoff_longitude DECIMAL(11,8),
ADD COLUMN IF NOT EXISTS passenger_name TEXT,
ADD COLUMN IF NOT EXISTS passenger_rating DECIMAL(2,1) DEFAULT 5.0,
ADD COLUMN IF NOT EXISTS passenger_image TEXT,
ADD COLUMN IF NOT EXISTS distance DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS duration INTEGER,
ADD COLUMN IF NOT EXISTS base_fare DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS commission DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS final_fare DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS fare DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'wallet')) DEFAULT 'card';

-- Verify the columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
AND column_name IN ('pickup_address', 'dropoff_address', 'pickup_latitude', 'pickup_longitude', 'dropoff_latitude', 'dropoff_longitude')
ORDER BY column_name;
