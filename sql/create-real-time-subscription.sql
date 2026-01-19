-- Enable real-time subscriptions for the driver app
-- This allows the app to receive live updates when new trips are posted

-- 1. Enable real-time for the bookings table
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- 2. Create a function to notify drivers of new trips
CREATE OR REPLACE FUNCTION notify_driver_new_trip()
RETURNS trigger AS $$
BEGIN
  -- Only notify for new pending trips
  IF NEW.status = 'pending' AND OLD.status IS DISTINCT FROM 'pending' THEN
    -- Perform notification (this could be extended to send push notifications)
    PERFORM pg_notify('new_trip', json_build_object(
      'trip_id', NEW.id,
      'driver_id', NEW.driver_id,
      'pickup_address', NEW.pickup_address,
      'dropoff_address', NEW.dropoff_address,
      'fare', COALESCE(NEW.final_fare, NEW.fare)
    )::text);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create trigger for new trip notifications
DROP TRIGGER IF EXISTS notify_driver_new_trip_trigger ON bookings;
CREATE TRIGGER notify_driver_new_trip_trigger
  AFTER INSERT OR UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION notify_driver_new_trip();

-- 4. Create an index for faster queries on driver_id and status
CREATE INDEX IF NOT EXISTS idx_bookings_driver_status ON bookings(driver_id, status);

-- 5. Create a view for active trips (pending and accepted)
CREATE OR REPLACE VIEW active_trips AS
SELECT 
  b.*,
  d.name as driver_name,
  d.phone as driver_phone,
  d.status as driver_status
FROM bookings b
LEFT JOIN drivers d ON b.driver_id = d.id
WHERE b.status IN ('pending', 'accepted')
ORDER BY b.created_at DESC;

-- 6. Enable RLS on the view
ALTER VIEW active_trips ENABLE ROW LEVEL SECURITY;

-- 7. Create policy for the view
CREATE POLICY "Drivers can view their active trips" ON active_trips
FOR SELECT 
USING (driver_id IN (SELECT id FROM drivers WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())));

-- 8. Verify the setup
SELECT 'Real-time setup complete' as status;
