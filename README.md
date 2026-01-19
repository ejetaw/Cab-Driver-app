# Driver App - Supabase Integration

This app integrates with your existing Supabase database structure using your existing `bookings`, `drivers`, `vehicles`, and `fare_settings` tables.

## Current Status

The app now includes robust error handling and fallback mechanisms:

- **Automatic Fallback**: If database queries fail, the app uses mock data
- **Connection Status**: Shows connection issues and retry options
- **Better Error Handling**: Graceful degradation when database is unavailable
- **Console Logging**: Detailed logs to help debug database issues

## Troubleshooting

If you're seeing "Error loading data":

1. **Check Database Connection**
   - Open browser developer tools (F12)
   - Look at the Console tab for error messages
   - The app will show connection status and retry options

2. **Verify Database Setup**
   - Ensure the `drivers` table exists
   - Check if driver with ID 'driver-001' exists
   - Verify Row Level Security (RLS) policies allow reading

3. **Common Issues**
   - **Missing Driver**: Create a driver record with ID 'driver-001'
   - **RLS Policies**: Ensure policies allow SELECT operations
   - **Missing Columns**: Run the schema additions SQL
   - **Network Issues**: Check internet connection

## Quick Database Setup

Run this SQL in your Supabase SQL Editor to create test data:

```sql
-- Insert test driver
INSERT INTO drivers (id, name, phone, email, status)
VALUES (
  'driver-001',
  'John Doe',
  '+1 (555) 123-4567',
  'john.doe@example.com',
  'offline'
) ON CONFLICT (id) DO NOTHING;

-- Insert test vehicle
INSERT INTO vehicles (driver_id, make, model, year, color, license_plate)
SELECT 
  'driver-001',
  'Toyota',
  'Camry',
  2020,
  'Silver',
  'ABC 123'
WHERE NOT EXISTS (
  SELECT 1 FROM vehicles WHERE driver_id = 'driver-001'
);

-- Ensure RLS policies allow reading
DROP POLICY IF EXISTS "Allow all reads" ON drivers;
CREATE POLICY "Allow all reads" ON drivers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all reads" ON vehicles;
CREATE POLICY "Allow all reads" ON vehicles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all reads" ON bookings;
CREATE POLICY "Allow all reads" ON bookings FOR SELECT USING (true);
```

## Features

- **Offline Mode**: App works with mock data when database is unavailable
- **Real-time Sync**: Updates sync with database when connection is restored
- **Error Recovery**: Automatic retry mechanisms for failed operations
- **Debug Information**: Console logs help identify and fix issues

## Database Schema

The app expects these tables:
- `drivers` - Driver profiles and status
- `vehicles` - Vehicle information
- `bookings` - Trip requests and history
- `earnings` - Daily earnings summary (optional)

See `sql/schema-additions.sql` for the complete schema.
